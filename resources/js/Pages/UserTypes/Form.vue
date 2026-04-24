<script setup lang="ts">
import { useForm, router } from '@inertiajs/vue3'
import { ref, computed } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Breadcrumb from 'primevue/breadcrumb'
import FloatLabel from 'primevue/floatlabel'
import FormField from '../../Components/FormField.vue'
import { useFormValidation } from '../../Composables/useFormValidation'

const props = defineProps<{
  userType: {
    id: number
    name: string
  } | null
}>()

const isEditing = computed(() => !!props.userType)

const home = ref({ icon: 'pi pi-home', command: () => router.get('/dashboard') })
const model = computed(() => [
  { label: 'Tipos de Usuário', command: () => router.get('/user-types') },
  { label: isEditing.value ? 'Editar Tipo' : 'Novo Tipo' },
])

const form = useForm({
  name: props.userType?.name || '',
})

useFormValidation(form)

const submit = () => {
  if (props.userType) {
    form.put(`/user-types/${props.userType.id}`)
  } else {
    form.post('/user-types')
  }
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-color">
        {{ isEditing ? 'Editar Tipo de Usuário' : 'Novo Tipo de Usuário' }}
      </h2>
      <Breadcrumb :home="home" :model="model" />
    </div>

    <form
      @submit.prevent="submit"
      class="bg-surface-ground border border-surface rounded-lg flex-1 flex flex-col min-h-0"
    >
      <div class="p-4 flex-1">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField field="name">
            <template #default="{ invalid }">
              <FloatLabel>
                <InputText id="name" v-model="form.name" fluid :invalid="invalid" />
                <label for="name">Nome *</label>
              </FloatLabel>
            </template>
          </FormField>
        </div>
      </div>

      <div class="flex justify-end gap-2 p-4 border-t border-surface">
        <Button type="submit" label="Salvar" :disabled="form.processing" severity="info" />
        <Button
          label="Cancelar"
          severity="secondary"
          outlined
          @click="$inertia.get('/user-types')"
        />
      </div>
    </form>
  </div>
</template>
