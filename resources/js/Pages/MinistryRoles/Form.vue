<script setup lang="ts">
import { useForm, router } from '@inertiajs/vue3'
import { ref, computed } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Message from 'primevue/message'
import Breadcrumb from 'primevue/breadcrumb'
import FloatLabel from 'primevue/floatlabel'

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
          <div class="pt-4">
            <FloatLabel>
              <InputText id="name" v-model="form.name" fluid />
              <label for="name">Nome *</label>
            </FloatLabel>
            <Message v-if="form.errors.name" severity="error" size="small">{{
              form.errors.name
            }}</Message>
          </div>
          <div class="pt-4">
            <FloatLabel>
              <InputText id="description" v-model="form.description" fluid />
              <label for="description">Descrição</label>
            </FloatLabel>
            <Message v-if="form.errors.description" severity="error" size="small">{{
              form.errors.description
            }}</Message>
          </div>
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
