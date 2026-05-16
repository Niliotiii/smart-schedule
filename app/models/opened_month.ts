import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import User from './user.js'
import Schedule from './schedule.js'

export default class OpenedMonth extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare year: number

  @column()
  declare month: number

  @column.dateTime()
  declare openedAt: DateTime

  @column()
  declare signalingPeriodDays: number

  @column.dateTime()
  declare signalingDeadline: DateTime

  @column()
  declare createdByUserId: number

  @belongsTo(() => User, { foreignKey: 'createdByUserId' })
  declare createdBy: BelongsTo<typeof User>

  @hasMany(() => Schedule)
  declare schedules: HasMany<typeof Schedule>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column.dateTime()
  declare deletedAt: DateTime | null

  async delete() {
    this.deletedAt = DateTime.now()
    await this.save()
  }

  async restore() {
    this.deletedAt = null
    await this.save()
  }

  static withoutTrashed(query: any) {
    return query.whereNull('deleted_at')
  }

  get isSignalingActive(): boolean {
    return DateTime.now() <= this.signalingDeadline
  }
}
