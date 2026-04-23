import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class Priest extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare phone: string | null

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
