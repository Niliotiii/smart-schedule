import vine from '@vinejs/vine'

const password = () => vine.string().minLength(8).maxLength(32)

const address = vine.object({
  postalCode: vine.string().trim().minLength(8).maxLength(9),
  countryId: vine.number().positive(),
  stateId: vine.number().positive().optional(),
  cityId: vine.number().positive().optional(),
  neighborhood: vine.string().trim().maxLength(150),
  street: vine.string().trim().maxLength(255),
  number: vine.string().trim().maxLength(50),
  complement: vine.string().trim().maxLength(255).optional(),
})

const sacrament = vine.object({
  sacramentTypeId: vine.number().positive(),
  receivedDate: vine.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  receivedChurch: vine.string().trim().maxLength(255),
  receivedCountryId: vine.number().positive(),
  receivedStateId: vine.number().positive(),
  receivedCityId: vine.number().positive(),
})

export const updateProfileValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().maxLength(255).optional(),
    email: vine.string().email().maxLength(254).optional(),
    phone: vine.string().trim().minLength(10).maxLength(20).optional(),
    birthDate: vine
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    birthCountryId: vine.number().positive().optional(),
    birthStateId: vine.number().positive().optional(),
    birthCityId: vine.number().positive().optional(),
    responsible1Name: vine.string().trim().maxLength(255).optional(),
    responsible1Phone: vine.string().trim().maxLength(20).optional(),
    responsible2Name: vine.string().trim().maxLength(255).optional(),
    responsible2Phone: vine.string().trim().maxLength(20).optional(),
    profileId: vine.number().positive().optional(),
    userTypeId: vine.number().positive().optional(),
    communityId: vine.number().positive().optional(),
    address: address.optional(),
    sacraments: vine.array(sacrament).optional(),
  })
)

export const changePasswordValidator = vine.compile(
  vine.object({
    currentPassword: vine.string(),
    newPassword: password(),
    newPasswordConfirmation: password().sameAs('newPassword'),
  })
)
