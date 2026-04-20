/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'login.show': {
    methods: ["GET","HEAD"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['login.show']['types'],
  },
  'login.post': {
    methods: ["POST"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['login.post']['types'],
  },
  'logout': {
    methods: ["POST"],
    pattern: '/logout',
    tokens: [{"old":"/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['logout']['types'],
  },
  'dashboard': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard',
    tokens: [{"old":"/dashboard","type":0,"val":"dashboard","end":""}],
    types: placeholder as Registry['dashboard']['types'],
  },
  'profiles.index': {
    methods: ["GET","HEAD"],
    pattern: '/profiles',
    tokens: [{"old":"/profiles","type":0,"val":"profiles","end":""}],
    types: placeholder as Registry['profiles.index']['types'],
  },
  'profiles.create': {
    methods: ["GET","HEAD"],
    pattern: '/profiles/create',
    tokens: [{"old":"/profiles/create","type":0,"val":"profiles","end":""},{"old":"/profiles/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['profiles.create']['types'],
  },
  'profiles.store': {
    methods: ["POST"],
    pattern: '/profiles',
    tokens: [{"old":"/profiles","type":0,"val":"profiles","end":""}],
    types: placeholder as Registry['profiles.store']['types'],
  },
  'profiles.show': {
    methods: ["GET","HEAD"],
    pattern: '/profiles/:id',
    tokens: [{"old":"/profiles/:id","type":0,"val":"profiles","end":""},{"old":"/profiles/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['profiles.show']['types'],
  },
  'profiles.edit': {
    methods: ["GET","HEAD"],
    pattern: '/profiles/:id/edit',
    tokens: [{"old":"/profiles/:id/edit","type":0,"val":"profiles","end":""},{"old":"/profiles/:id/edit","type":1,"val":"id","end":""},{"old":"/profiles/:id/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['profiles.edit']['types'],
  },
  'profiles.update': {
    methods: ["PUT","PATCH"],
    pattern: '/profiles/:id',
    tokens: [{"old":"/profiles/:id","type":0,"val":"profiles","end":""},{"old":"/profiles/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['profiles.update']['types'],
  },
  'profiles.destroy': {
    methods: ["DELETE"],
    pattern: '/profiles/:id',
    tokens: [{"old":"/profiles/:id","type":0,"val":"profiles","end":""},{"old":"/profiles/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['profiles.destroy']['types'],
  },
  'users.index': {
    methods: ["GET","HEAD"],
    pattern: '/users',
    tokens: [{"old":"/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['users.index']['types'],
  },
  'users.create': {
    methods: ["GET","HEAD"],
    pattern: '/users/create',
    tokens: [{"old":"/users/create","type":0,"val":"users","end":""},{"old":"/users/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['users.create']['types'],
  },
  'users.store': {
    methods: ["POST"],
    pattern: '/users',
    tokens: [{"old":"/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['users.store']['types'],
  },
  'users.show': {
    methods: ["GET","HEAD"],
    pattern: '/users/:id',
    tokens: [{"old":"/users/:id","type":0,"val":"users","end":""},{"old":"/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['users.show']['types'],
  },
  'users.edit': {
    methods: ["GET","HEAD"],
    pattern: '/users/:id/edit',
    tokens: [{"old":"/users/:id/edit","type":0,"val":"users","end":""},{"old":"/users/:id/edit","type":1,"val":"id","end":""},{"old":"/users/:id/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['users.edit']['types'],
  },
  'users.update': {
    methods: ["PUT","PATCH"],
    pattern: '/users/:id',
    tokens: [{"old":"/users/:id","type":0,"val":"users","end":""},{"old":"/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['users.update']['types'],
  },
  'users.destroy': {
    methods: ["DELETE"],
    pattern: '/users/:id',
    tokens: [{"old":"/users/:id","type":0,"val":"users","end":""},{"old":"/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['users.destroy']['types'],
  },
  'api.signup': {
    methods: ["POST"],
    pattern: '/api/v1/auth/signup',
    tokens: [{"old":"/api/v1/auth/signup","type":0,"val":"api","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['api.signup']['types'],
  },
  'api.login': {
    methods: ["POST"],
    pattern: '/api/v1/auth/login',
    tokens: [{"old":"/api/v1/auth/login","type":0,"val":"api","end":""},{"old":"/api/v1/auth/login","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/login","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['api.login']['types'],
  },
  'api.logout': {
    methods: ["POST"],
    pattern: '/api/v1/auth/logout',
    tokens: [{"old":"/api/v1/auth/logout","type":0,"val":"api","end":""},{"old":"/api/v1/auth/logout","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/logout","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['api.logout']['types'],
  },
  'api.profile': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/profile',
    tokens: [{"old":"/api/v1/account/profile","type":0,"val":"api","end":""},{"old":"/api/v1/account/profile","type":0,"val":"v1","end":""},{"old":"/api/v1/account/profile","type":0,"val":"account","end":""},{"old":"/api/v1/account/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['api.profile']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
