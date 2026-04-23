import { type HttpContext } from '@adonisjs/core/http'
import UserType from '#models/user_type'
import { createUserTypeValidator, updateUserTypeValidator } from '#validators/user_type'
import { userTypesRead, userTypesCreate, userTypesUpdate, userTypesDelete } from '#abilities/main'

export default class UserTypesController {
  async index({ inertia, request, bouncer }: HttpContext) {
    await bouncer.authorize(userTypesRead)
    const page = request.input('page', 1)
    const search = request.input('search', '').trim()

    const query = UserType.withoutTrashed(UserType.query().withCount('users'))
    if (search) {
      query.where('name', 'ilike', `%${search}%`)
    }
    const userTypes = await query.paginate(page, 15)

    const firstItem = userTypes.total > 0 ? (userTypes.currentPage - 1) * userTypes.perPage + 1 : 0
    const lastItem = Math.min(userTypes.currentPage * userTypes.perPage, userTypes.total)

    return inertia.render('UserTypes/Index', {
      userTypes: [
        ...userTypes.map((ut: UserType) => ({
          id: ut.id,
          name: ut.name,
          usersCount: ut.$extras.users_count as number,
        })),
      ],
      pagination: {
        total: userTypes.total,
        currentPage: userTypes.currentPage,
        lastPage: userTypes.lastPage,
        perPage: userTypes.perPage,
        firstItem,
        lastItem,
      },
      search,
    })
  }

  async create({ inertia, bouncer }: HttpContext) {
    await bouncer.authorize(userTypesCreate)
    return inertia.render('UserTypes/Form', {
      userType: null,
    })
  }

  async store({ request, response, session, bouncer }: HttpContext) {
    await bouncer.authorize(userTypesCreate)
    const { name } = await request.validateUsing(createUserTypeValidator)
    await UserType.create({ name })

    session.flash({ success: 'Tipo de usuário criado com sucesso' })
    return response.redirect('/user-types')
  }

  async show({ params, inertia, bouncer }: HttpContext) {
    await bouncer.authorize(userTypesRead)
    const userType = await UserType.query().where('id', params.id).preload('users').firstOrFail()
    return inertia.render('UserTypes/Show', {
      userType: {
        id: userType.id,
        name: userType.name,
        users: userType.users.map((u: { id: number; fullName: string | null; email: string }) => ({
          id: u.id,
          fullName: u.fullName,
          email: u.email,
        })),
        createdAt: userType.createdAt.toISO()!,
      },
    })
  }

  async edit({ params, inertia, bouncer }: HttpContext) {
    await bouncer.authorize(userTypesUpdate)
    const userType = await UserType.findOrFail(params.id)
    return inertia.render('UserTypes/Form', {
      userType: {
        id: userType.id,
        name: userType.name,
      },
    })
  }

  async update({ params, request, response, session, bouncer }: HttpContext) {
    await bouncer.authorize(userTypesUpdate)
    const userType = await UserType.findOrFail(params.id)
    const { name } = await request.validateUsing(updateUserTypeValidator, {
      meta: { id: userType.id },
    })
    userType.merge({ name })
    await userType.save()

    session.flash({ success: 'Tipo de usuário atualizado com sucesso' })
    return response.redirect('/user-types')
  }

  async destroy({ params, response, session, bouncer }: HttpContext) {
    await bouncer.authorize(userTypesDelete)
    const userType = await UserType.findOrFail(params.id)
    await userType.delete()

    session.flash({ success: 'Tipo de usuário excluído com sucesso' })
    return response.redirect('/user-types')
  }
}
