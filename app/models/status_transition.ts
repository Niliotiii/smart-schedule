import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import OpenedMonth from './opened_month.js'
import User from './user.js'

export default class StatusTransition extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare openedMonthId: number

  @column()
  declare fromStatus: string

  @column()
  declare toStatus: string

  @column()
  declare changedByUserId: number | null

  @column.dateTime()
  declare changedAt: DateTime

  @belongsTo(() => OpenedMonth)
  declare openedMonth: BelongsTo<typeof OpenedMonth>

  @belongsTo(() => User, { foreignKey: 'changedByUserId' })
  declare changedBy: BelongsTo<typeof User>
}
