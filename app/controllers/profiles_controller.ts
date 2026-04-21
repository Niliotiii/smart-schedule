import { type HttpContext } from '@adonisjs/core/http'
import Profile from '#models/profile'
import Permission from '#models/permission'
import { createProfileValidator, updateProfileValidator } from '#validators/profile'
import { profilesRead, profilesCreate, profilesUpdate, profilesDelete } from '#abilities/main'

export default class ProfilesController {
  async index({ inertia, request, bouncer }: HttpContext) {
    await bouncer.authorize(profilesRead)
    const page = request.input('page', 1)
    const search = request.input('search', '').trim()

    const query = Profile.query().preload('permissions')
    if (search) {
      query.where((q) => {
        q.where('name', 'ilike', `%${search}%`).orWhere('description', 'ilike', `%${search}%`)
      })
    }
    const profiles = await query.paginate(page, 15)

    const firstItem = profiles.total > 0 ? (profiles.currentPage - 1) * profiles.perPage + 1 : 0
    const lastItem = Math.min(profiles.currentPage * profiles.perPage, profiles.total)

    return inertia.render('Profiles/Index', {
      profiles: [
        ...profiles.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          permissions: p.permissions.map((perm: { id: number; module: string; action: string }) => ({
            id: perm.id,
            module: perm.module,
            action: perm.action,
          })),
        })),
      ],
      pagination: {
        total: profiles.total,
        currentPage: profiles.currentPage,
        lastPage: profiles.lastPage,
        perPage: profiles.perPage,
        firstItem,
        lastItem,
      },
      search,
    })
  }

  async create({ inertia, bouncer }: HttpContext) {
    await bouncer.authorize(profilesCreate)
    const permissions = await Permission.all()
    const groupedPermissions = permissions.reduce<
      Record<string, Array<{ id: number; action: string }>>
    >((acc, p) => {
      if (!acc[p.module]) acc[p.module] = []
      acc[p.module].push({ id: p.id, action: p.action })
      return acc
    }, {})

    return inertia.render('Profiles/Form', {
      profile: null,
      groupedPermissions,
      selectedPermissionIds: [],
    })
  }

  async store({ request, response, session, bouncer }: HttpContext) {
    await bouncer.authorize(profilesCreate)
    const { name, description, permissionIds } = await request.validateUsing(createProfileValidator)
    const profile = await Profile.create({ name, description })
    if (permissionIds) await profile.related('permissions').sync(permissionIds)

    session.flash({ success: 'Perfil criado com sucesso' })
    return response.redirect('/profiles')
  }

  async show({ params, inertia, bouncer }: HttpContext) {
    await bouncer.authorize(profilesRead)
    const profile = await Profile.query()
      .where('id', params.id)
      .preload('permissions')
      .firstOrFail()
    return inertia.render('Profiles/Show', {
      profile: {
        id: profile.id,
        name: profile.name,
        description: profile.description,
        permissions: profile.permissions.map((p: { id: number; module: string; action: string }) => ({
          id: p.id,
          module: p.module,
          action: p.action,
        })),
        createdAt: profile.createdAt.toISO()!,
      },
    })
  }

  async edit({ params, inertia, bouncer }: HttpContext) {
    await bouncer.authorize(profilesUpdate)
    const profile = await Profile.query()
      .where('id', params.id)
      .preload('permissions')
      .firstOrFail()
    const permissions = await Permission.all()
    const groupedPermissions = permissions.reduce<
      Record<string, Array<{ id: number; action: string }>>
    >((acc, p) => {
      if (!acc[p.module]) acc[p.module] = []
      acc[p.module].push({ id: p.id, action: p.action })
      return acc
    }, {})
    const selectedPermissionIds = profile.permissions.map((p: { id: number }) => p.id)

    return inertia.render('Profiles/Form', {
      profile: {
        id: profile.id,
        name: profile.name,
        description: profile.description,
        permissions: profile.permissions.map((p: { id: number; module: string; action: string }) => ({
          id: p.id,
          module: p.module,
          action: p.action,
        })),
      },
      groupedPermissions,
      selectedPermissionIds,
    })
  }

  async update({ params, request, response, session, bouncer }: HttpContext) {
    await bouncer.authorize(profilesUpdate)
    const profile = await Profile.findOrFail(params.id)
    const { name, description, permissionIds } = await request.validateUsing(updateProfileValidator)
    profile.merge({ name, description })
    await profile.save()
    await profile.related('permissions').sync(permissionIds || [])

    session.flash({ success: 'Perfil atualizado com sucesso' })
    return response.redirect('/profiles')
  }

  async destroy({ params, response, session, bouncer }: HttpContext) {
    await bouncer.authorize(profilesDelete)
    const profile = await Profile.findOrFail(params.id)
    await profile.delete()

    session.flash({ success: 'Perfil excluído com sucesso' })
    return response.redirect('/profiles')
  }
}
