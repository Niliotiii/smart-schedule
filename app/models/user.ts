import { column, belongsTo, hasOne, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasOne, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { type AccessToken, DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { DateTime } from 'luxon'
import { BaseModel } from '@adonisjs/lucid/orm'
import Profile from './profile.js'
import UserType from './user_type.js'
import Country from './country.js'
import State from './state.js'
import City from './city.js'
import Church from './church.js'
import Address from './address.js'
import Sacrament from './sacrament.js'
import MinistryRole from './ministry_role.js'

const AuthFinder = withAuthFinder(hash, {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare profileId: number | null

  @column()
  declare userTypeId: number | null

  @column.date()
  declare birthDate: DateTime

  @column()
  declare birthCountryId: number

  @column()
  declare birthStateId: number

  @column()
  declare birthCityId: number

  @column()
  declare phone: string

  @column({ columnName: 'responsible_1_name' })
  declare responsible1Name: string | null

  @column({ columnName: 'responsible_1_phone' })
  declare responsible1Phone: string | null

  @column({ columnName: 'responsible_2_name' })
  declare responsible2Name: string | null

  @column({ columnName: 'responsible_2_phone' })
  declare responsible2Phone: string | null

  @column()
  declare includeInScale: boolean

  @column()
  declare communityId: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column.dateTime()
  declare deletedAt: DateTime | null

  @belongsTo(() => Profile)
  declare profile: BelongsTo<typeof Profile>

  @belongsTo(() => UserType)
  declare userType: BelongsTo<typeof UserType>

  @belongsTo(() => Country, { foreignKey: 'birthCountryId' })
  declare birthCountry: BelongsTo<typeof Country>

  @belongsTo(() => State, { foreignKey: 'birthStateId' })
  declare birthState: BelongsTo<typeof State>

  @belongsTo(() => City, { foreignKey: 'birthCityId' })
  declare birthCity: BelongsTo<typeof City>

  @belongsTo(() => Church, { foreignKey: 'communityId' })
  declare community: BelongsTo<typeof Church>

  @hasOne(() => Address, {
    foreignKey: 'addressableId',
    onQuery: (query) => query.where('addressable_type', 'users'),
  })
  declare address: HasOne<typeof Address>

  @hasMany(() => Sacrament)
  declare sacraments: HasMany<typeof Sacrament>

  @manyToMany(() => MinistryRole, {
    pivotTable: 'ministry_role_user',
    pivotTimestamps: true,
  })
  declare ministryRoles: ManyToMany<typeof MinistryRole>

  static accessTokens = DbAccessTokensProvider.forModel(User)
  declare currentAccessToken?: AccessToken

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

  get initials() {
    const [first, last] = this.fullName ? this.fullName.split(' ') : this.email.split('@')
    if (first && last) {
      return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
    }
    return `${first!.slice(0, 2)}`.toUpperCase()
  }
}
