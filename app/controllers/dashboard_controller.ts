import { type HttpContext } from '@adonisjs/core/http'
import LiturgiaDiariaService from '#services/liturgia_diaria_service'
import { liturgiaDateValidator } from '#validators/liturgia_diaria'

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

    return inertia.render('Dashboard/Index', { liturgia })
  }
}

