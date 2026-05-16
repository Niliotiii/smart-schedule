import { type HttpContext } from '@adonisjs/core/http'
import OpenedMonth from '#models/opened_month'
import Schedule from '#models/schedule'
import Church from '#models/church'
import Priest from '#models/priest'
import MinistryRole from '#models/ministry_role'
import AvailabilitySignal from '#models/availability_signal'
import { createScheduleMonthValidator } from '#validators/schedule_month'
import { scheduleValidator } from '#validators/schedule'
import { scheduleMonthsRead, scheduleMonthsManage } from '#abilities/main'
import ScheduleService from '#services/schedule_service'

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
      signalingDeadline: string; isSignalingActive: boolean
      createdBy: { id: number; name: string } | null; scheduleCount: number
    }> = months.map((m) => ({
      id: m.id,
      year: m.year,
      month: m.month,
      openedAt: m.openedAt.toISO()!,
      signalingDeadline: m.signalingDeadline.toISO()!,
      isSignalingActive: m.isSignalingActive,
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

    return inertia.render('ScheduleMonths/Show', {
      month: this.serializeMonth(month),
    })
  }

  async signal({ params, inertia, bouncer, auth }: HttpContext) {
    await bouncer.authorize(scheduleMonthsRead)
    const month = await this.loadMonthWithSchedules(params.openedMonthId)

    const scheduleIds = month.schedules.map((s) => s.id)
    const userSignals = await AvailabilitySignal.query()
      .whereIn('schedule_id', scheduleIds)
      .where('user_id', auth.user!.id)

    const signalMap = new Map(userSignals.map((s) => [s.scheduleId, s.response]))

    return inertia.render('ScheduleMonths/Signal', {
      month: this.serializeMonth(month, signalMap),
    })
  }

  async edit({ params, inertia, bouncer }: HttpContext) {
    await bouncer.authorize(scheduleMonthsManage)
    const month = await this.loadMonthWithSchedules(params.openedMonthId)

    const [churches, priests, ministryRoles] = await Promise.all([
      Church.withoutTrashed(Church.query()).select('id', 'name').orderBy('name'),
      Priest.withoutTrashed(Priest.query()).select('id', 'name').orderBy('name'),
      MinistryRole.withoutTrashed(MinistryRole.query()).select('id', 'name').orderBy('name'),
    ])

    return inertia.render('ScheduleMonths/Edit', {
      month: this.serializeMonth(month),
      churches: churches.map((c: { id: number; name: string }) => ({ id: c.id, name: c.name })),
      priests: priests.map((p: { id: number; name: string }) => ({ id: p.id, name: p.name })),
      ministryRoles: ministryRoles.map((r: { id: number; name: string }) => ({ id: r.id, name: r.name })),
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
      isSignalingActive: month.isSignalingActive,
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
        })),
        userSignal: signalMap?.get(s.id) ?? null,
        signals: s.availabilitySignals.map((sig) => ({
          user: sig.user ? { id: sig.user.id, name: sig.user.fullName ?? '—' } : null,
          response: sig.response,
          signaledAt: sig.signaledAt.toISO()!,
        })),
      })),
    }
  }
}
