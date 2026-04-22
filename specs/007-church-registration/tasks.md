---
description: 'Task list for Church Registration feature implementation'
---

# Tasks: Church Registration

**Feature**: 007-church-registration  
**Input**: Design documents from `specs/007-church-registration/`  
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/churches-api.md, research.md, quickstart.md  

**Tests**: The user stories below do not include automated test tasks. If TDD is desired, add contract and integration test tasks before each implementation phase.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup & Cross-Cutting Concerns

**Purpose**: Add soft delete to existing entities and prepare cross-cutting infrastructure.

- [ ] T001 [P] Create migration to add `deleted_at` to `users` table in `database/migrations/XXX_add_deleted_at_to_users_table.ts`
- [ ] T002 [P] Create migration to add `deleted_at` to `profiles` table in `database/migrations/XXX_add_deleted_at_to_profiles_table.ts`
- [ ] T003 [P] Create migration to add `deleted_at` to `user_types` table in `database/migrations/XXX_add_deleted_at_to_user_types_table.ts`
- [ ] T004 [P] Add soft delete handling to `User` model in `app/models/user.ts`
- [ ] T005 [P] Add soft delete handling to `Profile` model in `app/models/profile.ts`
- [ ] T006 [P] Add soft delete handling to `UserType` model in `app/models/user_type.ts`
- [ ] T007 [P] Update `UsersController` destroy action to soft delete in `app/controllers/users_controller.ts`
- [ ] T008 [P] Update `ProfilesController` destroy action to soft delete in `app/controllers/profiles_controller.ts`
- [ ] T009 [P] Update `UserTypesController` destroy action to soft delete in `app/controllers/user_types_controller.ts`

**Checkpoint**: Existing entities support soft delete at the migration and controller level.

---

## Phase 2: Foundational — Reference Data & Domain Models

**Purpose**: Create reference data tables, seed them with IBGE data, and build the new domain models. All subsequent user stories depend on this phase.

- [ ] T010 [P] Create `database/data/countries.ts` with ~250 country rows
- [ ] T011 [P] Create `database/data/states.ts` with 27 Brazilian IBGE states
- [ ] T012 Create `database/data/cities.ts` with ~5,557 IBGE cities (chunked for `multiInsert`)
- [ ] T013 [P] Create migration for `countries` table in `database/migrations/XXX_create_countries_table.ts`
- [ ] T014 [P] Create migration for `states` table in `database/migrations/XXX_create_states_table.ts`
- [ ] T015 [P] Create migration for `cities` table in `database/migrations/XXX_create_cities_table.ts`
- [ ] T016 [P] Create migration for `addresses` table in `database/migrations/XXX_create_addresses_table.ts`
- [ ] T017 [P] Create migration for `churches` table in `database/migrations/XXX_create_churches_table.ts`
- [ ] T018 [P] Create `Country` model in `app/models/country.ts`
- [ ] T019 [P] Create `State` model in `app/models/state.ts`
- [ ] T020 [P] Create `City` model in `app/models/city.ts`
- [ ] T021 [P] Create `Address` model with polymorphic `morphTo`/`morphOne` relations in `app/models/address.ts`
- [ ] T022 [P] Create `Church` model with `morphOne` address relation in `app/models/church.ts`
- [ ] T023 [P] Create `database/seeders/country_seeder.ts`
- [ ] T024 [P] Create `database/seeders/state_seeder.ts`
- [ ] T025 Create `database/seeders/city_seeder.ts` using `db.insertQuery().multiInsert` for performance
- [ ] T026 Run migrations and seeders; verify countries, states, and cities are populated

**Checkpoint**: Reference data exists in the database; all new domain models are defined.

---

## Phase 3: User Story 1 — Register a New Church (Priority: P1) MVP

**Goal**: Administrators can register a new church through a dedicated form with basic address fields. The church appears in a searchable list.

