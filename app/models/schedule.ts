import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import OpenedMonth from './opened_month.js'
import Church from './church.js'
import Priest from './priest.js'
import ScheduleRole from './schedule_role.js'
import AvailabilitySignal from './availability_signal.js'

export default class Schedule extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare openedMonthId: number

  @column()
  declare day: number

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare communityId: number

  @column()
  declare priestId: number

  @column()
  declare time: string

  @belongsTo(() => OpenedMonth)
  declare openedMonth: BelongsTo<typeof OpenedMonth>

  @belongsTo(() => Church, { foreignKey: 'communityId' })
  declare community: BelongsTo<typeof Church>

  @belongsTo(() => Priest)
  declare priest: BelongsTo<typeof Priest>

  @hasMany(() => ScheduleRole)
  declare scheduleRoles: HasMany<typeof ScheduleRole>

  @hasMany(() => AvailabilitySignal)
  declare availabilitySignals: HasMany<typeof AvailabilitySignal>

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
}
