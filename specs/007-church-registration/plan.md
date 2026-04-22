# Implementation Plan: Church Registration

**Branch**: `007-church-registration` | **Date**: 2026-04-21 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/007-church-registration/spec.md`

## Summary

Add a `Church` entity with a dedicated address section managed through a reusable, polymorphic `Address` model. The registration form splits church data into an "Informacoes" tab and an "Endereco" tab. CEP lookup auto-fills address fields using ViaCEP (with Correios/ConectaGov as fallback when configured). OpenStreetMap Nominatim provides optional geolocation (latitude/longitude). Reference data (countries, Brazilian states, and cities) is pre-populated via Lucid seeders using IBGE data. Follow existing UserTypes CRUD pattern: Inertia page groups, Bouncer abilities, Vine validators, Lucid ORM, PrimeVue UI.

## Technical Context

**Language/Version**: TypeScript 6.x (backend), Vue 3 + TypeScript (frontend)
**Primary Dependencies**: AdonisJS 7, `@adonisjs/inertia`, `@inertiajs/vue3`, Vue 3, PrimeVue 4, `@adonisjs/bouncer`, `@vinejs/vine`, `@adonisjs/lucid`
**Storage**: PostgreSQL (via Lucid ORM) — new `churches`, `addresses`, `countries`, `states`, `cities` tables; seeders for reference data
**Testing**: @japa/runner — existing backend tests must pass; new functional tests for CEP contract and controller
**Target Platform**: Web (Docker-based development)
**Project Type**: Web application (AdonisJS monolith + Vue SPA frontend via Inertia)
**Performance Goals**: SPA navigation, CEP lookup < 2s, page render under 1s
**Constraints**:
- Nominatim rate limit: max 1 req/sec; set custom User-Agent; no auto-complete; cache aggressively
- ~5,500 cities IBGE seeder must use `db.insertQuery().multiInsert` for acceptable performance
- Polymorphic address model uses `addressable_id` + `addressable_type`
- CEP lookup endpoint must be protected by auth middleware
**Scale/Scope**:
- 5 new models, 1 new controller, 1 new service, 2 new validators, 6 migrations, 3 seeders
- 3 new Vue pages + 1 API endpoint Inertia component + AppMenu update
- Address reusable for future entities (polymorphic)
- **Soft delete migration**: add `deleted_at` to `users`, `profiles`, `user_types` tables (existing entities); all new tables (`addresses`, `churches`, `countries`, `states`, `cities`) include `deleted_at` at creation time
- Controller destroy actions updated to soft delete for users, profiles, user_types, churches

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                       | Status | Notes                                                                                                                                          |
| ------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| I. Extensibilidade              | PASS   | Polymorphic `Address` model is explicitly designed for reuse by future entities (e.g., Events, Users). Churches are a pastoral-specific entity, but address is fully generic. |
| II. Respeito a Disponibilidade  | PASS   | No scheduling logic touched — additive feature only.                                                                                           |
| III. Simplicidade e Usabilidade | PASS   | Dedicated Address tab with cascading State → City dropdowns; CEP auto-fill dramatically reduces manual typing.                                 |
| IV. Confiabilidade              | PASS   | CEP and geolocation services fail gracefully (manual entry always allowed). Fallback CEP provider ensures high availability.                |
| V. Seguranca e Privacidade      | PASS   | Bouncer abilities protect all churches CRUD and CEP lookup. Only authorized users can register or edit churches.                             |
| Tech: Monolito com Inertia      | PASS   | Follows existing Inertia + AdonisJS monolith architecture.                                                                                     |
| Tech: Responsivo                | PASS   | PrimeVue TabView, Select, InputText — responsive by default.                                                                                   |
| Flow: Modularidade              | PASS   | Separate controller, service, validators, models, seeders. Address service is reusable.                                                          |
| Flow: Testes                    | PASS   | CEP service, controller CRUD, and geolocation scenarios independently testable.                                                                  |

**Gate Result**: PASS — All constitution principles satisfied. The address model enhances extensibility for future scheduling by enabling other pastoral entities (e.g., events with physical locations) to reuse address data.

## Project Structure

### Documentation (this feature)

```text
specs/007-church-registration/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── churches-api.md
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
database/
├── migrations/
│   ├── XXX_add_deleted_at_to_users_table.ts         # ALTER — soft delete existing
│   ├── XXX_add_deleted_at_to_profiles_table.ts      # ALTER — soft delete existing
│   ├── XXX_add_deleted_at_to_user_types_table.ts    # ALTER — soft delete existing
│   ├── XXX_create_countries_table.ts                # NEW
│   ├── XXX_create_states_table.ts                   # NEW
│   ├── XXX_create_cities_table.ts                   # NEW
│   ├── XXX_create_addresses_table.ts                # NEW
│   └── XXX_create_churches_table.ts                 # NEW
├── seeders/
│   ├── country_seeder.ts                     # NEW
│   ├── state_seeder.ts                       # NEW
│   └── city_seeder.ts                        # NEW
└── data/
    ├── countries.ts                          # NEW — static array (~250 rows)
    ├── states.ts                           # NEW — static array (~27 rows)
    └── cities.ts                           # NEW — static array (~5,557 rows)

