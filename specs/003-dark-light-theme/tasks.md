# Tasks: Alternância de Tema Claro/Escuro

**Input**: Design documents from `/specs/003-dark-light-theme/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Configure Tailwind CSS v4 dark mode and create the core JavaScript theme logic

- [X] T001 Configure `@custom-variant dark (&:where(.dark, .dark *))` in resources/css/app.css
- [X] T002 Add theme toggle, localStorage persistence, and OS detection logic in resources/js/app.js
- [X] T003 [P] Add sun and moon SVG icons to resources/views/components/icon.edge

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add dark variants to reusable UI components that all pages depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Add theme toggle button and dark classes to navbar component in resources/views/components/navbar.edge
- [X] T005 [P] Add dark classes to sidebar component in resources/views/components/sidebar.edge
- [X] T006 [P] Add dark classes to pagination component in resources/views/components/pagination.edge
- [X] T007 [P] Add dark classes to action_button component in resources/views/components/action_button.edge

**Checkpoint**: All reusable components support dark theme. User stories can now proceed.

---

## Phase 3: User Story 1 - Alternar tema via botão na interface (Priority: P1) 🎯 MVP

**Goal**: Authenticated user can click the theme toggle button in the navbar and immediately switch between light and dark themes across all pages.

**Independent Test**: Access any authenticated page, click the theme toggle button in the navbar, verify all UI elements (backgrounds, text, sidebar, navbar, tables, forms, badges, buttons) change between light and dark themes. Navigate to another page and verify the theme persists.

### Implementation for User Story 1

- [X] T008 [US1] Add dark classes and FOUC prevention inline script to dashboard view in resources/views/dashboard/index.edge
- [X] T009 [P] [US1] Add dark classes and FOUC prevention inline script to users views in resources/views/users/index.edge, resources/views/users/form.edge, resources/views/users/show.edge
- [X] T010 [P] [US1] Add dark classes and FOUC prevention inline script to profiles views in resources/views/profiles/index.edge, resources/views/profiles/form.edge, resources/views/profiles/show.edge

**Checkpoint**: At this point, User Story 1 is fully functional — authenticated users can toggle theme and all pages adapt correctly.

---

## Phase 4: User Story 2 + User Story 3 - Persistência e detecção do SO (Priority: P2 + P3)

**Goal**: Theme preference persists across browser sessions (US2); first-time visitors see the theme that matches their OS preference (US3); login page supports theme toggle for unauthenticated users.

**Independent Test**: Set theme to dark, close browser, reopen and login — theme should still be dark (US2). Clear localStorage, set OS to dark mode, access login page — should load in dark (US3). Toggle theme on login page — should work without authentication (US2+US3).

### Implementation for User Story 2 + User Story 3

- [X] T011 [US2] [US3] Add theme toggle button, dark classes, and FOUC prevention inline script to login page in resources/views/auth/login.edge

**Checkpoint**: All user stories are now functional. Theme persists across sessions, respects OS preference, and works on the login page.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final validation that all components work correctly in both themes

- [X] T012 Verify all components render correctly in both light and dark themes per quickstart.md test checklist
- [X] T013 Verify theme persists across page navigation, browser restart, and multiple tabs per quickstart.md scenarios

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion
- **User Stories 2+3 (Phase 4)**: Depends on Foundational phase; largely complete after US1 since JS logic and FOUC scripts are already in place — only login page remains
- **Polish (Phase 5)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — no dependencies on other stories
- **User Story 2 (P2)**: Core persistence is built into T002 (JS logic) and FOUC scripts from US1 — only login page needs separate treatment
- **User Story 3 (P3)**: Core OS detection is built into T002 (JS logic) and FOUC scripts from US1 — login page (T011) completes this story

### Within Each User Story

- CSS and JS setup before component dark classes
- Reusable components (navbar, sidebar) before page views
- FOUC script added alongside dark classes in each view (same task)

### Parallel Opportunities

- T003 (icons) can run in parallel with T001 and T002
- T005, T006, T007 (sidebar, pagination, action_button) can all run in parallel
- T009 and T010 (users and profiles views) can run in parallel

---

## Parallel Example: Phase 2

```bash
# Launch all foundational component tasks together:
Task T004: "Add theme toggle button and dark classes to navbar"
Task T005: "Add dark classes to sidebar"
Task T006: "Add dark classes to pagination"
Task T007: "Add dark classes to action_button"
```

## Parallel Example: Phase 3

```bash
# After foundational components are done:
Task T008: "Add dark classes + FOUC script to dashboard"
Task T009: "Add dark classes + FOUC script to users views (3 files)"
Task T010: "Add dark classes + FOUC script to profiles views (3 files)"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T003)
2. Complete Phase 2: Foundational (T004–T007)
3. Complete Phase 3: User Story 1 (T008–T010)
4. **STOP and VALIDATE**: Toggle theme on authenticated pages, verify all components adapt
5. Deploy/demo if ready — core feature is functional

### Incremental Delivery

1. Complete Setup + Foundational → Core infrastructure ready
2. Add User Story 1 → Theme toggle works on all authenticated pages → **MVP!**
3. Add User Stories 2+3 → Login page theme support + persistence fully functional
4. Polish → Cross-browser and cross-tab validation

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- FOUC prevention (inline `<head>` script) is added alongside dark classes in each view — no separate task needed
- No database changes required — theme preference is entirely client-side (localStorage)
- All JS logic (toggle, persist, detect) is in a single file (resources/js/app.js) written once in T002
- Each view needs the same FOUC inline script block in `<head>` before `@vite()`