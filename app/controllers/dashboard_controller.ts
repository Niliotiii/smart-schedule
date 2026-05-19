import { type HttpContext } from '@adonisjs/core/http'
import LiturgiaDiariaService from '#services/liturgia_diaria_service'
import { liturgiaDateValidator } from '#validators/liturgia_diaria'
import Schedule from '#models/schedule'

export default class DashboardController {
  private liturgiaService = new LiturgiaDiariaService()

  async index({ request, inertia, auth }: HttpContext) {
    const user = auth.use('web').user!
    await user.load('profile', (profileQuery) => {
      profileQuery.preload('permissions')
    })

    const qs = request.qs()
    let liturgia = null

    if (qs.dia && qs.mes && qs.ano) {
      const payload = await liturgiaDateValidator.validate(qs)
      liturgia = await this.liturgiaService.fetchDate(payload.dia!, payload.mes!, payload.ano!)
    } else {
      liturgia = await this.liturgiaService.fetchToday()
    }

    const userSchedules = await Schedule.query()
      .whereHas('openedMonth', (q) => {
        q.whereNull('deleted_at')
      })
      .whereNull('deleted_at')
      .preload('openedMonth', (omq) => omq.select('id', 'year', 'month'))
      .preload('community', (cq) => cq.select('id', 'name'))
      .preload('priest', (pq) => pq.select('id', 'name'))
      .preload('scheduleAssignments', (saq) => {
        saq.preload('user', (uq) => uq.select('id', 'fullName'))
          .preload('ministryRole', (mrq) => mrq.select('id', 'name'))
      })
      .orderBy('day', 'asc')

    const currentUserId = user.id

    const userSchedulesData = userSchedules.map((schedule) => ({
      id: schedule.id,
      day: schedule.day,
      year: schedule.openedMonth.year,
      month: schedule.openedMonth.month,
      name: schedule.name,
      description: schedule.description,
      time: schedule.time,
      community: schedule.community
        ? { id: schedule.community.id, name: schedule.community.name }
        : null,
      priest: schedule.priest
        ? { id: schedule.priest.id, name: schedule.priest.name }
        : null,
      isAssigned: schedule.scheduleAssignments.some((sa) => sa.userId === currentUserId),
      assignments: schedule.scheduleAssignments.map((sa) => ({
        userId: sa.userId,
        userName: sa.user.fullName || 'Usuário',
        ministryRoleName: sa.ministryRole.name,
      })),
    }))

    return inertia.render('Dashboard/Index', { liturgia, userSchedules: userSchedulesData })
  }
}
