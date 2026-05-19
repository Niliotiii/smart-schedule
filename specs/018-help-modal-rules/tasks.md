---
description: 'Tasks for Help Modal with Rules feature'
---

# Tasks: Help Modal with Rules

**Input**: Design documents from `/specs/018-help-modal-rules/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: No tests requested — frontend-only static content.

**Organization**: Tasks are grouped by user story to enable independent implementation.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- Vue components: `resources/js/Components/`
- All paths relative to repository root

## Phase 1: Setup

**Purpose**: No project setup needed — PrimeVue Dialog and TabView already available.

No tasks.

---

## Phase 2: Create HelpModal Component (Shared)

**Purpose**: The modal component used by all user stories.

- [X] T001 Create `resources/js/Components/HelpModal.vue` with a PrimeVue Dialog containing TabView, and a ref for visibility control

**Checkpoint**: HelpModal component exists and can be imported.

---

## Phase 3: User Story 1 — Allocation Rules Tab (Priority: P1)

**Goal**: The "Regras de Alocação" tab in the modal explains how automatic allocation works.

**Independent Test**: Opening the modal shows the allocation rules tab with correct content.

- [X] T002 [US1] Add TabPanel "Regras de Alocação" in `resources/js/Components/HelpModal.vue` with static text explaining: eligible users must have matching role, users who signaled "não" are excluded, users who signaled "sim" get priority, same-day conflicts are prevented, assignments are balanced across users, and user type filtering
- [X] T003 [US1] Set "Regras de Alocação" as the first tab so it is active by default

**Checkpoint**: Allocation rules tab renders correctly.

---

## Phase 4: User Story 2 — Status Rules Tab (Priority: P1)

**Goal**: The "Status de Escala" tab describes the five statuses and allowed transitions.

**Independent Test**: Clicking the second tab shows status rules with all five statuses and their transitions.

- [X] T004 [US2] Add TabPanel "Status de Escala" in `resources/js/Components/HelpModal.vue` with static text explaining: aberta → disponivel, disponivel → aberta/rascunho, rascunho → disponivel/publicada/encerrada, publicada → rascunho/encerrada, encerrada (terminal)
- [X] T005 [US2] Format the status transition rules clearly using visual elements (tags, badges, or a list) in the tab content

**Checkpoint**: Status rules tab renders correctly.

---

## Phase 5: User Story 3 — Help Button in Sidebar (Priority: P1)

**Goal**: A help button above "Sair" in the sidebar opens the modal.

**Independent Test**: All authenticated users see a help button in the sidebar above Sair. Clicking it opens the modal.

- [X] T006 [US3] Add a help button with a question-mark icon above the logout button in `resources/js/Components/AppMenu.vue`, importing and toggling the HelpModal

**Checkpoint**: Button visible in sidebar; modal opens/closes correctly.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Build validation.

- [X] T007 Run `npx tsc --noEmit` to verify TypeScript compilation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 2 (HelpModal)**: No dependencies — start here
- **US1 (Phase 3)**: Depends on Phase 2 (adds tab to HelpModal)
- **US2 (Phase 4)**: Depends on Phase 2 (adds tab to HelpModal)
- **US3 (Phase 5)**: Depends on Phase 2 (needs HelpModal to exist)
- **Polish (Phase 6)**: Depends on all other phases

### Parallel Opportunities

- T002 and T004 can run in parallel (different tabs in same file — but sequential is safer for the same file)
- US3 can run once HelpModal is created

### User Story Dependencies

- **US1 (P1)**: After Phase 2
- **US2 (P1)**: After Phase 2
- **US3 (P1)**: After Phase 2

## Implementation Strategy

1. Create HelpModal.vue with Dialog shell
2. Add both tabs with content
3. Wire up button in AppMenu.vue
4. Build check
