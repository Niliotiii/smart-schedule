# Research Report: Church Registration

**Date**: 2026-04-21
**Feature**: [spec.md](./spec.md)

---

## Decision 1: External HTTP Client

**Decision**: Use native `fetch()` plus dedicated service classes. No external HTTP library needed.

**Rationale**:
- AdonisJS 7 requires Node.js 18+, so `fetch` is available without installation.
- Requests are simple GET calls; no request/response interceptors needed.
- Service classes (`CepLookupService`, `GeocodingService`) encapsulate timeout handling and error normalization.
- If interceptors or automatic retry become necessary later, `axios` or `p-retry` can be added without breaking existing code.

**Alternatives considered**:
- `axios` — rejected because it adds a dependency for two simple GET endpoints.
- `got` — rejected because AdonisJS ecosystem does not standardize on it.
- `@adonisjs/http-client` — does not exist in version 7.

---

## Decision 2: Reference Data Seeding Strategy

**Decision**: Three Lucid seeders (`CountrySeeder`, `StateSeeder`, `CitySeeder`) backed by static data files in `database/data/`.

**Rationale**:
- AdonisJS/Lucid convention: migrations define schema, seeders populate data.
- `multiInsert` for ~5,500 cities keeps seeder execution under a few seconds.
- Static data files (`countries.ts`, `states.ts`, `cities.ts`) keep seeders readable and allow IDE type-checking.

**Alternatives considered**:
- Raw SQL insert inside migrations — anti-pattern because migrations should be reversible and schema-only.
- Download IBGE data at seed time — adds runtime dependency on external APIs; preferring committed static data guarantees reproducibility.

---

## Decision 3: Reusable Address Data Model

**Decision**: Polymorphic relationship (`MorphOne` / `MorphTo` via `addressable_id` + `addressable_type`).

**Rationale**:
- The spec explicitly requires that future entities share the same address pattern.
- Polymorphic associations in Lucid ORM (`@morphOne`, `@morphTo`) directly support this while keeping a single `addresses` table.
- A composite index on `(addressable_type, addressable_id)` ensures query performance stays high.

**Alternatives considered**:
- `address_id` FK on each entity table — simpler but scatters nullable FKs across every table that might need an address, making schema changes harder when adding new entities.

---

## Decision 4: CEP Lookup Provider Order

**Decision**: ViaCEP as primary; Correios ConectaGov Serpro as fallback when configured.

**Rationale**:
- ViaCEP is stable, well documented, and commonly used in Brazilian applications.
- Correios ConectaGov requires authentication token/contract; this makes it strictly an optional fallback.
- If neither is available (network failure or service down), the UI allows manual entry without blocking.

**Alternatives considered**:
- Correios as primary — rejected because it requires authentication and contract, raising deployment complexity for an MVP.

---

## Decision 5: Geolocation Provider and Constraints

**Decision**: OpenStreetMap Nominatim API for address-to-coordinates lookup.

**Rationale**:
- No API key required, reducing deployment friction.
- Nominatim covers global addresses (not just Brazil), aligning with the optional international support assumption.

**Constraints discovered**:
- Absolute maximum 1 request per second per application.
- Strict auto-complete prohibition.
- Must provide custom HTTP `User-Agent` header: `SmartSchedule/1.0.0 (contact@example.com)`.
- Must cache results aggressively in the database (store lat/lng on the address record after first lookup).
- Display OpenStreetMap attribution in the UI.

**Alternatives considered**:
- Google Geocoding API — rejected because it requires an API key and billing, adding deployment complexity.
- Self-hosted Nominatim — overkill for initial volume; can be migrated later if usage grows.

---

## Decision 6: IBGE Data Source

**Decision**: Static JSON/TS arrays committed to the repository sourced from IBGE official CSV downloads.

**Rationale**:
- IBGE provides stable CSV downloads for states and municipalities.
- Committing processed arrays (e.g., `database/data/cities.ts`) makes seeders deterministic and avoids runtime external dependencies.
- Update path: when IBGE releases new data, run a conversion script locally, replace the static file, and adjust the seeder if the schema changed.

**Data shape expected**:

```ts
// database/data/states.ts
export const states = [
  { ibgeCode: 11, uf: 'RO', name: 'Rondônia' },
  ...
]

// database/data/cities.ts
export const cities = [
  { ibgeCode: 1100015, name: 'Alta Floresta D\'Oeste', stateUf: 'RO' },
  ...
]
```

