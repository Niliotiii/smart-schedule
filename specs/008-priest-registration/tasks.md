# Tasks: Priest Registration

**Input**: Design documents from `/specs/008-priest-registration/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), data-model.md

**Tests**: No test tasks — tests were not explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Foundational (Blocking Prerequisites)

**Purpose**: All shared infrastructure that MUST be complete before ANY user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T001 Create `priests` migration with `id`, `name`, `phone`, `created_at`, `updated_at`, `deleted_at` in `database/migrations/YYYYMMDD_create_priests_table.ts`
- [X] T002 Create `Priest` model with soft-delete methods in `app/models/priest.ts` (depends on T001)
- [X] T003 Create `priest` Vine validators (`createPriestValidator`, `updatePriestValidator`) in `app/validators/priest.ts`
- [X] T004 Add priests Bouncer abilities (`priestsRead`, `priestsCreate`, `priestsUpdate`, `priestsDelete`) in `app/abilities/main.ts`
- [X] T005 Add priests resource routes under auth group in `start/routes.ts`
- [X] T006 [P] Add priests navigation link to `AppMenu` in `resources/js/Components/AppMenu.vue`

**Checkpoint**: Foundation ready — migration runs, model/validator/controller scaffold exists, menu has link to `/priests`.

---

## Phase 2: User Story 1 - Register a Priest (Priority: P1) 🎯 MVP

**Goal**: Administrators can register new priests by providing a name (required) and an optional phone number.

**Independent Test**: Navigate to `/priests/create`, fill the form with a name and phone, submit, and verify the success message. The priest should be visible via the show/detail page.

### Implementation for User Story 1

- [X] T007 [US1] Create `PriestsController` with `create`, `store`, and `show` actions in `app/controllers/priests_controller.ts`
- [X] T008 [P] [US1] Create `Priests/Show.vue` Inertia page to display priest details in `resources/js/Pages/Priests/Show.vue`
- [X] T009 [P] [US1] Create `Priests/Form.vue` Inertia page with creation form (TabView with "Informações" tab) in `resources/js/Pages/Priests/Form.vue`
- [X] T010 [US1] Wire form POST submission: validate with `createPriestValidator`, flash success, redirect to `/priests`

**Checkpoint**: At this point, an administrator can create a priest and view its details. User Story 1 is independently functional.

---

## Phase 3: User Story 2 - List Registered Priests (Priority: P2)

**Goal**: Administrators can view a paginated, searchable list of all registered priests.

**Independent Test**: Navigate to `/priests` and verify the DataTable displays all priests with name and phone. Test search filtering and pagination.

### Implementation for User Story 2

- [X] T011 [US2] Add `index` action to `PriestsController` with pagination, search (`ilike` on `name`), and `withoutTrashed` filter in `app/controllers/priests_controller.ts`
- [X] T012 [P] [US2] Create `Priests/Index.vue` Inertia page with `DataTable`, search input, pagination, and action buttons in `resources/js/Pages/Priests/Index.vue`
- [X] T013 [US2] Wire listing Inertia props: `priests` array, `pagination` object, `search` state; handle empty state

**Checkpoint**: At this point, both registration (US1) and listing (US2) work independently.

---

## Phase 4: User Story 3 - Edit Priest Information (Priority: P3)

**Goal**: Administrators can edit an existing priest's name and phone number.

**Independent Test**: Navigate to `/priests/:id/edit`, modify the phone or name, submit, and verify the updated values appear in the listing and detail views.

### Implementation for User Story 3

- [X] T014 [US3] Add `edit` and `update` actions to `PriestsController` with `updatePriestValidator` in `app/controllers/priests_controller.ts`
- [X] T015 [US3] Update `Priests/Form.vue` to support edit mode: pre-fill form from `props.priest`, use `PUT/PATCH` route for updates, show edit title in `resources/js/Pages/Priests/Form.vue`

**Checkpoint**: All user stories (create, list, edit) are now independently functional.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final touches that affect the full feature.

- [X] T016 Add `destroy` action (soft delete) to `PriestsController` and wire "Excluir" button in `Index.vue` in `app/controllers/priests_controller.ts`
- [X] T017 [P] Run quickstart validation: manually test create, list, edit, delete flows end-to-end

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 1)**: No dependencies — can start immediately. BLOCKS all user stories.
- **User Story 1 (Phase 2)**: Depends on Foundational phase (T001–T006).
- **User Story 2 (Phase 3)**: Depends on Foundational phase. Reuses `PriestsController` and `Priest` model created in Phase 1/2.
- **User Story 3 (Phase 4)**: Depends on Foundational phase. Reuses `Form.vue` created in US1.
- **Polish (Phase 5)**: Depends on all user story phases being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Standalone MVP after Foundational. No dependencies on other stories.
- **User Story 2 (P2)**: Can start after Foundational. Reuses controller scaffold from US1 but can be tested independently by directly populating the `priests` table.
- **User Story 3 (P3)**: Can start after Foundational. Reuses `Form.vue` from US1 but adds edit capability.

### Within Each User Story

- Models / validators / abilities before controller
- Controller before pages
- Pages before wiring / integration

### Parallel Opportunities

- All Foundational tasks marked `[P]` (T002–T006) can run in parallel after T001 migration is defined.
- T008 (Show.vue) and T009 (Form.vue) can be built in parallel.
- T012 (Index.vue) can be built independently once the controller `index` action contract is known.

---

## Parallel Example: User Story 1

```bash
# Launch Show.vue and Form.vue together (different files, same contract):
Task: "Create Priests/Show.vue in resources/js/Pages/Priests/Show.vue"
Task: "Create Priests/Form.vue in resources/js/Pages/Priests/Form.vue"
# Both depend on PriestsController scaffold being ready.
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Foundational (migration, model, validator, abilities, routes, menu)
2. Complete Phase 2: User Story 1 (create, store, show + Form.vue + Show.vue)
3. **STOP and VALIDATE**: An administrator can create a priest and view its details.
4. Deploy / demo if ready.

### Incremental Delivery

1. Complete Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add Polish (soft delete + validation) → Final deploy
6. Each story adds value without breaking previous stories.

### Parallel Team Strategy

With multiple developers:

1. Team completes Foundational together.
2. Once Foundational is done:
   - Developer A: User Story 1 (controller + form + show)
   - Developer B: User Story 2 (index + listing page)
3. When US1 is done, Developer A can start User Story 3 (edit mode on same form).

---

## Notes

- `[P]` tasks = different files, no dependencies
- `[Story]` label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
