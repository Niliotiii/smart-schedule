import { type HttpContext } from '@adonisjs/core/http'
import OpenedMonth from '#models/opened_month'
import Schedule from '#models/schedule'
import Church from '#models/church'
import Priest from '#models/priest'
import MinistryRole from '#models/ministry_role'
import User from '#models/user'
import AvailabilitySignal from '#models/availability_signal'
import ScheduleAssignment from '#models/schedule_assignment'
import { createScheduleMonthValidator } from '#validators/schedule_month'
import { scheduleValidator } from '#validators/schedule'
import { createAssignmentValidator } from '#validators/schedule_assignment'
import { scheduleMonthsRead, scheduleMonthsManage } from '#abilities/main'
import ScheduleService from '#services/schedule_service'
import ScheduleGeneratorService from '#services/schedule_generator_service'
import StatusTransition from '#models/status_transition'
import UserType from '#models/user_type'
import { DateTime } from 'luxon'

export default class ScheduleMonthsController {
  async index({ inertia, bouncer }: HttpContext) {
    await bouncer.authorize(scheduleMonthsRead)
    const months = await OpenedMonth.query()
      .preload('createdBy', (q) => q.select('id', 'fullName'))
      .preload('schedules', (q) => q.whereNull('deleted_at'))
      .whereNull('deleted_at')
      .orderBy('year', 'desc')
      .orderBy('month', 'desc')

    const monthsData: Array<{
      id: number; year: number; month: number; openedAt: string
      signalingDeadline: string; status: string
      createdBy: { id: number; name: string } | null; scheduleCount: number
    }> = months.map((m) => ({
      id: m.id,
      year: m.year,
      month: m.month,
      openedAt: m.openedAt.toISO()!,
      signalingDeadline: m.signalingDeadline.toISO()!,
      status: m.status,
      createdBy: m.createdBy ? { id: m.createdBy.id, name: m.createdBy.fullName ?? '—' } : null,
      scheduleCount: m.schedules.length,
    }))

    return inertia.render('ScheduleMonths/Index', {
      months: monthsData,
    })
  }

  async create({ inertia, bouncer }: HttpContext) {
    await bouncer.authorize(scheduleMonthsManage)
    const [churches, priests, ministryRoles] = await Promise.all([
      Church.withoutTrashed(Church.query()).select('id', 'name').orderBy('name'),
      Priest.withoutTrashed(Priest.query()).select('id', 'name').orderBy('name'),
      MinistryRole.withoutTrashed(MinistryRole.query()).select('id', 'name').orderBy('name'),
    ])

    return inertia.render('ScheduleMonths/Create', {
      churches: churches.map((c: { id: number; name: string }) => ({ id: c.id, name: c.name })),
      priests: priests.map((p: { id: number; name: string }) => ({ id: p.id, name: p.name })),
      ministryRoles: ministryRoles.map((r: { id: number; name: string }) => ({ id: r.id, name: r.name })),
    })
  }

  async store({ request, response, session, bouncer, auth }: HttpContext) {
    await bouncer.authorize(scheduleMonthsManage)
    const data = await request.validateUsing(createScheduleMonthValidator)

    const existing = await OpenedMonth.query()
      .where('year', data.year)
      .where('month', data.month)
      .whereNull('deleted_at')
      .first()
    if (existing) {
      session.flash({ error: `Mês ${data.month}/${data.year} já está aberto` })
      return response.redirect().back()
    }

    const service = new ScheduleService()
    const yearMonthError = service.validateYearMonth(data.year, data.month)
    if (yearMonthError) {
      session.flash({ error: yearMonthError })
      return response.redirect().back()
    }

    const dayErrors: string[] = []
    for (const s of data.schedules) {
      const dayError = service.validateDay(data.year, data.month, s.day)
      if (dayError) dayErrors.push(dayError)
    }
    if (dayErrors.length > 0) {
      session.flash({ error: dayErrors.join('; ') })
      return response.redirect().back()
    }

    const openedMonth = await service.openMonth({
      year: data.year,
      month: data.month,
      signalingPeriodDays: data.signalingPeriodDays,
      createdByUserId: auth.user!.id,
      schedules: data.schedules.map((s) => ({
        day: s.day,
        name: s.name,
        description: s.description ?? null,
        communityId: s.communityId,
        priestId: s.priestId,
        ministryRoles: s.ministryRoles,
        time: s.time,
      })),
    })

    session.flash({ success: `Mês ${data.month}/${data.year} aberto com ${data.schedules.length} escala(s)` })
    return response.redirect(`/schedules/months/${openedMonth.id}`)
  }

