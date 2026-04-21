# Contracts: Churches API

**Feature**: 007-church-registration | **Date**: 2026-04-21

---

## Routes

| Method    | Path                   | Action    | Bouncer Ability  | Description                                      |
| --------- | ---------------------- | --------- | ---------------- | ------------------------------------------------ |
| GET       | /churches              | index     | churches:read    | List churches (paginated, searchable)            |
| GET       | /churches/create       | create    | churches:create  | Show create form                                 |
| POST      | /churches              | store     | churches:create  | Create new church + address                      |
| GET       | /churches/:id          | show      | churches:read    | Show church detail                               |
| GET       | /churches/:id/edit     | edit      | churches:update  | Show edit form                                   |
| PUT/PATCH | /churches/:id          | update    | churches:update  | Update church + address                          |
| DELETE    | /churches/:id          | destroy   | churches:delete  | Delete church (cascade address)                  |
| GET       | /churches/lookup-cep   | lookupCep | churches:create  | Query CEP and return address JSON (ViaCEP primary, Correios fallback) |

All routes except `lookupCep` are Inertia page routes. `lookupCep` returns `response.json(...)` directly.

---

## Inertia Page Props

### Churches/Index

```typescript
{
  churches: Array<{
    id: number
    name: string
    address: {
      street: string
      number: string
      neighborhood: string
      city: { name: string }
      state: { uf: string }
      postalCode: string
    } | null
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

### Churches/Form (create + edit)

```typescript
{
  church: {
    id: number          // present only when editing
    name: string
    address: {
      postalCode: string
      countryId: number
      stateId: number | null
      cityId: number | null
      neighborhood: string
      street: string
      number: string
      complement: string | null
      latitude: number | null
      longitude: number | null
    } | null
  } | null
  countries: Array<{ id: number; name: string; code: string }>
  states: Array<{ id: number; name: string; uf: string }>
  cities: Array<{ id: number; name: string; stateId: number }>
}
```

### Churches/Show

```typescript
{
  church: {
    id: number
    name: string
    address: {
      postalCode: string
      country: { id: number; name: string }
      state: { id: number; name: string; uf: string } | null
      city: { id: number; name: string } | null
      neighborhood: string
      street: string
      number: string
      complement: string | null
      latitude: number | null
      longitude: number | null
    } | null
    createdAt: string
    updatedAt: string
  }
}
```

---

## CEP Lookup JSON Contract

**Request**: `GET /churches/lookup-cep?cep=01001000`

**Success Response** (200):

```json
{
  "cep": "01001-000",
  "street": "Praça da Sé",
  "neighborhood": "Sé",
  "city": "São Paulo",
  "state": "SP",
  "complement": "lado ímpar"
}
```

**Error Response** (404 / 422):

```json
{
  "message": "CEP não encontrado"
}
```

**Validation**: `cep` parameter must be 8 digits (after removing non-numeric characters). Returns 422 with validation error otherwise.

---

## Validators

### createChurchValidator | updateChurchValidator

Top-level fields plus nested `address` object.

| Field              | Rules                                                               |
| ------------------ | ------------------------------------------------------------------- |
| name               | string, required, maxLength(255)                                    |
| address            | object, required                                                    |
| address.postalCode | string, required, maxLength(20)                                    |
| address.countryId  | number, required, exists({ table: 'countries', column: 'id' })    |
| address.stateId    | number, nullable, exists({ table: 'states', column: 'id' })       |
| address.cityId     | number, nullable, exists({ table: 'cities', column: 'id' })       |
| address.neighborhood | string, required, maxLength(150)                                |
| address.street     | string, required, maxLength(255)                                    |
| address.number     | string, required, maxLength(50)                                   |
| address.complement | string, nullable, maxLength(255)                                  |

Note: `latitude` and `longitude` are NOT accepted from the client form; they are computed server-side via `GeocodingService` after the address is saved.

---

## Bouncer Abilities

| Ability        | Permission String | Description                     |
| -------------- | ----------------- | ------------------------------- |
| churchesRead   | churches:read     | View churches list and details  |
| churchesCreate | churches:create   | Create new churches             |
| churchesUpdate | churches:update   | Edit existing churches          |
| churchesDelete | churches:delete   | Delete churches                 |

---

## Flash Messages

| Event          | Key     | Message                            |
| -------------- | ------- | ---------------------------------- |
| Church created | success | "Igreja cadastrada com sucesso"    |
| Church updated | success | "Igreja atualizada com sucesso"    |
| Church deleted | success | "Igreja excluída com sucesso"      |

---

## Seed Data: Permissions

Four new permission rows must be seeded in the `permissions` table:

| module   | action |
| -------- | ------ |
| churches | read   |
| churches | create |
| churches | update |
| churches | delete |

Admin profiles must be updated to include these new permissions.

---

## Service Contracts

### CepLookupService

```typescript
interface CepLookupService {
  lookup(cep: string): Promise<CepResult>
}

interface CepResult {
  postalCode: string
  street: string | null
  neighborhood: string | null
  city: string | null
  state: string | null
  complement: string | null
}
```

**Behavior**:
1. Normalize input (strip non-digits, ensure 8 chars).
2. Attempt ViaCEP first. Return on success.
3. If ViaCEP fails (timeout, 5xx, or `"erro": true`), attempt Correios ConectaGov fallback if configured.
4. If both fail, throw descriptive error for controller to map to 404/422.

### GeocodingService

```typescript
interface GeocodingService {
  geocode(address: Address): Promise<{ latitude: number; longitude: number } | null>
}
```

**Behavior**:
1. Build address string from `street`, `number`, `neighborhood`, `city.name`, `state.uf`, `country.name`.
2. Query Nominatim `search?q={address}&format=json&limit=1`.
3. Set custom `User-Agent: SmartSchedule/1.0.0 (contact@example.com)`.
4. Return first lat/lng result or `null` if none found.
5. Rate-limit internally to max 1 concurrent request per second.

---

## Controller Responsibilities

### ChurchesController

- `index` — paginated list with address preloaded; search by church name.
- `create` — render form with empty church + all countries/states/cities.
- `store` — validate input, create Church, create Address via polymorphic, call `GeocodingService`, redirect to `/churches`.
- `show` — render detail with fully preloaded address (country, state, city).
- `edit` — render form with existing church + address + all countries/states/cities.
- `update` — validate input, update Church, update/replace Address, call `GeocodingService` if address changed, redirect to `/churches`.
- `destroy` — delete Church (Lucid should cascade to Address via model hook or FK `onDelete` if configured).
- `lookupCep` — validate `cep` param, call `CepLookupService`, return JSON or error.
