/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  login: {
    show: typeof routes['login.show']
    post: typeof routes['login.post']
  }
  logout: typeof routes['logout']
  dashboard: typeof routes['dashboard']
  profiles: {
    index: typeof routes['profiles.index']
    create: typeof routes['profiles.create']
    store: typeof routes['profiles.store']
    show: typeof routes['profiles.show']
    edit: typeof routes['profiles.edit']
    update: typeof routes['profiles.update']
    destroy: typeof routes['profiles.destroy']
  }
  users: {
    index: typeof routes['users.index']
    create: typeof routes['users.create']
    store: typeof routes['users.store']
    show: typeof routes['users.show']
    edit: typeof routes['users.edit']
    update: typeof routes['users.update']
    destroy: typeof routes['users.destroy']
  }
  userTypes: {
    index: typeof routes['user_types.index']
    create: typeof routes['user_types.create']
    store: typeof routes['user_types.store']
    show: typeof routes['user_types.show']
    edit: typeof routes['user_types.edit']
    update: typeof routes['user_types.update']
    destroy: typeof routes['user_types.destroy']
  }
  churches: {
    lookupCep: typeof routes['churches.lookupCep']
    index: typeof routes['churches.index']
    create: typeof routes['churches.create']
    store: typeof routes['churches.store']
    show: typeof routes['churches.show']
    edit: typeof routes['churches.edit']
    update: typeof routes['churches.update']
    destroy: typeof routes['churches.destroy']
  }
  priests: {
    index: typeof routes['priests.index']
    create: typeof routes['priests.create']
    store: typeof routes['priests.store']
    show: typeof routes['priests.show']
    edit: typeof routes['priests.edit']
    update: typeof routes['priests.update']
    destroy: typeof routes['priests.destroy']
  }
  ministryRoles: {
    index: typeof routes['ministry_roles.index']
    create: typeof routes['ministry_roles.create']
    store: typeof routes['ministry_roles.store']
    show: typeof routes['ministry_roles.show']
    edit: typeof routes['ministry_roles.edit']
    update: typeof routes['ministry_roles.update']
    destroy: typeof routes['ministry_roles.destroy']
  }
  api: {
    signup: typeof routes['api.signup']
    login: typeof routes['api.login']
    logout: typeof routes['api.logout']
    profile: typeof routes['api.profile']
  }
}
