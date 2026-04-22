import vine from '@vinejs/vine'

export const createChurchValidator = vine.create({
  name: vine.string().maxLength(255),
  postalCode: vine.string().maxLength(20),
  countryId: vine.number(),
  stateId: vine.number().nullable(),
  cityId: vine.number().nullable(),
  neighborhood: vine.string().maxLength(150),
  street: vine.string().maxLength(255),
  number: vine.string().maxLength(50),
  complement: vine.string().maxLength(255).nullable(),
  latitude: vine.number().nullable(),
  longitude: vine.number().nullable(),
})

export const updateChurchValidator = vine.create({
  name: vine.string().maxLength(255),
  postalCode: vine.string().maxLength(20),
  countryId: vine.number(),
  stateId: vine.number().nullable(),
  cityId: vine.number().nullable(),
  neighborhood: vine.string().maxLength(150),
  street: vine.string().maxLength(255),
  number: vine.string().maxLength(50),
  complement: vine.string().maxLength(255).nullable(),
  latitude: vine.number().nullable(),
  longitude: vine.number().nullable(),
})
