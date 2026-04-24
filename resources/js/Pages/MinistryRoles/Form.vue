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
  ministryRole: {
    id: number
    name: string
    description: string | null
  } | null
}>()

const isEditing = computed(() => !!props.ministryRole)

const home = ref({ icon: 'pi pi-home', command: () => router.get('/dashboard') })
const model = computed(() => [
  { label: 'Funções', command: () => router.get('/ministry-roles') },
  { label: isEditing.value ? 'Editar Função' : 'Nova Função' },
])

const form = useForm({
  name: props.ministryRole?.name || '',
  description: props.ministryRole?.description || '',
})

useFormValidation(form)

const submit = () => {
  if (props.ministryRole) {
    form.put(`/ministry-roles/${props.ministryRole.id}`)
  } else {
    form.post('/ministry-roles')
  }
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-color">
        {{ isEditing ? 'Editar Função' : 'Nova Função' }}
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
          <FormField field="description">
            <template #default="{ invalid }">
              <FloatLabel>
                <InputText id="description" v-model="form.description" fluid :invalid="invalid" />
                <label for="description">Descrição</label>
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
          @click="$inertia.get('/ministry-roles')"
        />
      </div>
    </form>
  </div>
</template>
