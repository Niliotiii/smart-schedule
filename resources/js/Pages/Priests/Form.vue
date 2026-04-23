<script setup lang="ts">
import { useForm, router } from '@inertiajs/vue3'
import { ref, computed } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Message from 'primevue/message'
import Breadcrumb from 'primevue/breadcrumb'
import FloatLabel from 'primevue/floatlabel'

const props = defineProps<{
  priest: {
    id: number
    name: string
    phone: string | null
  } | null
}>()

const isEditing = computed(() => !!props.priest)

const home = ref({ icon: 'pi pi-home', command: () => router.get('/dashboard') })
const model = computed(() => [
  { label: 'Padres', command: () => router.get('/priests') },
  { label: isEditing.value ? 'Editar Padre' : 'Novo Padre' },
])

const form = useForm({
  name: props.priest?.name || '',
  phone: props.priest?.phone || '',
})

const submit = () => {
  const data = {
    name: form.name,
    phone: form.phone || null,
  }

  if (props.priest) {
    form.transform(() => data).put(`/priests/${props.priest!.id}`)
  } else {
    form.transform(() => data).post('/priests')
  }
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-color">
        {{ isEditing ? 'Editar Padre' : 'Novo Padre' }}
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
              <InputText id="name" v-model="form.name" fluid required />
              <label for="name">Nome *</label>
            </FloatLabel>
            <Message v-if="form.errors.name" severity="error" size="small">{{
              form.errors.name
            }}</Message>
          </div>

          <div class="pt-4">
            <FloatLabel>
              <InputText id="phone" v-model="form.phone" fluid maxlength="20" />
              <label for="phone">Telefone</label>
            </FloatLabel>
            <Message v-if="form.errors.phone" severity="error" size="small">{{
              form.errors.phone
            }}</Message>
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-2 p-4 border-t border-surface">
        <Button type="submit" label="Salvar" :disabled="form.processing" severity="info" />
        <Button label="Cancelar" severity="secondary" outlined @click="router.get('/priests')" />
      </div>
    </form>
  </div>
</template>
