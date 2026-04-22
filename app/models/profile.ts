import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import User from './user.js'
import Permission from './permission.js'

export default class Profile extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column.dateTime()
  declare deletedAt: DateTime | null

  @hasMany(() => User)
  declare users: HasMany<typeof User>

  @manyToMany(() => Permission, {
    pivotTable: 'profile_permissions',
    pivotTimestamps: true,
  })
  declare permissions: ManyToMany<typeof Permission>

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
