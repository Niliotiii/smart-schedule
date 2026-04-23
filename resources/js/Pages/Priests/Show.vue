<script setup lang="ts">
import { router } from '@inertiajs/vue3'
import { ref } from 'vue'
import Button from 'primevue/button'
import Breadcrumb from 'primevue/breadcrumb'

const home = ref({ icon: 'pi pi-home', command: () => router.get('/dashboard') })
const model = ref([
  { label: 'Padres', command: () => router.get('/priests') },
  { label: 'Detalhes' },
])

interface Props {
  priest: {
    id: number
    name: string
    phone: string | null
    createdAt: string
  }
}

defineProps<Props>()
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-color">Detalhes do Padre</h2>
      <Breadcrumb :home="home" :model="model" />
    </div>

    <div class="bg-surface-ground border border-surface rounded-lg p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <span class="text-muted-color text-sm block mb-1">Nome</span>
          <span class="text-color font-medium">{{ priest.name }}</span>
        </div>
        <div>
          <span class="text-muted-color text-sm block mb-1">Telefone</span>
          <span class="text-color font-medium">{{ priest.phone || '—' }}</span>
        </div>
        <div>
          <span class="text-muted-color text-sm block mb-1">Criado em</span>
          <span class="text-color font-medium">{{ new Date(priest.createdAt).toLocaleDateString('pt-BR') }}</span>
        </div>
      </div>

      <div class="flex justify-end gap-2 border-t border-surface pt-4">
        <Button
          label="Editar"
          icon="pi pi-pencil"
          severity="info"
          outlined
          @click="router.get(`/priests/${priest.id}/edit`)"
        />
        <Button
          label="Voltar"
          severity="secondary"
          outlined
          @click="router.get('/priests')"
        />
      </div>
    </div>
  </div>
</template>
