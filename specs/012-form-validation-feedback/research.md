# Research: form-validation-feedback

**Date**: 2026-04-24

## Decision 1: Abordagem Reutilizável — Composable + Wrapper Components

**Decision**: Instead of manually duplicating the `:invalid="!!form.errors.field"` + `<Message v-if="form.errors.field">` pattern in every form field, we will create a `useFormValidation` composable and two wrapper components (`FormField.vue`, `TabPanelError.vue`).

**Rationale**:
- Currently all 7 forms (Users, Churches, Priests, Profiles, MinistryRoles, UserTypes, Login) repeat the same invalid+Message pattern manually on each field.
- A composable gives unified logic for error detection and tab highlighting.
- Wrapper components reduce copy-paste risk and ensure consistency.
- No new validation library needed — `useForm` from `@inertiajs/vue3` already exposes `form.errors` populated by VineJS backend validation.

**Alternatives considered**:
- Modify every field manually in each form page: rejected — high duplication, risk of inconsistency.
- Use a generic `<Form>` wrapper like VeeValidate: rejected — introduces an unnecessary dependency when `useForm` already provides errors and we only need visual rendering.

## Decision 2: Detecção de Abas (Tabs) com Erros

**Decision**: The `useFormValidation` composable will compute `tabsWithErrors` based on a mapping of field names to tab indexes. This mapping will be passed once per form via a `tabMap` option.

**Rationale**:
- PrimeVue `TabPanel` does not expose an `error` prop natively.
- We can wrap `TabPanel` with a `TabPanelError` component that reads from the composable and conditionally adds a red class to the `header` slot or inserts an error indicator.
- The `activeTab` in forms is already bound via `v-model:activeIndex` on `TabView`.

**How it works**:
1. User defines a map: `{ fullName: 0, email: 0, address: 1 }` where values are tab indexes.
2. On submit validation, the composable scans `form.errors`, looks up which tab each error field belongs to, and produces a `Set` of tab indexes containing errors.
3. `TabPanelError` exposes an `error` prop or reads from `provide/inject` and applies the red highlight.

## Decision 3: Integração com Inertia `useForm`

**Decision**: The composable accepts the Inertia `useForm` instance as an argument and reacts to `form.errors` changes automatically using Vue `watch`.

**Rationale**:
- `useForm` is already used in every form page (Users, Churches, Priests, etc.).
- It already carries `form.errors` populated after `form.post()` returns validation errors from AdonisJS/VineJS.
- Watching `form.errors` allows the red highlight to disappear immediately when the user corrects a field and the error is cleared (or when re-validating).

## Decision 4: Estilo de Cor — Sistema de Tema Existente

**Decision**: Error colors will use the PrimeVue semantic tokens (`text-danger`, `border-red-500`, or PrimeVue `severity="error"`) so the application respects the current dark/light theme and Tailwind integration.

**Rationale**:
- The project already uses PrimeVue 4.5.5 with Tailwind theming.
- Manually hard-coding `#ff0000` would break in dark mode and violate the project's design system.
- `Message severity="error"` already handles theming correctly.

## Decision 5: Escopo — Aplicar a Todos os Formulários

**Decision**: After creating the composable and wrapper components, we will refactor all existing forms to use them. This is the requirement from the spec (FR-010).

**Forms to update**:
1. `resources/js/Pages/Users/Form.vue` (has tabs)
2. `resources/js/Pages/Churches/Form.vue` (has tabs)
3. `resources/js/Pages/Priests/Form.vue`
4. `resources/js/Pages/Profiles/Form.vue`
5. `resources/js/Pages/MinistryRoles/Form.vue`
6. `resources/js/Pages/UserTypes/Form.vue`
7. `resources/js/Pages/Auth/Login.vue`

**Risk**: Breaking existing behavior if the wrapper component doesn't support all PrimeVue input types. Mitigation: `FormField` will use a default slot so any PrimeVue input can be slotted in.

## Decision 6: Sem Backend Changes

**Decision**: No backend changes are needed. Validation remains handled by VineJS in AdonisJS controllers, which already return `form.errors`. Only the frontend visual feedback layer is being refactored.
