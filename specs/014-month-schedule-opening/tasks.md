# Tasks: Month Schedule Opening

**Input**: Design documents from `/specs/014-month-schedule-opening/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/api.md, research.md

**Tests**: Not explicitly requested. Test tasks are omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Minimal setup since the AdonisJS monolith already exists.

- [X] T001 Add schedule routes to the existing router in `start/routes.ts` (POST /schedules/months, GET /schedules/months, GET /schedules/months/:id, PUT /schedules/months/:openedMonthId/schedules/:scheduleId, DELETE /schedules/months/:openedMonthId/schedules/:scheduleId, POST /schedules/:scheduleId/signal)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T002 [P] Create `OpenedMonth` Lucid model in `app/models/opened_month.ts` with relations to `User`, `Schedule`
- [X] T003 [P] Create `Schedule` Lucid model in `app/models/schedule.ts` with relations to `OpenedMonth`, `Community`, `Priest`, `ScheduleRole`, `AvailabilitySignal`
- [X] T004 [P] Create `ScheduleRole` Lucid pivot model in `app/models/schedule_role.ts` with relations to `Schedule`, `MinistryRole`
- [X] T005 [P] Create `AvailabilitySignal` Lucid model in `app/models/availability_signal.ts` with relations to `Schedule`, `User`
- [X] T006 [P] Create migration for `opened_months` table in `database/migrations/014_create_opened_months_table.ts`
- [X] T007 [P] Create migration for `schedules` table in `database/migrations/014_create_schedules_table.ts`
- [X] T008 [P] Create migration for `schedule_roles` pivot table in `database/migrations/014_create_schedule_roles_table.ts`
- [X] T009 [P] Create migration for `availability_signals` table in `database/migrations/014_create_availability_signals_table.ts`
- [X] T010 [P] Create VineJS validator for opened month creation in `app/validators/schedule_month.ts` (year, month, signaling_period_days, schedules array)
- [X] T011 [P] Create VineJS validator for schedule fields in `app/validators/schedule.ts` (day, name, description, community_id, priest_id, ministry_role_ids)
- [X] T012 [P] Create Bouncer policy `SchedulePolicy` in `app/policies/schedule_policy.ts` with `manageSchedule` and `signalAvailability` abilities
- [X] T013 Implement `ScheduleService` in `app/services/schedule_service.ts` (batch create schedules within transaction, priest same-day conflict detection, role sync)
- [X] T014 Run all new migrations with `node ace migration:run`

**Checkpoint**: Foundation ready — user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 — Administrator Opens a Month and Creates Schedules (Priority: P1) 🎯 MVP

**Goal**: Admins can open a month and batch-create all schedules with day, community, priest, name, description, and required roles. A signaling period is defined.

**Independent Test**: Log in as admin, visit `/schedules/months/create`, select June 2026, create 3 schedules with all required fields, set signaling period to 7 days, submit, and verify the month and schedules are persisted in the database.

### Implementation for User Story 1

- [ ] T015 [P] [US1] Implement `store` action in `app/controllers/schedule_months_controller.ts` to open a month and batch-create schedules atomically
- [ ] T016 [P] [US1] Implement `index` action in `app/controllers/schedule_months_controller.ts` to list opened months with schedule and signal counts
- [ ] T017 [P] [US1] Create Inertia admin page `resources/js/pages/schedule_months/create.vue` with month selector, batch schedule form (day, community, priest, name, description, roles), and signaling period input
- [ ] T018 [P] [US1] Create Inertia page `resources/js/pages/schedule_months/index.vue` to display the list of opened months
- [ ] T019 [US1] Wire batch schedule creation form to POST `/schedules/months` and handle validation errors with user-friendly messages

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 — Users Signal Availability for Schedules (Priority: P1)

**Goal**: Authenticated users can view an opened month as horizontal carousel cards and click "Sim" or "Não" to signal availability for each schedule.

**Independent Test**: With an opened month created in US1, log in as a regular user, visit `/schedules/months/:id/signal`, see all schedules in a carousel, click "Sim" for one and "Não" for another, refresh the page, and verify the choices are persisted and displayed.

### Implementation for User Story 2

- [ ] T020 [P] [US2] Implement `show` action in `app/controllers/schedule_months_controller.ts` to return an opened month with schedules, communities, priests, roles, and the current user's signals
- [ ] T021 [P] [US2] Create `AvailabilitySignalsController` in `app/controllers/availability_signals_controller.ts` with `store` action to persist a user's availability signal
- [ ] T022 [P] [US2] Create Inertia user page `resources/js/pages/schedule_months/signal.vue` with PrimeVue Carousel displaying schedule cards, each with "Sim" and "Não" buttons
- [ ] T023 [US2] Wire carousel card buttons to POST `/schedules/:scheduleId/signal`, update card visual state immediately, and handle errors gracefully

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 — Administrator Edits or Deletes Schedules from an Opened Month (Priority: P2)

**Goal**: Admins can return to an opened month and edit or delete individual schedules without reopening the month.

**Independent Test**: Log in as admin, open an existing month with schedules, edit one schedule to change its priest and required roles, delete another schedule, and verify both operations are persisted. Confirm that deleted schedule's signals are also removed.

### Implementation for User Story 3

- [ ] T024 [P] [US3] Implement `update` action in `app/controllers/schedule_months_controller.ts` to edit an existing schedule and sync its ministry roles
- [ ] T025 [P] [US3] Implement `destroy` action in `app/controllers/schedule_months_controller.ts` to delete a schedule with cascade removal of its availability signals
- [ ] T026 [P] [US3] Create Inertia admin page `resources/js/pages/schedule_months/edit.vue` to display schedules of an opened month with inline edit and delete controls
- [ ] T027 [US3] Add priest same-day conflict warning in `app/services/schedule_service.ts` when updating a schedule

**Checkpoint**: User Stories 1, 2, and 3 should all be independently functional.

---

## Phase 6: User Story 4 — Users Edit Availability Signals Within the Signaling Period (Priority: P2)

**Goal**: Users can change their previously submitted availability signals as long as the signaling period is still active. After expiration, signals are locked.

**Independent Test**: With an active opened month, log in as a user, submit "Sim" for a schedule, then return and change it to "Não" before the deadline — verify the update persists. Wait (or mock) until the deadline passes and attempt another edit — confirm the system blocks it with a clear message.

### Implementation for User Story 4

- [ ] T028 [P] [US4] Add `update` action to `app/controllers/availability_signals_controller.ts` to allow users to change their signal while the deadline is active
- [ ] T029 [US4] Implement deadline guard in `app/controllers/availability_signals_controller.ts` that rejects signal create/update when `now() > signaling_deadline`
- [ ] T030 [US4] Update `resources/js/pages/schedule_months/signal.vue` to display the user's previously selected option on each card and allow changing it when the period is active; show a "period closed" state when inactive

**Checkpoint**: All four user stories should now be independently functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories.

- [ ] T031 [P] Run `npm run typecheck` and fix any TypeScript errors across new files
- [ ] T032 [P] Run `npm run lint` and fix any linting errors across new files
- [ ] T033 Validate all acceptance scenarios from `spec.md` against the running application
- [ ] T034 Update `specs/014-month-schedule-opening/quickstart.md` if any setup steps deviated during implementation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories.
- **User Stories (Phase 3+)**: All depend on Foundational phase completion.
  - User stories can proceed in parallel (if staffed).
  - Or sequentially in priority order (P1 → P2).
- **Polish (Final Phase)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — No dependencies on other stories. This is the **MVP**.
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) — Requires an opened month with schedules (delivered by US1) for end-to-end testing, but its controller and page can be built in parallel with US1.
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) — Depends on US1 being functional since it edits/deletes schedules created by US1.
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) — Depends on US2 being functional since it extends the signaling flow.

### Within Each User Story

- Models before services (handled in Foundational phase).
- Services before controllers (handled in Foundational phase).
- Core controller action before Inertia page wiring.
- Story complete before moving to next priority.

### Parallel Opportunities

- All Foundational tasks marked [P] can run in parallel (within Phase 2).
- Once Foundational is done, US1 and US2 can start in parallel (controller/pages are independent files).
- US3 and US4 can start in parallel after US1 and US2 are complete.
- All polish tasks marked [P] can run in parallel.

---

## Parallel Example: User Story 1

```bash
# Launch all implementation tasks for User Story 1 together:
Task: "Implement store action in app/controllers/schedule_months_controller.ts"
Task: "Implement index action in app/controllers/schedule_months_controller.ts"
Task: "Create Inertia admin page resources/js/pages/schedule_months/create.vue"
Task: "Create Inertia page resources/js/pages/schedule_months/index.vue"

# After controllers and pages exist:
Task: "Wire batch schedule creation form to POST /schedules/months"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready.
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!).
3. Add User Story 2 → Test independently → Deploy/Demo.
4. Add User Story 3 → Test independently → Deploy/Demo.
5. Add User Story 4 → Test independently → Deploy/Demo.
6. Each story adds value without breaking previous stories.

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together.
2. Once Foundational is done:
   - Developer A: User Story 1 (admin opening + creation)
   - Developer B: User Story 2 (user signaling + carousel)
3. After US1 + US2:
   - Developer A: User Story 3 (admin edit/delete)
   - Developer B: User Story 4 (user edit signals + deadline guard)
4. Stories complete and integrate independently.

---

## Notes

- [P] tasks = different files, no dependencies.
- [Story] label maps task to specific user story for traceability.
- Each user story should be independently completable and testable.
- Commit after each task or logical group.
- Stop at any checkpoint to validate a story independently.
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence.
