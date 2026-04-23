<script setup lang="ts">
import { router } from '@inertiajs/vue3'
import { ref } from 'vue'
import Button from 'primevue/button'
import Breadcrumb from 'primevue/breadcrumb'

const home = ref({ icon: 'pi pi-home', command: () => router.get('/dashboard') })
const model = ref([
  { label: 'Funções', command: () => router.get('/ministry-roles') },
  { label: 'Detalhes da Função' },
])

const props = defineProps<{
  ministryRole: {
    id: number
    name: string
    description: string | null
    createdAt: string
  }
}>()

const formatDate = (iso: string) => {
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-color">Detalhes da Função</h2>
      <Breadcrumb :home="home" :model="model" />
    </div>

    <div class="bg-surface-ground border border-surface rounded-lg flex-1 flex flex-col min-h-0">
      <div class="p-4 flex-1">
        <h3
          class="text-lg font-semibold text-color mb-4 flex items-center w-full gap-4 after:content-[''] after:flex-1 after:border-b after:border-surface"
        >
          Dados Gerais
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
          <div>
            <label class="block text-sm font-medium text-muted-color">Nome</label>
            <p class="mt-1 text-sm text-color">{{ ministryRole.name }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-muted-color">Descrição</label>
            <p class="mt-1 text-sm text-color">{{ ministryRole.description || '—' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-muted-color">Criado em</label>
            <p class="mt-1 text-sm text-color">{{ formatDate(ministryRole.createdAt) }}</p>
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-2 p-4 border-t border-surface">
        <Button
          v-tooltip="'Editar função'"
          label="Editar"
          severity="warn"
          @click="router.get(`/ministry-roles/${ministryRole.id}/edit`)"
        />
        <Button
          v-tooltip="'Voltar para listagem'"
          label="Voltar"
          severity="secondary"
          @click="router.get('/ministry-roles')"
        />
      </div>
    </div>
  </div>
</template>
