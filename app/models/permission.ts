import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/orm/types'
import { DateTime } from 'luxon'
import Profile from './profile.js'

export default class Permission extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare module: string

  @column()
  declare action: string

  @column()
  declare description: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @manyToMany(() => Profile, {
    pivotTable: 'profile_permissions',
    withTimestamps: true,
  })
  declare profiles: ManyToMany<typeof Profile>
}