# Tasks: Migração para SPA com Inertia.js e Vue

**Input**: Design documents from `/specs/004-inertia-vue-migration/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install and configure Inertia.js + Vue 3 dependencies and scaffolding

- [X] T001 Install Inertia and Vue dependencies: `@adonisjs/inertia`, `@inertiajs/vue3`, `vue`, `@vitejs/plugin-vue`, `vue-tsc` via npm in package.json
- [X] T002 Run `node ace configure inertia` to scaffold Inertia config, middleware, and root template — accept SPA mode (not SSR)
- [X] T003 Update `vite.config.ts` to add `@vitejs/plugin-vue`, change entrypoints from `resources/js/app.js` to `resources/js/app.ts`, and update reload patterns from `.edge` to `.vue` files
- [X] T004 Add Vue SFC type support: update `tsconfig.json` to include `.vue` files and create `resources/js/env.d.ts` with Vue module declaration

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core Inertia infrastructure that ALL user stories depend on — layouts, components, composables, shared data

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Create `InertiaSharedPropsMiddleware` in `app/middleware/inertia_shared_props_middleware.ts` — inject `auth.user`, `can` (Bouncer abilities as booleans), and `flash` messages as shared Inertia props on every request
- [X] T006 Register Inertia middleware and `InertiaSharedPropsMiddleware` in `start/kernel.ts` — add Inertia middleware to server stack and shared props middleware to router stack
- [X] T007 Modify `InitializeBouncerMiddleware` in `app/middleware/initialize_bouncer_middleware.ts` — remove the Edge template helper sharing (`ctx.view.share(ctx.bouncer.edgeHelpers)`) since Bouncer is now exposed via Inertia shared props
- [X] T008 Create Inertia root HTML template in `resources/views/app.edge` — minimal HTML wrapper with FOUC prevention inline script (dark class from localStorage), Tailwind CSS classes on body, and `@vite()` entrypoint
- [X] T009 Create Inertia+Vue app entry point in `resources/js/app.ts` — import `@inertiajs/vue3`, create Vue app with Inertia plugin, resolve page components dynamically, mount to `#app` div
- [X] T010 Create `useTheme` composable in `resources/js/Composables/useTheme.ts` — reactive `isDark` state, `toggleTheme()` method (toggles `.dark` class on `<html>`, persists to localStorage), `onMounted` reads localStorage + OS preference
- [X] T011 [P] Create `Icon.vue` component in `resources/js/Components/Icon.vue` — SVG icon component with `name` prop (users, shield, plus, pencil, trash, eye, chevron-left, chevron-right, home, logout, menu, magnifying-glass) rendering inline SVGs based on current Edge `icon.edge` component
- [X] T012 Create `Navbar.vue` component in `resources/js/Components/Navbar.vue` — sticky header with mobile menu button, theme toggle (moon/sun icons), user initials + name, uses `useTheme` composable for theme toggle
- [X] T013 Create `Sidebar.vue` component in `resources/js/Components/Sidebar.vue` — fixed left sidebar with nav links (Dashboard, Usuários, Perfis) using Inertia `<Link>`, permission-based visibility via `can` shared prop, logout form, mobile responsive with overlay
- [X] T014 [P] Create `Pagination.vue` component in `resources/js/Components/Pagination.vue` — accepts `pagination` and `search` props, renders page links using Inertia `<Link>` preserving search params, shows "Mostrando X-Y de Z" text
- [X] T015 Create `AuthenticatedLayout.vue` in `resources/js/Layouts/AuthenticatedLayout.vue` — persistent Inertia layout wrapping Sidebar + Navbar + `<slot>`, includes mobile sidebar toggle method
- [X] T016 [P] Create `GuestLayout.vue` in `resources/js/Layouts/GuestLayout.vue` — minimal layout for unauthenticated pages (login), centered card with theme toggle button, uses `useTheme` composable

**Checkpoint**: Foundation ready — all shared components, layouts, composables, and middleware are in place. User story implementation can now begin.

---

## Phase 3: User Story 1 - Acesso às funcionalidades existentes após migração (Priority: P1) 🎯 MVP

**Goal**: All existing functionality (login, dashboard, users CRUD, profiles CRUD, RBAC, search, pagination) works identically but rendered via Vue + Inertia instead of Edge templates.

**Independent Test**: Access every page (login, dashboard, users index/create/edit/show, profiles index/create/edit/show) and verify all actions (create, read, update, delete, search, paginate) work as before. Verify RBAC: restricted users see fewer buttons/links. Verify flash messages display correctly.

### Implementation for User Story 1

