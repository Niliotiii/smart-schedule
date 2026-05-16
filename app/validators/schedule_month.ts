import vine from '@vinejs/vine'

const scheduleItemSchema = vine.object({
  day: vine.number().min(1).max(31),
  name: vine.string().maxLength(255),
  description: vine.string().maxLength(1000).nullable().optional(),
  communityId: vine.number(),
  priestId: vine.number(),
  ministryRoles: vine.array(vine.object({ roleId: vine.number(), quantity: vine.number().min(1) })).optional(),
  time: vine.string().maxLength(5),
})

export const createScheduleMonthValidator = vine.create(
  vine.object({
    year: vine.number().min(new Date().getFullYear()),
    month: vine.number().min(1).max(12),
    signalingPeriodDays: vine.number().min(1).max(30),
    schedules: vine.array(scheduleItemSchema).minLength(1),
  })
)
