import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'login.show': { paramsTuple?: []; params?: {} }
    'login.post': { paramsTuple?: []; params?: {} }
    'logout': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'profiles.index': { paramsTuple?: []; params?: {} }
    'profiles.create': { paramsTuple?: []; params?: {} }
    'profiles.store': { paramsTuple?: []; params?: {} }
    'profiles.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'profiles.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'profiles.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'profiles.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.index': { paramsTuple?: []; params?: {} }
    'users.create': { paramsTuple?: []; params?: {} }
    'users.store': { paramsTuple?: []; params?: {} }
    'users.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'user_types.index': { paramsTuple?: []; params?: {} }
    'user_types.create': { paramsTuple?: []; params?: {} }
    'user_types.store': { paramsTuple?: []; params?: {} }
    'user_types.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'user_types.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'user_types.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'user_types.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'churches.lookupCep': { paramsTuple?: []; params?: {} }
    'churches.index': { paramsTuple?: []; params?: {} }
    'churches.create': { paramsTuple?: []; params?: {} }
    'churches.store': { paramsTuple?: []; params?: {} }
    'churches.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'churches.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'churches.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'churches.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'priests.index': { paramsTuple?: []; params?: {} }
    'priests.create': { paramsTuple?: []; params?: {} }
    'priests.store': { paramsTuple?: []; params?: {} }
    'priests.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'priests.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'priests.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'priests.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'ministry_roles.index': { paramsTuple?: []; params?: {} }
    'ministry_roles.create': { paramsTuple?: []; params?: {} }
    'ministry_roles.store': { paramsTuple?: []; params?: {} }
    'ministry_roles.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'ministry_roles.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'ministry_roles.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'ministry_roles.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'api.signup': { paramsTuple?: []; params?: {} }
    'api.login': { paramsTuple?: []; params?: {} }
    'api.logout': { paramsTuple?: []; params?: {} }
    'api.profile': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'login.show': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'profiles.index': { paramsTuple?: []; params?: {} }
    'profiles.create': { paramsTuple?: []; params?: {} }
    'profiles.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'profiles.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.index': { paramsTuple?: []; params?: {} }
    'users.create': { paramsTuple?: []; params?: {} }
    'users.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'user_types.index': { paramsTuple?: []; params?: {} }
    'user_types.create': { paramsTuple?: []; params?: {} }
    'user_types.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'user_types.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'churches.lookupCep': { paramsTuple?: []; params?: {} }
    'churches.index': { paramsTuple?: []; params?: {} }
    'churches.create': { paramsTuple?: []; params?: {} }
    'churches.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'churches.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'priests.index': { paramsTuple?: []; params?: {} }
    'priests.create': { paramsTuple?: []; params?: {} }
    'priests.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'priests.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'ministry_roles.index': { paramsTuple?: []; params?: {} }
    'ministry_roles.create': { paramsTuple?: []; params?: {} }
    'ministry_roles.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'ministry_roles.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'api.profile': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'login.show': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'profiles.index': { paramsTuple?: []; params?: {} }
    'profiles.create': { paramsTuple?: []; params?: {} }
    'profiles.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'profiles.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.index': { paramsTuple?: []; params?: {} }
    'users.create': { paramsTuple?: []; params?: {} }
    'users.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'user_types.index': { paramsTuple?: []; params?: {} }
    'user_types.create': { paramsTuple?: []; params?: {} }
    'user_types.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'user_types.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'churches.lookupCep': { paramsTuple?: []; params?: {} }
    'churches.index': { paramsTuple?: []; params?: {} }
    'churches.create': { paramsTuple?: []; params?: {} }
    'churches.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'churches.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'priests.index': { paramsTuple?: []; params?: {} }
    'priests.create': { paramsTuple?: []; params?: {} }
    'priests.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'priests.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'ministry_roles.index': { paramsTuple?: []; params?: {} }
    'ministry_roles.create': { paramsTuple?: []; params?: {} }
    'ministry_roles.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'ministry_roles.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'api.profile': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'login.post': { paramsTuple?: []; params?: {} }
    'logout': { paramsTuple?: []; params?: {} }
    'profiles.store': { paramsTuple?: []; params?: {} }
    'users.store': { paramsTuple?: []; params?: {} }
    'user_types.store': { paramsTuple?: []; params?: {} }
    'churches.store': { paramsTuple?: []; params?: {} }
    'priests.store': { paramsTuple?: []; params?: {} }
    'ministry_roles.store': { paramsTuple?: []; params?: {} }
    'api.signup': { paramsTuple?: []; params?: {} }
    'api.login': { paramsTuple?: []; params?: {} }
    'api.logout': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'profiles.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'user_types.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'churches.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'priests.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'ministry_roles.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PATCH: {
    'profiles.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'user_types.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'churches.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'priests.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'ministry_roles.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'profiles.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'user_types.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'churches.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'priests.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'ministry_roles.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}