- [X] T017 [US1] Migrate `AuthController` in `app/controllers/auth_controller.ts` — change `showLogin` from `view.render('auth/login')` to `inertia.render('Auth/Login')`, keep login/logout redirect behavior unchanged
- [X] T018 [P] [US1] Create `Login.vue` page in `resources/js/Pages/Auth/Login.vue` — form with email/password fields, CSRF via Inertia (automatic), flash error message display, themed card layout, uses `GuestLayout`, Inertia form submission via `useForm`
- [X] T019 [US1] Migrate `DashboardController` in `app/controllers/dashboard_controller.ts` — change `view.render('dashboard/index')` to `inertia.render('Dashboard/Index')` with serialized user props (serialize DateTime to ISO, include profile with permissions)
- [X] T020 [P] [US1] Create `Dashboard/Index.vue` page in `resources/js/Pages/Dashboard/Index.vue` — permission-based cards (Users, Perfis) with Inertia `<Link>`, uses `AuthenticatedLayout` + `can` shared prop for visibility
- [X] T021 [US1] Migrate `UsersController` in `app/controllers/users_controller.ts` — replace all `view.render()` calls with `inertia.render()`, serialize paginator to plain object for props, serialize DateTime fields, keep search/pagination logic unchanged
- [X] T022 [P] [US1] Create `Users/Index.vue` page in `resources/js/Pages/Users/Index.vue` — search form using Inertia `<Link>` with search params, user table with permission-based action buttons via `can` shared prop, flash success message, pagination using `Pagination.vue` component
- [X] T023 [P] [US1] Create `Users/Form.vue` page in `resources/js/Pages/Users/Form.vue` — create/edit form using Inertia `useForm()`, profile select dropdown, password field (optional on edit), validation error display from `errors` prop, back link to `/users`, conditional title (Novo Usuário vs Editar Usuário)
- [X] T024 [P] [US1] Create `Users/Show.vue` page in `resources/js/Pages/Users/Show.vue` — detail view showing fullName, email, profile name, createdAt (formatted from ISO string), permission-based edit link, back link to `/users`
- [X] T025 [US1] Migrate `ProfilesController` in `app/controllers/profiles_controller.ts` — replace all `view.render()` calls with `inertia.render()`, serialize paginator, preloaded permissions, and groupedPermissions to plain objects, keep search/pagination logic unchanged
- [X] T026 [P] [US1] Create `Profiles/Index.vue` page in `resources/js/Pages/Profiles/Index.vue` — search form, profiles table with permissions count, permission-based action buttons, flash success message, pagination
- [X] T027 [P] [US1] Create `Profiles/Form.vue` page in `resources/js/Pages/Profiles/Profiles/Form.vue` — create/edit form with name, description textarea, permission checkboxes grouped by module using `groupedPermissions` and `selectedPermissionIds` props, validation error display
- [X] T028 [P] [US1] Create `Profiles/Show.vue` page in `resources/js/Pages/Profiles/Show.vue` — detail view showing name, description, permissions list (as badges), createdAt, permission-based edit link, back link to `/profiles`
- [X] T029 [US1] Verify all controllers return Inertia responses — ensure no `view.render()` calls remain in `auth_controller.ts`, `dashboard_controller.ts`, `users_controller.ts`, `profiles_controller.ts`

**Checkpoint**: At this point, User Story 1 is fully functional — all CRUD pages work via Inertia+Vue with SPA navigation.

---

## Phase 4: User Story 2 - Alternância de tema claro/escuro (Priority: P2)

**Goal**: Theme toggle (light/dark) works correctly in the Inertia+Vue frontend — persists in localStorage, respects OS preference, no FOUC on initial load or navigation.

**Independent Test**: Click theme toggle in navbar → theme switches instantly. Close and reopen browser → theme persists. Clear localStorage + set OS to dark → dark theme on first visit. Navigate between pages → theme stays consistent.

### Implementation for User Story 2

- [X] T030 [US2] Verify `useTheme` composable works across all authenticated and guest pages — toggle in `Navbar.vue` updates `<html>` dark class reactively, `localStorage` read/write works, OS `prefers-color-scheme` detection works on first visit
- [X] T031 [US2] Verify FOUC prevention works — ensure the inline `<script>` in `resources/views/app.edge` reads localStorage and applies `.dark` class before Vue mounts, no flash of light theme on reload when dark is selected
- [X] T032 [US2] Verify theme persistence across Inertia page navigations — since `AuthenticatedLayout.vue` is persistent, theme state should survive navigation without re-mounting; verify sidebar, navbar, and page content all reflect the current theme

**Checkpoint**: Theme toggle works perfectly in the Inertia+Vue frontend — light/dark switching, persistence, OS detection, no FOUC.

---

## Phase 5: User Story 3 - Navegação sem recarregamento de página (Priority: P3)

**Goal**: All internal navigation happens via Inertia SPA navigation — no full page reload when clicking links, submitting forms, or redirecting after CRUD operations.

**Independent Test**: Click sidebar links, create/edit/delete buttons, form submissions, pagination — all should navigate without a full page reload (no white flash, no browser loading indicator). Browser back/forward buttons work correctly.

### Implementation for User Story 3

