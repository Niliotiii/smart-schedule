import { type HttpContext } from '@adonisjs/core/http'
import Church from '#models/church'
import Country from '#models/country'
import State from '#models/state'
import City from '#models/city'
import Address from '#models/address'
import { createChurchValidator, updateChurchValidator } from '#validators/church'
import { churchesRead, churchesCreate, churchesUpdate, churchesDelete } from '#abilities/main'
import CepLookupService from '#services/cep_lookup_service'
import GeocodingService from '#services/geocoding_service'

const ADDRESSABLE_TYPE = 'churches'

export default class ChurchesController {
  async index({ inertia, request, bouncer }: HttpContext) {
    await bouncer.authorize(churchesRead)
    const page = request.input('page', 1)
    const search = request.input('search', '').trim()

    const query = Church.withoutTrashed(Church.query())
    if (search) {
      query.where('name', 'ilike', `%${search}%`)
    }
    const churches = await query.paginate(page, 15)

    const churchIds = churches.all().map((c: { id: number }) => c.id)
    const addresses = await Address.query()
      .where('addressable_type', ADDRESSABLE_TYPE)
      .whereIn('addressable_id', churchIds)
      .preload('country')
      .preload('state')
      .preload('city')
    const addressMap = new Map(addresses.map((a: Address) => [a.addressableId, a]))

    const firstItem = churches.total > 0 ? (churches.currentPage - 1) * churches.perPage + 1 : 0
    const lastItem = Math.min(churches.currentPage * churches.perPage, churches.total)

    return inertia.render('Churches/Index', {
      churches: [
        ...churches.map((c: Church) => {
          const addr = addressMap.get(c.id)
          return {
            id: c.id,
            name: c.name,
            address: addr
              ? {
                  city: addr.city ? addr.city.name : null,
                  state: addr.state ? addr.state.uf : null,
                }
              : null,
            createdAt: c.createdAt.toISO()!,
          }
        }),
      ],
      pagination: {
        total: churches.total,
        currentPage: churches.currentPage,
        lastPage: churches.lastPage,
        perPage: churches.perPage,
        firstItem,
        lastItem,
      },
      search,
    })
  }

  async create({ inertia, bouncer }: HttpContext) {
    await bouncer.authorize(churchesCreate)
    const countries = await Country.all()
    const states = await State.all()
    const cities = await City.all()
    return inertia.render('Churches/Form', {
      church: null,
      countries: countries.map((c) => ({ id: c.id, name: c.name })),
      states: states.map((s) => ({ id: s.id, name: s.name, uf: s.uf })),
      cities: cities.map((c) => ({ id: c.id, name: c.name, stateId: c.stateId })),
    })
  }

  async store({ request, response, session, bouncer }: HttpContext) {
    await bouncer.authorize(churchesCreate)
    const {
      name,
      postalCode,
      countryId,
      stateId,
      cityId,
      neighborhood,
      street,
      number,
      complement,
      latitude,
      longitude,
    } = await request.validateUsing(createChurchValidator)
    const church = await Church.create({ name })
    const address = await Address.create({
      addressableId: church.id,
      addressableType: ADDRESSABLE_TYPE,
      postalCode,
      countryId,
      stateId,
      cityId,
      neighborhood,
      street,
      number,
      complement,
      latitude,
      longitude,
    })

    const geo = new GeocodingService()
    const [countryRow, stateRow, cityRow] = await Promise.all([
      Country.query().where('id', Number(countryId)).first(),
      stateId ? State.query().where('id', Number(stateId)).first() : Promise.resolve(null),
      cityId ? City.query().where('id', Number(cityId)).first() : Promise.resolve(null),
    ])

    const geoResult = await geo.geocode({
      country: countryRow?.name ?? null,
      state: stateRow?.uf ?? null,
      city: cityRow?.name ?? null,
      neighborhood,
      street,
      number,
    })

    if (geoResult) {
      address.merge({ latitude: geoResult.latitude, longitude: geoResult.longitude })
      await address.save()
    }

    session.flash({ success: 'Igreja criada com sucesso' })
    return response.redirect('/churches')
  }