  async show({ params, inertia, bouncer }: HttpContext) {
    await bouncer.authorize(scheduleMonthsRead)
    const month = await this.loadMonthWithSchedules(params.openedMonthId)

    const canManage = await bouncer.allows('scheduleMonthsManage')
    const isPublic = month.status === 'publicada' || month.status === 'encerrada'

    const serialized = this.serializeMonth(month)

    // Non-admin users can only see role/assignment details on published or closed months
    if (!canManage && !isPublic) {
      serialized.schedules = serialized.schedules.map((s) => ({
        ...s,
        roles: [],
        assignments: [],
      }))
    }

    return inertia.render('ScheduleMonths/Show', {
      month: serialized,
    })
  }

  async signal({ params, inertia, bouncer, auth, session, response }: HttpContext) {
    await bouncer.authorize(scheduleMonthsRead)
    const month = await this.loadMonthWithSchedules(params.openedMonthId)

    if (month.status !== 'disponivel') {
      session.flash({ error: 'O período de sinalização não está ativo para este mês' })
      return response.redirect(`/schedules/months/${params.openedMonthId}`)
    }

    const scheduleIds = month.schedules.map((s) => s.id)
    const userSignals = await AvailabilitySignal.query()
      .whereIn('schedule_id', scheduleIds)
      .where('user_id', auth.user!.id)

    const signalMap = new Map(userSignals.map((s) => [s.scheduleId, s.response]))

    return inertia.render('ScheduleMonths/Signal', {
      month: this.serializeMonth(month, signalMap),
    })
  }

  async edit({ params, inertia, bouncer, session }: HttpContext) {
    await bouncer.authorize(scheduleMonthsManage)
    const month = await this.loadMonthWithSchedules(params.openedMonthId)

    if (month.status !== 'rascunho') {
      session.flash({ warning: `A edição de escalas só está disponível no status "Rascunho". Status atual: ${month.status}` })
    }

    const [churches, priests, ministryRoles, userTypes, eligibleUsers] = await Promise.all([
      Church.withoutTrashed(Church.query()).select('id', 'name').orderBy('name'),
      Priest.withoutTrashed(Priest.query()).select('id', 'name').orderBy('name'),
      MinistryRole.withoutTrashed(MinistryRole.query()).select('id', 'name').orderBy('name'),
      UserType.query().select('id', 'name').orderBy('name'),
      User.query()
        .where('include_in_scale', true)
        .whereNull('deleted_at')
        .whereHas('ministryRoles', (q) => {
          q.select('id')
        })
        .preload('ministryRoles', (q) => q.select('id'))
        .select('id', 'fullName', 'userTypeId')
        .orderBy('fullName'),
    ])

    return inertia.render('ScheduleMonths/Edit', {
      month: this.serializeMonth(month),
      churches: churches.map((c: { id: number; name: string }) => ({ id: c.id, name: c.name })),
      priests: priests.map((p: { id: number; name: string }) => ({ id: p.id, name: p.name })),
      ministryRoles: ministryRoles.map((r: { id: number; name: string }) => ({ id: r.id, name: r.name })),
      userTypes: userTypes.map((t: { id: number; name: string }) => ({ id: t.id, name: t.name })),
      eligibleUsers: eligibleUsers.map((u) => ({
        id: u.id,
        name: u.fullName ?? '—',
        ministryRoleIds: u.ministryRoles.map((r) => r.id),
        userTypeId: u.userTypeId,
      })),
    })
  }

