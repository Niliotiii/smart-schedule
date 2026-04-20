# Implementation Plan: Migração para SPA com Inertia.js e Vue

**Branch**: `004-inertia-vue-migration` | **Date**: 2026-04-20 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-inertia-vue-migration/spec.md`

## Summary

Migrate the Smart Schedule frontend from Edge SSR templates to a SPA using Inertia.js + Vue 3. All existing functionality (CRUD, auth, RBAC, search, pagination, theme toggle) must be preserved. The primary benefits are SPA navigation (no page reloads) and faster development velocity with Vue's component ecosystem.

## Technical Context

**Language/Version**: TypeScript 6.x (backend), Vue 3 + TypeScript (frontend)
**Primary Dependencies**: AdonisJS 7 (`@adonisjs/core`), `@adonisjs/inertia`, `@inertiajs/vue3`, Vue 3, `@vitejs/plugin-vue`
**Storage**: PostgreSQL (via Lucid ORM) — no schema changes
**Testing**: @japa/runner — existing backend tests must pass
**Target Platform**: Web (Docker-based development)
**Project Type**: Web application (AdonisJS monolith + Vue SPA frontend)
**Performance Goals**: SPA navigation (no full page reload), ≥50% faster perceived navigation
**Constraints**: Session-based auth must remain, RBAC via Bouncer must work, CSRF protection must work
**Scale/Scope**: 7 page views, 4 components, 2 layouts, 1 composable

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Extensibilidade | PASS | Vue components are more modular and reusable than Edge templates — improves extensibility |
| II. Respeito à Disponibilidade | PASS | No changes to scheduling logic — purely a frontend migration |
| III. Simplicidade e Usabilidade | PASS | SPA navigation improves UX; Vue components enable better responsive design |
| IV. Confiabilidade | PASS | Same controller logic, same data — only rendering layer changes |
| V. Segurança e Privacidade | PASS | Session auth preserved, CSRF handled by Inertia, Bouncer RBAC preserved via shared props |
| Tech: Monolito com frontend via Edge ou Inertia | PASS | Constitution explicitly permits Inertia: "via Edge ou Inertia" |
| Tech: Responsivo | PASS | Tailwind CSS classes preserved identically |
| Flow: Modularidade | PASS | Vue pages/components naturally more modular than Edge templates |
| Flow: Testes | PASS | Existing backend tests continue; frontend tests can be added incrementally |

**Gate Result**: PASS — All constitution principles satisfied. Migration to Inertia+Vue is explicitly allowed.

## Project Structure

### Documentation (this feature)

```text
specs/004-inertia-vue-migration/
├── plan.md              # This file
├── research.md          # Phase 0 output — technology decisions
├── data-model.md        # Phase 1 output — Inertia props contract
├── quickstart.md        # Phase 1 output — setup and integration scenarios
├── contracts/           # Phase 1 output — controller/props contracts
│   └── inertia-props.md
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
resources/
├── css/
│   └── app.css                         # KEEP — Tailwind CSS v4 config
├── js/
│   ├── app.ts                           # NEW — Inertia+Vue entrypoint (replaces app.js)
│   ├── Pages/                           # NEW — Inertia page components
│   │   ├── Auth/
│   │   │   └── Login.vue
│   │   ├── Dashboard/
│   │   │   └── Index.vue
│   │   ├── Users/
│   │   │   ├── Index.vue
│   │   │   ├── Form.vue
│   │   │   └── Show.vue
│   │   └── Profiles/
│   │       ├── Index.vue
│   │       ├── Form.vue
│   │       └── Show.vue
│   ├── Layouts/                         # NEW — Persistent Inertia layouts
│   │   ├── AuthenticatedLayout.vue
│   │   └── GuestLayout.vue
│   ├── Components/                      # NEW — Shared Vue components
│   │   ├── ApplicationLogo.vue
│   │   ├── Sidebar.vue
│   │   ├── Navbar.vue
│   │   ├── Pagination.vue
│   │   └── Icon.vue
│   └── Composables/                     # NEW — Vue composables
│       └── useTheme.ts
└── views/                               # Edge templates — keep during migration
    └── app.edge                          # NEW — Inertia root HTML shell

app/
├── controllers/                          # MODIFY — replace view.render → inertia.render
│   ├── auth_controller.ts
│   ├── dashboard_controller.ts
│   ├── users_controller.ts
│   └── profiles_controller.ts
└── middleware/
    ├── inertia_shared_props_middleware.ts  # NEW — inject auth, can, flash
    └── initialize_bouncer_middleware.ts    # MODIFY — remove Edge helper sharing

config/
└── inertia.ts                           # NEW — created by ace configure

start/
├── kernel.ts                            # MODIFY — add inertia middleware
└── routes.ts                            # KEEP — no route changes

vite.config.ts                           # MODIFY — add Vue plugin, update entrypoints
package.json                             # MODIFY — add Inertia/Vue dependencies
tsconfig.json                            # MODIFY — add Vue SFC type support
```

**Structure Decision**: Single project monolith — no separation of frontend/backend directories. Vue files live under `resources/js/` alongside the CSS. This follows the AdonisJS + Inertia convention and keeps the monolith architecture intact.

## Complexity Tracking

No constitution violations. No complexity justifications needed.

---

## Phase 0: Research — COMPLETE

See [research.md](./research.md) for all 12 technology decisions.

Key decisions:
- **SPA mode** (not SSR) — simpler, sufficient for internal tool
- **Vue 3 + Composition API** with `<script setup>` — modern standard
- **`@adonisjs/inertia`** package with `node ace configure inertia` scaffolding
- **Session auth preserved** — Inertia handles cookies automatically
- **Theme toggle → Vue composable** — reactive, idiomatic Vue 3
- **Bouncer RBAC → shared Inertia props** — serialized booleans for frontend

---

## Phase 1: Design — COMPLETE

See [data-model.md](./data-model.md) for Inertia props contracts.
See [contracts/inertia-props.md](./contracts/inertia-props.md) for controller response contracts.
See [quickstart.md](./quickstart.md) for setup commands and integration scenarios.

---

## Phase 2: Task Generation

Run `/speckit.tasks` to generate the implementation task breakdown based on this plan.