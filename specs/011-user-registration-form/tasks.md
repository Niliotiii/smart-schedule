# Tasks: Cadastro Completo de Usuários

**Input**: Design documents from `specs/011-user-registration-form/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/interfaces.md, research.md, quickstart.md
**Branch**: `011-user-registration-form`

Tests are NOT explicitly requested in the specification; test tasks are omitted. Each story includes an Independent Test criterion for manual/exploratory validation.

---

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (`[US1]`, `[US2]`, `[US3]`, `[US4]`)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Ensure existing project dependencies and structure are ready for feature work.

- [x] T001 Verify existing AdonisJS monolith health (`npm run lint && npm run typecheck`) and confirm no uncommitted blockers on branch `011-user-registration-form`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Database schema expansion and shared backend contracts that ALL user stories depend on.

**⚠️ CRITICAL**: No user story implementation can begin until this phase is complete.

- [x] T002 [P] Create migration `database/migrations/17770_alter_users_table_add_personal_fields.ts` adding to `users`: `birth_date` (date, not null), `birth_country_id` (FK→countries, not null), `birth_state_id` (FK→states, not null), `birth_city_id` (FK→cities, not null), `phone` (varchar(20), not null), `responsible1_name` (varchar(255), nullable), `responsible1_phone` (varchar(20), nullable), `responsible2_name` (varchar(255), nullable), `responsible2_phone` (varchar(20), nullable), `include_in_scale` (boolean, not null, default false), `community_id` (FK→churches, nullable)
- [x] T003 [P] Update `app/models/user.ts` adding columns: `birthDate`, `birthCountryId`, `birthStateId`, `birthCityId`, `phone`, `responsible1Name`, `responsible1Phone`, `responsible2Name`, `responsible2Phone`, `includeInScale`, `communityId`; add `belongsTo` relations for birth Country/State/City; add `hasOne(() => Address)` polymorphic alias; add `hasMany(() => Sacrament)` relation; add `manyToMany(() => MinistryRole, { pivotTable: 'ministry_role_user' })` relation
- [x] T004 Update `app/validators/user.ts` — expand `createUserValidator` to include: `birthDate` (string regex `^\d{4}-\d{2}-\d{2}$`), `birthCountryId`, `birthStateId`, `birthCityId` (number positive), `phone` (string trim minLength 10 maxLength 20), `responsible1Name`, `responsible1Phone`, `responsible2Name`, `responsible2Phone` (optional), `includeInScale` (boolean), `communityId` (number positive optional), nested `address` object (optional, matching church address fields), nested `sacraments` array (optional), `ministryRoleIds` array (optional); update `updateUserValidator` similarly with `password`/`passwordConfirmation` optional
- [x] T005 Add `usersEditProfile` ability in `app/abilities/main.ts` mapping to permission string `profiles:update`
- [x] T006 Update `app/controllers/users_controller.ts` `store`/`update` methods to extract all new validated fields, persist User with expanded fields, and conditionally merge password only when provided in update

**Checkpoint**: Foundation ready — database schema, User model, validators, and base controller extraction support all stories.

---

## Phase 3: User Story 1 – Cadastrar Informações Gerais (Priority: P1) 🎯 MVP

**Goal**: Enable registration/editing of all general information fields (name, birth date, naturalidade, phone, guardians, profile/type, scale inclusion).

**Independent Test**: Create a new user filling ONLY the "Informações Gerais" tab; the record must be saved and retrievable via `Users/Show.vue` even though other tabs are empty.

- [x] T007 [P] [US1] Update `app/controllers/users_controller.ts` `create`/`edit` methods to preload and pass to Inertia: `countries`, `states`, `cities`, `profiles`, `userTypes`, and a `canEditProfile` boolean derived from `bouncer.authorize(usersEditProfile)` (wrap in try/catch or check without throwing)
- [x] T008 [P] [US1] Update `resources/js/Pages/Users/Form.vue` — add to existing "Informações Gerais" tab: `birthDate` (date input), `phone` (text input with formatting), naturalidade row with three `Select` components (`birthCountryId`, `birthStateId` filtered by country, `birthCityId` filtered by state), `responsible1Name`/`responsible1Phone`, `responsible2Name`/`responsible2Phone`
- [x] T009 [P] [US1] Update `resources/js/Pages/Users/Form.vue` — bind profile and userType selectors to form state; add `:disabled` prop to profile `Select` when `canEditProfile` is false
- [x] T010 [US1] Update `resources/js/Pages/Users/Form.vue` — add `includeInScale` boolean toggle (PrimeVue `ToggleSwitch` or `Checkbox`) to "Informações Gerais" tab
- [x] T011 [US1] Update `resources/js/Pages/Users/Show.vue` — display all new personal fields (birth date, phone, naturalidade as formatted text, responsible names/phones, includeInScale as Tag)
- [x] T012 [US1] Update `resources/js/Pages/Users/Index.vue` — add `phone` column to data table if space permits

**Checkpoint**: User Story 1 fully functional and independently testable.

---

## Phase 4: User Story 2 – Vincular Endereço ao Usuário (Priority: P2)

**Goal**: Allow users to have an address stored via the existing polymorphic `addresses` table, reusing the exact pattern from Church.

**Independent Test**: Open edit on a user created in US1, fill only the "Endereço" tab with CEP lookup, save, and verify the address is displayed on `Users/Show.vue`.

- [x] T013 [US2] Update `app/controllers/users_controller.ts` `store`/`update` to check for nested `address` in validated payload; create or update `Address` record with `addressable_type = 'users'` and `addressable_id = user.id`
- [x] T014 [US2] Update `app/controllers/users_controller.ts` `edit` method to preload the user's existing Address (if any) and include its flattened fields (`postalCode`, `countryId`, `stateId`, `cityId`, `neighborhood`, `street`, `number`, `complement`) in the `user` prop passed to Inertia
- [x] T015 [US2] Update `resources/js/Pages/Users/Form.vue` — add "Endereço" tab mirroring `Churches/Form.vue`: CEP input with auto-lookup via `/churches/lookup-cep`, country/state/city cascading selects, neighborhood/street/number/complement text inputs
- [x] T016 [US2] Update `resources/js/Pages/Users/Show.vue` — display user address block below personal info, formatted as "Rua, Número — Bairro, Cidade/UF, CEP"

**Checkpoint**: User Stories 1 and 2 both independently functional.

---

## Phase 5: User Story 3 – Associar Comunidade e Sacramentos ao Usuário (Priority: P2)

**Goal**: Enable community selection and dynamic addition of sacrament records (type, date, church, location) per user.

**Independent Test**: Create a user with only "Informações Gerais" partially filled, then add a community and one sacrament (Batismo) via the "Sacramentos" tab, save, and verify on `Users/Show.vue`.

- [x] T017 [P] [US3] Create migration `database/migrations/17771_create_sacrament_types_table.ts` with `id`, `name` (varchar(100), not null), `description` (text, nullable), `created_at`, `updated_at`
- [x] T018 [P] [US3] Create seeder `database/seeders/sacrament_type_seeder.ts` inserting: Batismo, Primeira Eucaristia, Crisma
- [x] T019 [P] [US3] Create migration `database/migrations/17772_create_sacraments_table.ts` with `id`, `user_id` (FK→users, not null), `sacrament_type_id` (FK→sacrament_types, not null), `received_date` (date, not null), `received_church` (varchar(255), not null), `received_country_id` (FK→countries, not null), `received_state_id` (FK→states, not null), `received_city_id` (FK→cities, not null), `created_at`, `updated_at`, `deleted_at` (nullable, soft-delete)
- [x] T020 [P] [US3] Create `app/models/sacrament_type.ts` extending BaseModel with columns `id`, `name`, `description`, `createdAt`, `updatedAt`
- [x] T021 [P] [US3] Create `app/models/sacrament.ts` extending BaseModel with columns `userId`, `sacramentTypeId`, `receivedDate`, `receivedChurch`, `receivedCountryId`, `receivedStateId`, `receivedCityId`, `createdAt`, `updatedAt`, `deletedAt`; add `belongsTo(() => SacramentType)` and `belongsTo` for Country/State/City relations; implement soft-delete pattern (delete/restore methods)
- [x] T022 [US3] Update `app/controllers/users_controller.ts` `store`/`update` to: if `sacraments` array is present, delete existing user's sacraments (or sync) and create new Sacrament records with `userId`; handle create vs update logic for sacrament rows
- [x] T023 [US3] Update `app/controllers/users_controller.ts` `create`/`edit` methods to pass `sacramentTypes` list to the Inertia props
- [x] T024 [US3] Update `resources/js/Pages/Users/Form.vue` — add "Sacramentos" tab containing: community selector (`communityId` using churches data), a dynamic list of sacrament rows; each row has `sacramentTypeId` (Select), `receivedDate` (date input), `receivedChurch` (text), and received location (`receivedCountryId`, `receivedStateId`, `receivedCityId` cascading selects); include Add/Remove row buttons
- [x] T025 [US3] Update `resources/js/Pages/Users/Show.vue` — display community name and a list/table of sacraments with type, date, church, and location

**Checkpoint**: User Stories 1, 2, and 3 independently functional.

---

## Phase 6: User Story 4 – Cadastrar Funções Desempenháveis pelo Usuário (Priority: P3)

**Goal**: Assign N:N ministry roles to users via a multi-select interface.

**Independent Test**: Edit a user and select multiple ministry roles in the "Funções" tab without touching other tabs; save and verify the assigned roles appear on `Users/Show.vue`.

- [x] T026 Create migration `database/migrations/17773_create_ministry_role_user_table.ts` with `id`, `user_id` (FK→users, not null), `ministry_role_id` (FK→ministry_roles, not null), `created_at`, `updated_at`; add composite unique index on (`user_id`, `ministry_role_id`)
- [x] T027 [P] [US4] Update `app/models/ministry_role.ts` adding `manyToMany(() => User, { pivotTable: 'ministry_role_user' })` relation
- [x] T028 [US4] Update `app/models/user.ts` confirming `manyToMany(() => MinistryRole, { pivotTable: 'ministry_role_user', pivotTimestamps: true })` relation is correctly declared
- [x] T029 [US4] Update `app/controllers/users_controller.ts` `store`/`update` to sync user's ministry roles using `user.related('ministryRoles').sync(ministryRoleIds)` when `ministryRoleIds` array is present in validated payload
- [x] T030 [US4] Update `app/controllers/users_controller.ts` `create`/`edit` methods to pass `ministryRoles` list to the Inertia props
- [x] T031 [US4] Update `app/controllers/users_controller.ts` `show` and `edit` methods to preload `ministryRoles` relation on the user
- [x] T032 [US4] Update `resources/js/Pages/Users/Form.vue` — add "Funções" tab with PrimeVue `MultiSelect` (or equivalent) bound to `ministryRoleIds`, showing ministry role names with descriptions
- [x] T033 [US4] Update `resources/js/Pages/Users/Show.vue` — display assigned ministry roles as a row of Tags

**Checkpoint**: All four user stories independently functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validation, cleanup, and consistency across all user stories.

- [x] T034 [P] Update `app/controllers/users_controller.ts` `show` method to preload all relations needed for display: `profile`, `userType`, `birthCountry`, `birthState`, `birthCity`, `address.country`, `address.state`, `address.city`, `sacraments.sacramentType`, `sacraments.receivedCountry`, `ministryRoles`, `community`
- [x] T035 [P] Update `app/controllers/users_controller.ts` `index` method to preload `profile` and `userType` (already done); optionally include `phone` in the response payload for listing
- [x] T036 [P] Ensure `resources/js/Pages/Users/Form.vue` save button is accessible from any active tab (move submit button outside `TabView` or add a persistent submit bar)
- [x] T037 [P] Run full validation: `npm run lint`, `npm run typecheck`, and `node ace migration:run` followed by `node ace db:seed` — confirm no errors
- [x] T038 Validate against quickstart.md walkthrough: create user → add address → add sacrament → assign roles → view Show page → verify all data persisted correctly

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on Phase 1. BLOCKS all user stories. Must include: users table migration + User model + validators + controller base extraction
- **User Story 1 (Phase 3)**: Depends on Phase 2. No dependencies on other stories. MVP scope.
- **User Story 2 (Phase 4)**: Depends on Phase 2 and US1 (shares the same form/component). Address model/table already exists from Church feature.
- **User Story 3 (Phase 5)**: Depends on Phase 2. Can run in parallel with US2 if staffed. Requires new tables (sacrament_types, sacraments).
- **User Story 4 (Phase 6)**: Depends on Phase 2. Can run in parallel with US2/US3 if staffed. Requires new pivot table.
- **Polish (Phase 7)**: Depends on Phases 3–6 completion.

### User Story Dependencies

- **US1 (P1)**: Can start immediately after Foundational. Independent.
- **US2 (P2)**: Can start after Foundational + US1 (same form component). Address backend is standalone.
- **US3 (P2)**: Can start after Foundational. Independent of US2, but shares the same Form.vue component.
- **US4 (P3)**: Can start after Foundational. Independent of US2/US3, but shares the same Form.vue component.

### Within Each User Story

- Models before controllers
- Controllers before Vue form tab updates
- Core tab implementation before Show.vue display updates

### Parallel Opportunities

- Within Foundational: T002, T005 can run in parallel with T003, T004 (different files)
- Within US1: T007 and T008 can run in parallel
- Within US3: T017, T018, T019, T020, T021 can run in parallel (different files, no cross-dependencies)
- Once Foundational is done, US1, US2 backend, US3 backend, and US4 backend can be developed in parallel by different developers; frontend Form.vue merges happen at the end or through coordination

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL)
3. Complete Phase 3: User Story 1 (Informações Gerais)
4. **STOP and VALIDATE**: Create/edit user with general info only; confirm Show and Index work
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational
2. Add US1 → Test independently → Deploy/Demo (MVP!)
3. Add US2 → Test independently (address save/lookup)
4. Add US3 → Test independently (sacraments create/update)
5. Add US4 → Test independently (roles assignment)
6. Polish → Full end-to-end validation

### Parallel Team Strategy

With multiple developers after Foundational is complete:

- Developer A: US1 frontend (Informações Gerais tab + Show.vue updates)
- Developer B: US2 (Address integration — backend + frontend tab)
- Developer C: US3 (Sacraments — migrations, models, backend, frontend tab)
- Developer D: US4 (Ministry roles — migration, model relation, backend, frontend tab)

All merge through the shared `Users/Form.vue`; coordination needed on form state schema and tab ordering.

---

## Notes

- `[P]` tasks = different files, no dependencies
- All new tables follow the existing soft-delete pattern (`deleted_at` nullable)
- The Address reuse means no new Address model or migration is needed for US2
- Form validation is global: the `createUserValidator`/`updateUserValidator` are defined in Foundational with all fields as optional nested objects; each story then implements its own section in the form UI
- CEP lookup endpoint `/churches/lookup-cep` is already available and reused for User address
