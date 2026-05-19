---
description: 'Tasks for Dashboard Signal Access feature'
---

# Tasks: Dashboard Signal Access

**Input**: Design documents from `/specs/017-dashboard-signal-access/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: No tests requested — UI reorganization only.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- AdonisJS app: `app/controllers/`, `start/routes.ts`, `types/`
- Inertia Vue pages: `resources/js/Pages/`
- All paths relative to repository root

## Phase 1: Setup

**Purpose**: No project setup needed — feature builds on existing infrastructure.

No tasks. All dependencies are already in place.

---

## Phase 2: Foundational — Route, Type & Controller Action

**Purpose**: Shared backend infrastructure needed by both US1 and US2.

- [X] T001 Add `signals()` action in `app/controllers/schedule_months_controller.ts` that queries months with status "disponivel" and eager-loads schedules with the current user's signal in `app/controllers/schedule_months_controller.ts` that queries months with status "disponivel" and eager-loads schedules with the current user's signal
- [X] T002 [P] Add route `GET /schedules/signals` pointing to the `signals()` action in `start/routes.ts` `GET /schedules/signals` pointing to the `signals()` action in `start/routes.ts`
- [X] T003 [P] Add `ScheduleMonths/Signals` page type in `types/inertia.ts` for the consolidated signal page props in `types/inertia.ts` for the consolidated signal page props

**Checkpoint**: Route and controller action ready; type defined.

---

## Phase 3: User Story 2 — Consolidated Signal Page (Priority: P1)

**Goal**: A single page showing schedules from ALL months with status "disponivel", grouped by month, with Sim/Não buttons per schedule.

**Independent Test**: Navigate to `/schedules/signals` and see all open months' schedules with working signal buttons.

- [X] T004 [US2] Create `ScheduleMonths/Signals.vue` page with grouped-by-month layout, schedule details (day, name, time, community, priest, roles), and existing signal display
- [X] T005 [US2] Add Sim/Não buttons per schedule reusing the existing `POST /schedules/:scheduleId/signal` endpoint with loading state and toast feedback
- [X] T006 [US2] Add empty state and non-disponivel status messaging in `resources/js/Pages/ScheduleMonths/Signals.vue`

**Checkpoint**: Consolidated signal page works at `/schedules/signals`.

---

## Phase 4: User Story 1 — Dashboard Quick-Access Card (Priority: P1)

**Goal**: A "Sinalizar" card on the dashboard matching the existing card pattern (Usuários, Perfis, Escalas).

**Independent Test**: User with `scheduleMonthsRead` permission sees a "Sinalizar" card on the dashboard; clicking it navigates to `/schedules/signals`.

- [X] T007 [P] [US1] Add `can.scheduleMonthsRead` to `Dashboard/Index.vue` props (if not already present)
- [X] T008 [US1] Add "Sinalizar" quick-access card in `resources/js/Pages/Dashboard/Index.vue` following the existing card pattern, with enabled/disabled states based on permission

**Checkpoint**: Dashboard shows Sinalizar card linking to `/schedules/signals`.

---

## Phase 5: User Story 3 — Remove Old Signal Button (Priority: P2)

**Goal**: Remove the per-row "Sinalizar" button from the schedules/months index page.

**Independent Test**: The flag icon button no longer appears in the actions column of `ScheduleMonths/Index.vue`.

- [X] T009 [P] [US3] Remove the "Sinalizar disponibilidade" button from actions column in `resources/js/Pages/ScheduleMonths/Index.vue`

**Checkpoint**: No duplicate signal entry points.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Build validation and cleanup.

- [X] T010 Run `npx tsc --noEmit` to verify TypeScript compilation
- [X] T011 Run `node ace build` to verify production build

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — nothing to do
- **Foundational (Phase 2)**: No dependencies — can start immediately
- **US2 (Phase 3)**: Depends on Phase 2 (needs route + controller action + type)
- **US1 (Phase 4)**: Depends on Phase 2 (needs route to exist for the card link)
- **US3 (Phase 5)**: Independent — can run in parallel with US2/US1
- **Polish (Phase 6)**: Depends on all other phases

### User Story Dependencies

- **US1 (P1)**: Can start after Phase 2 — independent of US2/US3 for implementation
- **US2 (P1)**: Can start after Phase 2 — independent of US1/US3
- **US3 (P2)**: Fully independent — can run anytime

### Parallel Opportunities

- T002 and T003 can run in parallel (route + type)
- T007 and T009 can run in parallel (different files, independent)
- US2 (Signals page) and US1 (Dashboard card) can be implemented in parallel after Phase 2

## Parallel Example

```bash
# Launch foundational parallel tasks:
Task: "Add route GET /schedules/signals in start/routes.ts"
Task: "Add ScheduleMonths/Signals page type in types/inertia.ts"

# Launch US1 + US3 parallel cleanups:
Task: "Add Sinalizar card in Dashboard/Index.vue"
Task: "Remove signal button from ScheduleMonths/Index.vue"
```

## Implementation Strategy

### MVP (Phase 2 + Phase 3 only)

1. Complete Phase 2: Route + controller + type
2. Complete Phase 3: Signals page at `/schedules/signals`
3. **MVP done** — users can access via direct URL

### Full Delivery

1. Phase 2 → Phase 3 → Phase 4 → Phase 5 → Polish
2. Each phase adds value without breaking existing functionality
