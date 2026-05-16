import vine from '@vinejs/vine'

export const scheduleValidator = vine.create({
  day: vine.number().min(1).max(31),
  name: vine.string().maxLength(255),
  description: vine.string().maxLength(1000).nullable().optional(),
  communityId: vine.number(),
  priestId: vine.number(),
  ministryRoles: vine.array(vine.object({ roleId: vine.number(), quantity: vine.number().min(1) })).optional(),
  time: vine.string().maxLength(5),
})

export const signalValidator = vine.create({
  response: vine.string().in(['sim', 'nao']),
})
