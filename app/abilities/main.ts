import { Bouncer } from '@adonisjs/bouncer'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'
import type User from '#models/user'

const checkPermission = (user: User, permission: string): AuthorizerResponse => {
  if (!user.profile) return false
  return user.profile.permissions.some((p) => `${p.module}:${p.action}` === permission)
}

export const usersRead = Bouncer.ability((user: User) => checkPermission(user, 'users:read'))
export const usersCreate = Bouncer.ability((user: User) => checkPermission(user, 'users:create'))
export const usersUpdate = Bouncer.ability((user: User) => checkPermission(user, 'users:update'))
export const usersDelete = Bouncer.ability((user: User) => checkPermission(user, 'users:delete'))

export const profilesRead = Bouncer.ability((user: User) => checkPermission(user, 'profiles:read'))
export const profilesCreate = Bouncer.ability((user: User) => checkPermission(user, 'profiles:create'))
export const profilesUpdate = Bouncer.ability((user: User) => checkPermission(user, 'profiles:update'))
export const profilesDelete = Bouncer.ability((user: User) => checkPermission(user, 'profiles:delete'))