import { HttpContext } from '@adonisjs/core/http'

export default class DashboardController {
  async index({ view, auth }: HttpContext) {
    const user = auth.use('web').user!
    await user.load('profile', (profileQuery) => {
      profileQuery.preload('permissions')
    })

    return view.render('dashboard/index', { user })
  }
}