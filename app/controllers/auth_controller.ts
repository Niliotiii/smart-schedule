import { type HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  async showLogin({ inertia }: HttpContext) {
    return inertia.render('Auth/Login', {})
  }

  async login({ auth, request, response, session }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    try {
      const { default: User } = await import('#models/user')
      const user = await User.verifyCredentials(email, password)
      await auth.use('web').login(user)
      return response.redirect('/dashboard')
    } catch (error) {
      session.flash({ errors: 'Credenciais inválidas' })
      return response.redirect().back()
    }
  }

  async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect('/login')
  }
}
