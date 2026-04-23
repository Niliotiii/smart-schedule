import { type HttpContext } from '@adonisjs/core/http'
import MinistryRole from '#models/ministry_role'
import { createMinistryRoleValidator, updateMinistryRoleValidator } from '#validators/ministry_role'
import {
  ministryRolesRead,
  ministryRolesCreate,
  ministryRolesUpdate,
  ministryRolesDelete,
} from '#abilities/main'

export default class MinistryRolesController {
  async index({ inertia, request, bouncer }: HttpContext) {
    await bouncer.authorize(ministryRolesRead)
    const page = request.input('page', 1)
    const search = request.input('search', '').trim()

    const query = MinistryRole.withoutTrashed(MinistryRole.query())
    if (search) {
      query.where('name', 'ilike', `%${search}%`)
    }
    const ministryRoles = await query.paginate(page, 15)

    const firstItem = ministryRoles.total > 0 ? (ministryRoles.currentPage - 1) * ministryRoles.perPage + 1 : 0
    const lastItem = Math.min(ministryRoles.currentPage * ministryRoles.perPage, ministryRoles.total)

    return inertia.render('MinistryRoles/Index', {
      ministryRoles: [
        ...ministryRoles.map((mr: MinistryRole) => ({
          id: mr.id,
          name: mr.name,
          description: mr.description,
          createdAt: mr.createdAt.toISO()!,
        })),
      ],
      pagination: {
        total: ministryRoles.total,
        currentPage: ministryRoles.currentPage,
        lastPage: ministryRoles.lastPage,
        perPage: ministryRoles.perPage,
        firstItem,
        lastItem,
      },
      search,
    })
  }

  async create({ inertia, bouncer }: HttpContext) {
    await bouncer.authorize(ministryRolesCreate)
    return inertia.render('MinistryRoles/Form', {
      ministryRole: null,
    })
  }

  async store({ request, response, session, bouncer }: HttpContext) {
    await bouncer.authorize(ministryRolesCreate)
    const payload = await request.validateUsing(createMinistryRoleValidator)
    await MinistryRole.create(payload)

    session.flash({ success: 'Função criada com sucesso' })
    return response.redirect('/ministry-roles')
  }

  async show({ params, inertia, bouncer }: HttpContext) {
    await bouncer.authorize(ministryRolesRead)
    const ministryRole = await MinistryRole.query().where('id', params.id).firstOrFail()
    return inertia.render('MinistryRoles/Show', {
      ministryRole: {
        id: ministryRole.id,
        name: ministryRole.name,
        description: ministryRole.description,
        createdAt: ministryRole.createdAt.toISO()!,
      },
    })
  }

  async edit({ params, inertia, bouncer }: HttpContext) {
    await bouncer.authorize(ministryRolesUpdate)
    const ministryRole = await MinistryRole.findOrFail(params.id)
    return inertia.render('MinistryRoles/Form', {
      ministryRole: {
        id: ministryRole.id,
        name: ministryRole.name,
        description: ministryRole.description,
      },
    })
  }

  async update({ params, request, response, session, bouncer }: HttpContext) {
    await bouncer.authorize(ministryRolesUpdate)
    const ministryRole = await MinistryRole.findOrFail(params.id)
    const payload = await request.validateUsing(updateMinistryRoleValidator)
    ministryRole.merge(payload)
    await ministryRole.save()

    session.flash({ success: 'Função atualizada com sucesso' })
    return response.redirect('/ministry-roles')
  }

  async destroy({ params, response, session, bouncer }: HttpContext) {
    await bouncer.authorize(ministryRolesDelete)
    const ministryRole = await MinistryRole.findOrFail(params.id)
    await ministryRole.delete()

    session.flash({ success: 'Função excluída com sucesso' })
    return response.redirect('/ministry-roles')
  }
}
