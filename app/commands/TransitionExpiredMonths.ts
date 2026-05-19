import { BaseCommand } from '@adonisjs/core/ace'
import { DateTime } from 'luxon'
import OpenedMonth from '#models/opened_month'
import StatusTransition from '#models/status_transition'

export default class TransitionExpiredMonths extends BaseCommand {
  static commandName = 'transition:expired'
  static description = 'Transition expired disponivel months to rascunho'

  async run() {
    const now = DateTime.now()
    const expired = await OpenedMonth.query()
      .where('status', 'disponivel')
      .where('signaling_deadline', '<', now.toSQL()!)
      .whereNull('deleted_at')

    if (expired.length === 0) {
      this.logger.info('No expired months to transition')
      return
    }

    this.logger.info(`Found ${expired.length} expired month(s) to transition`)

    for (const month of expired) {
      await StatusTransition.create({
        openedMonthId: month.id,
        fromStatus: 'disponivel',
        toStatus: 'rascunho',
        changedByUserId: null,
        changedAt: now,
      })

      month.status = 'rascunho'
      await month.save()

      this.logger.info(
        `Transitioned month ${month.month}/${month.year} (ID: ${month.id}) to rascunho`
      )
    }
  }
}
