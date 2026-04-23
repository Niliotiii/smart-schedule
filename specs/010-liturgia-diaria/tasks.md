# Tasks: Liturgia Diária no Dashboard

**Input**: Design documents from `/specs/010-liturgia-diaria/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No test tasks generated — tests were not explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install cache driver dependency and configure environment for Redis.

- [ ] T001 Install `ioredis` in `package.json` — `npm install ioredis` (add to dependencies, update lockfile)
- [ ] T002 [P] Append `REDIS_URL`/`REDIS_HOST`/`REDIS_PORT`/`REDIS_PASSWORD` placeholders to `.env.example`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T003 Create `providers/redis_provider.ts` — IoC singleton wrapping `new Redis(env.get('REDIS_URL'))` with graceful error handling
- [ ] T004 Register `() => import('#providers/redis_provider')` in `adonisrc.ts` providers array
- [ ] T005 [P] Create `resources/js/lib/liturgia.ts` — TypeScript DTOs: `LiturgiaData`, `Leitura`, `Oracoes`, `Leituras`, `Antifonas`, `LiturgicalColor`
- [ ] T006 Create `app/services/liturgia_diaria_service.ts` — `fetchToday()`, `fetchDate(dia, mes, ano)`, Redis `GET`/`SETEX` with key `liturgia:DD-MM-YYYY` TTL 86400, `AbortController` 3000ms, null on error
- [ ] T007 [P] Create `app/validators/liturgia_diaria.ts` — Vine.js object schema for optional `dia`, `mes`, `ano` (all required together if any provided; range: dia 1–31, mes 1–12, ano ≥ 1970)

**Checkpoint**: Foundation ready — Redis provider registers, service can fetch from API or cache, types compile, validators pass.

---

## Phase 3: User Story 1 — Visualizar Liturgia do Dia Atual (Priority: P1) 🎯 MVP

**Goal**: Display the liturgy card on the dashboard automatically showing today's liturgy.

**Independent Test**: Log in as admin, navigate to `/dashboard`. The Liturgia Card should render below quick-access cards with today's title, color indicator, saint summary, Gospel phrase, and accordion sections collapsed by default.

### Implementation for User Story 1

- [ ] T008 [US1] Update `app/controllers/dashboard_controller.ts` — inject `LiturgiaDiariaService`, call `fetchToday()`, pass `liturgia` prop to `inertia.render('Dashboard/Index', { liturgia })`
- [ ] T009 [P] [US1] Update `types/inertia.ts` — add `liturgia: LiturgiaData | null` to `InertiaPages['Dashboard/Index']`
- [ ] T010 [P] [US1] Create `resources/js/Pages/Liturgia/Card.vue` — layout: título + cor indicator + Calendar (default hoje) + resumo (santo, frase evangelho) + Accordion `:multiple="true"` for primeiraLeitura/salmo/evangelho, usando props `liturgia`
- [ ] T011 [US1] Update `resources/js/Pages/Dashboard/Index.vue` — import `Card` from `@/Pages/Liturgia/Card.vue`, render it below the quick-access cards grid

**Checkpoint**: User Story 1 should be fully functional — today's liturgy shows on dashboard, cache populated.

---

## Phase 4: User Story 2 — Selecionar Data Específica (Priority: P1)

**Goal**: Allow users to pick a custom date via the Calendar component, triggering a new API/cache lookup for that date.

**Independent Test**: Click the datepicker, choose a past or future date. The card updates with the new liturgy data. Check Redis with `GET liturgia:DD-MM-YYYY` and confirm TTL.

### Implementation for User Story 2

- [ ] T012 [US2] Update `app/controllers/dashboard_controller.ts` — read optional `dia`/`mes`/`ano` from `request.qs()`, validate via `liturgia_diaria.validator`, call `fetchDate()` instead of `fetchToday()` when params present; preserve selected date in `selectedDate` prop
- [ ] T013 [US2] Update `resources/js/Pages/Liturgia/Card.vue` — bind `Calendar` date to `selectedDate` prop, emit Inertia visit `router.get('/dashboard', { dia, mes, ano })` on date change; ensure current selection survives page reload

**Checkpoint**: User Stories 1 AND 2 should both work independently — today's data auto-loads, custom date loads and caches.

---

## Phase 5: User Story 3 — Visualizar Leituras em Seções Expansíveis (Priority: P2)

**Goal**: Confirm accordion sections open/close independently and render correct reading texts.

**Independent Test**: Expand “Primeira Leitura” — verify only that section opens, others remain collapsed. Expand “Evangelho” — both can stay open. Verify text matches the API response.

### Implementation for User Story 3

- [ ] T014 [US3] Verify `resources/js/Pages/Liturgia/Card.vue` — each `AccordionPanel` header is labeled correctly (Primeira Leitura, Salmo, Evangelho); content renders `leitura.tema`, `leitura.referencia`, `leitura.texto`; empty arrays hide the panel or show "Não há leitura para este dia". Validate `:multiple="true"` behavior.

**Checkpoint**: All accordion sections behave as specified; empty readings handled gracefully.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, type checks, and commit.

- [ ] T015 [P] Commit all changes with a single descriptive message
- [ ] T016 [P] Run `tsc --noEmit` and `tsc --noEmit --project resources/js/tsconfig.json` to ensure zero type errors
- [ ] T017 Manually validate quickstart.md scenarios 1–5

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — existing project
- **Foundational (Phase 2)**: Depends on Setup (ioredis installed)
  - T003 and T005 can run in parallel
  - T004 depends on T003 (provider file before registration)
  - T006 depends on T003 (provider must exist for service to use container)
  - T007 is independent
- **User Stories (Phase 3–5)**: All depend on Foundational phase completion
  - Phase 3 (US1): T008, T009, T010 can run in parallel; T011 depends on T010 (import Card.vue)
  - Phase 4 (US2): T012 and T013 are sequential (same Inertia flow)
  - Phase 5 (US3): T014 depends on T010 (Card.vue exists)
- **Polish (Phase 6)**: Depends on all user stories complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2)
- **User Story 2 (P1)**: Can start after US1 Card.vue exists (T010)
- **User Story 3 (P2)**: Can start after US1 Card.vue accordion structure exists (T010)

### Parallel Opportunities

- All Setup tasks T001–T002 marked [P] can run in parallel
- Foundational tasks T003 and T005 marked [P] can run in parallel
- US1 tasks T008 and T009, T010 can run in parallel (different files)
- Polish tasks T015 and T016 marked [P] can run in parallel

---

## Implementation Strategy

### MVP First (User Story 1)

1. Complete Phase 2: Foundational
2. Complete Phase 3: US1 — Visualizar liturgia do dia atual
3. **STOP and VALIDATE**: Verify card renders with today's data, cache populates
4. Continue to US2 (date picker) and US3 (accordions) for full feature scope

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 → MVP (today's liturgy displays) → Demo
3. Add US2 → Date selection works → Demo
4. Add US3 → Accordions verified → Demo
5. Each phase adds value without breaking previous phases

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify TypeScript compiles after each phase
- Commit after each phase or logical group
- Stop at any checkpoint to validate story independently
- No migration needed — data is volatile and stored only in Redis
- DashboardController already exists and returns `inertia.render('Dashboard/Index')`; just add the `liturgia` prop
- Card.vue uses `LiturgiaData | null` prop — null renders an empty/fallback state
