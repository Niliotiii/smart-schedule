import vine from '@vinejs/vine'

const email = () => vine.string().email().maxLength(254)
const password = () => vine.string().minLength(8).maxLength(32)

const requiredAddress = vine.object({
  postalCode: vine.string().trim().minLength(8).maxLength(9),
  countryId: vine.number().positive(),
  stateId: vine.number().positive(),
  cityId: vine.number().positive(),
  neighborhood: vine.string().trim().maxLength(150),
  street: vine.string().trim().maxLength(255),
  number: vine.string().trim().maxLength(50),
  complement: vine.string().trim().maxLength(255).optional(),
})

const requiredSacrament = vine.object({
  sacramentTypeId: vine.number().positive(),
  receivedDate: vine.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  receivedChurch: vine.string().trim().maxLength(255),
  receivedCountryId: vine.number().positive(),
  receivedStateId: vine.number().positive(),
  receivedCityId: vine.number().positive(),
})

export const signupValidator = vine.compile(
  vine.object({
    fullName: vine.string().nullable(),
    email: email().unique({ table: 'users', column: 'email' }),
    password: password(),
    passwordConfirmation: password().sameAs('password'),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: email(),
    password: vine.string(),
  })
)

export const createUserValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().maxLength(255),
    email: email().unique({ table: 'users', column: 'email' }),
    password: password(),
    passwordConfirmation: password().sameAs('password'),
    profileId: vine.number().positive(),
    userTypeId: vine.number().positive(),
    birthDate: vine
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/),
    birthCountryId: vine.number().positive(),
    birthStateId: vine.number().positive(),
    birthCityId: vine.number().positive(),
    phone: vine.string().trim().minLength(10).maxLength(20),
    responsible1Name: vine.string().trim().maxLength(255).optional(),
    responsible1Phone: vine.string().trim().maxLength(20).optional(),
    responsible2Name: vine.string().trim().maxLength(255).optional(),
    responsible2Phone: vine.string().trim().maxLength(20).optional(),
    includeInScale: vine.boolean(),
    communityId: vine.number().positive(),
    address: requiredAddress,
    sacraments: vine.array(requiredSacrament),
    ministryRoleIds: vine.array(vine.number().positive()).optional(),
  })
)

export const updateUserValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().maxLength(255),
    email: email(),
    password: password().optional(),
    passwordConfirmation: vine.string().sameAs('password').optional(),
    profileId: vine.number().positive(),
    userTypeId: vine.number().positive(),
    birthDate: vine
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/),
    birthCountryId: vine.number().positive(),
    birthStateId: vine.number().positive(),
    birthCityId: vine.number().positive(),
    phone: vine.string().trim().minLength(10).maxLength(20),
    responsible1Name: vine.string().trim().maxLength(255).optional(),
    responsible1Phone: vine.string().trim().maxLength(20).optional(),
    responsible2Name: vine.string().trim().maxLength(255).optional(),
    responsible2Phone: vine.string().trim().maxLength(20).optional(),
    includeInScale: vine.boolean(),
    communityId: vine.number().positive(),
    address: requiredAddress,
    sacraments: vine.array(requiredSacrament),
    ministryRoleIds: vine.array(vine.number().positive()).optional(),
  })
)
