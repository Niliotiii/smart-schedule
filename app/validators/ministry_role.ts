import vine from '@vinejs/vine'

export const createMinistryRoleValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(255),
    description: vine.string().trim().optional(),
  })
)

export const updateMinistryRoleValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(255),
    description: vine.string().trim().optional(),
  })
)
