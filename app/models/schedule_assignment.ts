import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Schedule from './schedule.js'
import User from './user.js'
import MinistryRole from './ministry_role.js'

export default class ScheduleAssignment extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare scheduleId: number

  @column()
  declare userId: number

  @column()
  declare ministryRoleId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => Schedule)
  declare schedule: BelongsTo<typeof Schedule>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => MinistryRole)
  declare ministryRole: BelongsTo<typeof MinistryRole>
}
