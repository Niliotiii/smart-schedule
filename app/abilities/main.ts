import { Bouncer } from '@adonisjs/bouncer'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'
import type User from '#models/user'

const checkPermission = (user: User, permission: string): AuthorizerResponse => {
  if (!user.profile) return false
  return user.profile.permissions.some(
    (p: { module: string; action: string }) => `${p.module}:${p.action}` === permission
  )
}

export const usersRead = Bouncer.ability((user: User) => checkPermission(user, 'users:read'))
export const usersCreate = Bouncer.ability((user: User) => checkPermission(user, 'users:create'))
export const usersUpdate = Bouncer.ability((user: User) => checkPermission(user, 'users:update'))
export const usersDelete = Bouncer.ability((user: User) => checkPermission(user, 'users:delete'))

export const profilesRead = Bouncer.ability((user: User) => checkPermission(user, 'profiles:read'))
export const profilesCreate = Bouncer.ability((user: User) =>
  checkPermission(user, 'profiles:create')
)
export const profilesUpdate = Bouncer.ability((user: User) =>
  checkPermission(user, 'profiles:update')
)
export const profilesDelete = Bouncer.ability((user: User) =>
  checkPermission(user, 'profiles:delete')
)

export const userTypesRead = Bouncer.ability((user: User) =>
  checkPermission(user, 'user_types:read')
)
export const userTypesCreate = Bouncer.ability((user: User) =>
  checkPermission(user, 'user_types:create')
)
export const userTypesUpdate = Bouncer.ability((user: User) =>
  checkPermission(user, 'user_types:update')
)
export const userTypesDelete = Bouncer.ability((user: User) =>
  checkPermission(user, 'user_types:delete')
)

export const churchesRead = Bouncer.ability((user: User) => checkPermission(user, 'churches:read'))
export const churchesCreate = Bouncer.ability((user: User) =>
  checkPermission(user, 'churches:create')
)
export const churchesUpdate = Bouncer.ability((user: User) =>
  checkPermission(user, 'churches:update')
)
export const churchesDelete = Bouncer.ability((user: User) =>
  checkPermission(user, 'churches:delete')
)

export const priestsRead = Bouncer.ability((user: User) => checkPermission(user, 'priests:read'))
export const priestsCreate = Bouncer.ability((user: User) =>
  checkPermission(user, 'priests:create')
)
export const priestsUpdate = Bouncer.ability((user: User) =>
  checkPermission(user, 'priests:update')
)
export const priestsDelete = Bouncer.ability((user: User) =>
  checkPermission(user, 'priests:delete')
)

export const ministryRolesRead = Bouncer.ability((user: User) =>
  checkPermission(user, 'ministry_roles:read')
)
export const ministryRolesCreate = Bouncer.ability((user: User) =>
  checkPermission(user, 'ministry_roles:create')
)
export const ministryRolesUpdate = Bouncer.ability((user: User) =>
  checkPermission(user, 'ministry_roles:update')
)
export const ministryRolesDelete = Bouncer.ability((user: User) =>
  checkPermission(user, 'ministry_roles:delete')
)
