import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Country from './country.js'
import City from './city.js'

export default class State extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare countryId: number

  @column()
  declare ibgeCode: number

  @column()
  declare uf: string

  @column()
  declare name: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column.dateTime()
  declare deletedAt: DateTime | null

  @belongsTo(() => Country)
  declare country: BelongsTo<typeof Country>

  @hasMany(() => City)
  declare cities: HasMany<typeof City>

  async delete() {
    this.deletedAt = DateTime.now()
    await this.save()
  }
}
