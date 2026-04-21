# Implementation Plan: User Types

**Branch**: `006-user-types` | **Date**: 2026-04-21 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-user-types/spec.md`

## Summary

Add a "UserType" entity for classifying users by ministry role (acólitos, coroinhas, apoio, etc.). Provide full CRUD for user types (list, create, edit, delete) via a new management page, and add a nullable `user_type_id` foreign key to users with a dropdown selector on the user create/edit form. Follow existing AdonisJS + Inertia + PrimeVue patterns established by Profiles CRUD.

## Technical Context

**Language/Version**: TypeScript 6.x (backend), Vue 3 + TypeScript (frontend)
**Primary Dependencies**: AdonisJS 7, `@adonisjs/inertia`, `@inertiajs/vue3`, Vue 3, PrimeVue 4, `@adonisjs/bouncer`, `@vinejs/vine`
**Storage**: PostgreSQL (via Lucid ORM) — new `user_types` table + `user_type_id` column on `users`
**Testing**: @japa/runner — existing backend tests must pass
**Target Platform**: Web (Docker-based development)
**Project Type**: Web application (AdonisJS monolith + Vue SPA frontend via Inertia)
**Performance Goals**: SPA navigation (no full page reloads), consistent rendering under 1s
**Constraints**: Session-based auth preserved, RBAC via Bouncer for new user_types resource, deleting a type must nullify user_type_id on all affected users
**Scale/Scope**: 1 new model, 1 new controller, 1 new validator, 2 migrations, 3 new Vue pages, 2 modified Vue pages, 1 new ability set, route registration

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                       | Status | Notes                                                                                                                              |
| ------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| I. Extensibilidade              | PASS   | User types are parameterized — not hardcoded to any specific ministry. Any role can be created/edited/deleted without code changes |
| II. Respeito à Disponibilidade  | PASS   | No changes to scheduling logic — purely classification metadata                                                                    |
| III. Simplicidade e Usabilidade | PASS   | Simple name-only entity with dropdown selection, consistent with existing Profile UX pattern                                       |
| IV. Confiabilidade              | PASS   | onDelete SET NULL ensures users aren't orphaned when a type is deleted                                                             |
| V. Segurança e Privacidade      | PASS   | Bouncer abilities protect all user_types CRUD operations; only authorized admins can manage types                                  |
| Tech: Monolito com Inertia      | PASS   | Follows existing AdonisJS + Inertia architecture                                                                                   |
| Tech: Responsivo                | PASS   | PrimeVue DataTable, Select, InputText — responsive by default                                                                      |
| Flow: Modularidade              | PASS   | Separate model, controller, validator — follows existing modular pattern                                                           |
| Flow: Testes                    | PASS   | New CRUD is independently testable                                                                                                 |

**Gate Result**: PASS — All constitution principles satisfied. User types improve extensibility by decoupling ministry classification from RBAC profiles.

## Project Structure

### Documentation (this feature)

```text
specs/006-user-types/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── user-types-api.md
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
database/migrations/
├── XXX_create_user_types_table.ts          # NEW — user_types table
└── XXX_add_user_type_id_to_users_table.ts  # NEW — add user_type_id FK to users

app/
├── models/
│   └── user_type.ts                        # NEW — UserType model with hasMany(User)
├── controllers/
│   └── user_types_controller.ts            # NEW — full CRUD (index, create, store, show, edit, update, destroy)
├── validators/
│   └── user_type.ts                        # NEW — create/update validators
└── abilities/
    └── main.ts                             # MODIFY — add userTypesRead, userTypesCreate, userTypesUpdate, userTypesDelete

start/
└── routes.ts                               # MODIFY — add router.resource('user-types', UserTypesController)

resources/js/
├── Pages/
│   ├── UserTypes/
│   │   ├── Index.vue                       # NEW — list with DataTable, search, pagination
│   │   ├── Form.vue                        # NEW — create/edit form with InputText
│   │   └── Show.vue                        # NEW — detail view with Card
│   └── Users/
│       ├── Form.vue                        # MODIFY — add userTypeId Select dropdown
│       └── Show.vue                        # MODIFY — display userType name
└── Components/
    └── AppMenu.vue                          # MODIFY — add "Tipos de Usuário" menu item
```

**Structure Decision**: Single project monolith — follows the exact same pattern as existing Profiles CRUD. New `UserTypes/` pages directory mirrors `Users/` and `Profiles/`. Migrations are auto-numbered by AdonisJS.

## Complexity Tracking

No constitution violations. No complexity justifications needed.

---

## Phase 0: Research — COMPLETE

See [research.md](./research.md) for all technology decisions.

Key decisions:

- **UserType as separate entity** — distinct from Profile (RBAC), stores only `name`
- **onDelete SET NULL** — deleting a type clears user_type_id, preserves users
- **Follow Profiles CRUD pattern** — same controller structure, Inertia rendering, Bouncer abilities
- **PrimeVue components** — DataTable, InputText, Select to match existing UI

---

## Phase 1: Design — COMPLETE

See [data-model.md](./data-model.md) for entity definitions and relationships.
See [contracts/user-types-api.md](./contracts/user-types-api.md) for controller/Inertia contracts.
See [quickstart.md](./quickstart.md) for setup commands and integration scenarios.

---

## Phase 2: Task Generation

Run `/speckit.tasks` to generate the implementation task breakdown based on this plan.
