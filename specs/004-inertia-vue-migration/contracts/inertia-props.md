# Contract: Inertia Page Props and Controller Responses

**Feature**: 004-inertia-vue-migration
**Date**: 2026-04-20

---

## Overview

This contract defines the interface between AdonisJS controllers and Inertia Vue page components. Every controller action must return props that match the expected shape of the corresponding Vue page component.

---

## Controller → Inertia Response Contract

### DashboardController.index

```
Route: GET /dashboard
Inertia component: Dashboard/Index
Auth: required (web guard)
Bouncer: none

Props:
  - user: SerializedAuthUser  (from shared props, NOT in page props)

Response:
  inertia.render('Dashboard/Index')
```

### AuthController.showLogin

```
Route: GET /login
Inertia component: Auth/Login
Auth: none

Props: {} (empty — no data needed)

Response:
  inertia.render('Auth/Login')
```

### AuthController.login

```
Route: POST /login
Auth: none

On success:
  response.redirect('/dashboard')  — Inertia intercepts as SPA navigation

On failure:
  session.flash({ errors: 'Credenciais inválidas' })
  response.redirect().back()  — Inertia shows flash message
```

### AuthController.logout

```
Route: POST /logout
Auth: required (web guard)

Response:
  auth.use('web').logout()
  response.redirect('/login')
```

---

### UsersController.index

```
Route: GET /users
Inertia component: Users/Index
Auth: required
Bouncer: usersRead

Props:
  users: Array<{
    id: number
    fullName: string | null
    email: string
    profileId: number | null
    profile: { id: number; name: string } | null
  }>
  pagination: {
    total: number
    currentPage: number
    lastPage: number
    perPage: number
    firstItem: number
    lastItem: number
  }
  search: string
```

### UsersController.create

```
Route: GET /users/create
Inertia component: Users/Form
Auth: required
Bouncer: usersCreate

Props:
  user: null
  profiles: Array<{ id: number; name: string }>
```

### UsersController.store

```
Route: POST /users
Auth: required
Bouncer: usersCreate

On success:
  session.flash({ success: 'Usuário criado com sucesso' })
  response.redirect('/users')

On validation error:
  Auto-redirect back with errors prop (Inertia handles automatically)
```

### UsersController.show

```
Route: GET /users/:id
Inertia component: Users/Show
Auth: required
Bouncer: usersRead

Props:
  userToShow: {
    id: number
    fullName: string | null
    email: string
    profileId: number | null
    profile: { id: number; name: string } | null
    createdAt: string  (ISO format)
  }
```

### UsersController.edit

```
Route: GET /users/:id/edit
Inertia component: Users/Form
Auth: required
Bouncer: usersUpdate

Props:
  user: {
    id: number
    fullName: string | null
    email: string
    profileId: number | null
  }
  profiles: Array<{ id: number; name: string }>
```

### UsersController.update

```
Route: PUT /users/:id
Auth: required
Bouncer: usersUpdate

On success:
  session.flash({ success: 'Usuário atualizado com sucesso' })
  response.redirect('/users')

On validation error:
  Auto-redirect back with errors prop
```

### UsersController.destroy

```
Route: DELETE /users/:id
Auth: required
Bouncer: usersDelete

On success:
  session.flash({ success: 'Usuário excluído com sucesso' })
  response.redirect('/users')
```

---

### ProfilesController.index

```
Route: GET /profiles
Inertia component: Profiles/Index
Auth: required
Bouncer: profilesRead

Props:
  profiles: Array<{
    id: number
    name: string
    description: string | null
    permissions: Array<{ id: number; module: string; action: string }>
  }>
  pagination: {
    total: number
    currentPage: number
    lastPage: number
    perPage: number
    firstItem: number
    lastItem: number
  }
  search: string
```

### ProfilesController.create

```
Route: GET /profiles/create
Inertia component: Profiles/Form
Auth: required
Bouncer: profilesCreate

Props:
  profile: null
  groupedPermissions: Record<string, Array<{ id: number; action: string }>>
  selectedPermissionIds: [] (empty array)
```

### ProfilesController.store

```
Route: POST /profiles
Auth: required
Bouncer: profilesCreate

On success:
  session.flash({ success: 'Perfil criado com sucesso' })
  response.redirect('/profiles')
```

### ProfilesController.show

```
Route: GET /profiles/:id
Inertia component: Profiles/Show
Auth: required
Bouncer: profilesRead

Props:
  profile: {
    id: number
    name: string
    description: string | null
    permissions: Array<{ id: number; module: string; action: string }>
    createdAt: string (ISO format)
  }
```

### ProfilesController.edit

```
Route: GET /profiles/:id/edit
Inertia component: Profiles/Form
Auth: required
Bouncer: profilesUpdate

Props:
  profile: {
    id: number
    name: string
    description: string | null
    permissions: Array<{ id: number; module: string; action: string }>
  }
  groupedPermissions: Record<string, Array<{ id: number; action: string }>>
  selectedPermissionIds: number[] (selected permission IDs)
```

### ProfilesController.update

```
Route: PUT /profiles/:id
Auth: required
Bouncer: profilesUpdate

On success:
  session.flash({ success: 'Perfil atualizado com sucesso' })
  response.redirect('/profiles')
```

### ProfilesController.destroy

```
Route: DELETE /profiles/:id
Auth: required
Bouncer: profilesDelete

On success:
  session.flash({ success: 'Perfil excluído com sucesso' })
  response.redirect('/profiles')
```

---

## Shared Props Contract

These props are automatically injected into every Inertia response by the shared data middleware.

```
auth: {
  user: {
    id: number
    fullName: string | null
    email: string
    initials: string
  } | null
}

can: {
  usersRead: boolean
  usersCreate: boolean
  usersUpdate: boolean
  usersDelete: boolean
  profilesRead: boolean
  profilesCreate: boolean
  profilesUpdate: boolean
  profilesDelete: boolean
}

flash: {
  success: string | null
  errors: string | null
}
```

---

## Error Contract

### Validation Errors

Inertia automatically passes validation errors as `errors` prop on form submissions. Shape:

```
errors: {
  fieldName: string  // e.g., { email: "O email já está em uso" }
}
```

### Authorization Errors (Bouncer)

When Bouncer denies access, it throws `E_AUTHORIZATION_FAILURE`. The exception handler returns:
- For Inertia requests: 403 response with error message
- For direct browser requests: 403 page

### Authentication Errors

When unauthenticated user hits a protected route:
- Middleware redirects to `/login` (same as current behavior)