# Implementation Plan: PrimeVue UI Refactor

**Branch**: `005-primevue-ui-refactor` | **Date**: 2026-04-20 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-primevue-ui-refactor/spec.md`

## Summary

Refatorar a UI do Smart Schedule para usar PrimeVue 4 com preset Aura e design tokens, substituindo componentes HTML customizados por componentes PrimeVue (DataTable, InputText, Select, Button, Dialog, Toast, etc.), inspirado no layout sakai-vue (sidebar fixo, topbar, área de conteúdo). Manter toda a lógica existente (Inertia, Bouncer RBAC, CRUD, busca, paginação) — apenas a camada visual muda.

## Technical Context

**Language/Version**: TypeScript 6.x (backend), Vue 3 + TypeScript (frontend)
**Primary Dependencies**: AdonisJS 7, `@adonisjs/inertia`, `@inertiajs/vue3`, Vue 3, PrimeVue 4, `@primeuix/themes` (Aura preset), `tailwindcss-primeui`, `primeicons`
**Storage**: PostgreSQL (via Lucid ORM) — no schema changes
**Testing**: @japa/runner — existing backend tests must pass
**Target Platform**: Web (Docker-based development)
**Project Type**: Web application (AdonisJS monolith + Vue SPA frontend via Inertia)
**Performance Goals**: SPA navigation (no full page reloads), consistent rendering under 1s
**Constraints**: Session-based auth preserved, RBAC via Bouncer preserved, CSRF handled by Inertia, no SSR
**Scale/Scope**: 7 page views, 5 components, 2 layouts, 1 composable, 1 config entry

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                                       | Status | Notes                                                                                                                 |
| ----------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------- |
| I. Extensibilidade                              | PASS   | PrimeVue components are more modular and reusable than hand-rolled HTML — improves extensibility for future pastorais |
| II. Respeito à Disponibilidade                  | PASS   | No changes to scheduling logic — purely a UI layer refactor                                                           |
| III. Simplicidade e Usabilidade                 | PASS   | PrimeVue provides polished, accessible UI components — improves usability for coordinators and volunteers             |
| IV. Confiabilidade                              | PASS   | Same controller logic, same data — only rendering layer changes                                                       |
| V. Segurança e Privacidade                      | PASS   | Session auth preserved, RBAC via Bouncer still enforced, no data exposure changes                                     |
| Tech: Monolito com frontend via Edge ou Inertia | PASS   | Constitution explicitly permits Inertia                                                                               |
| Tech: Responsivo                                | PASS   | PrimeVue components are responsive by default + Tailwind utilities preserved                                          |
| Flow: Modularidade                              | PASS   | PrimeVue components are naturally modular; layout shell promotes reuse                                                |
| Flow: Testes                                    | PASS   | Existing backend tests continue; frontend tests can be added incrementally                                            |

**Gate Result**: PASS — All constitution principles satisfied. UI refactor using a component library improves extensibility and usability without affecting core logic.

## Project Structure

### Documentation (this feature)

```text
specs/005-primevue-ui-refactor/
├── plan.md              # This file
├── research.md          # Phase 0 output — technology decisions
├── data-model.md        # Phase 1 output — component data contracts
├── quickstart.md        # Phase 1 output — setup and integration scenarios
├── contracts/           # Phase 1 output — component prop contracts
│   ├── layout-shell.md
│   └── primevue-components.md
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
resources/
├── css/
│   └── app.css                            # MODIFY — add tailwindcss-primeui import and layer order
├── js/
│   ├── app.ts                             # MODIFY — register PrimeVue, Aura, services
│   ├── Pages/                             # MODIFY — all 7 pages refactored
│   │   ├── Auth/
│   │   │   └── Login.vue                  # MODIFY — PrimeVue InputText, Password, Button, Message
│   │   ├── Dashboard/
│   │   │   └── Index.vue                  # MODIFY — PrimeVue Card, Tag, Button
│   │   ├── Users/
│   │   │   ├── Index.vue                  # MODIFY — PrimeVue DataTable, Column, Toolbar, IconField
│   │   │   ├── Form.vue                   # MODIFY — PrimeVue InputText, Select, Password, Button
│   │   │   └── Show.vue                   # MODIFY — PrimeVue Card, Tag
│   │   └── Profiles/
│   │       ├── Index.vue                  # MODIFY — PrimeVue DataTable, Column, Toolbar
│   │       ├── Form.vue                   # MODIFY — PrimeVue InputText, Textarea, Checkbox, Button
│   │       └── Show.vue                   # MODIFY — PrimeVue Card, Tag
│   ├── Layouts/                           # MODIFY — refactored to sakai-vue style
│   │   ├── AuthenticatedLayout.vue        # MODIFY — sakai-vue shell layout with ConfirmDialog + Toast
│   │   └── GuestLayout.vue               # MODIFY — PrimeVue styled guest layout
│   ├── Components/                        # REWRITE — new sakai-vue inspired components
│   │   ├── AppSidebar.vue                 # NEW — replaces Sidebar.vue with sakai-vue style
│   │   ├── AppTopbar.vue                  # NEW — replaces Navbar.vue with sakai-vue style
│   │   └── AppMenu.vue                    # NEW — recursive menu with PrimeIcons and RBAC
│   └── Composables/
│       └── useTheme.ts                    # MODIFY — integrate PrimeVue design tokens, keep .dark selector
└── views/
    └── app.edge                           # KEEP — no changes (Inertia shell)

package.json                               # MODIFY — add primevue, @primeuix/themes, tailwindcss-primeui, primeicons
vite.config.ts                             # KEEP — no changes (already has vue plugin)
tsconfig.json                              # KEEP — already includes .vue files
```

**Structure Decision**: Single project monolith — Vue files remain under `resources/js/`. PrimeVue components are imported directly (no separate components directory for PrimeVue). New layout components (AppSidebar, AppTopbar, AppMenu) replace the existing Sidebar.vue and Navbar.vue.

## Complexity Tracking

No constitution violations. No complexity justifications needed.

---

## Phase 0: Research — COMPLETE

See [research.md](./research.md) for all 7 technology decisions.

Key decisions:

- **PrimeVue 4 with Aura preset** — modern theming via @primeuix/themes with design tokens
- **Dark mode via `.dark` selector** — matches existing Tailwind `@custom-variant dark` config
- **CSS layers** — `tailwind-base, primeui, tailwind-utilities` order for proper cascade
- **`tailwindcss-primeui/v4`** — Tailwind CSS v4 specific import for design token integration
- **Component-by-component migration** — replace hand-rolled HTML with PrimeVue equivalents
- **PrimeIcons** — replace custom Icon.vue SVG component with PrimeIcons font
- **ConfirmationService + ToastService** — replace native `confirm()` and flash `<div>` messages

---

## Phase 1: Design — COMPLETE

See [data-model.md](./data-model.md) for component data contracts.
See [contracts/layout-shell.md](./contracts/layout-shell.md) for layout shell contract.
See [contracts/primevue-components.md](./contracts/primevue-components.md) for PrimeVue component usage contracts.
See [quickstart.md](./quickstart.md) for setup commands and integration scenarios.

---

## Phase 2: Task Generation

Run `/speckit.tasks` to generate the implementation task breakdown based on this plan.
