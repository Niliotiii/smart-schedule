# Tasks: form-validation-feedback

**Input**: Design documents from `/specs/012-form-validation-feedback/`
**Prerequisites**: plan.md, spec.md, data-model.md, research.md, quickstart.md

**Tests**: NOT requested (spec does not ask for TDD or automated tests).

**Organization**: Tasks grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure — minimal for a frontend-only refactor.

- [X] T001 Verify project runs and HMR works at `npm run dev`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core composable and wrapper components that MUST be complete before ANY user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T002 Create `resources/js/Composables/useFormValidation.ts` — composable that watches `form.errors`, computes `tabsWithErrors` from tabMap, and exposes `getFieldError`, `hasTabError`, `clearErrors`
- [X] T003 Create `resources/js/Components/FormField.vue` — wrapper component with `field`/`label`/`required` props, renders `<FloatLabel>` + input slot + `<Message severity="error">` below. Uses inject to read from `useFormValidation`.
- [X] T004 Create `resources/js/Components/TabPanelError.vue` — wrapper around PrimeVue `<TabPanel>` that receives `tabIndex` and `header` props, injects `tabsWithErrors`, and applies red highlight to header when tab contains errors.
- [X] T005 Add `provide` call in `resources/js/Layouts/AuthenticatedLayout.vue` (or create a `FormValidationProvider.vue` wrapper) to make `formValidation` state available via inject to deeply nested fields and tabs
- [X] T006 Verify new components render correctly in a test page (e.g., quick inline usage in `resources/js/Pages/Dashboard/Index.vue` or a temporary test route)

**Checkpoint**: Foundation ready — composable and both wrapper components render without errors; `useFormValidation` correctly detects errors and tab indexes.

---

## Phase 3: User Story 1 — Destacar Campos Obrigatórios Não Preenchidos (Priority: P1) 🎯 MVP

**Goal**: Submitting a form with missing required fields highlights the empty fields in red and displays error messages below each one.

**Independent Test**: Visit `Users/Form.vue`, leave all required fields empty, click Salvar. Verify all required fields show red borders and `<Message severity="error">` below each. Then correct one field and verify its error disappears.

### Implementation for User Story 1

- [X] T007 [US1] Refactor `resources/js/Pages/Users/Form.vue` — replace manual `:invalid="!!form.errors.xxx"` + `<Message v-if="form.errors.xxx">` with `<FormField>` for all required fields inside each `<TabPanelError>`. Define `tabMap` in script section.
- [X] T008 [P] [US1] Refactor `resources/js/Pages/Churches/Form.vue` — same pattern as T007 (fields + tabMap + TabPanelError wrapper)
- [X] T009 [P] [US1] Refactor `resources/js/Pages/Priests/Form.vue` — use `<FormField>` for all required fields (no tabs in this form, so only FormField)
- [X] T010 [P] [US1] Refactor `resources/js/Pages/Profiles/Form.vue` — use `<FormField>` for all required fields (no tabs)
- [X] T011 [P] [US1] Refactor `resources/js/Pages/MinistryRoles/Form.vue` — use `<FormField>` for all required fields (no tabs)
- [X] T012 [P] [US1] Refactor `resources/js/Pages/UserTypes/Form.vue` — use `<FormField>` for all required fields (no tabs)
- [X] T013 [P] [US1] Refactor `resources/js/Pages/Auth/Login.vue` — use `<FormField>` for email and password fields (no tabs)

**Checkpoint**: At this point, submitting any existing form with empty required fields should show red borders + error messages. User Story 1 is independently testable.

---

## Phase 4: User Story 2 — Indicar Erros de Validação em Campos Preenchidos (Priority: P1)

**Goal**: Fields filled with invalid values (e.g., wrong email format, invalid CPF, out-of-range date) show red highlight and a specific error message when submitting.

**Independent Test**: Visit `Users/Form.vue`, fill email with "invalid-email", leave a required field empty too, click Salvar. Verify both the empty field and the invalid email show their respective errors. Fix the email to valid and verify only the email error disappears.

### Implementation for User Story 2

- [X] T014 [US2] Verify `FormField.vue` already supports non-required fields (it should read `form.errors[field]` regardless of required status). If not, adjust the component to handle any field with an error.
- [X] T015 [US2] Ensure `UserTypes/Form.vue`, `MinistryRoles/Form.vue`, and `Profiles/Form.vue` use `<FormField>` for ALL fields (not just required ones) so that any backend validation error is surfaced visually.
- [X] T016 [US2] Verify backend VineJS validators return field-specific messages (e.g., email format, CPF digits, date range) and that these messages flow through `form.errors` into `<FormField>` display.

**Checkpoint**: Submitting forms with invalid values shows the correct field-specific error messages. User Story 2 independently testable.

---

## Phase 5: User Story 3 — Destacar Abas com Erros (Priority: P2)

