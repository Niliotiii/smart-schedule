# Tasks: PrimeVue UI Refactor

**Input**: Design documents from `/specs/005-primevue-ui-refactor/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not explicitly requested — no test tasks included.

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install PrimeVue dependencies and configure the integration with Vue 3, Inertia, and Tailwind CSS v4.

- [X] T001 Install PrimeVue packages: `npm install primevue @primeuix/themes primeicons tailwindcss-primeui`
- [X] T002 Configure CSS layers and PrimeVue design tokens in `resources/css/app.css` — add `@import "tailwindcss-primeui/v4"`, `@layer tailwind-base, primeui, tailwind-utilities` per `quickstart.md` Step 1
- [X] T003 Register PrimeVue plugin with Aura preset, ConfirmationService, and ToastService in `resources/js/app.ts` per `quickstart.md` Step 2

**Checkpoint**: Dev server starts without errors, existing pages still render (no PrimeVue components used yet), dark mode toggle still works.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the new layout shell components and composable that ALL user stories depend on. Delete old components that are being replaced.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T004 Refactor `resources/js/Composables/useTheme.ts` — keep `.dark` class toggle on `document.documentElement`, keep localStorage persistence, keep `matchMedia` detection; add `matchMedia` change listener for live system preference updates per research.md Decision 6
- [X] T005 Create `resources/js/Components/AppMenu.vue` — computed menu items filtered by RBAC `can` props, PrimeIcons (`pi pi-home`, `pi pi-users`, `pi pi-shield`, `pi pi-sign-out`), Inertia `<Link>` navigation, active item highlighting based on `currentUrl`, divider before logout per `contracts/layout-shell.md`
- [X] T006 Create `resources/js/Components/AppTopbar.vue` — hamburger button (`pi pi-bars`, mobile only), logo "Smart Schedule", theme toggle (`pi pi-moon`/`pi pi-sun` via `useTheme`), user avatar with initials and name per `contracts/layout-shell.md`
- [X] T007 [P] Create `resources/js/Components/AppSidebar.vue` — fixed sidebar with AppMenu, static mode on desktop, overlay mode on mobile with mask backdrop, logout button at bottom per `contracts/layout-shell.md`
- [X] T008 Refactor `resources/js/Layouts/AuthenticatedLayout.vue` — replace Sidebar/Navbar with AppSidebar/AppTopbar, add `<ConfirmDialog />` and `<Toast />` global instances, mobile overlay mask with close-on-click, content area offset by sidebar width on desktop per `contracts/layout-shell.md`
- [X] T009 Refactor `resources/js/Layouts/GuestLayout.vue` — PrimeVue styled centered layout with theme toggle button using PrimeIcons per `contracts/layout-shell.md`
- [X] T010 Delete `resources/js/Components/Sidebar.vue` — replaced by AppSidebar.vue
- [X] T011 [P] Delete `resources/js/Components/Navbar.vue` — replaced by AppTopbar.vue
- [X] T012 [P] Delete `resources/js/Components/Icon.vue` — replaced by PrimeIcons
- [X] T013 [P] Delete `resources/js/Components/Pagination.vue` — replaced by PrimeVue DataTable paginator

**Checkpoint**: App loads with new layout shell. Sidebar menu works with RBAC filtering. Theme toggle works. Mobile overlay works. ConfirmDialog and Toast are available globally. Old components deleted. App still functionally works (pages still use old HTML but layout is new).

---

## Phase 3: User Story 1 - Layout Shell with PrimeVue Components (Priority: P1) 🎯 MVP

**Goal**: Authenticated users see a fully redesigned interface with PrimeVue-styled layout shell (sidebar, topbar, content area) following the sakai-vue pattern.

**Independent Test**: Access any authenticated page — sidebar, topbar, and content area render with PrimeVue components and PrimeIcons. Mobile sidebar overlay works. Navigation between pages via SPA.

### Implementation for User Story 1

- [X] T014 [US1] Refactor `resources/js/Pages/Dashboard/Index.vue` — replace custom card `<div>` with PrimeVue `<Card>`, replace Icon.vue with PrimeIcons (`pi pi-users`, `pi pi-shield`), use `<Button>` and `<Tag>` for links/permissions, use PrimeVue surface tokens (`bg-surface-0`, `text-color`) per `contracts/primevue-components.md`
- [X] T015 [US1] Verify layout shell responsiveness — test sidebar static mode on desktop (≥992px) and overlay mode on mobile (<992px), verify hamburger toggle, mask click-to-close, and active menu highlighting across all pages

**Checkpoint**: Dashboard page renders with PrimeVue Card and PrimeIcons. Layout shell works on desktop and mobile. All authenticated pages show new sidebar/topbar. This is the MVP.

---

## Phase 4: User Story 2 - Refactored CRUD Pages with PrimeVue DataTable (Priority: P2)

**Goal**: Admins manage users and profiles through PrimeVue DataTable with pagination, search (IconField), confirmation dialogs (ConfirmDialog), and toast notifications.

**Independent Test**: Access /users, create/edit/delete a user — all CRUD operations work with PrimeVue components. Same for /profiles.

### Implementation for User Story 2

- [X] T016 [US2] Refactor `resources/js/Pages/Users/Index.vue` — replace HTML table with `<DataTable>` + `<Column>` (lazy mode, server-side pagination via `@page`), replace search form with `<Toolbar>` + `<IconField>` + `<InputIcon>` + `<InputText>`, replace `confirm()` with `useConfirm()`, replace flash `<div>` with `useToast()`, replace Icon.vue with PrimeIcons, replace "New User" `<Link>` with `<Button>`, action column with `<Button icon="pi pi-..." text rounded />` per `contracts/primevue-components.md`
- [X] T017 [P] [US2] Refactor `resources/js/Pages/Profiles/Index.vue` — same pattern as Users/Index: `<DataTable>` lazy with `@page`, `<Toolbar>` + `<IconField>` for search, `useConfirm()` for delete, `useToast()` for flash, PrimeIcons for action buttons, permissions column with `<Tag>` per `contracts/primevue-components.md`
- [X] T018 [P] [US2] Refactor `resources/js/Pages/Users/Form.vue` — replace `<input>` with `<InputText>`, `<input type="password">` with `<Password>`, `<select>` with `<Select>` (optionLabel, optionValue, showClear), replace submit `<button>` with `<Button>`, replace cancel `<Link>` with `<Button outlined>`, replace error `<p>` with `<Message severity="error">`, use PrimeIcons for back button (`pi pi-arrow-left`) per `contracts/primevue-components.md`
- [X] T019 [P] [US2] Refactor `resources/js/Pages/Profiles/Form.vue` — replace `<input>` with `<InputText>`, `<textarea>` with `<Textarea>`, `<input type="checkbox">` with `<Checkbox>`, replace submit/cancel buttons with `<Button>`, replace error messages with `<Message>`, use PrimeIcons for back button per `contracts/primevue-components.md`
- [X] T020 [P] [US2] Refactor `resources/js/Pages/Users/Show.vue` — replace card `<div>` with `<Card>`, permission/fields display with `<Tag>`, edit `<Link>` with `<Button>`, back `<Link>` with `<Button outlined>`, use PrimeIcons for edit button (`pi pi-pencil`) per `contracts/primevue-components.md`
- [X] T021 [P] [US2] Refactor `resources/js/Pages/Profiles/Show.vue` — replace card `<div>` with `<Card>`, permissions `<span>` badges with `<Tag>`, edit button with `<Button>`, back button with `<Button outlined>`, use PrimeIcons per `contracts/primevue-components.md`

**Checkpoint**: All CRUD pages (Users Index/Form/Show, Profiles Index/Form/Show) use PrimeVue components. DataTable pagination, search, ConfirmationService delete, and Toast feedback all work. No `confirm()` calls remain. No manual flash `<div>` elements remain.

---

## Phase 5: User Story 3 - Theming System with PrimeVue Design Tokens (Priority: P3)

**Goal**: Dark/light theme toggle applies consistently across all PrimeVue components and custom elements using PrimeVue design tokens. Preference persists and respects system preference.

**Independent Test**: Click theme toggle — all components (sidebar, topbar, DataTable, Cards, forms, Toast, ConfirmDialog) change consistently. Reload preserves preference. New user gets system preference.

### Implementation for User Story 3

- [X] T022 [US3] Audit and replace hardcoded Tailwind color classes with PrimeVue design tokens across all Vue files — replace `bg-white dark:bg-gray-800` with `bg-surface-0`, `text-gray-900 dark:text-gray-100` with `text-color`, `border-gray-200 dark:border-gray-700` with `border-surface`, `text-gray-500 dark:text-gray-400` with `text-muted-color`, and similar patterns per `contracts/primevue-components.md` dark mode section
- [X] T023 [US3] Add `matchMedia` change event listener in `resources/js/Composables/useTheme.ts` so theme reacts when system preference changes while app is open (per edge case in spec.md)

**Checkpoint**: Theme toggle switches all components consistently. PrimeVue design tokens are used instead of hardcoded Tailwind dark: variants where tokens exist. System preference changes are detected live.

---

## Phase 6: User Story 4 - Login Page with PrimeVue Styling (Priority: P4)

**Goal**: Unauthenticated users see a styled login page using PrimeVue form components.

**Independent Test**: Access /login, submit credentials — form uses PrimeVue InputText, Password, Button with consistent styling.

### Implementation for User Story 4

- [X] T024 [US4] Refactor `resources/js/Pages/Auth/Login.vue` — replace `<input type="email">` with `<InputText>`, `<input type="password">` with `<Password>`, submit `<button>` with `<Button label="Entrar">`, error flash `<div>` with `<Message severity="error">`, use PrimeVue surface tokens for card styling, use PrimeIcons for branding per `contracts/primevue-components.md`

**Checkpoint**: Login page uses PrimeVue components. Error messages display with Message component. Form submission works. Theme toggle in GuestLayout works.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Clean up, verify, and ensure consistency across all refactored pages.

- [X] T025 [P] Verify all pages use PrimeIcons consistently — no remaining references to Icon.vue component in imports or templates across `resources/js/`
- [X] T026 [P] Verify no `window.confirm()` calls remain in `resources/js/` — all replaced by `useConfirm()`
- [X] T027 [P] Verify no manual flash `<div>` elements remain in page components — all replaced by `useToast()`
- [X] T028 Run full manual test: login, dashboard, users CRUD (create/read/update/delete), profiles CRUD, search, pagination, theme toggle, mobile responsiveness per quickstart.md verification checklist
- [X] T029 Run `node ace test` to confirm all existing backend tests still pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) completion — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2)
- **User Story 2 (Phase 4)**: Depends on Foundational (Phase 2) — can run in parallel with US1
- **User Story 3 (Phase 5)**: Depends on US1 + US2 completion (needs pages to exist before auditing tokens)
- **User Story 4 (Phase 6)**: Depends on Foundational (Phase 2) — can run in parallel with US1/US2

### User Story Dependencies

- **US1 (P1)**: Depends on Phase 2 — no dependencies on other stories
- **US2 (P2)**: Depends on Phase 2 — independently testable, can parallel with US1
- **US3 (P3)**: Depends on US1 + US2 being complete (audits all pages for token replacement)
- **US4 (P4)**: Depends on Phase 2 — independently testable, can parallel with US1/US2

### Within Each User Story

- Layout components before page refactoring
- Page refactoring before token audit (US3)
- Core implementation before polish

### Parallel Opportunities

- T007 + T006 (AppSidebar and AppTopbar) can be created in parallel
- T010-T013 (deletions) can all run in parallel
- T016 + T017 (Users/Index and Profiles/Index) can be refactored in parallel
- T018 + T019 (Users/Form and Profiles/Form) can be refactored in parallel
- T020 + T021 (Users/Show and Profiles/Show) can be refactored in parallel
- T025 + T026 + T027 (polish verification tasks) can run in parallel
- US1, US2, and US4 can be worked on in parallel by different developers

---

## Parallel Example: Phase 2 (Foundational)

```bash
# After T004 (useTheme) and T005 (AppMenu) complete:
Task: "Create AppTopbar.vue in resources/js/Components/AppTopbar.vue"
Task: "Create AppSidebar.vue in resources/js/Components/AppSidebar.vue"

