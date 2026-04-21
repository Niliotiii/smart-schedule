<script setup lang="ts">
import { router } from '@inertiajs/vue3'
import { ref } from 'vue'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Breadcrumb from 'primevue/breadcrumb'

const props = defineProps<{
  profile: {
    id: number
    name: string
    description: string | null
    permissions: Array<{ id: number; module: string; action: string }>
    createdAt: string
  }
  can: {
    profilesUpdate: boolean
  }
}>()

const home = ref({ icon: 'pi pi-home', command: () => router.get('/dashboard') })
const model = ref([
  { label: 'Perfis', command: () => router.get('/profiles') },
  { label: 'Detalhes do Perfil' },
])

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
      <h2 class="text-2xl font-bold text-color">Detalhes do Perfil</h2>
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
            <p class="mt-1 text-sm text-color">{{ profile.name }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-muted-color">Descrição</label>
            <p class="mt-1 text-sm text-color">{{ profile.description || '-' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-muted-color">Criado em</label>
            <p class="mt-1 text-sm text-color">{{ formatDate(profile.createdAt) }}</p>
          </div>
          <div class="md:col-span-3">
            <label class="block text-sm font-medium text-muted-color">Permissões</label>
            <div class="mt-2 flex flex-wrap gap-1">
              <template v-if="profile.permissions.length > 0">
                <Tag
                  v-for="permission in profile.permissions"
                  :key="permission.id"
                  :value="`${permission.module}:${permission.action}`"
                  severity="info"
                  class="mr-1 mb-1"
                />
              </template>
              <p v-else class="text-sm text-muted-color">Nenhuma permissão atribuída</p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-2 p-4 border-t border-surface">
        <Button
          v-if="can.profilesUpdate"
          v-tooltip="'Editar perfil'"
          label="Editar"
          severity="warn"
          @click="$inertia.get(`/profiles/${profile.id}/edit`)"
        />
        <Button
          v-tooltip="'Voltar para listagem'"
          label="Voltar"
          severity="secondary"
          @click="$inertia.get('/profiles')"
        />
      </div>
    </div>
  </div>
</template>
