# Data Model: Migração para SPA com Inertia.js e Vue

**Feature**: 004-inertia-vue-migration
**Date**: 2026-04-20

---

## Overview

This migration does **not introduce new database entities**. All existing models (User, Profile, Permission) remain unchanged. The "data model" here describes the **Inertia page props** and **shared data** structure — the data contract between controllers and Vue components.

---

## Page Props (Per-Route Data)

Each controller returns page-specific props via `inertia.render()`. Props must be plain serializable objects.

### Dashboard Page

```typescript
// Props for Pages/Dashboard/Index.vue
{
  user: {
    id: number
    fullName: string | null
    email: string
    profileId: number | null
    initials: string
    profile: {
      id: number
      name: string
      permissions: Array<{ id: number; module: string; action: string }>
    } | null
  }
}
```

### Users Index Page

```typescript
// Props for Pages/Users/Index.vue
{
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
}
```

### Users Form Page (Create/Edit)

```typescript
// Props for Pages/Users/Form.vue
{
  user: {
    id: number
    fullName: string | null
    email: string
    profileId: number | null
  } | null  // null = creating, object = editing
  profiles: Array<{ id: number; name: string }>
}
```

### Users Show Page

```typescript
// Props for Pages/Users/Show.vue
{
  userToShow: {
    id: number
    fullName: string | null
    email: string
    profileId: number | null
    profile: { id: number; name: string } | null
    createdAt: string  // ISO date string, formatted in Vue
  }
}
```

### Profiles Index Page

```typescript
// Props for Pages/Profiles/Index.vue
{
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
}
```

### Profiles Form Page (Create/Edit)

```typescript
// Props for Pages/Profiles/Form.vue
{
  profile: {
    id: number
    name: string
    description: string | null
    permissions: Array<{ id: number; module: string; action: string }>
  } | null  // null = creating
  groupedPermissions: Record<string, Array<{ id: number; action: string }>>
  selectedPermissionIds: number[]  // empty for create
}
```

### Profiles Show Page

```typescript
// Props for Pages/Profiles/Show.vue
{
  profile: {
    id: number
    name: string
    description: string | null
    permissions: Array<{ id: number; module: string; action: string }>
    createdAt: string // ISO date string
  }
}
```

---

## Shared Props (Global — Available on Every Page)

Automatically injected by Inertia shared data middleware.

```typescript
{
  auth: {
    user: {
      id: number
      fullName: string | null
      email: string
      initials: string
      profileId: number | null
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
}
```

**Notes**:

- `auth.user` replaces the `user` prop that was manually passed to every Edge template
- `can` replaces Bouncer's `@can()` Edge helper — all ability checks serialize to boolean
- `flash` replaces `flashMessages.get('success')` and `flashMessages.get('errors')` from Edge
- Validation errors for form fields are available via Inertia's built-in `errors` prop (not in shared props)

---

## Serialization Rules

1. **DateTime fields**: Convert `DateTime` to ISO string via `.toISO()` in controller, format in Vue with `toLocaleDateString()` or Luxon
2. **Paginator**: Extract `total`, `currentPage`, `lastPage`, `perPage`, compute `firstItem`/`lastItem` in controller
3. **Relationships**: Preload with `.preload()` before serialization — Inertia cannot lazy-load
4. **Null handling**: Use `| null` in TypeScript; Vue templates handle with `|| '-'`
