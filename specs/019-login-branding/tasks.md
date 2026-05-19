---
description: 'Tasks for Login Branding Refactor'
---

# Tasks: Login Branding Refactor

**Input**: Design documents from `/specs/019-login-branding/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: No tests requested — frontend-only static content.

**Organization**: Tasks grouped by user story. Both stories modify the same single file (`resources/js/Pages/Auth/Login.vue`), so they must run sequentially.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- Vue components: `resources/js/Pages/Auth/`
- All paths relative to repository root

## Phase 1: Setup

**Purpose**: No project setup needed — all dependencies already available (PrimeVue, Tailwind, PrimeIcons).

No tasks.

---

## Phase 2: User Story 1 — Login with Brand Identity (Priority: P1) 🎯 MVP

**Goal**: The login page conveys brand identity with visual hierarchy, brand colors, and a professional look fitting the church schedule management context.

**Independent Test**: Navigating to `/login` shows a redesigned page with brand elements (icon, gradient background, accent bar) while maintaining full login functionality.

- [X] T001 [US1] Add top accent bar with gradient (`bg-gradient-to-r from-primary/60 via-primary to-primary/60`) and gradient card background (`bg-gradient-to-br from-primary/4 via-surface-ground to-primary/7`) to `resources/js/Pages/Auth/Login.vue`
- [X] T002 [US1] Add brand icon area with `pi-calendar-clock` icon inside a rounded container (`bg-primary/10`) above the title in `resources/js/Pages/Auth/Login.vue`
- [X] T003 [US1] Enhance "Smart Schedule" title to `text-3xl` and wrap card in rounded-xl container with shadow overflow-hidden in `resources/js/Pages/Auth/Login.vue`

**Checkpoint**: Login page renders with gradient card, accent bar, brand icon, and enhanced title — all form fields functional.

---

## Phase 3: User Story 2 — Visual Design Elements (Priority: P1)

**Goal**: Decorative visual elements (gradient, iconography) reflect the church/schedule management context and adapt to dark/light mode.

**Independent Test**: The login page displays a cohesive visual design with gradient backgrounds and icon that work in both light and dark modes.

- [X] T004 [US2] Verify dark/light mode adaptation — gradient backgrounds and icon container use PrimeVue surface tokens that respond to theme changes (no code change needed, already achieved by using `bg-surface-ground`, `bg-primary/10`, `text-primary`, etc.)

**Checkpoint**: Visual elements adapt correctly to dark/light mode toggle.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Build validation.

- [X] T005 Run `npx tsc --noEmit` to verify TypeScript compilation
- [X] T006 Run `node ace build` to verify production build

---

## Dependencies & Execution Order

### Phase Dependencies

- **US1 (Phase 2)**: No dependencies — start here
- **US2 (Phase 3)**: Depends on US1 (same file)
- **Polish (Phase 4)**: Depends on all other phases

### User Story Dependencies

- **US1 (P1)**: No dependencies — can start immediately
- **US2 (P1)**: Depends on US1 (same file — sequential execution required)

### Parallel Opportunities

- No parallel opportunities — both user stories modify the same single file (Login.vue), requiring sequential execution
- T005 and T006 can run in parallel

## Implementation Strategy

1. Add accent bar and gradient background
2. Add brand icon
3. Enhance title styling
4. Build check
