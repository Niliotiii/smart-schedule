# Implementation Tasks: Auth, RBAC & Dashboard

**Branch**: `002-auth-rbac-dashboard`
**Status**: Draft

## Implementation Strategy

This feature introduces the core frontend structure using Tailwind CSS and establishes the critical path for security (RBAC) and authentication.
The MVP encompasses the login, dashboard layout, and the RBAC groundwork.

- **Phase 1**: Frontend Infrastructure Setup (Tailwind, Vite, Icons).
- **Phase 2**: Database schema updates for RBAC & Seeding.
- **Phase 3**: User Story 1 (Auth & Layout).
- **Phase 4**: User Story 2 (RBAC Backend & Bouncer Integration).
- **Phase 5**: User Story 3 (Users & Profiles CRUD).
- **Phase 6**: Polish.

---

## Phase 1: Setup & Project Initialization

_Goal: Setup TailwindCSS, Vite and Icon structure._

- [x] T001 Initialize TailwindCSS via AdonisJS Vite plugin (`node ace configure tailwind`)
- [x] T002 Add `resources/css/app.css` to `vite.config.ts` if not already added
- [x] T003 Create `resources/views/components/icon.edge` to handle inline SVGs dynamically
- [x] T004 Create `resources/views/layouts/app.edge` containing the base HTML and Vite entrypoints

---

## Phase 2: Foundational/Blocking

_Goal: Establish the Data Model for RBAC._

- [x] T005 [P] Create migration for `profiles` table
- [x] T006 [P] Create migration for `permissions` table
- [x] T007 [P] Create migration for `profile_permissions` pivot table
- [x] T008 Update `users` table migration to include `profile_id` referencing `profiles` (and run migrations)
- [x] T009 Create Lucid Models: `Profile`, `Permission`
- [x] T010 Update `User` Model to add `belongsTo` Profile relationship
- [x] T011 Create `DatabaseSeeder` to populate initial `permissions` (e.g., users:read, users:create...) and the default Admin Profile

---

## Phase 3: User Story 1 - Authentication & Dashboard Access (Priority: P1)

_Goal: Login screen and responsive dashboard wrapper._
_Independent Test: Log in using valid credentials and be redirected to a responsive Dashboard with a Sidebar._

- [x] T012 [US1] Create `AuthController` to handle login (show login form and authenticate via Session)
- [x] T013 [US1] Create `DashboardController` mapped to `/dashboard` route
- [x] T014 [US1] Build `resources/views/auth/login.edge` (Tailwind styled login form)
- [x] T015 [US1] Build `resources/views/components/sidebar.edge` (Desktop fixed, Mobile hidden/hamburger logic)
- [x] T016 [US1] Build `resources/views/components/navbar.edge` (With hamburger trigger for mobile)
- [x] T017 [US1] Build `resources/views/dashboard/index.edge` using the `app.edge` layout, including sidebar and navbar
- [x] T018 [US1] Add routes for login (`GET /login`, `POST /login`), logout (`POST /logout`), and `/dashboard` (protected by auth middleware) in `start/routes.ts`

---

## Phase 4: User Story 2 - Role-Based Access Control (Priority: P1)

_Goal: Restrict actions based on the User's Profile Permissions._
_Independent Test: A user without permission 'users:read' does not see the 'Usuários' menu link and cannot access `/users`._

- [x] T019 [US2] Configure AdonisJS Bouncer to define abilities checking `user.profile.permissions` (ensure Profile/Permissions are eager-loaded or cached)
- [x] T020 [US2] Create a custom View Helper or global state in `start/view.ts` to easily check permissions inside `.edge` templates (e.g., `@can('users:read')`)
- [x] T021 [US2] Update `resources/views/components/sidebar.edge` to wrap menu links inside `@can` conditions

---

## Phase 5: User Story 3 - Users & Profiles Management (CRUD) (Priority: P2)

_Goal: Standardized CRUD interfaces for Users and Profiles._
_Independent Test: Admin can list profiles, create a new one, assign permissions, and see icons instead of text for actions._

- [x] T022 [US3] Create `resources/views/components/table.edge` and `resources/views/components/pagination.edge` for reuse
- [x] T023 [US3] Create `resources/views/components/action_button.edge` (Receives icon name and URL)
- [x] T024 [P] [US3] Create `ProfilesController` with `index`, `create`, `store`, `edit`, `update`, `destroy` methods
- [x] T025 [P] [US3] Create `UsersController` with `index`, `create`, `store`, `edit`, `update`, `destroy` methods
- [x] T026 [P] [US3] Build `resources/views/profiles/index.edge` and `resources/views/profiles/form.edge` (Includes checkboxes for Permissions)
- [x] T027 [P] [US3] Build `resources/views/users/index.edge` and `resources/views/users/form.edge` (Includes select for Profile)
- [x] T028 [US3] Map all CRUD routes in `start/routes.ts` wrapped by auth middleware and Bouncer checks

---

## Phase 6: Polish & Cross-Cutting Concerns

_Goal: Ensure UI consistency and test coverage._

- [x] T029 Refactor standard layout to guarantee Mobile Responsiveness (verify hamburger menu JS toggle)
- [x] T030 Add simple tests (Japa) in `tests/functional/` to assert that an unauthorized user receives 403/404 on restricted CRUD routes

---

## Dependencies

- Phase 2 (DB/Models) depends on Phase 1 (Project setup).
- Phase 3 (Auth/Dashboard) depends on Phase 2 (User table adjustments).
- Phase 4 (RBAC logic) depends on Phase 3 (Auth context).
- Phase 5 (CRUDs) depends on Phase 4 (Bouncer setup).
- Phase 6 (Polish) depends on Phase 5.

### Parallel Execution Examples

- Migrations (T005-T007) can be written in parallel.
- Controllers for Profiles and Users (T024, T025) and their respective Views (T026, T027) can be developed simultaneously by different agents/developers once the Base Layout and Components (Phase 1 and T022-T023) exist.
