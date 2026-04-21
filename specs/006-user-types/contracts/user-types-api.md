# Contracts: User Types API

**Feature**: 006-user-types | **Date**: 2026-04-21

## Routes

| Method    | Path                 | Action  | Bouncer Ability  | Description                             |
| --------- | -------------------- | ------- | ---------------- | --------------------------------------- |
| GET       | /user-types          | index   | userTypes:read   | List user types (paginated, searchable) |
| GET       | /user-types/create   | create  | userTypes:create | Show create form                        |
| POST      | /user-types          | store   | userTypes:create | Create new user type                    |
| GET       | /user-types/:id      | show    | userTypes:read   | Show user type detail                   |
| GET       | /user-types/:id/edit | edit    | userTypes:update | Show edit form                          |
| PUT/PATCH | /user-types/:id      | update  | userTypes:update | Update user type                        |
| DELETE    | /user-types/:id      | destroy | userTypes:delete | Delete user type                        |

## Inertia Page Props

### UserTypes/Index

```typescript
{
  userTypes: Array<{
    id: number
    name: string
    usersCount: number
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

### UserTypes/Form (create)

```typescript
{
  userType: null
}
```

### UserTypes/Form (edit)

```typescript
{
  userType: {
    id: number
    name: string
  }
}
```

### UserTypes/Show

```typescript
{
  userType: {
    id: number
    name: string
    users: Array<{ id: number; fullName: string | null; email: string }>
    createdAt: string
  }
}
```

### Users/Form (modified — added userTypes)

```typescript
{
  user: { ... } | null
  profiles: Array<{ id: number; name: string }>      // existing
  userTypes: Array<{ id: number; name: string }>     // NEW
}
```

### Users/Show (modified — added userType)

```typescript
{
  userToShow: {
    ...existing fields,
    userType: { id: number; name: string } | null    // NEW
  }
}
```

## Validators

### createUserTypeValidator

| Field | Rules                                                                             |
| ----- | --------------------------------------------------------------------------------- |
| name  | string, required, maxLength(100), unique({ table: 'user_types', column: 'name' }) |

### updateUserTypeValidator

| Field | Rules                                                                                              |
| ----- | -------------------------------------------------------------------------------------------------- |
| name  | string, required, maxLength(100), unique({ table: 'user_types', column: 'name' }) (excluding self) |

## Bouncer Abilities

| Ability         | Permission String | Description                      |
| --------------- | ----------------- | -------------------------------- |
| userTypesRead   | user_types:read   | View user types list and details |
| userTypesCreate | user_types:create | Create new user types            |
| userTypesUpdate | user_types:update | Edit existing user types         |
| userTypesDelete | user_types:delete | Delete user types                |

## Flash Messages

| Event        | Key     | Message                                  |
| ------------ | ------- | ---------------------------------------- |
| Type created | success | "Tipo de usuário criado com sucesso"     |
| Type updated | success | "Tipo de usuário atualizado com sucesso" |
| Type deleted | success | "Tipo de usuário excluído com sucesso"   |

## Seed Data: Permissions

Four new permission rows must be seeded in the `permissions` table:

| module     | action |
| ---------- | ------ |
| user_types | read   |
| user_types | create |
| user_types | update |
| user_types | delete |

Admin profiles must be updated to include these new permissions.
