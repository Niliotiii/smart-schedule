# Implementation Plan: Priest Registration

**Branch**: `008-priest-registration` | **Date**: 2026-04-22 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/008-priest-registration/spec.md`

## Summary

Add a `Priest` entity with a dedicated CRUD module (list, create, read, edit, delete). The feature follows the exact same architectural patterns established by `Church`, `UserTypes`, and `Users`: Inertia + PrimeVue on the frontend, AdonisJS 7 with Lucid ORM on the backend, Bouncer abilities for authorization, Vine validators for request validation, and soft-deletion support. The entity is intentionally simple — name (required) and phone (optional) — to allow fast registration. The UI reuses existing `DataTable` listing and `TabView` form patterns already proven in the codebase.

## Technical Context

**Language/Version**: TypeScript 5.6+ (backend), Vue 3 + TypeScript (frontend)  
**Primary Dependencies**: AdonisJS 7, `@adonisjs/inertia`, `@inertiajs/vue3`, Vue 3, PrimeVue 4, `@adonisjs/bouncer`, `@vinejs/vine`, `@adonisjs/lucid`  
**Storage**: PostgreSQL (via Lucid ORM) — one new `priests` table  
**Testing**: @japa/runner — existing backend tests must pass; add functional tests for priests controller CRUD  
**Target Platform**: Web (Docker-based development)  
**Project Type**: Web application (AdonisJS monolith + Vue SPA frontend via Inertia)  
**Performance Goals**: SPA navigation, page render under 1s, list queries under 500ms for typical parish scale (< 500 priests)  
**Constraints**:  
- Soft delete via `deleted_at` column (same pattern used across all existing models)
- No foreign keys to other entities in this feature (priest is standalone for v1)
- Phone is optional at this stage; no format enforcement beyond basic max length
- Must reuse existing UI patterns (PrimeVue `TabView` form, `DataTable` listing)
**Scale/Scope**:  
- 1 new model, 1 new controller, 1 new validator, 1 migration, 0 seeders
- 3 new Vue pages + `AppMenu` update
- Estimated implementation: ~4-6 tasks (see `tasks.md`)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                       | Status | Notes                                                                                                                                          |
| ------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| I. Extensibilidade              | PASS   | Priest is a standalone pastoral entity. Future scheduling features (assign priests to masses/events) can reference this model via FK. Name kept generic enough to serve multiple pastoral contexts beyond "Acolitos". |
| II. Respeito a Disponibilidade  | PASS   | No scheduling logic touched — additive feature only.                                                                                           |
| III. Simplicidade e Usabilidade | PASS   | Two-field form (name + optional phone) provides minimal friction. Reuses existing `DataTable` and `TabView` UX patterns.                       |
| IV. Confiabilidade              | PASS   | Soft delete prevents accidental data loss. Validation ensures name is never blank.                                                           |
| V. Seguranca e Privacidade      | PASS   | Bouncer abilities protect all CRUD operations. Only users with `priests` permissions can manage priests.                                        |
| Tech: Monolito com Inertia      | PASS   | Follows existing Inertia + AdonisJS monolith architecture exactly.                                                                           |
| Tech: Responsivo                | PASS   | PrimeVue components (`InputText`, `DataTable`, `TabView`) are responsive by default.                                                           |
| Flow: Modularidade              | PASS   | Separate controller, validator, model, pages. No cross-contamination with existing modules.                                                  |
| Flow: Testes                    | PASS   | Controller CRUD is independently testable. Vine validation rules are unit-testable if needed.                                                 |

**Gate Result**: PASS — All constitution principles satisfied.

## Project Structure

### Documentation (this feature)

```text
specs/008-priest-registration/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (skipped — purely internal web)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
app/
├── controllers/
│   └── priests_controller.ts      # index, create, store, show, edit, update, destroy
├── models/
│   └── priest.ts                  # Lucid model with soft delete
├── validators/
│   └── priest.ts                  # Vine create/update validators
database/
└── migrations/
    └── YYYYMMDDHHMMSS_create_priests_table.ts
resources/js/Pages/Priests/
├── Index.vue                      # DataTable listing + search + pagination
└── Form.vue                       # Create/Edit form (TabView with one tab)
```

**Structure Decision**: Single monolith — backend controller + frontend Inertia pages. Follows 007-church-registration pattern one-for-one, minus external services and polymorphic address.

## Complexity Tracking

No constitutional violations. No additional complexity beyond the existing CRUD pattern.
