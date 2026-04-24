# Quick Start: form-validation-feedback

## Developer Guide

### 1. Add the composable and components

After implementation, the new files should be present:

```text
resources/js/Composables/useFormValidation.ts
resources/js/Components/FormField.vue
resources/js/Components/TabPanelError.vue
```

### 2. Use in a form with tabs

Example adapted from `Users/Form.vue`:

```vue
<script setup lang="ts">
import { useForm } from '@inertiajs/vue3'
import { useFormValidation } from '@/Composables/useFormValidation'
import FormField from '@/Components/FormField.vue'
import TabPanelError from '@/Components/TabPanelError.vue'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import InputText from 'primevue/inputtext'

const form = useForm({
  fullName: '',
  email: '',
  // ...other fields
})

// Map field names to tab indexes
const tabMap = {
  fullName: 0,
  email: 0,
  // tab 1 address fields
  postalCode: 1,
  cityId: 1,
}

const { tabsWithErrors, hasErrors } = useFormValidation({ form, tabMap })

function submit() {
  form.post('/users', { onError: () => {
    // errors already populated; tabsWithErrors recalculates automatically
  }})
}
</script>

<template>
  <form @submit.prevent="submit">
    <TabView v-model:activeIndex="activeTab">
      <TabPanelError :tabIndex="0" header="Informações Gerais">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField field="fullName" label="Nome completo" required>
            <template #default="{ invalid }">
              <InputText v-model="form.fullName" :invalid="invalid" fluid />
            </template>
          </FormField>

          <FormField field="email" label="Email" required>
            <template #default="{ invalid }">
              <InputText v-model="form.email" type="email" :invalid="invalid" fluid />
            </template>
          </FormField>
        </div>
      </TabPanelError>

      <TabPanelError :tabIndex="1" header="Endereço">
        <FormField field="postalCode" label="CEP" required>
          <template #default="{ invalid }">
            <InputText v-model="form.postalCode" :invalid="invalid" fluid />
          </template>
        </FormField>
      </TabPanelError>
    </TabView>
  </form>
</template>
```

### 3. Use in a form without tabs

```vue
<script setup lang="ts">
import { useForm } from '@inertiajs/vue3'
import { useFormValidation } from '@/Composables/useFormValidation'
import FormField from '@/Components/FormField.vue'
import InputText from 'primevue/inputtext'

const form = useForm({ email: '', password: '' })
useFormValidation({ form }) // no tabMap needed
</script>

<template>
  <form @submit.prevent="form.post('/login')">
    <FormField field="email" label="Email" required>
      <template #default="{ invalid }">
        <InputText v-model="form.email" :invalid="invalid" fluid />
      </template>
    </FormField>

    <FormField field="password" label="Senha" required>
      <template #default="{ invalid }">
        <InputText v-model="form.password" type="password" :invalid="invalid" fluid />
      </template>
    </FormField>
  </form>
</template>
```

### 4. What happens on validation failure

1. User clicks **Salvar**.
2. Backend returns validation errors → `form.errors` populated.
3. `useFormValidation` detects changes in `form.errors`:
   - Updates `tabsWithErrors` based on `tabMap`.
   - Each `FormField` slot receives `invalid=true` and displays `<Message severity="error">`.
   - Each `TabPanelError` whose `tabIndex` is in `tabsWithErrors` renders header in red.
4. User corrects a field → error disappears from `form.errors` → visual feedback clears automatically.

### 5. Testing checklist

- [ ] Submit empty form with required fields → all required fields show red border + error message.
- [ ] Submit invalid email → email field shows red + "email inválido" message.
- [ ] Submit with errors hidden in another tab → tab header turns red.
- [ ] Correct all fields in a red tab → tab header turns normal.
- [ ] Switch themes (dark/light) → error colors still visible and accessible.
