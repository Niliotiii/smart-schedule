import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Profile from '#models/profile'
import hash from '@adonisjs/core/services/hash'
import { createUserValidator, updateUserValidator } from '#validators/user'
import { usersRead, usersCreate, usersUpdate, usersDelete } from '#abilities/main'

export default class UsersController {
  async index({ view, request, auth, bouncer }: HttpContext) {
    await bouncer.authorize(usersRead)
    const page = request.input('page', 1)
    const search = request.input('search', '').trim()

    const query = User.query().preload('profile')
    if (search) {
      query.where((q) => {
        q.where('full_name', 'ilike', `%${search}%`).orWhere('email', 'ilike', `%${search}%`)
      })
    }
    const users = await query.paginate(page, 15)
    users.baseUrl(request.url())

    const firstItem = (users.currentPage - 1) * users.perPage + 1
    const lastItem = Math.min(users.currentPage * users.perPage, users.total)
    const pages = Array.from({ length: users.lastPage }, (_, i) => i + 1)

    return view.render('users/index', { users, firstItem, lastItem, pages, search, user: auth.user })
  }

  async create({ view, auth, bouncer }: HttpContext) {
    await bouncer.authorize(usersCreate)
    const profiles = await Profile.all()
    return view.render('users/form', { user: null, profiles, currentUser: auth.user })
  }

  async store({ request, response, session, bouncer }: HttpContext) {
    await bouncer.authorize(usersCreate)
    const { fullName, email, password, profileId } = await request.validateUsing(createUserValidator)
    await User.create({ fullName, email, password, profileId })

    session.flash({ success: 'Usuário criado com sucesso' })
    return response.redirect('/users')
  }

  async show({ params, view, auth, bouncer }: HttpContext) {
    await bouncer.authorize(usersRead)
    const userToShow = await User.query().where('id', params.id).preload('profile').firstOrFail()
    return view.render('users/show', { userToShow, user: auth.user })
  }

  async edit({ params, view, auth, bouncer }: HttpContext) {
    await bouncer.authorize(usersUpdate)
    const user = await User.findOrFail(params.id)
    const profiles = await Profile.all()
    return view.render('users/form', { user, profiles, currentUser: auth.user })
  }

  async update({ params, request, response, session, bouncer }: HttpContext) {
    await bouncer.authorize(usersUpdate)
    const user = await User.findOrFail(params.id)
    const { fullName, email, password, profileId } = await request.validateUsing(updateUserValidator)
    user.merge({ fullName, email, profileId })
    if (password) user.password = password
    await user.save()

    session.flash({ success: 'Usuário atualizado com sucesso' })
    return response.redirect('/users')
  }

  async destroy({ params, response, session, bouncer }: HttpContext) {
    await bouncer.authorize(usersDelete)
    const user = await User.findOrFail(params.id)
    await user.delete()

    session.flash({ success: 'Usuário excluído com sucesso' })
    return response.redirect('/users')
  }
}