**Independent Test**: Navigate to `/churches`, click "Nova Igreja", fill out the Info and Endereco tabs manually, save, and verify the record appears in the list. All required validations fire correctly.

- [ ] T027 [P] [US1] Create nested church validators (create/update) in `app/validators/church.ts`
- [ ] T028 [P] [US1] Create `ChurchesController` with full CRUD (index, create, store, show, edit, update, destroy) in `app/controllers/churches_controller.ts`
- [ ] T029 [P] [US1] Add churches resource routes + `/churches/lookup-cep` route in `start/routes.ts`
- [ ] T030 [P] [US1] Add `churchesRead`, `churchesCreate`, `churchesUpdate`, `churchesDelete` abilities in `app/abilities/main.ts`
- [ ] T031 [P] [US1] Create `database/seeders/church_permissions_seeder.ts` with churches CRUD permissions + attach to admin profiles
- [ ] T032 [P] [US1] Create `resources/js/Pages/Churches/Index.vue` with DataTable, search, and pagination
- [ ] T033 [P] [US1] Create `resources/js/Pages/Churches/Form.vue` with PrimeVue TabView (Info + Endereco), cascading state→city Selects, and manual address entry
- [ ] T034 [P] [US1] Create `resources/js/Pages/Churches/Show.vue` with church detail and address display
- [ ] T035 [P] [US1] Update `resources/js/Components/AppMenu.vue` with "Igrejas" navigation item

**Checkpoint**: User Story 1 is fully functional and testable independently. Church CRUD works end-to-end.

---

## Phase 4: User Story 2 — Auto-complete Address via CEP (Priority: P1)

**Goal**: When a valid Brazilian CEP is entered in the church form, address fields are auto-populated. Fallback service ensures high availability.

**Independent Test**: Enter a known CEP (e.g., `01001-000`) in the form; street, neighborhood, city, and state auto-fill without manual typing. Invalid CEP shows a clear message.

- [ ] T036 [P] [US2] Create `CepLookupService` with ViaCEP primary + Correios ConectaGov fallback in `app/services/cep_lookup_service.ts`
- [ ] T037 [P] [US2] Implement ChurchesController `lookupCep` action in `app/controllers/churches_controller.ts`
- [ ] T038 [US2] Wire CEP auto-fill and error fallback in `resources/js/Pages/Churches/Form.vue` (call `/churches/lookup-cep`, populate fields, allow manual override)

**Checkpoint**: User Stories 1 and 2 work together. CEP lookup reduces manual address entry significantly.

---

## Phase 5: User Story 3 — Geolocation via OpenStreetMap (Priority: P2)

**Goal**: After a church address is saved, latitude and longitude are resolved via Nominatim and stored on the Address record.

**Independent Test**: Save a church with a complete Brazilian address; verify `latitude` and `longitude` are populated in the `addresses` table. Unresolvable addresses leave lat/lng null without blocking the save.

- [ ] T039 [P] [US3] Create `GeocodingService` with Nominatim integration + 1 req/sec rate limit in `app/services/geocoding_service.ts`
- [ ] T040 [US3] Wire `GeocodingService` into ChurchesController `store` and `update` actions in `app/controllers/churches_controller.ts`
- [ ] T041 [US3] Display lat/lng and OpenStreetMap attribution in `resources/js/Pages/Churches/Show.vue`

**Checkpoint**: All three user stories are functional. Churches can be registered with CEP auto-fill and optional geolocation.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate correctness, prevent regressions, and finalize the feature.

- [ ] T042 [P] Verify all controller destroy actions perform soft delete (users, profiles, user_types, churches)
- [ ] T043 [P] Run existing backend tests and ensure none regress
- [ ] T044 [P] Verify `quickstart.md` integration steps end-to-end (migrations, seeders, navigation, CRUD)
- [ ] T045 [P] Verify CEP lookup JSON contract matches `specs/007-church-registration/contracts/churches-api.md`
- [ ] T046 [P] Code cleanup: remove debug logs, ensure consistent naming, verify type imports

