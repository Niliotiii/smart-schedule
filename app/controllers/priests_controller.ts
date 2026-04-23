import { type HttpContext } from '@adonisjs/core/http'
import Priest from '#models/priest'
import { createPriestValidator, updatePriestValidator } from '#validators/priest'
import { priestsRead, priestsCreate, priestsUpdate, priestsDelete } from '#abilities/main'

export default class PriestsController {
  async index({ inertia, request, bouncer }: HttpContext) {
    await bouncer.authorize(priestsRead)
    const page = request.input('page', 1)
    const search = request.input('search', '').trim()

    const query = Priest.withoutTrashed(Priest.query())
    if (search) {
      query.where('name', 'ilike', `%${search}%`)
    }
    const priests = await query.paginate(page, 15)

    const firstItem = priests.total > 0 ? (priests.currentPage - 1) * priests.perPage + 1 : 0
    const lastItem = Math.min(priests.currentPage * priests.perPage, priests.total)

    return inertia.render('Priests/Index', {
      priests: [
        ...priests.map((p: Priest) => ({
          id: p.id,
          name: p.name,
          phone: p.phone,
          createdAt: p.createdAt.toISO()!,
        })),
      ],
      pagination: {
        total: priests.total,
        currentPage: priests.currentPage,
        lastPage: priests.lastPage,
        perPage: priests.perPage,
        firstItem,
        lastItem,
      },
      search,
    })
  }

  async create({ inertia, bouncer }: HttpContext) {
    await bouncer.authorize(priestsCreate)
    return inertia.render('Priests/Form', { priest: null })
  }

  async store({ request, response, session, bouncer }: HttpContext) {
    await bouncer.authorize(priestsCreate)
    const { name, phone } = await request.validateUsing(createPriestValidator)
    await Priest.create({ name, phone: phone || null })
    session.flash({ success: 'Padre criado com sucesso' })
    return response.redirect('/priests')
  }

  async show({ params, inertia, bouncer }: HttpContext) {
    await bouncer.authorize(priestsRead)
    const priest = await Priest.query().where('id', params.id).firstOrFail()
    return inertia.render('Priests/Show', {
      priest: {
        id: priest.id,
        name: priest.name,
        phone: priest.phone,
        createdAt: priest.createdAt.toISO()!,
      },
    })
  }

  async edit({ params, inertia, bouncer }: HttpContext) {
    await bouncer.authorize(priestsUpdate)
    const priest = await Priest.query().where('id', params.id).firstOrFail()
    return inertia.render('Priests/Form', {
      priest: {
        id: priest.id,
        name: priest.name,
        phone: priest.phone,
      },
    })
  }

  async update({ params, request, response, session, bouncer }: HttpContext) {
    await bouncer.authorize(priestsUpdate)
    const priest = await Priest.query().where('id', params.id).firstOrFail()
    const { name, phone } = await request.validateUsing(updatePriestValidator)
    priest.merge({ name, phone: phone || null })
    await priest.save()
    session.flash({ success: 'Padre atualizado com sucesso' })
    return response.redirect('/priests')
  }

  async destroy({ params, response, session, bouncer }: HttpContext) {
    await bouncer.authorize(priestsDelete)
    const priest = await Priest.query().where('id', params.id).firstOrFail()
    await priest.delete()
    session.flash({ success: 'Padre excluído com sucesso' })
    return response.redirect('/priests')
  }
}