  async destroy({ params, response, session, bouncer }: HttpContext) {
    await bouncer.authorize(scheduleMonthsManage)
    const month = await OpenedMonth.query()
      .where('id', params.openedMonthId)
      .whereNull('deleted_at')
      .firstOrFail()

    await month.delete()
    session.flash({ success: 'Mês excluído com sucesso' })
    return response.redirect('/schedules/months')
  }

  async updateSchedule({ params, request, response, session, bouncer }: HttpContext) {
    await bouncer.authorize(scheduleMonthsManage)
    const schedule = await Schedule.query()
      .where('id', params.scheduleId)
      .where('opened_month_id', params.openedMonthId)
      .whereNull('deleted_at')
      .firstOrFail()

    const data = await request.validateUsing(scheduleValidator)
    const service = new ScheduleService()

    const month = await OpenedMonth.findOrFail(params.openedMonthId)
    const dayError = service.validateDay(month.year, month.month, data.day)
    if (dayError) {
      session.flash({ error: dayError })
      return response.redirect().back()
    }

    const hasConflict = await service.checkPriestSameDayConflict(
      month.id,
      data.day,
      data.priestId,
      schedule.id
    )
    if (hasConflict) {
      session.flash({ warning: 'Atenção: padre já escalado neste dia' })
    }

    await service.updateSchedule(schedule, {
      day: data.day,
      name: data.name,
      description: data.description ?? null,
      communityId: data.communityId,
      priestId: data.priestId,
      ministryRoles: data.ministryRoles,
      assignments: data.assignments,
      time: data.time ?? null,
    })

    session.flash({ success: 'Escala atualizada com sucesso' })
    return response.redirect(`/schedules/months/${params.openedMonthId}/edit`)
  }

  async storeSchedule({ params, request, response, session, bouncer }: HttpContext) {
    await bouncer.authorize(scheduleMonthsManage)
    const month = await OpenedMonth.findOrFail(params.openedMonthId)

    const data = await request.validateUsing(scheduleValidator)
    const service = new ScheduleService()

    const dayError = service.validateDay(month.year, month.month, data.day)
    if (dayError) {
      session.flash({ error: dayError })
      return response.redirect().back()
    }

    const hasConflict = await service.checkPriestSameDayConflict(
      month.id,
      data.day,
      data.priestId,
    )
    if (hasConflict) {
      session.flash({ warning: 'Atenção: padre já escalado neste dia' })
    }

    await service.createSchedule(month.id, {
      day: data.day,
      name: data.name,
      description: data.description ?? null,
      communityId: data.communityId,
      priestId: data.priestId,
      ministryRoles: data.ministryRoles,
      assignments: data.assignments,
      time: data.time ?? null,
    })

    session.flash({ success: 'Escala adicionada com sucesso' })
    return response.redirect(`/schedules/months/${params.openedMonthId}/edit`)
  }

  async destroySchedule({ params, response, session, bouncer }: HttpContext) {
    await bouncer.authorize(scheduleMonthsManage)
    const schedule = await Schedule.query()
      .where('id', params.scheduleId)
      .where('opened_month_id', params.openedMonthId)
      .whereNull('deleted_at')
      .firstOrFail()

    const service = new ScheduleService()
    await service.deleteSchedule(schedule)

    session.flash({ success: 'Escala excluída com sucesso' })
    return response.redirect(`/schedules/months/${params.openedMonthId}/edit`)
  }

