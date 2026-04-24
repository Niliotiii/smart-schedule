# Interface Contracts: Cadastro Completo de Usuários

**Date**: 2026-04-23
**Feature**: specs/011-user-registration-form

O projeto é uma aplicação web monolítica com InertiaJS. Não existem APIs públicas externas neste escopo. Os contratos de interface são definidos via props Inertia recebidas pelo componente Vue `Users/Form.vue` e via contratos de validação VineJS (backend).

---

## Inertia Page Props Contract: Users/Form

### `Users/Form.edit` Props

```typescript
interface UserFormProps {
  user: {
    id: number                          // presente apenas em modo edição
    fullName: string
    birthDate: string                   // ISO date (yyyy-mm-dd)
    birthCountryId: number
    birthStateId: number
    birthCityId: number
    phone: string
    email: string | null
    responsible1Name: string | null
    responsible1Phone: string | null
    responsible2Name: string | null
    responsible2Phone: string | null
    profileId: number
    userTypeId: number
    includeInScale: boolean
    communityId: number
    // Relations (preloaded)
    sacraments: Sacrament[]
    ministryRoles: MinistryRole[]
    address: Address | null
  } | null

  profiles: Array<{ id: number; name: string }>
  userTypes: Array<{ id: number; name: string }>
  countries: Array<{ id: number; name: string }>
  states: Array<{ id: number; name: string; uf: string }>
  cities: Array<{ id: number; name: string; stateId: number }>
  sacramentTypes: Array<{ id: number; name: string }>
  ministryRoles: Array<{ id: number; name: string; description: string | null }>
}

interface Sacrament {
  id: number
  sacramentTypeId: number
  receivedDate: string                // ISO date (yyyy-mm-dd)
  receivedChurch: string
  receivedCountryId: number
  receivedStateId: number
  receivedCityId: number
}

interface MinistryRole {
  id: number
  name: string
}

interface Address {
  id?: number                         // undefined em criação
  postalCode: string
  countryId: number
  stateId: number | null
  cityId: number | null
  neighborhood: string
  street: string
  number: string
  complement: string | null
}
```

---

## POST /users (Create) Request Contract

### VineJS Validator Fields

```typescript
// app/validators/user.ts  →  createUserValidator
export const createUserValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().maxLength(255),
    birthDate: vine.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    birthCountryId: vine.number().positive(),
    birthStateId: vine.number().positive(),
    birthCityId: vine.number().positive(),
    phone: vine.string().trim().minLength(10).maxLength(20),
    email: vine.string().email().optional(),
    responsible1Name: vine.string().trim().maxLength(255).optional(),
    responsible1Phone: vine.string().trim().maxLength(20).optional(),
    responsible2Name: vine.string().trim().maxLength(255).optional(),
    responsible2Phone: vine.string().trim().maxLength(20).optional(),
    profileId: vine.number().positive(),
    userTypeId: vine.number().positive(),
    includeInScale: vine.boolean(),
    communityId: vine.number().positive(),
    password: vine.string().minLength(8),
    passwordConfirmation: vine.string().sameAs('password'),
    // Nested: Address
    address: vine.object({
      postalCode: vine.string().trim().minLength(8).maxLength(9),
      countryId: vine.number().positive(),
      stateId: vine.number().positive().optional(),
      cityId: vine.number().positive().optional(),
      neighborhood: vine.string().trim().maxLength(150),
      street: vine.string().trim().maxLength(255),
      number: vine.string().trim().maxLength(50),
      complement: vine.string().trim().maxLength(255).optional(),
    }).optional(),
    // Nested: Sacraments
    sacraments: vine.array(
      vine.object({
        sacramentTypeId: vine.number().positive(),
        receivedDate: vine.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        receivedChurch: vine.string().trim().maxLength(255),
        receivedCountryId: vine.number().positive(),
        receivedStateId: vine.number().positive(),
        receivedCityId: vine.number().positive(),
      })
    ).optional(),
    // Nested: Ministry Roles (array of IDs)
    ministryRoleIds: vine.array(vine.number().positive()).optional(),
  })
)
```

---

## PUT /users/:id (Update) Request Contract

### VineJS Validator Fields

```typescript
// app/validators/user.ts  →  updateUserValidator
export const updateUserValidator = vine.compile(
  vine.object({
    // Todos os campos do createUserValidator, com modificações:
    password: vine.string().minLength(8).optional(),  // opcional no update
    passwordConfirmation: vine.string().sameAs('password').optional(),
    // demais campos iguais ao createUserValidator
    // ...
  })
)
```

---

## Bouncer Ability Contract

```typescript
// app/abilities/main.ts

export const usersCreate = bouncer.ability(() => { ... })
export const usersRead = bouncer.ability(() => { ... })
export const usersUpdate = bouncer.ability(() => { ... })
export const usersDelete = bouncer.ability(() => { ... })

// NEW: ability to edit profile field
export const usersEditProfile = bouncer.ability((user: User) => {
  // Only users with specific permission (e.g. profiles:update or similar)
  // Return true/false based on user's permissions
})
```

---

## GET /churches/lookup-cep?cep=########

Existing endpoint used for address CEP lookup. Reusable as-is for User address tab.

```
Request: GET /churches/lookup-cep?cep=00000000
Headers: Accept: application/json

Response 200:
{
  "street": "Rua Example",
  "neighborhood": "Centro",
  "complement": "",
  "city": "São Paulo",
  "state": "SP"
}

Response 404:
{
  "message": "CEP não encontrado"
}
```
