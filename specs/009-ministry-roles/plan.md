# Implementation Plan: Cadastro de Funções (Ministry Roles)

**Branch**: `009-ministry-roles` | **Date**: 2026-04-22 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/009-ministry-roles/spec.md`

## Summary

Implement a full CRUD for ministry roles (Funções) following the established pattern from UserTypes, Churches, and Priests. Users register name and optional description. Listing with search/pagination, detail view, create/edit form, soft-delete.

## Technical Context

**Language/Version**: TypeScript 5.x / Node.js 20+
**Primary Dependencies**: AdonisJS 7, Lucid ORM, Inertia.js (Vue 3), PrimeVue 4, VineJS, Bouncer
**Storage**: PostgreSQL (via Lucid ORM)
**Testing**: AdonisJS test runner (Japa)
**Target Platform**: Web (SPA via Inertia)
**Project Type**: Monolithic web application
**Performance Goals**: 2s page load, 1s search debounce
**Constraints**: Permission-based access via RBAC, soft-delete only
**Scale/Scope**: ~100 ministry roles per parish

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle | Assessment | Notes |
|-----------|-----------|-------|
| I. Extensibilidade | PASS | Ministry roles are generic and reusable across different parish contexts |
| II. Disponibilidade | N/A | No scheduling logic in this module |
| III. Simplicidade | PASS | Follows established CRUD patterns; PrimeVue components reused |
| IV. Confiabilidade | PASS | Deterministic CRUD with soft delete |
| V. Segurança | PASS | RBAC protection via existing Bouncer/permission framework |

**Gate Result**: PASS

## Project Structure

### Documentation (this feature)

```text
specs/009-ministry-roles/
├── plan.md              # This file
├── spec.md              # Feature specification
├── checklists/
│   └── requirements.md   # Spec quality checklist
├── data-model.md         # Entity definition
├── quickstart.md         # Test scenarios
└── tasks.md              # Task breakdown (Phase 2)
```

### Source Code (repository root)

**No structural divergence** from established patterns.

Backend:
- `app/models/ministry_role.ts` — model
- `app/controllers/ministry_roles_controller.ts` — full CRUD controller
- `app/validators/ministry_role.ts` — create + update validators
- `app/abilities/main.ts` — append 4 new abilities
- `start/routes.ts` — add `ministry-roles` resource route
- `database/migrations/XXXXXXXX_create_ministry_roles_table.ts` — migration
- `database/seeders/database_seeder.ts` — add `'ministry_roles'` to MODULES

Frontend:
- `resources/js/Pages/MinistryRoles/Index.vue` — listing
- `resources/js/Pages/MinistryRoles/Show.vue` — detail
- `resources/js/Pages/MinistryRoles/Form.vue` — create/edit
- `resources/js/Components/AppMenu.vue` — add menu item

Shared:
- `app/middleware/inertia_shared_props_middleware.ts` — add 4 permission props
- `types/inertia.ts` — add shared props + page types

**Structure Decision**: Single project. No new directories outside the established `resources/js/Pages/MinistryRoles/` pattern.

## Complexity Tracking

No complexity violations.
