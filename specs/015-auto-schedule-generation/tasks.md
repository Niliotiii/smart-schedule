---
description: 'Task list for auto schedule generation feature'
---

# Tasks: Geração Automática de Escalas

**Input**: Design documents from `/specs/015-auto-schedule-generation/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: New migration and model shared across all stories

- [x] T001 Create migration `create_schedule_assignments_table` in database/migrations/ with columns: schedule_id, user_id, ministry_role_id, created_at. Foreign keys to schedules, users, ministry_roles. Unique constraint on (schedule_id, user_id, ministry_role_id).
- [x] T002 [P] Create ScheduleAssignment model in app/models/schedule_assignment.ts with BelongsTo relations to Schedule, User, MinistryRole
- [x] T003 [P] Add @hasMany(() => ScheduleAssignment) relation to Schedule model in app/models/schedule.ts
- [x] T004 [P] Add @hasMany(() => ScheduleAssignment) relation to User model in app/models/user.ts

---

## Phase 2: Foundational (Blocking Prerequisites) — Algorithm Service

**Purpose**: Core algorithm that all stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Create ScheduleGeneratorService in app/services/schedule_generator_service.ts with the core algorithm:
  - Load eligible users (includeInScale=true, has ministry roles matching the month's schedules)
  - Group users by ministry role
  - Load availability signals for the month
  - For each schedule, for each role slot: filter eligible users (have role, not signaled "não" for this schedule), sort by (sim before no-signal, then ascending current assignment count, then ascending user ID as tiebreaker), assign top N
  - Check for day/time conflicts (same user assigned to two schedules same day)
  - Return summary with filled and unfilled slots
- [x] T006 Create route `POST /schedules/months/:openedMonthId/generate` in start/routes.ts
- [x] T007 Add `generate` method to ScheduleMonthsController in app/controllers/schedule_months_controller.ts:
  - Authorize scheduleMonthsManage
  - Call ScheduleGeneratorService
  - Delete existing assignments and insert new ones in transaction
  - Redirect with success message and unfilled slots summary
- [x] T008 Serialize assignments in `serializeMonth()` method in schedule_months_controller.ts so the edit page receives assignment data

**Checkpoint**: Foundation ready — user story implementation can now begin in parallel

---

## Phase 3: User Story 1 — Gerar Escala Automaticamente (Priority: P1) 🎯 MVP

**Goal**: Administrador pode gerar escalas automaticamente para um mês com um clique

**Independent Test**: Abrir um mês com escalas, ter usuários com funções e sinalizações, clicar em "Gerar Escala Automaticamente" e verificar distribuição correta

### Implementation for User Story 1

- [x] T009 [US1] Add "Gerar Escala Automaticamente" button to Edit.vue in resources/js/Pages/ScheduleMonths/Edit.vue in the DataTable header area, along with a confirmation dialog before executing
- [x] T010 [US1] Show generation summary after execution — display success/error flash messages with unfilled slots details in Edit.vue
- [x] T011 [US1] Display assigned users per schedule row in the Edit.vue DataTable, showing user name grouped by ministry role

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 — Visualizar e Ajustar Resultado (Priority: P2)

**Goal**: Administrador pode ver e modificar manualmente as alocações geradas

**Independent Test**: Após gerar, remover um usuário de uma função e substituir por outro manualmente

### Implementation for User Story 2

- [x] T012 [US2] Add UI to remove a user assignment from a schedule in the Edit.vue dialog — show assigned users as removable chips per role
- [x] T013 [US2] Add UI to manually assign a user to a schedule role in Edit.vue — a Select dropdown filtered by eligible users for that role
- [x] T014 [US2] Add endpoint `DELETE /schedules/months/:id/assignments/:assignmentId` to controller to delete a single assignment
- [x] T015 [US2] Add endpoint `POST /schedules/months/:id/assignments` to controller to manually create a single assignment
- [x] T016 [US2] Add routes for the assignment CRUD endpoints in start/routes.ts

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 — Reprocessar Escala (Priority: P3)

**Goal**: Administrador pode regenerar a alocação, substituindo a anterior

**Independent Test**: Gerar, alterar manualmente, regenerar, confirmar que alocações manuais foram sobrescritas

### Implementation for User Story 3

- [x] T017 [US3] Add confirmation dialog before regeneration warning that manual changes will be lost (already handled if T009 includes confirmation)
- [x] T018 [US3] Ensure the generate endpoint deletes all existing assignments before creating new ones (already covered by T007)
- [x] T019 [US3] Show regeneration confirmation message distinguishing from first-time generation in Edit.vue

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T020 [P] Add unit tests for algorithm in tests/unit/schedule_generator_service.spec.ts: test signal priority, role matching, uniform distribution, day conflict avoidance, partial fill scenarios
- [x] T021 [P] Run migrations and verify schema with `node ace migration:run`
- [x] T022 Update types/inertia.ts with new page prop types for assignments
- [x] T023 Verify build with `node ace build`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational — No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational — Needs US1 for initial generation, but has independent test path
- **User Story 3 (P3)**: Can start after Foundational — Depends on US1 generate endpoint, shares US2 manual adjustment

### Within Each Phase

- Migration before models
- Models before services
- Services before endpoints
- Backend before frontend

### Parallel Opportunities

- T002, T003, T004 can run in parallel (different model files)
- All phases sequential (each builds on previous)
- Within US2: T014/T015 (endpoints) can run in parallel with T012/T013 (UI)

---

## Parallel Example: Setup Phase

```bash
# Launch all model tasks together:
Task: "Create ScheduleAssignment model in app/models/schedule_assignment.ts"
Task: "Add hasMany ScheduleAssignment to Schedule model in app/models/schedule.ts"
Task: "Add hasMany ScheduleAssignment to User model in app/models/user.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (migration + models)
2. Complete Phase 2: Foundational (algorithm service + endpoint)
3. Complete Phase 3: User Story 1 (UI button + display)
4. **STOP and VALIDATE**: Generate a month's schedules in browser
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Algorithm ready via POST endpoint
2. Add User Story 1 → One-click generation from edit page (MVP!)
3. Add User Story 2 → Manual adjustment of assignments
4. Add User Story 3 → Regeneration workflow

### Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
