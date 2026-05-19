import Schedule from '#models/schedule'
import User from '#models/user'
import ScheduleAssignment from '#models/schedule_assignment'

interface SlotResult {
  filledSlots: number
  totalSlots: number
  unfilledDetails: Array<{
    day: number
    scheduleName: string
    role: string
    missingQuantity: number
  }>
}

interface AssignmentInput {
  scheduleId: number
  userId: number
  ministryRoleId: number
}

export default class ScheduleGeneratorService {
  async generate(openedMonthId: number): Promise<{ summary: SlotResult; assignments: AssignmentInput[] }> {
    const schedules = await Schedule.query()
      .where('opened_month_id', openedMonthId)
      .whereNull('deleted_at')
      .preload('scheduleRoles', (sq) =>
        sq.preload('ministryRole', (mq) => mq.select('id', 'name'))
      )
      .preload('availabilitySignals', (aq) => aq.select('schedule_id', 'user_id', 'response'))
      .orderBy('day', 'asc')
    console.log(`[SGS] Found ${schedules.length} schedules`)

    const roleIds = [
      ...new Set(
        schedules.flatMap((s) => s.scheduleRoles.map((r) => r.ministryRoleId))
      ),
    ]
    console.log(`[SGS] Role IDs required: ${JSON.stringify(roleIds)}`)

    if (roleIds.length === 0) {
      console.log('[SGS] No roles found, returning empty')
      return {
        summary: { filledSlots: 0, totalSlots: 0, unfilledDetails: [] },
        assignments: [],
      }
    }

    const eligibleUsers = await User.query()
      .where('include_in_scale', true)
      .whereNull('deleted_at')
      .whereHas('ministryRoles', (q) => {
        q.whereIn('ministry_roles.id', roleIds)
      })
      .preload('ministryRoles', (q) => q.select('id'))
    console.log(`[SGS] Eligible users count: ${eligibleUsers.length}`)

    if (eligibleUsers.length === 0) {
      const totalSlots = schedules.reduce(
        (sum, s) => sum + s.scheduleRoles.reduce((rs, r) => rs + r.quantity, 0),
        0
      )
      return {
        summary: { filledSlots: 0, totalSlots, unfilledDetails: [] },
        assignments: [],
      }
    }

    const userRoleMap = new Map<number, Set<number>>()
    for (const user of eligibleUsers) {
      userRoleMap.set(
        user.id,
        new Set(user.ministryRoles.map((r) => r.id))
      )
    }

    // Build signal map: scheduleId -> set of userId who said "não"
    const signalNoMap = new Map<number, Set<number>>()
    for (const schedule of schedules) {
      const noUsers = new Set<number>()
      for (const sig of schedule.availabilitySignals) {
        if (sig.response === 'nao') {
          noUsers.add(sig.userId)
        }
      }
      signalNoMap.set(schedule.id, noUsers)
    }

    // Build day/time map: scheduleId -> { day, time } for conflict checking
    const scheduleDayTime = new Map<
      number,
      { day: number; time: string | null }
    >()
    for (const s of schedules) {
      scheduleDayTime.set(s.id, { day: s.day, time: s.time })
    }

    // Process schedules hardest-to-fill first
    const schedulesSorted = [...schedules].sort((a, b) => {
      const aCandidates = this.countCandidates(a, eligibleUsers, userRoleMap, signalNoMap)
      const bCandidates = this.countCandidates(b, eligibleUsers, userRoleMap, signalNoMap)
      return aCandidates - bCandidates
    })

    const assignments: AssignmentInput[] = []
    // Track per-user assignment count in this month for balancing
    const userAssignmentCount = new Map<number, number>()
    // Track which schedules a user is already assigned to (by day) for conflict check
    const userAssignedDays = new Map<number, Set<number>>()

    // Also pre-load existing assignments (for regeneration context)
    const existingAssignments = await ScheduleAssignment.query()
      .whereIn(
        'schedule_id',
        schedules.map((s) => s.id)
      )
    for (const a of existingAssignments) {
      userAssignmentCount.set(a.userId, (userAssignmentCount.get(a.userId) ?? 0) + 1)
      const dt = scheduleDayTime.get(a.scheduleId)
      if (dt) {
        const days = userAssignedDays.get(a.userId) ?? new Set()
        days.add(dt.day)
        userAssignedDays.set(a.userId, days)
      }
    }

    const unfilledDetails: SlotResult['unfilledDetails'] = []

    for (const schedule of schedulesSorted) {
      for (const roleSlot of schedule.scheduleRoles) {
        const needed = roleSlot.quantity
        if (needed <= 0) continue

        const roleId = roleSlot.ministryRoleId
        const roleName = roleSlot.ministryRole?.name ?? '?'

        const candidates = eligibleUsers.filter((u) => {
          const roles = userRoleMap.get(u.id)
          if (!roles || !roles.has(roleId)) return false

          // Exclude users who said "não" for this schedule
          const noUsers = signalNoMap.get(schedule.id)
          if (noUsers?.has(u.id)) return false

          // Exclude users already assigned to another schedule same day
          const assignedDays = userAssignedDays.get(u.id)
          if (assignedDays?.has(schedule.day)) return false

          // Filter by user type if the role slot requires one
          if (roleSlot.userTypeId && u.userTypeId !== roleSlot.userTypeId) return false

          return true
        })

        // Sort: (a) signaled "sim" first, (b) ascending current assignment count, (c) ascending user ID
        const signalYesSet = new Set(
          schedule.availabilitySignals
            .filter((s) => s.response === 'sim')
            .map((s) => s.userId)
        )

        candidates.sort((a, b) => {
          const aYes = signalYesSet.has(a.id) ? 1 : 0
          const bYes = signalYesSet.has(b.id) ? 1 : 0
          if (bYes !== aYes) return bYes - aYes // sim first
          const aCount = userAssignmentCount.get(a.id) ?? 0
          const bCount = userAssignmentCount.get(b.id) ?? 0
          if (aCount !== bCount) return aCount - bCount
          return a.id - b.id
        })

        const selected = candidates.slice(0, needed)

        for (const user of selected) {
          assignments.push({
            scheduleId: schedule.id,
            userId: user.id,
            ministryRoleId: roleId,
          })
          userAssignmentCount.set(
            user.id,
            (userAssignmentCount.get(user.id) ?? 0) + 1
          )
          const days = userAssignedDays.get(user.id) ?? new Set()
          days.add(schedule.day)
          userAssignedDays.set(user.id, days)
        }

        if (selected.length < needed) {
          unfilledDetails.push({
            day: schedule.day,
            scheduleName: schedule.name,
            role: roleName,
            missingQuantity: needed - selected.length,
          })
        }
      }
    }

    const totalSlots = schedules.reduce(
      (sum, s) => sum + s.scheduleRoles.reduce((rs, r) => rs + r.quantity, 0),
      0
    )

    return {
      summary: {
        filledSlots: assignments.length,
        totalSlots,
        unfilledDetails,
      },
      assignments,
    }
  }

  private countCandidates(
    schedule: Schedule,
    users: User[],
    userRoleMap: Map<number, Set<number>>,
    signalNoMap: Map<number, Set<number>>
  ): number {
    const noUsers = signalNoMap.get(schedule.id) ?? new Set()
    const requiredRoleIds = new Set(
      schedule.scheduleRoles.map((r) => r.ministryRoleId)
    )
    let count = 0
    for (const user of users) {
      if (noUsers.has(user.id)) continue
      const roles = userRoleMap.get(user.id)
      if (roles) {
        for (const rid of requiredRoleIds) {
          if (roles.has(rid)) {
            count++
            break
          }
        }
      }
    }
    return count
  }
}
