import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Schedule from './schedule.js'
import User from './user.js'

export default class AvailabilitySignal extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare scheduleId: number

  @column()
  declare userId: number

  @column()
  declare response: 'sim' | 'nao'

  @column.dateTime()
  declare signaledAt: DateTime

  @belongsTo(() => Schedule)
  declare schedule: BelongsTo<typeof Schedule>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
