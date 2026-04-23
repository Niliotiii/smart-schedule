import vine from '@vinejs/vine'

export const createPriestValidator = vine.create({
  name: vine.string().maxLength(255),
  phone: vine.string().maxLength(20).nullable().optional(),
})

export const updatePriestValidator = vine.create({
  name: vine.string().maxLength(255),
  phone: vine.string().maxLength(20).nullable().optional(),
})
