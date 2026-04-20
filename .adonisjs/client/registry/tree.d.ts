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
  api: {
    signup: typeof routes['api.signup']
    login: typeof routes['api.login']
    logout: typeof routes['api.logout']
    profile: typeof routes['api.profile']
  }
}
