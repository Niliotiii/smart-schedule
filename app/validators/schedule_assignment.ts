import vine from '@vinejs/vine'

export const createAssignmentValidator = vine.create({
  scheduleId: vine.number(),
  userId: vine.number(),
  ministryRoleId: vine.number(),
})
