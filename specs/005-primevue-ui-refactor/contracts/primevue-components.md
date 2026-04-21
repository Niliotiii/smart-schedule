# PrimeVue Component Usage Contracts

**Feature**: 005-primevue-ui-refactor | **Date**: 2026-04-20

## Component Mapping: Current → PrimeVue

### Form Inputs

| Current HTML              | PrimeVue Replacement | Import Path          |
| ------------------------- | -------------------- | -------------------- |
| `<input type="text">`     | `<InputText>`        | `primevue/inputtext` |
| `<input type="email">`    | `<InputText>`        | `primevue/inputtext` |
| `<input type="password">` | `<Password>`         | `primevue/password`  |
| `<select>`                | `<Select>`           | `primevue/select`    |
| `<textarea>`              | `<Textarea>`         | `primevue/textarea`  |
| `<input type="checkbox">` | `<Checkbox>`         | `primevue/checkbox`  |

### Buttons & Links

| Current HTML           | PrimeVue Replacement                                   | Import Path       |
| ---------------------- | ------------------------------------------------------ | ----------------- |
| `<button>` (primary)   | `<Button label="..." severity="primary" />`            | `primevue/button` |
| `<button>` (secondary) | `<Button label="..." severity="secondary" outlined />` | `primevue/button` |
| `<button>` (danger)    | `<Button label="..." severity="danger" text />`        | `primevue/button` |
| Navigation `<Link>`    | `<Link>` (Inertia) styled with PrimeVue classes        | `@inertiajs/vue3` |
| `<Link>` (icon action) | `<Button icon="pi pi-..." text rounded />`             | `primevue/button` |

### Data Display

| Current HTML              | PrimeVue Replacement                          | Import Path                                      |
| ------------------------- | --------------------------------------------- | ------------------------------------------------ |
| `<table>` with pagination | `<DataTable>` + `<Column>`                    | `primevue/datatable` + `primevue/column`         |
| Manual pagination         | DataTable `paginator` prop                    | Built-in                                         |
| Manual search input       | `<IconField>` + `<InputIcon>` + `<InputText>` | `primevue/iconfield` + `primevue/inputicon`      |
| Manual flash `<div>`      | `<Toast>` + `useToast()`                      | `primevue/toast` + `primevue/usetoast`           |
| `<div>` card              | `<Card>`                                      | `primevue/card`                                  |
| `<span>` badge            | `<Tag>`                                       | `primevue/tag`                                   |
| `window.confirm()`        | `<ConfirmDialog>` + `useConfirm()`            | `primevue/confirmdialog` + `primevue/useconfirm` |
| Error `<div>`             | `<Message>`                                   | `primevue/message`                               |

### Layout

| Current Component     | PrimeVue Replacement           | Import Path                               |
| --------------------- | ------------------------------ | ----------------------------------------- |
| Custom `Icon.vue` SVG | PrimeIcons font classes        | `primeicons` (CSS)                        |
| Search bar + button   | `<Toolbar>` with `<IconField>` | `primevue/toolbar` + `primevue/iconfield` |

## DataTable Usage Pattern

### Users/Index and Profiles/Index

```vue
<DataTable
  :value="items"
  :paginator="true"
  :rows="pagination.perPage"
  :totalRecords="pagination.total"
  :rowsPerPageOptions="[10, 25, 50]"
  :first="(pagination.currentPage - 1) * pagination.perPage"
  lazy
  @page="onPageChange($event)"
  stripedRows
  size="small"
>
  <Column field="fullName" header="Nome" />
  <Column field="email" header="Email" />
  <Column header="Ações">
    <template #body="{ data }">
      <!-- Action buttons -->
    </template>
  </Column>
</DataTable>
```

**Important**: Since we use server-side pagination (Inertia router), DataTable uses `lazy` mode with `@page` handler that calls `router.get()` with updated page parameter. The `first` prop must be calculated from `currentPage * perPage`.

### Search within DataTable

Search remains server-side. Use a `<Toolbar>` or separate `<IconField>` above the DataTable:

```vue
<IconField>
  <InputIcon class="pi pi-search" />
  <InputText v-model="searchInput" @keyup.enter="doSearch" />
</IconField>
```

## Confirmation Dialog Pattern

Replace all `window.confirm()` calls with:

```vue
<script setup>
import { useConfirm } from 'primevue/useconfirm'

const confirm = useConfirm()

const confirmDelete = (id: number) => {
  confirm.require({
    message: 'Tem certeza que deseja excluir este item?',
    header: 'Confirmação',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Sim',
    rejectLabel: 'Não',
    accept: () => router.delete(`/users/${id}`),
  })
}
</script>
```

The `<ConfirmDialog />` component must be placed in `AuthenticatedLayout.vue`.

## Toast Pattern

Replace all manual flash `<div>` messages with:

```vue
<script setup>
import { useToast } from 'primevue/usetoast'

const toast = useToast()

// On page load, check for flash messages
const props = defineProps<{ flash?: { success?: string | null } }>()
if (props.flash?.success) {
  toast.add({ severity: 'success', summary: 'Sucesso', detail: props.flash.success, life: 3000 })
}
</script>
```

The `<Toast />` component must be placed in `AuthenticatedLayout.vue`.

## Form Pattern

Replace inline `<label>` + `<input>` pairs with PrimeVue `<label>` + `<InputText>` etc.:

```vue
<div class="flex flex-col gap-2">
  <label for="name" class="font-medium">Nome</label>
  <InputText id="name" v-model="form.name" />
  <Message v-if="form.errors.name" severity="error">{{ form.errors.name }}</Message>
</div>
```

For the Select dropdown (profile selection):

```vue
<Select
  v-model="form.profileId"
  :options="profiles"
  optionLabel="name"
  optionValue="id"
  showClear
  placeholder="Sem perfil"
/>
```

## Dark Mode Integration

PrimeVue handles dark mode automatically once configured with `darkModeSelector: '.dark'`. The existing `useTheme` composable toggles the `.dark` class on `<html>`, which triggers PrimeVue's dark CSS variables. No additional PrimeVue theme switching calls needed.

To use PrimeVue design tokens in Tailwind utility classes:

```html
<!-- Instead of hardcoded colors -->
<div class="bg-white dark:bg-gray-800">
  <!-- Use PrimeVue surface tokens -->
  <div class="bg-surface-0 text-color"></div>
</div>
```

Available token-based classes from `tailwindcss-primeui`:

- `text-color`, `text-color-emphasis`, `text-muted-color`
- `bg-surface-0`, `bg-surface-50`, `bg-surface-100`
- `bg-primary`, `text-primary`
- `border-surface`
