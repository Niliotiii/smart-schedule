# Data Model: form-validation-feedback

This feature is frontend-only and does not introduce new backend entities, database tables, or API contracts. The "data model" below describes the state managed by the `useFormValidation` composable and the props/contracts of the new Vue components.

---

## useFormValidation composable

**State**

```typescript
interface FormValidationState {
  // Set of tab indexes that contain at least one error field
  tabsWithErrors: Set<number>
  // Reactive record mapping field name to error string or null
  fieldErrors: Record<string, string | null>
  // Whether any error exists in the form
  hasErrors: boolean
}
```

**Input (Options)**

```typescript
interface UseFormValidationOptions {
  // The Inertia useForm instance
  form: any
  // Map of fieldName -> tabIndex (only needed if form has tabs)
  tabMap?: Record<string, number>
}
```

**Output (Composable Return)**

```typescript
interface UseFormValidationReturn {
  tabsWithErrors: shallowReadonly<Set<number>>
  hasErrors: ComputedRef<boolean>
  hasTabError(tabIndex: number): boolean
  getFieldError(fieldName: string): string | null
  clearErrors(): void
}
```

---

## FormField Component

**Props**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `field` | `string` | Yes | Name of the field (must match key in `form.errors`) |
| `label` | `string` | No | Label text displayed above/inside FloatLabel |
| `required` | `boolean` | No | Whether to show asterisk (*) on label |

**Slots**

| Slot | Description |
|------|-------------|
| `default` | The input component (e.g. `<InputText>`, `<Select>`). Receives `{ invalid: boolean }` via slot props. |

**Behavior**
- Reads `form.errors[field]` using `inject` (expects a provided `formValidation` instance).
- Renders `<Message severity="error" v-if="error">` below the input.
- Automatically removes error display when the field is corrected.

---

## TabPanelError Component

**Props**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `header` | `string` | Yes | Tab header label |
| `tabIndex` | `number` | Yes | Index of this tab in the parent TabView |

**Behavior**
- Uses inject to determine if `tabIndex` is present in `tabsWithErrors`.
- When `tabsWithErrors` contains `tabIndex`, applies red text/color class to the rendered header.
- Can wrap PrimeVue `<TabPanel>` so it is a drop-in replacement.

---

## Integration Points

- **Uses**: `@inertiajs/vue3` `useForm`, Vue 3 `inject/provide`, PrimeVue `Message`, `TabPanel`.
- **Provides**: Visual error consistency across all forms.
- **No API changes**: Backend continues to return errors in the same `form.errors` shape.
