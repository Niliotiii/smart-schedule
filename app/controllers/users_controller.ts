import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Profile from '#models/profile'
import { createUserValidator, updateUserValidator } from '#validators/user'
import { usersRead, usersCreate, usersUpdate, usersDelete } from '#abilities/main'

export default class UsersController {
  async index({ inertia, request, bouncer }: HttpContext) {
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

    const firstItem = users.total > 0 ? (users.currentPage - 1) * users.perPage + 1 : 0
    const lastItem = Math.min(users.currentPage * users.perPage, users.total)

    return inertia.render('Users/Index', {
      users: [...users.map((u) => ({
        id: u.id,
        fullName: u.fullName,
        email: u.email,
        profileId: u.profileId,
        profile: u.profile ? { id: u.profile.id, name: u.profile.name } : null,
      }))],
      pagination: {
        total: users.total,
        currentPage: users.currentPage,
        lastPage: users.lastPage,
        perPage: users.perPage,
        firstItem,
        lastItem,
      },
      search,
    })
  }

  async create({ inertia, bouncer }: HttpContext) {
    await bouncer.authorize(usersCreate)
    const profiles = await Profile.all()
    return inertia.render('Users/Form', {
      user: null,
      profiles: profiles.map((p) => ({ id: p.id, name: p.name })),
    })
  }

  async store({ request, response, session, bouncer }: HttpContext) {
    await bouncer.authorize(usersCreate)
    const { fullName, email, password, profileId } = await request.validateUsing(createUserValidator)
    await User.create({ fullName, email, password, profileId })

    session.flash({ success: 'Usuário criado com sucesso' })
    return response.redirect('/users')
  }

  async show({ params, inertia, bouncer }: HttpContext) {
    await bouncer.authorize(usersRead)
    const userToShow = await User.query().where('id', params.id).preload('profile').firstOrFail()
    return inertia.render('Users/Show', {
      userToShow: {
        id: userToShow.id,
        fullName: userToShow.fullName,
        email: userToShow.email,
        profileId: userToShow.profileId,
        profile: userToShow.profile ? { id: userToShow.profile.id, name: userToShow.profile.name } : null,
        createdAt: userToShow.createdAt.toISO()!,
      },
    })
  }

  async edit({ params, inertia, bouncer }: HttpContext) {
    await bouncer.authorize(usersUpdate)
    const user = await User.findOrFail(params.id)
    const profiles = await Profile.all()
    return inertia.render('Users/Form', {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        profileId: user.profileId,
      },
      profiles: profiles.map((p) => ({ id: p.id, name: p.name })),
    })
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