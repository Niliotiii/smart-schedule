import { type HttpContext } from '@adonisjs/core/http'
import Schedule from '#models/schedule'
import AvailabilitySignal from '#models/availability_signal'
import { signalValidator } from '#validators/schedule'
import { scheduleMonthsSignal } from '#abilities/main'
import { DateTime } from 'luxon'

export default class AvailabilitySignalsController {
  async store({ params, request, response, session, bouncer, auth }: HttpContext) {
    await bouncer.authorize(scheduleMonthsSignal)
    const schedule = await Schedule.query()
      .where('id', params.scheduleId)
      .whereNull('deleted_at')
      .firstOrFail()
    const month = await schedule.related('openedMonth').query().firstOrFail()

    if (month.status !== 'disponivel') {
      session.flash({ error: 'O período de sinalização não está ativo' })
      return response.redirect().back()
    }

    const data = await request.validateUsing(signalValidator)

    const existing = await AvailabilitySignal.query()
      .where('schedule_id', schedule.id)
      .where('user_id', auth.user!.id)
      .first()

    if (existing) {
      existing.response = data.response as 'sim' | 'nao'
      existing.signaledAt = DateTime.now()
      await existing.save()
    } else {
      await AvailabilitySignal.create({
        scheduleId: schedule.id,
        userId: auth.user!.id,
        response: data.response as 'sim' | 'nao',
        signaledAt: DateTime.now(),
      })
    }

    session.flash({ success: 'Sinalização registrada com sucesso' })
    return response.redirect().back()
  }

  async update({ params, request, response, session, bouncer, auth }: HttpContext) {
    await bouncer.authorize(scheduleMonthsSignal)
    const schedule = await Schedule.query()
      .where('id', params.scheduleId)
      .whereNull('deleted_at')
      .firstOrFail()
    const month = await schedule.related('openedMonth').query().firstOrFail()

    if (month.status !== 'disponivel') {
      session.flash({ error: 'O período de sinalização não está ativo' })
      return response.redirect().back()
    }

    const data = await request.validateUsing(signalValidator)

    const signal = await AvailabilitySignal.query()
      .where('schedule_id', schedule.id)
      .where('user_id', auth.user!.id)
      .firstOrFail()

    signal.response = data.response as 'sim' | 'nao'
    signal.signaledAt = DateTime.now()
    await signal.save()

    session.flash({ success: 'Sinalização atualizada com sucesso' })
    return response.redirect().back()
  }
}