**Checkpoint**: Feature is complete, tested, and ready for merge.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — new table migrations can be written in parallel with soft delete migrations, but all must run before seeding
- **User Story 1 (Phase 3)**: Depends on Foundational phase — form dropdowns need seeded countries/states/cities
- **User Story 2 (Phase 4)**: Depends on User Story 1 — CEP auto-fill wires into the existing Form.vue
- **User Story 3 (Phase 5)**: Depends on User Story 1 — geocoding hooks into existing store/update actions
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2). No dependencies on other stories.
- **User Story 2 (P1)**: Can start after User Story 1. Requires the Form.vue and controller from US1.
- **User Story 3 (P2)**: Can start after User Story 1. Requires the controller store/update from US1.
- User Stories 2 and 3 can be developed in parallel once User Story 1 is complete.

### Within Each User Story

- Validators before Controller
- Controller before Routes
- Routes before Frontend pages
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks (T001–T009) can run in parallel (different controllers/models/migrations)
- All Foundational data file creation (T010–T012) can run in parallel
- All Foundational migrations (T013–T017) can run in parallel
- All Foundational models (T018–T022) can run in parallel
- All Foundational seeders (T023–T025) can run in parallel
- Within US1: validators, abilities, seeder, frontend pages, and menu update are all independent (T027–T035)
- Within US2: CepLookupService and controller lookupCep are independent (T036–T037)
- US2 and US3 can proceed in parallel once US1 is complete

---

## Parallel Example: User Story 1

```bash
# Launch all backend scaffolding tasks for US1 together:
Task: "Create church validators in app/validators/church.ts"
Task: "Add churches Bouncer abilities in app/abilities/main.ts"
Task: "Create church permissions seeder in database/seeders/church_permissions_seeder.ts"

# Launch all frontend page tasks for US1 together:
Task: "Create Churches/Index.vue in resources/js/Pages/Churches/Index.vue"
Task: "Create Churches/Form.vue in resources/js/Pages/Churches/Form.vue"
Task: "Create Churches/Show.vue in resources/js/Pages/Churches/Show.vue"
Task: "Update AppMenu.vue with Igrejas nav item"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup — soft delete migrations for existing tables
2. Complete Phase 2: Foundational — reference data tables, models, seeders
3. Complete Phase 3: User Story 1 — full Church CRUD with manual address entry
4. **STOP and VALIDATE**: Test Church registration end-to-end independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Reference data is seeded, all models exist
2. Add User Story 1 → Church CRUD with manual address entry → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → CEP auto-fill on the form → Test independently
4. Add User Story 3 → Geolocation on save → Test independently
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: Phase 3 — User Story 1 (Church CRUD)
   - Developer B: Phase 4 — User Story 2 (CEP auto-fill)
   - Developer C: Phase 5 — User Story 3 (Geolocation)
3. Stories complete and integrate independently once US1 foundation is ready

---

## Task Summary

| Phase                  | Task Count | Key Deliverables                                      |
| ---------------------- | ---------- | ----------------------------------------------------- |
| Phase 1: Setup         | 9          | Soft delete migrations + model updates for existing tables |
| Phase 2: Foundational  | 17         | Reference data files, 5 new migrations, 5 new models, 3 seeders |
| Phase 3: US1 (MVP)     | 9          | Church validators, controller, routes, abilities, 3 Vue pages, menu |
| Phase 4: US2 (CEP)     | 3          | CepLookupService, lookupCep endpoint, frontend wireup |
| Phase 5: US3 (Geocode) | 3          | GeocodingService, controller integration, lat/lng display |
| Phase 6: Polish        | 5          | Verification, regression tests, cleanup               |
| **Total**              | **46**     |                                                       |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each phase or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Soft delete is manual (Lucid 22.4.2 has no built-in SoftDeletes); see `research.md` Decision 8 for implementation pattern
- CEP lookup and Geocoding services use native `fetch()`; see `research.md` for constraints
