import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Country from './country.js'
import State from './state.js'
import City from './city.js'

export default class Address extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare addressableId: number

  @column()
  declare addressableType: string

  @column()
  declare postalCode: string

  @column()
  declare countryId: number

  @column()
  declare stateId: number | null

  @column()
  declare cityId: number | null

  @column()
  declare neighborhood: string

  @column()
  declare street: string

  @column()
  declare number: string

  @column()
  declare complement: string | null

  @column()
  declare latitude: number | null

  @column()
  declare longitude: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column.dateTime()
  declare deletedAt: DateTime | null

  @belongsTo(() => Country)
  declare country: BelongsTo<typeof Country>

  @belongsTo(() => State)
  declare state: BelongsTo<typeof State>

  @belongsTo(() => City)
  declare city: BelongsTo<typeof City>

  async delete() {
    this.deletedAt = DateTime.now()
    await this.save()
  }
}
