import { type HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import { randomBytes } from 'node:crypto'
import User from '#models/user'
import Address from '#models/address'
import Sacrament from '#models/sacrament'
import Profile from '#models/profile'
import UserType from '#models/user_type'
import Country from '#models/country'
import State from '#models/state'
import City from '#models/city'
import Church from '#models/church'
import SacramentType from '#models/sacrament_type'
import MinistryRole from '#models/ministry_role'

import { createUserValidator, updateUserValidator } from '#validators/user'
import { usersRead, usersCreate, usersUpdate, usersDelete, usersEditProfile } from '#abilities/main'

const ADDRESSABLE_TYPE = 'users'

export default class UsersController {
  async index({ inertia, request, bouncer }: HttpContext) {
    await bouncer.authorize(usersRead)
    const page = request.input('page', 1)
    const search = request.input('search', '').trim()

    const query = User.withoutTrashed(User.query().preload('profile').preload('userType'))
    if (search) {
      query.where((q: any) => {
        q.where('full_name', 'ilike', `%${search}%`).orWhere('email', 'ilike', `%${search}%`)
      })
    }
    const users = await query.paginate(page, 15)

    const firstItem = users.total > 0 ? (users.currentPage - 1) * users.perPage + 1 : 0
    const lastItem = Math.min(users.currentPage * users.perPage, users.total)

    return inertia.render('Users/Index', {
      users: [
        ...users.map((u: User) => ({
          id: u.id,
          fullName: u.fullName,
          email: u.email,
          phone: u.phone,
          profileId: u.profileId,
          profile: u.profile ? { id: u.profile.id, name: u.profile.name } : null,
          userType: u.userType ? { id: u.userType.id, name: u.userType.name } : null,
        })),
      ],
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
    const [
      profiles,
      userTypes,
      countries,
      states,
      cities,
      sacramentTypes,
      ministryRoles,
      churches,
    ] = await Promise.all([
      Profile.all(),
      UserType.all(),
      Country.all(),
      State.all(),
      City.all(),
      SacramentType.all(),
      MinistryRole.all(),
      Church.all(),
    ])
    let canEditProfile = false
    try {
      canEditProfile = await bouncer.allows(usersEditProfile)
    } catch {
      canEditProfile = false
    }
    return inertia.render('Users/Form', {
      user: null,
      profiles: profiles.map((p) => ({ id: p.id, name: p.name })),
      userTypes: userTypes.map((ut) => ({ id: ut.id, name: ut.name })),
      countries: countries.map((c) => ({ id: c.id, name: c.name })),
      states: states.map((s) => ({ id: s.id, name: s.name, uf: s.uf })),
      cities: cities.map((c) => ({ id: c.id, name: c.name, stateId: c.stateId })),
      sacramentTypes: sacramentTypes.map((st) => ({ id: st.id, name: st.name })),
      ministryRoles: ministryRoles.map((mr) => ({
        id: mr.id,
        name: mr.name,
        description: mr.description,
      })),
      churches: churches.map((ch) => ({ id: ch.id, name: ch.name })),
      canEditProfile,
    })
  }

  async store({ request, response, session, bouncer }: HttpContext) {
    await bouncer.authorize(usersCreate)
    const payload = await request.validateUsing(createUserValidator)
    const generatedPassword = randomBytes(18).toString('base64').substring(0, 24)
    const user = await User.create({
      fullName: payload.fullName,
      email: payload.email,
      password: generatedPassword,
      profileId: payload.profileId,
      userTypeId: payload.userTypeId,
      birthDate: DateTime.fromISO(payload.birthDate),
      birthCountryId: payload.birthCountryId,
      birthStateId: payload.birthStateId,
      birthCityId: payload.birthCityId,
      phone: payload.phone,
      responsible1Name: payload.responsible1Name,
      responsible1Phone: payload.responsible1Phone,
      responsible2Name: payload.responsible2Name,
      responsible2Phone: payload.responsible2Phone,
      includeInScale: payload.includeInScale,
      communityId: payload.communityId,
    })

    if (payload.address) {
      await Address.create({
        addressableId: user.id,
        addressableType: ADDRESSABLE_TYPE,
        ...payload.address,
      })
    }

    if (payload.sacraments && payload.sacraments.length > 0) {
      await user.related('sacraments').createMany(
        payload.sacraments.map((s) => ({
          sacramentTypeId: s.sacramentTypeId,
          receivedDate: DateTime.fromISO(s.receivedDate),
          receivedChurch: s.receivedChurch,
          receivedCountryId: s.receivedCountryId,
          receivedStateId: s.receivedStateId,
          receivedCityId: s.receivedCityId,
        }))
      )
    }

    if (payload.ministryRoleIds && payload.ministryRoleIds.length > 0) {
      await user.related('ministryRoles').attach(payload.ministryRoleIds)
    }

    session.flash({ success: 'Usuario criado com sucesso. Senha gerada automaticamente.' })
    return response.redirect('/users')
  }

  async show({ params, inertia, bouncer }: HttpContext) {
    await bouncer.authorize(usersRead)
    const user = await User.query()
      .where('id', params.id)
      .preload('profile')
      .preload('userType')
      .preload('birthCountry')
      .preload('birthState')
      .preload('birthCity')
      .preload('community')
      .preload('address', (q) => q.preload('country').preload('state').preload('city'))
      .preload('sacraments', (q) =>
        q
          .preload('sacramentType')
          .preload('receivedCountry')
          .preload('receivedState')
          .preload('receivedCity')
      )
      .preload('ministryRoles')
      .firstOrFail()

    return inertia.render('Users/Show', {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        birthDate: user.birthDate.toISODate()!,
        phone: user.phone,
        responsible1Name: user.responsible1Name,
        responsible1Phone: user.responsible1Phone,
        responsible2Name: user.responsible2Name,
        responsible2Phone: user.responsible2Phone,
        includeInScale: user.includeInScale,
        profileId: user.profileId,
        profile: user.profile ? { id: user.profile.id, name: user.profile.name } : null,
        userTypeId: user.userTypeId,
        userType: user.userType ? { id: user.userType.id, name: user.userType.name } : null,
        birthCountry: user.birthCountry
          ? { id: user.birthCountry.id, name: user.birthCountry.name }
          : null,
        birthState: user.birthState
          ? { id: user.birthState.id, name: user.birthState.name, uf: user.birthState.uf }
          : null,
        birthCity: user.birthCity ? { id: user.birthCity.id, name: user.birthCity.name } : null,
        community: user.community ? { id: user.community.id, name: user.community.name } : null,
        address: user.address
          ? {
              postalCode: user.address.postalCode,
              street: user.address.street,
              number: user.address.number,
              complement: user.address.complement,
              neighborhood: user.address.neighborhood,
              city: user.address.city ? user.address.city.name : null,
              state: user.address.state ? user.address.state.uf : null,
              country: user.address.country ? user.address.country.name : null,
            }
          : null,
        sacraments: user.sacraments.map((s) => ({
          id: s.id,
          sacramentTypeId: s.sacramentTypeId,
          sacramentType: s.sacramentType
            ? { id: s.sacramentType.id, name: s.sacramentType.name }
            : null,
          receivedDate: s.receivedDate.toISODate()!,
          receivedChurch: s.receivedChurch,
          receivedCountry: s.receivedCountry
            ? { id: s.receivedCountry.id, name: s.receivedCountry.name }
            : null,
          receivedState: s.receivedState
            ? { id: s.receivedState.id, name: s.receivedState.name, uf: s.receivedState.uf }
            : null,
          receivedCity: s.receivedCity
            ? { id: s.receivedCity.id, name: s.receivedCity.name }
            : null,
        })),
        ministryRoles: user.ministryRoles.map((mr) => ({
          id: mr.id,
          name: mr.name,
        })),
        createdAt: user.createdAt.toISO()!,
      },
    })
  }

  async edit({ params, inertia, bouncer }: HttpContext) {
    await bouncer.authorize(usersUpdate)
    const user = await User.query()
      .where('id', params.id)
      .preload('address', (q) => q.preload('country').preload('state').preload('city'))
      .preload('sacraments', (q) =>
        q
          .preload('sacramentType')
          .preload('receivedCountry')
          .preload('receivedState')
          .preload('receivedCity')
      )
      .preload('ministryRoles')
      .firstOrFail()

    const [
      profiles,
      userTypes,
      countries,
      states,
      cities,
      sacramentTypes,
      ministryRoles,
      churches,
    ] = await Promise.all([
      Profile.all(),
      UserType.all(),
      Country.all(),
      State.all(),
      City.all(),
      SacramentType.all(),
      MinistryRole.all(),
      Church.all(),
    ])

    let canEditProfile = false
    try {
      canEditProfile = await bouncer.allows(usersEditProfile)
    } catch {
      canEditProfile = false
    }

    return inertia.render('Users/Form', {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        birthDate: user.birthDate.toISODate()!,
        phone: user.phone,
        birthCountryId: user.birthCountryId,
        birthStateId: user.birthStateId,
        birthCityId: user.birthCityId,
        responsible1Name: user.responsible1Name,
        responsible1Phone: user.responsible1Phone,
        responsible2Name: user.responsible2Name,
        responsible2Phone: user.responsible2Phone,
        profileId: user.profileId,
        userTypeId: user.userTypeId,
        includeInScale: user.includeInScale,
        communityId: user.communityId,
        address: user.address
          ? {
              id: user.address.id,
              postalCode: user.address.postalCode,
              countryId: user.address.countryId,
              stateId: user.address.stateId,
              cityId: user.address.cityId,
              neighborhood: user.address.neighborhood,
              street: user.address.street,
              number: user.address.number,
              complement: user.address.complement,
            }
          : null,
        sacraments: user.sacraments.map((s) => ({
          id: s.id,
          sacramentTypeId: s.sacramentTypeId,
          receivedDate: s.receivedDate.toISODate()!,
          receivedChurch: s.receivedChurch,
          receivedCountryId: s.receivedCountryId,
          receivedStateId: s.receivedStateId,
          receivedCityId: s.receivedCityId,
        })),
        ministryRoleIds: user.ministryRoles.map((mr) => mr.id),
      },
      profiles: profiles.map((p) => ({ id: p.id, name: p.name })),
      userTypes: userTypes.map((ut) => ({ id: ut.id, name: ut.name })),
      countries: countries.map((c) => ({ id: c.id, name: c.name })),
      states: states.map((s) => ({ id: s.id, name: s.name, uf: s.uf })),
      cities: cities.map((c) => ({ id: c.id, name: c.name, stateId: c.stateId })),
      sacramentTypes: sacramentTypes.map((st) => ({ id: st.id, name: st.name })),
      ministryRoles: ministryRoles.map((mr) => ({
        id: mr.id,
        name: mr.name,
        description: mr.description,
      })),
      churches: churches.map((ch) => ({ id: ch.id, name: ch.name })),
      canEditProfile,
    })
  }

  async update({ params, request, response, session, bouncer }: HttpContext) {
    await bouncer.authorize(usersUpdate)
    const user = await User.findOrFail(params.id)
    const payload = await request.validateUsing(updateUserValidator)
    user.merge({
      fullName: payload.fullName,
      email: payload.email,
      profileId: payload.profileId,
      userTypeId: payload.userTypeId,
      birthDate: DateTime.fromISO(payload.birthDate),
      birthCountryId: payload.birthCountryId,
      birthStateId: payload.birthStateId,
      birthCityId: payload.birthCityId,
      phone: payload.phone,
      responsible1Name: payload.responsible1Name,
      responsible1Phone: payload.responsible1Phone,
      responsible2Name: payload.responsible2Name,
      responsible2Phone: payload.responsible2Phone,
      includeInScale: payload.includeInScale,
      communityId: payload.communityId,
    })
    await user.save()

    if (payload.address) {
      const existingAddress = await Address.query()
        .where('addressable_type', ADDRESSABLE_TYPE)
        .where('addressable_id', user.id)
        .first()
      if (existingAddress) {
        existingAddress.merge({
          postalCode: payload.address.postalCode,
          countryId: payload.address.countryId,
          stateId: payload.address.stateId ?? null,
          cityId: payload.address.cityId ?? null,
          neighborhood: payload.address.neighborhood,
          street: payload.address.street,
          number: payload.address.number,
          complement: payload.address.complement ?? null,
        })
        await existingAddress.save()
      } else {
        await Address.create({
          addressableId: user.id,
          addressableType: ADDRESSABLE_TYPE,
          ...payload.address,
        })
      }
    }

    if (payload.sacraments) {
      await Sacrament.query().where('user_id', user.id).delete()
      if (payload.sacraments.length > 0) {
        await user.related('sacraments').createMany(
          payload.sacraments.map((s) => ({
            sacramentTypeId: s.sacramentTypeId,
            receivedDate: DateTime.fromISO(s.receivedDate),
            receivedChurch: s.receivedChurch,
            receivedCountryId: s.receivedCountryId,
            receivedStateId: s.receivedStateId,
            receivedCityId: s.receivedCityId,
          }))
        )
      }
    }

    if (payload.ministryRoleIds) {
      await user.related('ministryRoles').sync(payload.ministryRoleIds)
    }

    session.flash({ success: 'Usuario atualizado com sucesso' })
    return response.redirect('/users')
  }

  async destroy({ params, response, session, bouncer }: HttpContext) {
    await bouncer.authorize(usersDelete)
    const user = await User.findOrFail(params.id)
    await user.delete()

    session.flash({ success: 'Usuario excluido com sucesso' })
    return response.redirect('/users')
  }
}
