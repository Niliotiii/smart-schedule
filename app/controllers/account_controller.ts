import { type HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { changePasswordValidator } from '#validators/account'

export default class AccountController {
  async show({ inertia }: HttpContext) {
    return inertia.render('Account/Profile', {})
  }

  async changePassword({ request, response, session, auth }: HttpContext) {
    const user = auth.use('web').user!
    const payload = await request.validateUsing(changePasswordValidator)

    try {
      await User.verifyCredentials(user.email, payload.currentPassword)
    } catch {
      session.flash({ errors: 'Senha atual incorreta' })
      return response.redirect().back()
    }

    user.password = payload.newPassword
    await user.save()

    session.flash({ success: 'Senha alterada com sucesso. Faça login novamente.' })
    await auth.use('web').logout()
    return response.redirect('/login')
  }
}