app/
├── models/
│   ├── country.ts                            # NEW
│   ├── state.ts                              # NEW
│   ├── city.ts                               # NEW
│   ├── address.ts                            # NEW — polymorphic Address
│   └── church.ts                             # NEW — morphOne Address
├── controllers/
│   └── churches_controller.ts                # NEW — full CRUD + lookup endpoint
├── services/
│   ├── cep_lookup_service.ts                 # NEW — ViaCEP + Correios fallback
│   └── geocoding_service.ts                  # NEW — Nominatim lookup
├── validators/
│   └── church.ts                             # NEW — create / update validators
└── abilities/
    └── main.ts                               # MODIFY — add churches CRUD abilities

start/
└── routes.ts                               # MODIFY — add churches resource + /churches/lookup-cep

resources/js/
├── Pages/
│   └── Churches/
│       ├── Index.vue                         # NEW — list with DataTable, search, pagination
│       ├── Form.vue                          # NEW — TabView (Info + Endereco), CEP auto-fill
│       └── Show.vue                          # NEW — detail with address map hint
└── Components/
    └── AppMenu.vue                           # MODIFY — add "Igrejas" menu item
```

**Structure Decision**: Single project monolith — follows exact UserTypes CRUD pattern. New `Churches/` pages directory mirrors `UserTypes/`. Six migrations are needed for reference tables + address + church. Three seeders pre-populate countries/states/cities.

## Complexity Tracking

No constitution violations. No complexity justifications needed.

---

## Phase 0: Research — COMPLETE

See [research.md](./research.md) for all technology decisions.

Key decisions:

- **Polymorphic Address model** — `MorphOne` / `MorphTo` so Church, Event, User, etc. can all reuse the same `addresses` table without FK duplication.
- **Native `fetch` + service classes** — AdonisJS 7 has no built-in HTTP client. Use `fetch()` inside thin service classes (`CepLookupService`, `GeocodingService`). No axios unless interceptors become necessary.
- **Seeders with `multiInsert`** — Countries and states via `createMany`. Cities (~5,500 rows) via `db.insertQuery().multiInsert(...)` from a static `database/data/cities.ts` file.
- **Nominatim constraints** — Max 1 req/sec; custom User-Agent; geolookup triggered only on explicit user action (e.g., "Save" or "Buscar coordenadas"), never on auto-complete. Results cached in database (lat/lng persisted in Address).
- **ViaCEP + Correios fallback** — ViaCEP as primary; Correios ConectaGov gateway as secondary. Both cached if needed.

---

## Phase 1: Design — COMPLETE

See [data-model.md](./data-model.md) for entity definitions and relationships.
See [contracts/churches-api.md](./contracts/churches-api.md) for controller/Inertia contracts.
See [quickstart.md](./quickstart.md) for setup commands and integration scenarios.

---

## Phase 2: Task Generation

Run `/speckit.tasks` to generate the implementation task breakdown based on this plan.
