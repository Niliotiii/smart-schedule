import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import OpenedMonth from '#models/opened_month'
import Schedule from '#models/schedule'
import ScheduleRole from '#models/schedule_role'
import AvailabilitySignal from '#models/availability_signal'

interface ScheduleItem {
  day: number
  name: string
  description: string | null
  communityId: number
  priestId: number
  time: string
  ministryRoles?: Array<{ roleId: number; quantity: number }>
}

export default class ScheduleService {
  async openMonth(data: {
    year: number
    month: number
    signalingPeriodDays: number
    createdByUserId: number
    schedules: ScheduleItem[]
  }) {
    return await db.transaction(async (trx) => {
      const openedAt = DateTime.now()
      const signalingDeadline = openedAt.plus({ days: data.signalingPeriodDays })

      const openedMonth = new OpenedMonth()
      openedMonth.useTransaction(trx)
      openedMonth.year = data.year
      openedMonth.month = data.month
      openedMonth.openedAt = openedAt
      openedMonth.signalingPeriodDays = data.signalingPeriodDays
      openedMonth.signalingDeadline = signalingDeadline
      openedMonth.createdByUserId = data.createdByUserId
      await openedMonth.save()

      for (const scheduleData of data.schedules) {
        const schedule = new Schedule()
        schedule.useTransaction(trx)
        schedule.openedMonthId = openedMonth.id
        schedule.day = scheduleData.day
        schedule.name = scheduleData.name
        schedule.description = scheduleData.description
        schedule.communityId = scheduleData.communityId
        schedule.priestId = scheduleData.priestId
        schedule.time = scheduleData.time
        await schedule.save()

        if (scheduleData.ministryRoles && scheduleData.ministryRoles.length > 0) {
          const roles = scheduleData.ministryRoles.map((r) => ({
            scheduleId: schedule.id,
            ministryRoleId: r.roleId,
            quantity: r.quantity,
          }))
          await ScheduleRole.createMany(roles, { client: trx })
        }
      }

      return openedMonth
    })
  }

  async createSchedule(
    openedMonthId: number,
    data: ScheduleItem
  ) {
    return await db.transaction(async (trx) => {
      const schedule = new Schedule()
      schedule.useTransaction(trx)
      schedule.openedMonthId = openedMonthId
      schedule.day = data.day
      schedule.name = data.name
      schedule.description = data.description
      schedule.communityId = data.communityId
      schedule.priestId = data.priestId
      schedule.time = data.time
      await schedule.save()

      if (data.ministryRoles && data.ministryRoles.length > 0) {
        const roles = data.ministryRoles.map((r) => ({
          scheduleId: schedule.id,
          ministryRoleId: r.roleId,
          quantity: r.quantity,
        }))
        await ScheduleRole.createMany(roles, { client: trx })
      }

      return schedule
    })
  }

  async updateSchedule(
    schedule: Schedule,
    data: ScheduleItem
  ) {
    return await db.transaction(async (trx) => {
      schedule.useTransaction(trx)
      schedule.day = data.day
      schedule.name = data.name
      schedule.description = data.description
      schedule.communityId = data.communityId
      schedule.priestId = data.priestId
      schedule.time = data.time
      await schedule.save()

      await ScheduleRole.query({ client: trx })
        .where('schedule_id', schedule.id)
        .delete()

      if (data.ministryRoles && data.ministryRoles.length > 0) {
        const roles = data.ministryRoles.map((r) => ({
          scheduleId: schedule.id,
          ministryRoleId: r.roleId,
          quantity: r.quantity,
        }))
        await ScheduleRole.createMany(roles, { client: trx })
      }

      return schedule
    })
  }

  async deleteSchedule(schedule: Schedule) {
    await db.transaction(async (trx) => {
      await AvailabilitySignal.query({ client: trx })
        .where('schedule_id', schedule.id)
        .delete()

      schedule.useTransaction(trx)
      await schedule.delete()
    })
  }

  async checkPriestSameDayConflict(
    openedMonthId: number,
    day: number,
    priestId: number,
    excludeScheduleId?: number
  ): Promise<boolean> {
    const query = Schedule.query()
      .where('opened_month_id', openedMonthId)
      .where('day', day)
      .where('priest_id', priestId)
      .whereNull('deleted_at')

    if (excludeScheduleId) {
      query.whereNot('id', excludeScheduleId)
    }

    const count = await query.count('* as total')
    return Number(count[0].$extras.total) > 0
  }

  validateYearMonth(year: number, month: number): string | null {
    const now = DateTime.now()
    const input = DateTime.local(year, month, 1)
    const maxFuture = now.plus({ months: 12 })

    if (input < now.startOf('month')) {
      return 'O mês/ano não pode estar no passado'
    }
    if (input > maxFuture) {
      return 'O mês/ano não pode estar além de 12 meses no futuro'
    }
    if (month < 1 || month > 12) {
      return 'Mês inválido'
    }
    return null
  }

  validateDay(year: number, month: number, day: number): string | null {
    const input = DateTime.local(year, month, 1)
    const daysInMonth = input.daysInMonth ?? 31
    if (day < 1 || day > daysInMonth) {
      return `Dia inválido para ${month}/${year} (máx. ${daysInMonth})`
    }
    return null
  }
}
