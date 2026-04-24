import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import User from './user.js'
import SacramentType from './sacrament_type.js'
import Country from './country.js'
import State from './state.js'
import City from './city.js'

export default class Sacrament extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare sacramentTypeId: number

  @column.date()
  declare receivedDate: DateTime

  @column()
  declare receivedChurch: string

  @column()
  declare receivedCountryId: number

  @column()
  declare receivedStateId: number

  @column()
  declare receivedCityId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column.dateTime()
  declare deletedAt: DateTime | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => SacramentType)
  declare sacramentType: BelongsTo<typeof SacramentType>

  @belongsTo(() => Country, { foreignKey: 'receivedCountryId' })
  declare receivedCountry: BelongsTo<typeof Country>

  @belongsTo(() => State, { foreignKey: 'receivedStateId' })
  declare receivedState: BelongsTo<typeof State>

  @belongsTo(() => City, { foreignKey: 'receivedCityId' })
  declare receivedCity: BelongsTo<typeof City>

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
