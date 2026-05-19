---
description: 'Task list for schedule statuses feature implementation'
---

# Tasks: Schedule Statuses

**Input**: Design documents from `/specs/016-schedule-statuses/`
**Prerequisites**: plan.md, spec.md

**Tests**: Not requested in the feature specification — no test tasks included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `app/models/`, `app/controllers/`, `app/commands/`, `database/migrations/`, `start/`, `types/`
- **Frontend**: `resources/js/Pages/ScheduleMonths/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization — no setup needed, project already exists.

No tasks — the AdonisJS project is fully initialized with all dependencies (Lucid ORM, migrations, Inertia.js, PrimeVue).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Database migrations and models that MUST be complete before ANY user story.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T001 Create migration `add_status_to_opened_months` in `database/migrations/1779150539000_add_status_to_opened_months.ts`
- [X] T002 [P] Create migration `create_status_transitions_table` in `database/migrations/1779150539001_create_status_transitions_table.ts`
- [X] T003 Update `OpenedMonth` model in `app/models/opened_month.ts`
- [X] T004 [P] Create `StatusTransition` model in `app/models/status_transition.ts`

**Checkpoint**: Foundation ready.

---

## Phase 3: User Story 1 — Admin manages month lifecycle (Priority: P1) 🎯 MVP

**Goal**: Admin can transition a month through all statuses with audit logging.

**Independent Test**: Create a month, verify initial status, transition through states, each logged.

- [X] T005 Create ACE command `TransitionExpiredMonths` in `app/commands/TransitionExpiredMonths.ts`
- [X] T006 [P] [US1] Add `changeStatus()` action in `app/controllers/schedule_months_controller.ts`
- [X] T007 [P] [US1] Add transition route `POST /schedules/months/:openedMonthId/transition` in `start/routes.ts`
- [X] T008 [P] [US1] Update `serializeMonth()` in `app/controllers/schedule_months_controller.ts`

**Checkpoint**: Admin can fully manage lifecycle. Auto-transition command exists.

---

## Phase 4: User Story 2 — Users can only signal when disponivel (Priority: P1)

**Goal**: Users can submit availability signals only when month status is `disponivel`.

**Independent Test**: Access signal page for month in each status — only 'disponivel' works.

- [X] T009 [US2] Update `AvailabilitySignalsController` in `app/controllers/availability_signals_controller.ts`
- [X] T010 [US2] Update `signal()` action in `app/controllers/schedule_months_controller.ts`
- [X] T011 [P] [US2] Update `Signal.vue` in `resources/js/Pages/ScheduleMonths/Signal.vue`

**Checkpoint**: Signaling gated by status.

---

## Phase 5: User Story 3 — Admin editing only in rascunho (Priority: P2)

**Goal**: Admin can edit schedule allocations only when status is `rascunho`. Transition buttons on edit page.

**Independent Test**: Edit page shows actions only in 'rascunho'. Buttons for Publish/Reopen/Close.

- [X] T012 [US3] Update `edit()` action in `app/controllers/schedule_months_controller.ts`
- [X] T013 [P] [US3] Update `Edit.vue` in `resources/js/Pages/ScheduleMonths/Edit.vue`
- [X] T014 [P] [US3] Update `types/inertia.ts`

**Checkpoint**: Edit gated, transition buttons visible.

---

## Phase 6: User Story 4 — Users can view published schedules (Priority: P3)

**Goal**: All users can view finalized schedule when published/closed. Non-admins see limited info before publication.

**Independent Test**: Show page for 'publicada' vs 'rascunho' for different user roles.

- [X] T015 [US4] Update `show()` action in `app/controllers/schedule_months_controller.ts`
- [X] T016 [P] [US4] Update `Show.vue` in `resources/js/Pages/ScheduleMonths/Show.vue`

**Checkpoint**: Published schedule visibility works.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: All views consistent with new status field.

- [X] T017 [P] Update `Index.vue` in `resources/js/Pages/ScheduleMonths/Index.vue`
- [X] T018 Backfill status for existing months via migration (included in T001)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 2)**: No dependencies — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Phase 2
- **US2 (Phase 4)**: Depends on Phase 2
- **US3 (Phase 5)**: Depends on Phase 2
- **US4 (Phase 6)**: Depends on Phase 2
- **Polish (Phase 7)**: Depends on Phase 2

### Parallel Opportunities

- T001 and T002 (migrations) could run in parallel
- T003 and T004 (models) could run in parallel
- All [P] tasks within a phase could run in parallel
