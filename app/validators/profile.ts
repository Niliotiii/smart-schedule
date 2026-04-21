import vine from '@vinejs/vine'

export const createProfileValidator = vine.create({
  name: vine.string().maxLength(100),
  description: vine.string().nullable(),
  permissionIds: vine.array(vine.number()).optional(),
})

export const updateProfileValidator = vine.create({
  name: vine.string().maxLength(100),
  description: vine.string().nullable(),
  permissionIds: vine.array(vine.number()).optional(),
})
