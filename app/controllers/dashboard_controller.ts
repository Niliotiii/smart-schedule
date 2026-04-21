import { type HttpContext } from '@adonisjs/core/http'

export default class DashboardController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.use('web').user!
    await user.load('profile', (profileQuery) => {
      profileQuery.preload('permissions')
    })

    return inertia.render('Dashboard/Index', {})
  }
}
