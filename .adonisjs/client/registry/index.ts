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
  'user_types.index': {
    methods: ["GET","HEAD"],
    pattern: '/user-types',
    tokens: [{"old":"/user-types","type":0,"val":"user-types","end":""}],
    types: placeholder as Registry['user_types.index']['types'],
  },
  'user_types.create': {
    methods: ["GET","HEAD"],
    pattern: '/user-types/create',
    tokens: [{"old":"/user-types/create","type":0,"val":"user-types","end":""},{"old":"/user-types/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['user_types.create']['types'],
  },
  'user_types.store': {
    methods: ["POST"],
    pattern: '/user-types',
    tokens: [{"old":"/user-types","type":0,"val":"user-types","end":""}],
    types: placeholder as Registry['user_types.store']['types'],
  },
  'user_types.show': {
    methods: ["GET","HEAD"],
    pattern: '/user-types/:id',
    tokens: [{"old":"/user-types/:id","type":0,"val":"user-types","end":""},{"old":"/user-types/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['user_types.show']['types'],
  },
  'user_types.edit': {
    methods: ["GET","HEAD"],
    pattern: '/user-types/:id/edit',
    tokens: [{"old":"/user-types/:id/edit","type":0,"val":"user-types","end":""},{"old":"/user-types/:id/edit","type":1,"val":"id","end":""},{"old":"/user-types/:id/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['user_types.edit']['types'],
  },
  'user_types.update': {
    methods: ["PUT","PATCH"],
    pattern: '/user-types/:id',
    tokens: [{"old":"/user-types/:id","type":0,"val":"user-types","end":""},{"old":"/user-types/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['user_types.update']['types'],
  },
  'user_types.destroy': {
    methods: ["DELETE"],
    pattern: '/user-types/:id',
    tokens: [{"old":"/user-types/:id","type":0,"val":"user-types","end":""},{"old":"/user-types/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['user_types.destroy']['types'],
  },
  'churches.lookupCep': {
    methods: ["GET","HEAD"],
    pattern: '/churches/lookup-cep',
    tokens: [{"old":"/churches/lookup-cep","type":0,"val":"churches","end":""},{"old":"/churches/lookup-cep","type":0,"val":"lookup-cep","end":""}],
    types: placeholder as Registry['churches.lookupCep']['types'],
  },
  'churches.index': {
    methods: ["GET","HEAD"],
    pattern: '/churches',
    tokens: [{"old":"/churches","type":0,"val":"churches","end":""}],
    types: placeholder as Registry['churches.index']['types'],
  },
  'churches.create': {
    methods: ["GET","HEAD"],
    pattern: '/churches/create',
    tokens: [{"old":"/churches/create","type":0,"val":"churches","end":""},{"old":"/churches/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['churches.create']['types'],
  },
  'churches.store': {
    methods: ["POST"],
    pattern: '/churches',
    tokens: [{"old":"/churches","type":0,"val":"churches","end":""}],
    types: placeholder as Registry['churches.store']['types'],
  },
  'churches.show': {
    methods: ["GET","HEAD"],
    pattern: '/churches/:id',
    tokens: [{"old":"/churches/:id","type":0,"val":"churches","end":""},{"old":"/churches/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['churches.show']['types'],
  },
  'churches.edit': {
    methods: ["GET","HEAD"],
    pattern: '/churches/:id/edit',
    tokens: [{"old":"/churches/:id/edit","type":0,"val":"churches","end":""},{"old":"/churches/:id/edit","type":1,"val":"id","end":""},{"old":"/churches/:id/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['churches.edit']['types'],
  },
  'churches.update': {
    methods: ["PUT","PATCH"],
    pattern: '/churches/:id',
    tokens: [{"old":"/churches/:id","type":0,"val":"churches","end":""},{"old":"/churches/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['churches.update']['types'],
  },
  'churches.destroy': {
    methods: ["DELETE"],
    pattern: '/churches/:id',
    tokens: [{"old":"/churches/:id","type":0,"val":"churches","end":""},{"old":"/churches/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['churches.destroy']['types'],
  },
  'priests.index': {
    methods: ["GET","HEAD"],
    pattern: '/priests',
    tokens: [{"old":"/priests","type":0,"val":"priests","end":""}],
    types: placeholder as Registry['priests.index']['types'],
  },
  'priests.create': {
    methods: ["GET","HEAD"],
    pattern: '/priests/create',
    tokens: [{"old":"/priests/create","type":0,"val":"priests","end":""},{"old":"/priests/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['priests.create']['types'],
  },
  'priests.store': {
    methods: ["POST"],
    pattern: '/priests',
    tokens: [{"old":"/priests","type":0,"val":"priests","end":""}],
    types: placeholder as Registry['priests.store']['types'],
  },
  'priests.show': {
    methods: ["GET","HEAD"],
    pattern: '/priests/:id',
    tokens: [{"old":"/priests/:id","type":0,"val":"priests","end":""},{"old":"/priests/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['priests.show']['types'],
  },
  'priests.edit': {
    methods: ["GET","HEAD"],
    pattern: '/priests/:id/edit',
    tokens: [{"old":"/priests/:id/edit","type":0,"val":"priests","end":""},{"old":"/priests/:id/edit","type":1,"val":"id","end":""},{"old":"/priests/:id/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['priests.edit']['types'],
  },
  'priests.update': {
    methods: ["PUT","PATCH"],
    pattern: '/priests/:id',
    tokens: [{"old":"/priests/:id","type":0,"val":"priests","end":""},{"old":"/priests/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['priests.update']['types'],
  },
  'priests.destroy': {
    methods: ["DELETE"],
    pattern: '/priests/:id',
    tokens: [{"old":"/priests/:id","type":0,"val":"priests","end":""},{"old":"/priests/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['priests.destroy']['types'],
  },
  'ministry_roles.index': {
    methods: ["GET","HEAD"],
    pattern: '/ministry-roles',
    tokens: [{"old":"/ministry-roles","type":0,"val":"ministry-roles","end":""}],
    types: placeholder as Registry['ministry_roles.index']['types'],
  },
  'ministry_roles.create': {
    methods: ["GET","HEAD"],
    pattern: '/ministry-roles/create',
    tokens: [{"old":"/ministry-roles/create","type":0,"val":"ministry-roles","end":""},{"old":"/ministry-roles/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['ministry_roles.create']['types'],
  },
  'ministry_roles.store': {
    methods: ["POST"],
    pattern: '/ministry-roles',
    tokens: [{"old":"/ministry-roles","type":0,"val":"ministry-roles","end":""}],
    types: placeholder as Registry['ministry_roles.store']['types'],
  },
  'ministry_roles.show': {
    methods: ["GET","HEAD"],
    pattern: '/ministry-roles/:id',
    tokens: [{"old":"/ministry-roles/:id","type":0,"val":"ministry-roles","end":""},{"old":"/ministry-roles/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['ministry_roles.show']['types'],
  },
  'ministry_roles.edit': {
    methods: ["GET","HEAD"],
    pattern: '/ministry-roles/:id/edit',
    tokens: [{"old":"/ministry-roles/:id/edit","type":0,"val":"ministry-roles","end":""},{"old":"/ministry-roles/:id/edit","type":1,"val":"id","end":""},{"old":"/ministry-roles/:id/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['ministry_roles.edit']['types'],
  },
  'ministry_roles.update': {
    methods: ["PUT","PATCH"],
    pattern: '/ministry-roles/:id',
    tokens: [{"old":"/ministry-roles/:id","type":0,"val":"ministry-roles","end":""},{"old":"/ministry-roles/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['ministry_roles.update']['types'],
  },
  'ministry_roles.destroy': {
    methods: ["DELETE"],
    pattern: '/ministry-roles/:id',
    tokens: [{"old":"/ministry-roles/:id","type":0,"val":"ministry-roles","end":""},{"old":"/ministry-roles/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['ministry_roles.destroy']['types'],
  },
  'account.profile': {
    methods: ["GET","HEAD"],
    pattern: '/account/profile',
    tokens: [{"old":"/account/profile","type":0,"val":"account","end":""},{"old":"/account/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['account.profile']['types'],
  },
  'account.password': {
    methods: ["PUT"],
    pattern: '/account/password',
    tokens: [{"old":"/account/password","type":0,"val":"account","end":""},{"old":"/account/password","type":0,"val":"password","end":""}],
    types: placeholder as Registry['account.password']['types'],
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