Note: `~5,557` municipalities (latest IBGE); `multiInsert` must chunk inserts — raw SQL may chunk rows by ~500 to stay within PostgreSQL parameter limits if necessary.

---

## Decision 7: Frontend Form Architecture

**Decision**: PrimeVue `TabView` with two tabs: "Informações" (church name) and "Endereço" (complete address fields). Same pattern already used in `Users/Form.vue`.

**Rationale**:
- Existing forms already use `TabView` + `TabPanel` with `FloatLabel`, `InputText`, `Select`.
- CEP field triggers a backend lookup endpoint via `router.get('/churches/lookup-cep?cep=...')` (Inertia visit or fetch) that returns Inertia `json` response or direct AJAX on an API sub-route.
- Address fields are grouped in the second tab for clarity and to support adding geolocation hints later.

**Alternatives considered**:
- Single long form — rejected because 10+ address fields plus church name would be overwhelming.

---

## Decision 8: Soft Delete Strategy

**Decision**: Manual soft delete implementation using `deleted_at` columns, query scopes, and model hooks. Lucid 22.4.2 does not provide a built-in `SoftDeletes` feature.

**Rationale**:
- AdonisJS Lucid 22.4.2 has no built-in `SoftDeletes` mixin or plugin (unlike Laravel Eloquent).
- All tables — both existing (`users`, `profiles`, `user_types`) and new (`churches`, `addresses`, `countries`, `states`, `cities`) — must consistently support `deleted_at`.
- Implementation pattern:
  1. Migration-level: `table.timestamp('deleted_at').nullable()` on every table.
  2. Model-level: override `delete()` method or use `@beforeDelete` / `@afterDelete` hooks to cancel the actual SQL `DELETE` and instead set `this.deletedAt = DateTime.now()` + save.
  3. Query scopes are not supported natively in Lucid 22, but custom static methods (e.g., `withoutTrashed()`) can be added and used explicitly in controllers, or a custom base model can intercept standard queries.
  4. For simplicity, controllers will explicitly filter `WHERE "deleted_at" IS NULL` via query builder when listing records.
  5. Optional `restore()` method unsets `deleted_at`.

**Cascade soft delete**: When a Church is soft deleted, its linked Address must also be soft deleted. This will be handled in the controller or a model hook since polymorphic `ON DELETE` cannot be limited to soft delete.

**Alternatives considered**:
- Third-party Lucid soft-delete package — none actively maintained for Lucid 22.
- Raw SQL triggers to auto-set `deleted_at` — rejected for transparency and testability; model logic is preferred.

---

## Decision 9: CEP Lookup Endpoint Design

**Decision**: Authenticated Inertia-compatible endpoint at `GET /churches/lookup-cep` (or `POST` with form data) returning JSON `{ address: { ... } }`. Protected by Bouncer.

**Rationale**:
- The frontend uses Inertia forms; the CEP lookup should not trigger a full page reload.
- Returning JSON via a dedicated route that does not render an Inertia page is acceptable in AdonisJS Inertia apps: return `response.json(...)` directly.
- Alternatively, implement as an API endpoint under `/api/v1/cep-lookup` to keep it explicitly separate from page routes.

**Chosen approach**: Add `router.get('/churches/lookup-cep', [ChurchesController, 'lookupCep'])` inside the auth group.

---

## Summary

| Decision                  | Chosen Approach                                      |
| ------------------------ | ---------------------------------------------------- |
| HTTP Client              | Native `fetch()` in service classes                  |
| Reference Data           | Lucid seeders + static `database/data/*.ts` files    |
| Address Model            | Polymorphic `MorphOne` / `MorphTo`                   |
| CEP Provider             | ViaCEP primary; Correios fallback                    |
| Geolocation Provider     | OpenStreetMap Nominatim (1 req/sec, custom User-Agent) |
| IBGE Data                | Static committed arrays from IBGE CSV                |
| Frontend Form            | PrimeVue `TabView` with Info + Endereco tabs         |
| CEP Lookup Endpoint      | Auth-protected GET route returning JSON              |
| Soft Delete              | Manual `deleted_at` + query scopes + custom model hook |