# After layout is updated (T008, T009):
Task: "Delete Sidebar.vue"
Task: "Delete Navbar.vue"
Task: "Delete Icon.vue"
Task: "Delete Pagination.vue"
```

## Parallel Example: Phase 4 (User Story 2)

```bash
# All page refactors can run in parallel:
Task: "Refactor Users/Index.vue with DataTable"
Task: "Refactor Profiles/Index.vue with DataTable"
Task: "Refactor Users/Form.vue with PrimeVue inputs"
Task: "Refactor Profiles/Form.vue with PrimeVue inputs"
Task: "Refactor Users/Show.vue with Card"
Task: "Refactor Profiles/Show.vue with Card"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (install + configure PrimeVue)
2. Complete Phase 2: Foundational (layout shell + delete old components)
3. Complete Phase 3: User Story 1 (Dashboard with PrimeVue)
4. **STOP and VALIDATE**: Test layout shell + Dashboard independently
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready, all old components deleted
2. Add US1 → Dashboard with PrimeVue Card/Tag → Deploy (MVP!)
3. Add US2 → CRUD pages with DataTable/Toast/ConfirmDialog → Deploy
4. Add US3 → Design token audit, consistent theming → Deploy
5. Add US4 → Login page with PrimeVue inputs → Deploy
6. Polish → Final verification and cleanup → Deploy

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- No backend changes — all tasks are frontend-only
- PrimeVue CSS and theme are injected automatically via the plugin registration
- `tailwindcss-primeui/v4` must use the `/v4` import path for Tailwind CSS v4 compatibility
- The `.dark` class on `<html>` is the single source of truth for dark mode (used by both Tailwind and PrimeVue)
- Commit after each task or logical group