  async generate({ params, response, session, bouncer }: HttpContext) {
    await bouncer.authorize(scheduleMonthsManage)
    const openedMonth = await OpenedMonth.findOrFail(params.openedMonthId)
    console.log(`[DEBUG] generate() called for openedMonthId=${params.openedMonthId}`)

    const generator = new ScheduleGeneratorService()
    const result = await generator.generate(openedMonth.id)
    console.log(`[DEBUG] result: filledSlots=${result.summary.filledSlots}, totalSlots=${result.summary.totalSlots}, assignments=${result.assignments.length}`)

    if (result.assignments.length > 0) {
      await ScheduleAssignment.query()
        .whereIn(
          'schedule_id',
          result.assignments.map((a) => a.scheduleId)
        )
        .delete()
      console.log(`[DEBUG] deleted existing assignments for ${result.assignments.length} new assignments`)

      await ScheduleAssignment.createMany(result.assignments)
      console.log(`[DEBUG] created ${result.assignments.length} assignments`)
    }

    const summary = result.summary
    if (summary.unfilledDetails.length > 0) {
      const details = summary.unfilledDetails
        .map((u) => `${u.day}/${openedMonth.month} — ${u.scheduleName}: ${u.role} (faltam ${u.missingQuantity})`)
        .join('; ')
      session.flash({
        warning: `Alocações geradas com ${summary.filledSlots}/${summary.totalSlots} vagas preenchidas. Vagas não preenchidas: ${details}`,
      })
    } else {
      session.flash({
        success: `Alocações geradas com sucesso! ${summary.filledSlots}/${summary.totalSlots} vagas preenchidas.`,
      })
    }

    return response.redirect(`/schedules/months/${params.openedMonthId}/edit`)
  }

  async destroyAssignment({ params, response, session, bouncer }: HttpContext) {
    await bouncer.authorize(scheduleMonthsManage)
    const assignment = await ScheduleAssignment.query()
      .where('id', params.assignmentId)
      .firstOrFail()

    await assignment.delete()

    session.flash({ success: 'Alocação removida com sucesso' })
    return response.redirect(`/schedules/months/${params.openedMonthId}/edit`)
  }

  async storeAssignment({ params, request, response, session, bouncer }: HttpContext) {
    await bouncer.authorize(scheduleMonthsManage)
    const data = await request.validateUsing(createAssignmentValidator)

    await ScheduleAssignment.create({
      scheduleId: data.scheduleId,
      userId: data.userId,
      ministryRoleId: data.ministryRoleId,
    })

    session.flash({ success: 'Alocação adicionada com sucesso' })
    return response.redirect(`/schedules/months/${params.openedMonthId}/edit`)
  }

  async signals({ inertia, bouncer, auth }: HttpContext) {
    await bouncer.authorize(scheduleMonthsRead)
    const months = await OpenedMonth.query()
      .where('status', 'disponivel')
      .whereNull('deleted_at')
      .preload('schedules', (q) => {
        q.whereNull('deleted_at')
          .preload('community', (cq) => cq.select('id', 'name'))
          .preload('priest', (pq) => pq.select('id', 'name'))
          .preload('scheduleRoles', (rq) => rq.preload('ministryRole', (mrq) => mrq.select('id', 'name')))
          .orderBy('day', 'asc')
      })
      .orderBy('year', 'asc')
      .orderBy('month', 'asc')

    const scheduleIds = months.flatMap((m) => m.schedules.map((s) => s.id))
    const userSignals = scheduleIds.length
      ? await AvailabilitySignal.query()
          .whereIn('schedule_id', scheduleIds)
          .where('user_id', auth.user!.id)
      : []

    const signalMap = new Map(userSignals.map((s) => [s.scheduleId, s.response as 'sim' | 'nao']))

    const monthsData = months.map((m) => ({
      id: m.id,
      year: m.year,
      month: m.month,
      status: m.status,
      schedules: m.schedules.map((s) => ({
        id: s.id,
        day: s.day,
        name: s.name,
        description: s.description,
        time: s.time,
        community: s.community ? { id: s.community.id, name: s.community.name } : null,
        priest: s.priest ? { id: s.priest.id, name: s.priest.name } : null,
        roles: s.scheduleRoles.map((r) => ({
          id: r.ministryRole?.id,
          name: r.ministryRole?.name,
          quantity: r.quantity,
        })),
        userSignal: signalMap.get(s.id) ?? null,
      })),
    }))

    return inertia.render('ScheduleMonths/Signals', { months: monthsData })
  }

