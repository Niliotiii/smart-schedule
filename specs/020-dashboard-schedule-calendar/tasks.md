---
description: 'Tasks for Dashboard Schedule Calendar'
---

# Tasks: Dashboard Schedule Calendar

**Input**: Design documents from `/specs/020-dashboard-schedule-calendar/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: No tests requested — read-only data display.

**Organization**: Tasks are grouped by user story. US1 and US2 share the same file (Dashboard/Index.vue), so they must run sequentially.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- Backend: `app/controllers/`
- Frontend: `resources/js/Pages/` and `resources/js/Components/`
- Types: `types/`
- All paths relative to repository root

## Phase 1: Setup

**Purpose**: No project setup needed — all dependencies already available (PrimeVue, Tailwind, Lucid ORM).

No tasks.

---

## Phase 2: Backend — Dashboard Assignments Query (Foundational)

**Purpose**: Controller query that loads the authenticated user's schedule assignments, must be done before frontend.

- [X] T001 Add query in `app/controllers/dashboard_controller.ts` to load the user's Schedules for months with status "rascunho" or "publicada", preloading schedule (with community, priest, scheduleAssignments.user, scheduleAssignments.ministryRole), each including year and month
- [X] T002 [P] Update the `Dashboard/Index` page type in `types/inertia.ts` to include `userSchedules: Array<{ id: number; day: number; year: number; month: number; name: string; description: string | null; time: string; community: { id: number; name: string } | null; priest: { id: number; name: string } | null; assignments: Array<{ userId: number; userName: string; ministryRoleName: string }> }>`

**Checkpoint**: Dashboard controller returns `scheduleDays` with the user's assignments grouped by day.

---

## Phase 3: User Story 1 — Schedule Calendar Tab (Priority: P1) 🎯 MVP

**Goal**: The dashboard shows a calendar tab where days with user's schedules are green and other days gray. Clicking any day shows schedule details.

**Independent Test**: Dashboard shows a "Calendário de Escalas" tab with a calendar grid. Green days indicate assigned schedules, gray days indicate none.

- [X] T003 [US1] Create `resources/js/Pages/ScheduleCalendar/Card.vue` with a monthly calendar grid using Tailwind grid and PrimeVue surface tokens, receiving `userSchedules` prop, displaying green (`bg-green-500`) dots on assigned days and gray (`bg-surface-300`) dots on others
- [X] T004 [US1] Add month navigation (previous/next) with native Date month/year tracking in `resources/js/Pages/ScheduleCalendar/Card.vue`
- [X] T005 [US1] Add click handler on each day cell in `resources/js/Pages/ScheduleCalendar/Card.vue` that displays a detail panel below the calendar showing schedule name, time, community, priest, and assigned users with their ministry roles — or "Nenhuma escala neste dia" if empty
- [X] T006 [US1] Refactor `resources/js/Pages/Dashboard/Index.vue` to import the new `ScheduleCalendar/Card.vue`, pass `userSchedules` prop, and render it as the first tab panel in a PrimeVue Tabs/TabList/TabPanels layout
- [X] T007 [US1] Add "Calendário de Escalas" TabPanel with active by default in `resources/js/Pages/Dashboard/Index.vue`

**Checkpoint**: Calendar tab renders with green/gray day dots, month navigation works, clicking a day shows schedule details.

---

## Phase 4: User Story 2 — Liturgia Tab (Priority: P1)

**Goal**: The existing liturgia content moves to the second tab, fully functional.

**Independent Test**: Clicking "Liturgia Diária" tab shows the complete liturgia content with date picker, readings, accordions.

- [X] T008 [US2] Add "Liturgia Diária" TabPanel as the second tab in `resources/js/Pages/Dashboard/Index.vue`, moving the existing `<LiturgiaCard :liturgia="liturgia" />` into it

**Checkpoint**: Liturgia content renders correctly on the second tab with all functionality preserved.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Build validation.

- [X] T009 Run `npx tsc --noEmit` to verify TypeScript compilation
- [X] T010 Run `node ace build` to verify production build

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 2 (Backend)**: No dependencies — start here
- **US1 (Phase 3)**: Depends on Phase 2 (needs scheduleDays data)
- **US2 (Phase 4)**: Depends on Phase 3 (same file — Dashboard/Index.vue)
- **Polish (Phase 5)**: Depends on all other phases

### Parallel Opportunities

- T001 and T002 can run in parallel (different files)
- T003, T004, T005 can run in parallel (same file, but feature-complete together)
- T009 and T010 can run in parallel

### User Story Dependencies

- **US1 (P1)**: Depends on backend query
- **US2 (P1)**: Depends on US1 (same file)

## Implementation Strategy

1. Backend query + type update
2. New ScheduleCalendar/Card.vue component
3. Refactor Dashboard/Index.vue with tabbed layout
4. Build check
