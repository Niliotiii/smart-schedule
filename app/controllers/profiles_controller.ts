import { HttpContext } from '@adonisjs/core/http'
import Profile from '#models/profile'
import Permission from '#models/permission'
import { createProfileValidator, updateProfileValidator } from '#validators/profile'
import { profilesRead, profilesCreate, profilesUpdate, profilesDelete } from '#abilities/main'

export default class ProfilesController {
  async index({ view, request, auth, bouncer }: HttpContext) {
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
    profiles.baseUrl(request.url())

    const firstItem = (profiles.currentPage - 1) * profiles.perPage + 1
    const lastItem = Math.min(profiles.currentPage * profiles.perPage, profiles.total)
    const pages = Array.from({ length: profiles.lastPage }, (_, i) => i + 1)

    return view.render('profiles/index', { profiles, firstItem, lastItem, pages, search, user: auth.user })
  }

  async create({ view, auth, bouncer }: HttpContext) {
    await bouncer.authorize(profilesCreate)
    const permissions = await Permission.all()
    const grouped = permissions.reduce<Record<string, typeof permissions>>((acc, p) => {
      if (!acc[p.module]) acc[p.module] = []
      acc[p.module].push(p)
      return acc
    }, {})

    return view.render('profiles/form', { profile: null, groupedPermissions: grouped, user: auth.user })
  }

  async store({ request, response, session, bouncer }: HttpContext) {
    await bouncer.authorize(profilesCreate)
    const { name, description, permissionIds } = await request.validateUsing(createProfileValidator)
    const profile = await Profile.create({ name, description })
    if (permissionIds) await profile.related('permissions').sync(permissionIds)

    session.flash({ success: 'Perfil criado com sucesso' })
    return response.redirect('/profiles')
  }

  async show({ params, view, auth, bouncer }: HttpContext) {
    await bouncer.authorize(profilesRead)
    const profile = await Profile.query().where('id', params.id).preload('permissions').firstOrFail()
    return view.render('profiles/show', { profile, user: auth.user })
  }

  async edit({ params, view, auth, bouncer }: HttpContext) {
    await bouncer.authorize(profilesUpdate)
    const profile = await Profile.query().where('id', params.id).preload('permissions').firstOrFail()
    const permissions = await Permission.all()
    const grouped = permissions.reduce<Record<string, typeof permissions>>((acc, p) => {
      if (!acc[p.module]) acc[p.module] = []
      acc[p.module].push(p)
      return acc
    }, {})
    const selectedIds = profile.permissions.map((p) => p.id)

    return view.render('profiles/form', { profile, groupedPermissions: grouped, selectedPermissionIds: selectedIds, user: auth.user })
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