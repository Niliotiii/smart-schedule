# Tasks: Cadastro de Funções (Ministry Roles)

**Input**: Design documents from `/specs/009-ministry-roles/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), data-model.md, quickstart.md

**Tests**: No test tasks generated — tests were not explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Existing project setup already complete. No new infrastructure needed.

*(Nothing to do — this feature builds incrementally on the established AdonisJS + Inertia + PrimeVue stack.)*

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core backend infrastructure that MUST be complete before ANY user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T001 Create migration `database/migrations/XXXXXXXX_create_ministry_roles_table.ts` with id, name, description, timestamps, deleted_at
- [X] T002 [P] [Foundational] Create model `app/models/ministry_role.ts` with soft-delete methods (delete, restore, withoutTrashed)
- [X] T003 [P] [Foundational] Create validators `app/validators/ministry_role.ts` for create (name required, unique, max 255) and update (name required, unique ignoring self)
- [X] T004 [P] [Foundational] Add Bouncer abilities `app/abilities/main.ts` — ministryRolesRead, ministryRolesCreate, ministryRolesUpdate, ministryRolesDelete
- [X] T005 [P] [Foundational] Update Inertia shared props middleware `app/middleware/inertia_shared_props_middleware.ts` — add ministryRolesRead/Create/Update/Delete to `can` object (all 3 locations)
- [X] T006 [P] [Foundational] Update Inertia types `types/inertia.ts` — add ministryRolesRead/Create/Update/Delete to SharedProps.can and add MinistryRoles/Index, Show, Form page types
- [X] T007 [Foundational] Update database seeder `database/seeders/database_seeder.ts` — add `'ministry_roles'` to MODULES and `'funções'` to moduleLabel map

**Checkpoint**: Foundation ready — migration runs, model validates, permissions seeded, types compile, middleware shares new permissions.

---

## Phase 3: User Story 1 — Cadastrar nova função (Priority: P1) 🎯 MVP

**Goal**: Allow administrators to create new ministry roles with name and optional description.

**Independent Test**: Log in as admin, navigate to /ministry-roles/create, fill name and description, save. Should redirect to listing with success toast and new item visible.

### Implementation for User Story 1

- [X] T008 [US1] Create full controller `app/controllers/ministry_roles_controller.ts` with index, create, store, show, edit, update, destroy actions (following UserTypesController pattern)
- [X] T009 [US1] Add resource route `start/routes.ts` — `router.resource('ministry-roles', MinistryRolesController).as('ministryRoles')`
- [X] T010 [US1] Create Form.vue `resources/js/Pages/MinistryRoles/Form.vue` with FloatLabel inputs for name and description, create/edit modes, Breadcrumb, validation errors, Cancel button

**Checkpoint**: User Story 1 should be fully functional — create form works, validation enforced, redirect to listing with success toast.

---

## Phase 4: User Story 2 — Listar e buscar funções (Priority: P1)

**Goal**: Display a paginated, searchable list of all ministry roles.

**Independent Test**: Access /ministry-roles, see paginated table with name/description columns, type in search box and see debounced filtering.

### Implementation for User Story 2

- [X] T011 [US2] Create Index.vue `resources/js/Pages/MinistryRoles/Index.vue` with DataTable, search InputText, pagination controls (first/prev/next/last), action buttons (show, edit, delete with confirm), empty state
- [X] T012 [US2] Add "Funções" menu item `resources/js/Components/AppMenu.vue` — icon `pi pi-briefcase`, route `/ministry-roles`, permission `ministryRolesRead`

**Checkpoint**: User Stories 1 AND 2 should both work independently — listing loads within 2s, search debounces correctly, create flows through to list.

---

## Phase 5: User Story 3 — Visualizar detalhes de uma função (Priority: P2)

**Goal**: Allow administrators to view details of a specific ministry role.

**Independent Test**: From listing, click eye icon on a role. Show page displays name, description, created-at timestamp, with Edit and Back buttons.

### Implementation for User Story 3

- [X] T013 [US3] Create Show.vue `resources/js/Pages/MinistryRoles/Show.vue` with sectioned layout (Dados Gerais), 3-column grid, formatDate for createdAt, Edit (warn) and Back (secondary) buttons, Breadcrumb

**Checkpoint**: Show page renders correctly with all role data displayed.

---

## Phase 6: User Story 4 — Editar uma função existente (Priority: P2)

**Goal**: Allow administrators to edit existing ministry role information.

**Independent Test**: From Show page, click Edit. Form pre-fills with existing data. Change description, save. Redirect to listing with success toast, changes persisted.

### Implementation for User Story 4

- [X] T014 [US4] Verify Form.vue edit mode `resources/js/Pages/MinistryRoles/Form.vue` — pre-populates name and description on edit, uses PUT request, page title changes to "Editar Função"

**Checkpoint**: Edit flow works end-to-end — data pre-fills, validation runs on update, redirect and toast confirmed.

---

## Phase 7: User Story 5 — Excluir uma função (Priority: P2)

**Goal**: Allow administrators to delete ministry roles with confirmation.

**Independent Test**: From listing, click trash icon, confirm deletion. Item disappears from list, success toast shown. Soft-delete confirmed — item absent on reload.

### Implementation for User Story 5

- [X] T015 [US5] Verify Index.vue delete flow `resources/js/Pages/MinistryRoles/Index.vue` — confirm dialog with custom message, router.delete call, success toast on complete

**Checkpoint**: Delete confirmation works, soft-delete hides item from listing, cancel leaves item intact.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup.

- [X] T016 Re-seed database `node ace db:seed` to generate ministry_roles:* permissions
- [X] T017 Run TypeScript compiler `tsc --noEmit` to verify no type errors across all modified files
- [X] T018 Verify quickstart.md scenarios 1–9 manually
- [X] T019 Commit all changes

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — existing project
- **Foundational (Phase 2)**: No dependencies — pure backend infra
- **User Stories (Phase 3–7)**: All depend on Foundational phase completion
  - US3, US4, US5 depend on US1 (controller) and US2 (Index.vue, menu) indirectly, but the controller is complete in US1
- **Polish (Phase 8)**: Depends on all user stories complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2)
- **User Story 2 (P1)**: Can start after US1 controller is complete
- **User Story 3 (P2)**: Can start after US1 controller and US2 listing are complete
- **User Story 4 (P2)**: Can start after US1 Form.vue is complete (edit mode is same component)
- **User Story 5 (P2)**: Can start after US2 Index.vue is complete (delete button on same component)

### Within Each User Story

- Models/validators before controller
- Controller before routes
- Routes before Vue pages
- Core implementation before integration/menu

### Parallel Opportunities

- All Foundational tasks T001–T007 marked [P] can run in parallel (different files)
- T008 (controller) and T010 (Form.vue) can run in parallel after Foundational completes
- T011 (Index.vue) and T013 (Show.vue) can run in parallel after controller is done

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 2: Foundational
2. Complete Phase 3: US1 — Create (controller + Form.vue)
3. Complete Phase 4: US2 — List (Index.vue + menu)
4. **STOP and VALIDATE**: Test create and list flows independently
5. Continue to US3, US4, US5 for full CRUD

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 + US2 → MVP (create + list) → Deploy/Demo
3. Add US3 + US4 + US5 → Complete CRUD → Deploy/Demo
4. Each phase adds value without breaking previous phases

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify TypeScript compiles after each phase
- Commit after each phase or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Form.vue handles both create and edit (US1 + US4) — single component
- Index.vue handles list, search, pagination, and delete (US2 + US5) — single component
- Controller implements all 7 RESTful actions in one file (US1–US5 shared backend)