- [X] T033 [US3] Audit all Vue pages to confirm navigation uses Inertia `<Link>` instead of HTML `<a>` tags — verify Dashboard cards, Sidebar nav links, Navbar, show/edit/delete action links, back links, cancel links, create buttons all use `<Link>`
- [X] T034 [US3] Verify form submissions use Inertia `useForm()` — ensure create, update, delete, and login forms all use Inertia's form helper so redirects happen via SPA navigation, not full page reloads
- [X] T035 [US3] Verify browser back/forward buttons work correctly — after navigating between pages, use browser back/forward and confirm the correct page renders with correct props
- [X] T036 [US3] Verify error handling for failed requests — when a server error occurs, Inertia should display an error page or message gracefully, not crash the SPA

**Checkpoint**: SPA navigation is fully functional — all navigation uses Inertia, no full page reloads.

---

## Phase 6: Polish & Cleanup

**Purpose**: Remove legacy code, final validation

- [X] T037 Delete `resources/js/app.js` — replaced by `resources/js/app.ts` (Inertia entry point)
- [X] T038 [P] Delete all Edge templates except `resources/views/app.edge` — remove `resources/views/home.edge`, `resources/views/components/`, `resources/views/dashboard/`, `resources/views/users/`, `resources/views/profiles/`, `resources/views/auth/login.edge`
- [X] T039 Remove `edge.js` from `package.json` dependencies if no longer needed
- [X] T040 Update `resources/css/app.css` if needed — ensure Tailwind v4 dark mode `@custom-variant` still works with Vue components
- [X] T041 Run full verification checklist from `specs/004-inertia-vue-migration/quickstart.md` — verify all scenarios (login, CRUD, search, pagination, theme, RBAC, SPA navigation)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion
- **User Story 2 (Phase 4)**: Depends on US1 completion — theme toggle testing requires working Vue pages
- **User Story 3 (Phase 5)**: Depends on US1 completion — SPA navigation testing requires all pages migrated
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Can start after Foundational (Phase 2) — no dependencies on other stories
- **US2 (P2)**: Depends on US1 — theme toggle can only be verified after pages are migrated to Vue
- **US3 (P3)**: Depends on US1 — SPA navigation can only be verified after all pages use Inertia

### Within Each User Story

- Controllers must be migrated before their corresponding Vue pages can be tested
- Vue pages within US1 can be created in parallel (different files)
- US2 and US3 are primarily verification tasks — the implementation is in foundational + US1

### Parallel Opportunities

- T003 (Vite config) and T004 (TypeScript config) can run in parallel
- T011 (Icon), T014 (Pagination), T016 (GuestLayout) can run in parallel
- T018 (Login), T020 (Dashboard), T022-T024 (Users pages), T026-T028 (Profiles pages) can all run in parallel
- T038 (delete Edge templates) and T040 (verify CSS) can run in parallel

---

## Parallel Example: Phase 2

```bash
# After T005-T009 are done (middleware + config):
Task T010: "Create useTheme composable"
Task T011: "Create Icon.vue component"       # [P] — different file
Task T014: "Create Pagination.vue component" # [P] — different file

# After T010-T014 are done (composables + components):
Task T012: "Create Navbar.vue"               # depends on useTheme + Icon
Task T013: "Create Sidebar.vue"              # depends on Icon
Task T015: "Create AuthenticatedLayout.vue"  # depends on Sidebar + Navbar
Task T016: "Create GuestLayout.vue"          # [P] — independent layout
```

## Parallel Example: Phase 3 (US1)

```bash
# After controller migrations (T017, T019, T021, T025):
Task T018: "Create Login.vue page"
Task T020: "Create Dashboard/Index.vue page"
Task T022: "Create Users/Index.vue page"      # [P]
Task T023: "Create Users/Form.vue page"       # [P]
Task T024: "Create Users/Show.vue page"       # [P]
Task T026: "Create Profiles/Index.vue page"   # [P]
Task T027: "Create Profiles/Form.vue page"    # [P]
Task T028: "Create Profiles/Show.vue page"    # [P]
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T004)
2. Complete Phase 2: Foundational (T005–T016)
3. Complete Phase 3: User Story 1 (T017–T029)
4. **STOP and VALIDATE**: Test all CRUD operations, auth, RBAC, search, pagination
5. Deploy/demo if ready — core migration is functional

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → All pages migrated to Vue → **MVP!**
3. Verify User Story 2 → Theme toggle confirmed working
4. Verify User Story 3 → SPA navigation confirmed working
5. Polish + Cleanup → Remove legacy Edge templates

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- US1 is the heavy lift — all controller migrations + Vue page creation
- US2 and US3 are primarily verification since theme and SPA nav are built into the foundational work
- The `useTheme` composable replaces `window.toggleTheme` from `app.js`
- Inertia `<Link>` replaces all `<a href>` tags for internal navigation
- Inertia `useForm()` replaces HTML `<form>` submissions and handles CSRF automatically
- Controllers change from `view.render('template', data)` to `inertia.render('Component', data)` — same routes, different response format
- All Edge templates except `app.edge` (Inertia root template) will be deleted in Phase 6