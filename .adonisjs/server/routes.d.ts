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
    'api.profile': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'login.post': { paramsTuple?: []; params?: {} }
    'logout': { paramsTuple?: []; params?: {} }
    'profiles.store': { paramsTuple?: []; params?: {} }
    'users.store': { paramsTuple?: []; params?: {} }
    'api.signup': { paramsTuple?: []; params?: {} }
    'api.login': { paramsTuple?: []; params?: {} }
    'api.logout': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'profiles.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PATCH: {
    'profiles.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'profiles.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}