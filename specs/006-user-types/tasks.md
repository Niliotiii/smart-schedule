# Tasks: User Types

**Input**: Design documents from `/specs/006-user-types/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Not explicitly requested — test tasks are excluded.

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- File paths are relative to project root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Database schema and model foundation for user types

- [x] T001 Create migration for user_types table in database/migrations/XXXX_create_user_types_table.ts — fields: id (increments), name (string, notNullable, unique), created_at (timestamp), updated_at (timestamp)
- [x] T002 Create migration to add user_type_id column to users table in database/migrations/XXXX_add_user_type_id_to_users_table.ts — nullable integer FK referencing user_types.id ON DELETE SET NULL
- [x] T003 [P] Create UserType model in app/models/user_type.ts — fields: id, name, createdAt, updatedAt; relationship: hasMany(() => User)
- [x] T004 Update User model in app/models/user.ts — add userTypeId column, add belongsTo(() => UserType) relationship, add userType preload in existing query patterns

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Authorization, routing, and validation that all user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Add Bouncer abilities for user_types in app/abilities/main.ts — userTypesRead (user_types:read), userTypesCreate (user_types:create), userTypesUpdate (user_types:update), userTypesDelete (user_types:delete) following existing checkPermission pattern
- [x] T006 Create user type validators in app/validators/user_type.ts — createUserTypeValidator: name (string, required, maxLength(100), unique table:user_types column:name); updateUserTypeValidator: name (same rules, excluding self on update)
- [x] T007 Register user-types resource route in start/routes.ts — router.resource('user-types', UserTypesController) inside authenticated group, add lazy import for UserTypesController
- [x] T008 Update database seeder in database/seeders/database_seeder.ts — add 'user_types' to MODULES array, add 'tipos de usuário' to moduleLabel map

**Checkpoint**: Foundation ready — model, migration, abilities, validators, routes, and seeds are in place

---

## Phase 3: User Story 1 - Manage User Types (Priority: P1) 🎯 MVP

**Goal**: Administrators can create, view, update, and delete user types through a management interface

**Independent Test**: Create, edit, and delete user types through the UI; verify they persist in the list

### Implementation for User Story 1

- [x] T009 [US1] Create UserTypesController in app/controllers/user_types_controller.ts — implement all 7 CRUD actions (index, create, store, show, edit, update, destroy) following ProfilesController pattern: Bouncer authorization, Vine validation, Inertia rendering, paginated query with search, preloading users relation on show, flash messages in Portuguese
- [x] T010 [P] [US1] Create UserTypes/Index.vue in resources/js/Pages/UserTypes/Index.vue — PrimeVue DataTable with columns (name, usersCount), search IconField, Toolbar with "Novo" button, pagination, row actions (show, edit, delete) matching Profiles/Index.vue pattern
- [x] T011 [P] [US1] Create UserTypes/Form.vue in resources/js/Pages/UserTypes/Form.vue — PrimeVue InputText for name, Button submit/cancel, form layout matching Profiles/Form.vue pattern; handle both create (userType null) and edit (userType object) modes
- [x] T012 [P] [US1] Create UserTypes/Show.vue in resources/js/Pages/UserTypes/Show.vue — PrimeVue Card displaying type name, list of assigned users, createdAt; edit/delete action buttons matching Profiles/Show.vue pattern
- [x] T013 [US1] Add "Tipos de Usuário" menu item to AppMenu.vue in resources/js/Components/AppMenu.vue — route to /user-types, PrimeIcon pi pi-users or pi pi-tag, visible to users with userTypes:read ability

**Checkpoint**: User Story 1 complete — full CRUD for user types works independently

---

## Phase 4: User Story 2 - Assign User Type to Users (Priority: P2)

**Goal**: Administrators can select a user type when creating or editing a user

**Independent Test**: Create/edit a user and select a type from the dropdown; verify the assignment persists

### Implementation for User Story 2

- [x] T014 [US2] Update UsersController.create in app/controllers/users_controller.ts — preload user types via UserType.all() and pass as userTypes prop array [{id, name}] alongside profiles
- [x] T015 [US2] Update UsersController.edit in app/controllers/users_controller.ts — same as create: preload user types and pass as userTypes prop
- [x] T016 [US2] Update UsersController.store in app/controllers/users_controller.ts — add userTypeId to destructured validated data from createUserValidator, pass to User.create
- [x] T017 [US2] Update UsersController.update in app/controllers/users_controller.ts — add userTypeId to destructured validated data from updateUserValidator, pass to user.merge
- [x] T018 [US2] Add userTypeId to validators in app/validators/user.ts — add userTypeId: vine.number().nullable().optional() to both createUserValidator and updateUserValidator
- [x] T019 [US2] Update Users/Form.vue in resources/js/Pages/Users/Form.vue — add PrimeVue Select dropdown for userTypeId, prepopulated from userTypes prop, with empty/nullable option, placed below profile dropdown

**Checkpoint**: User Story 2 complete — users can be assigned a type during create/edit

---

## Phase 5: User Story 3 - View User Type on User Details (Priority: P3)

**Goal**: The assigned user type is visible on the user list and detail pages

**Independent Test**: View user list and detail pages; confirm user type is displayed for assigned users and absent for unassigned users

### Implementation for User Story 3

- [x] T020 [US3] Update UsersController.index in app/controllers/users_controller.ts — add preload('userType') to the query, include userType in the serialized user objects
- [x] T021 [US3] Update UsersController.show in app/controllers/users_controller.ts — add preload('userType') to the query, include userType in the serialized userToShow object
- [x] T022 [P] [US3] Update Users/Index.vue in resources/js/Pages/Users/Index.vue — add "Tipo" column to DataTable showing user.userType?.name or empty, add userType to serialization in controller
- [x] T023 [P] [US3] Update Users/Show.vue in resources/js/Pages/Users/Show.vue — display userType name in user detail Card, show "—" or empty when no type assigned

**Checkpoint**: User Story 3 complete — user type is visible on list and detail pages

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Data integrity, consistency, and final cleanup

- [x] T024 Run migrations with node ace migration:run and verify user_types table and users.user_type_id column are created
- [x] T025 Run seeder with node ace db:seed and verify user_types permissions are created and assigned to admin profile
- [x] T026 Verify onDelete SET NULL behavior — create a user type, assign to users, delete the type, confirm users have user_type_id set to null

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup (Phase 1)
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2)
- **User Story 2 (Phase 4)**: Depends on Foundational (Phase 2) + User model changes from Setup (Phase 1)
- **User Story 3 (Phase 5)**: Depends on User Story 2 (Phase 4) for the userTypeId field to exist
- **Polish (Phase 6)**: Depends on all user stories being complete

### Within Each Phase

- Setup migrations (T001, T002) should run first in Phase 1
- Models (T003, T004) can be parallel after migrations
- Foundational tasks (T005-T008) are all parallelizable
- Implementation tasks within US1 (T010, T011, T012) are parallel; T009 and T013 depend on controller existing
- Implementation tasks within US2: T014-T018 are backend, T019 is frontend — backend first
- Implementation tasks within US3: T020-T021 are backend, T022-T023 are parallel frontend

### Parallel Opportunities

- T001, T002: Both migrations (sequential by AdonisJS but independent logically)
- T003, T004: Both models (different files — can be parallel)
- T005, T006, T007, T008: All foundational (different files — fully parallel)
- T010, T011, T012: All page components (different files — fully parallel)
- T022, T023: Both view updates (different files — fully parallel)

---

## Parallel Example: User Story 1

```bash
# After T009 (controller) is done, launch all page components together:
Task: "Create UserTypes/Index.vue in resources/js/Pages/UserTypes/Index.vue"
Task: "Create UserTypes/Form.vue in resources/js/Pages/UserTypes/Form.vue"
Task: "Create UserTypes/Show.vue in resources/js/Pages/UserTypes/Show.vue"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (migrations, model)
2. Complete Phase 2: Foundational (abilities, validators, routes, seeder)
3. Complete Phase 3: User Story 1 (CRUD pages for user types)
4. **STOP and VALIDATE**: Create, edit, delete user types through UI
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test assigning types to users → Deploy/Demo
4. Add User Story 3 → Test viewing types on user pages → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Phase 1 + Phase 2 together
2. Once foundational is done:
   - Developer A: User Story 1 (user types CRUD)
   - Developer B: User Story 2 (user form integration) — can start backend after Phase 1
   - Developer C: User Story 3 (display on user pages) — waits for US2

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Migrations are auto-numbered by AdonisJS (node ace make:migration)
- Flash messages should be in Portuguese to match existing patterns
- The seeder pattern reuses the existing MODULES/ACTIONS loop — just add 'user_types'
- deleteUserType validates unique name via Vine, onDelete SET NULL in migration handles user cleanup