  async changeStatus({ params, request, response, session, bouncer, auth }: HttpContext) {
    await bouncer.authorize(scheduleMonthsManage)
    const month = await OpenedMonth.query()
      .where('id', params.openedMonthId)
      .whereNull('deleted_at')
      .firstOrFail()

    const allowedTransitions: Record<string, string[]> = {
      aberta: ['disponivel'],
      disponivel: ['aberta', 'rascunho'],
      rascunho: ['disponivel', 'publicada', 'encerrada'],
      publicada: ['rascunho', 'encerrada'],
      encerrada: [],
    }

    const targetStatus = request.input('status')
    if (!targetStatus) {
      session.flash({ error: 'Status de destino não informado' })
      return response.redirect().back()
    }

    const allowed = allowedTransitions[month.status]
    if (!allowed || !allowed.includes(targetStatus)) {
      session.flash({ error: `Transição de "${month.status}" para "${targetStatus}" não é permitida` })
      return response.redirect().back()
    }

    const now = DateTime.now()
    await StatusTransition.create({
      openedMonthId: month.id,
      fromStatus: month.status,
      toStatus: targetStatus,
      changedByUserId: auth.user!.id,
      changedAt: now,
    })

    month.status = targetStatus
    await month.save()

    const statusLabels: Record<string, string> = {
      aberta: 'Aberta',
      disponivel: 'Disponível',
      rascunho: 'Rascunho',
      publicada: 'Publicada',
      encerrada: 'Encerrada',
    }

    session.flash({ success: `Status alterado para "${statusLabels[targetStatus] || targetStatus}"` })
    return response.redirect(`/schedules/months/${params.openedMonthId}/edit`)
  }

  private async loadMonthWithSchedules(openedMonthId: number) {
    return await OpenedMonth.query()
      .where('id', openedMonthId)
      .whereNull('deleted_at')
      .preload('schedules', (q) => {
        q.whereNull('deleted_at')
          .preload('community', (cq) => cq.select('id', 'name'))
          .preload('priest', (pq) => pq.select('id', 'name'))
          .preload('scheduleRoles', (rq) => rq.preload('ministryRole', (mrq) => mrq.select('id', 'name')))
          .preload('availabilitySignals', (aq) => aq.preload('user', (uq) => uq.select('id', 'fullName')))
          .preload('scheduleAssignments', (saq) =>
            saq.preload('user', (uq) => uq.select('id', 'fullName')).preload('ministryRole', (mrq) => mrq.select('id', 'name'))
          )
          .orderBy('day', 'asc')
      })
      .preload('createdBy', (q) => q.select('id', 'fullName'))
      .firstOrFail()
  }

  private serializeMonth(month: OpenedMonth, signalMap?: Map<number, 'sim' | 'nao'>) {
    return {
      id: month.id,
      year: month.year,
      month: month.month,
      openedAt: month.openedAt.toISO()!,
      signalingDeadline: month.signalingDeadline.toISO()!,
      status: month.status,
      createdBy: month.createdBy
        ? { id: month.createdBy.id, name: month.createdBy.fullName ?? '—' }
        : null,
      schedules: month.schedules.map((s) => ({
        id: s.id,
        day: s.day,
        name: s.name,
        description: s.description,
        time: s.time,
        community: s.community ? { id: s.community.id, name: s.community.name } : null,
        priest: s.priest ? { id: s.priest.id, name: s.priest.name } : null,
        roles: s.scheduleRoles.map((r) => ({
          id: r.ministryRole?.id,
          name: r.ministryRole?.name,
          quantity: r.quantity,
          userTypeId: r.userTypeId,
        })),
        userSignal: signalMap?.get(s.id) ?? null,
        signals: s.availabilitySignals.map((sig) => ({
          user: sig.user ? { id: sig.user.id, name: sig.user.fullName ?? '—' } : null,
          response: sig.response,
          signaledAt: sig.signaledAt.toISO()!,
        })),
        assignments: s.scheduleAssignments.map((a) => ({
          id: a.id,
          userId: a.userId,
          userName: a.user?.fullName ?? '—',
          ministryRoleId: a.ministryRoleId,
          ministryRoleName: a.ministryRole?.name ?? '?',
        })),
      })),
    }
  }
}