**Goal**: When a form has tabs and errors exist inside an inactive tab, the tab header turns red.

**Independent Test**: Visit `Users/Form.vue`, leave a required field in tab "Endereço" empty, stay on tab "Informacoes Gerais", click Salvar. Verify the "Endereço" tab header turns red. Switch to that tab, fill the missing field, and verify the red highlight disappears.

### Implementation for User Story 3

- [X] T017 [US3] Verify `useFormValidation` correctly populates `tabsWithErrors` using `tabMap` for `Users/Form.vue` and `Churches/Form.vue`.
- [X] T018 [US3] Verify `TabPanelError` applies red CSS class to the TabPanel header slot when `tabIndex` is in `tabsWithErrors`. Test on both light and dark themes.
- [X] T019 [US3] Verify that when ALL errors inside a tab are corrected, the tab header red highlight is removed within 300ms (via reactivity, not animation required).
- [X] T020 [US3] Test edge case: multiple tabs with errors simultaneously — submit with empty fields in tabs 0, 1, and 2; verify all three headers turn red.
- [X] T021 [US3] Test edge case: tab switching after error correction — fix error in tab 1 while viewing tab 0, verify tab 1 header clears without needing to visit the tab.

**Checkpoint**: All tab-highlighting scenarios work correctly. User Story 3 independently testable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final adjustments and rollout to all forms.

- [X] T022 [P] Verify that no manual `:invalid="!!form.errors.xxx"` patterns remain in any of the 7 refactored forms (grep for `:invalid="!!form.errors` across `resources/js/Pages/**/Form.vue` and `Login.vue`)
- [X] T023 [P] Run `npm run build` and verify no TypeScript/Vue compilation errors
- [X] T024 [P] Run `npm run lint` (or equivalent) and fix any new lint issues
- [X] T025 Verify visual accessibility: red error color provides sufficient contrast in both light (`--p-red-500`) and dark themes (`--p-red-400`)
- [X] T026 Verify edge cases from spec: (a) submit with no errors clears all highlights, (b) conditional required fields are validated only when condition is met, (c) nested tabs are handled correctly if applicable.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories. T002, T003, T004 are interdependent (T004 depends on T002/T003). T005 is optional if inject is configured per-page instead of globally.
- **User Stories (Phase 3–5)**: All depend on Foundational phase. Can proceed in priority order or partially in parallel.
- **Polish (Phase 6)**: Depends on all user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational. No dependencies on other stories.
- **User Story 2 (P1)**: Can start after Foundational. Depends on `FormField` already rendering errors for any field (which is part of Foundational), but is logically independent of US1. Can run in parallel with US1 if staffed.
- **User Story 3 (P2)**: Can start after Foundational. Depends on `TabPanelError` and `useFormValidation` with `tabMap` (both foundational). Can run in parallel with US1/US2.

### Within Each User Story

- Refactor one form at a time (T007–T013 for US1 are parallel across different files).
- Verify one form before moving to the next to catch `FormField`/`TabPanelError` edge cases early.

### Parallel Opportunities

- T007–T013 (all form refactors for US1) are independent across different pages and can run in parallel.
- T008–T013 can also run in parallel with T007 if multiple developers are available.
- T017–T021 (tab error testing) run on the same forms but are read-only tests; they can run in parallel with refactor tasks after foundational is ready.
- T022–T024 (polish tasks) are independent and can run in parallel.

---

## Parallel Example: User Story 1

```bash
# Refactor all forms in parallel:
Task: "Refactor resources/js/Pages/Users/Form.vue"
Task: "Refactor resources/js/Pages/Churches/Form.vue"
Task: "Refactor resources/js/Pages/Priests/Form.vue"
Task: "Refactor resources/js/Pages/Profiles/Form.vue"
Task: "Refactor resources/js/Pages/MinistryRoles/Form.vue"
Task: "Refactor resources/js/Pages/UserTypes/Form.vue"
Task: "Refactor resources/js/Pages/Auth/Login.vue"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup (T001)
2. Complete Foundational (T002–T006)** — composable + FormField + TabPanelError ready
3. Complete User Story 1 (T007–T013) — refactor all 7 forms to show red borders + error messages
4. **STOP and VALIDATE**: Test each form with empty required fields
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. User Story 1 → Refactor all forms → Test → Deploy (MVP!)
3. User Story 2 → Ensure ALL fields (not just required) show errors → Test
4. User Story 3 → Add tab header red highlight to tabbed forms → Test
5. Polish → Lint, build, accessibility check

### Parallel Team Strategy

With multiple developers:

1. Team completes Foundational (T002–T006) together
2. Once Foundational is done:
   - Developer A: T007, T008 (Users + Churches forms — complex tab forms)
   - Developer B: T009, T010, T011, T012 (Priests, Profiles, MinistryRoles, UserTypes — simple forms)
   - Developer C: T013 (Login) + T014–T021 (US2 + US3 verification)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