  async show({ params, inertia, bouncer }: HttpContext) {
    await bouncer.authorize(churchesRead)
    const church = await Church.query().where('id', params.id).firstOrFail()
    const address = await Address.query()
      .where('addressable_type', ADDRESSABLE_TYPE)
      .where('addressable_id', church.id)
      .preload('country')
      .preload('state')
      .preload('city')
      .first()

    return inertia.render('Churches/Show', {
      church: {
        id: church.id,
        name: church.name,
        address: address
          ? {
              postalCode: address.postalCode,
              street: address.street,
              number: address.number,
              complement: address.complement,
              neighborhood: address.neighborhood,
              city: address.city ? address.city.name : null,
              state: address.state ? address.state.uf : null,
              country: address.country ? address.country.name : null,
              latitude: address.latitude,
              longitude: address.longitude,
            }
          : null,
        createdAt: church.createdAt.toISO()!,
      },
    })
  }

  async edit({ params, inertia, bouncer }: HttpContext) {
    await bouncer.authorize(churchesUpdate)
    const church = await Church.query().where('id', params.id).firstOrFail()
    const address = await Address.query()
      .where('addressable_type', ADDRESSABLE_TYPE)
      .where('addressable_id', church.id)
      .first()

    const countries = await Country.all()
    const states = await State.all()
    const cities = await City.all()
    return inertia.render('Churches/Form', {
      church: {
        id: church.id,
        name: church.name,
        postalCode: address?.postalCode ?? '',
        countryId: address?.countryId ?? '',
        stateId: address?.stateId ?? '',
        cityId: address?.cityId ?? '',
        neighborhood: address?.neighborhood ?? '',
        street: address?.street ?? '',
        number: address?.number ?? '',
        complement: address?.complement ?? '',
        latitude: address?.latitude ?? '',
        longitude: address?.longitude ?? '',
      },
      countries: countries.map((c) => ({ id: c.id, name: c.name })),
      states: states.map((s) => ({ id: s.id, name: s.name, uf: s.uf })),
      cities: cities.map((c) => ({ id: c.id, name: c.name, stateId: c.stateId })),
    })
  }

  async update({ params, request, response, session, bouncer }: HttpContext) {
    await bouncer.authorize(churchesUpdate)
    const church = await Church.query().where('id', params.id).firstOrFail()
    const {
      name,
      postalCode,
      countryId,
      stateId,
      cityId,
      neighborhood,
      street,
      number,
      complement,
      latitude,
      longitude,
    } = await request.validateUsing(updateChurchValidator)
    church.merge({ name })
    await church.save()

    const addressData = {
      postalCode,
      countryId,
      stateId,
      cityId,
      neighborhood,
      street,
      number,
      complement,
      latitude,
      longitude,
    }

    const address = await Address.query()
      .where('addressable_type', ADDRESSABLE_TYPE)
      .where('addressable_id', church.id)
      .first()

    const addressRecord = address
      ? (() => {
          address.merge(addressData)
          return address
        })()
      : await Address.create({
          addressableId: church.id,
          addressableType: ADDRESSABLE_TYPE,
          ...addressData,
        })

    await addressRecord.save()

    const geo = new GeocodingService()
    const [countryRow, stateRow, cityRow] = await Promise.all([
      Country.query().where('id', Number(countryId)).first(),
      stateId ? State.query().where('id', Number(stateId)).first() : Promise.resolve(null),
      cityId ? City.query().where('id', Number(cityId)).first() : Promise.resolve(null),
    ])

    const geoResult = await geo.geocode({
      country: countryRow?.name ?? null,
      state: stateRow?.uf ?? null,
      city: cityRow?.name ?? null,
      neighborhood,
      street,
      number,
    })

    if (geoResult) {
      addressRecord.merge({ latitude: geoResult.latitude, longitude: geoResult.longitude })
      await addressRecord.save()
    }

    session.flash({ success: 'Igreja atualizada com sucesso' })
    return response.redirect('/churches')
  }

  async destroy({ params, response, session, bouncer }: HttpContext) {
    await bouncer.authorize(churchesDelete)
    const church = await Church.query().where('id', params.id).firstOrFail()
    const address = await Address.query()
      .where('addressable_type', ADDRESSABLE_TYPE)
      .where('addressable_id', church.id)
      .first()
    if (address) {
      await address.delete()
    }
    await church.delete()

    session.flash({ success: 'Igreja excluída com sucesso' })
    return response.redirect('/churches')
  }

  async lookupCep({ request, response, bouncer }: HttpContext) {
    await bouncer.authorize(churchesCreate)
    const cep = request.input('cep', '').toString().trim()
    const service = new CepLookupService()
    try {
      const result = await service.lookup(cep)
      return response.json(result)
    } catch (error: any) {
      return response.status(404).json({ message: error.message || 'CEP não encontrado' })
    }
  }
}
