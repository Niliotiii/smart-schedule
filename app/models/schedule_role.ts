import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Schedule from './schedule.js'
import MinistryRole from './ministry_role.js'

export default class ScheduleRole extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare scheduleId: number

  @column()
  declare ministryRoleId: number

  @belongsTo(() => Schedule)
  declare schedule: BelongsTo<typeof Schedule>

  @column()
  declare quantity: number

  @belongsTo(() => MinistryRole)
  declare ministryRole: BelongsTo<typeof MinistryRole>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
