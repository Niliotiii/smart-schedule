<script setup lang="ts">
import { router } from '@inertiajs/vue3'
import { ref } from 'vue'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Breadcrumb from 'primevue/breadcrumb'

const props = defineProps<{
  userToShow: {
    id: number
    fullName: string | null
    email: string
    profileId: number | null
    profile: { id: number; name: string } | null
    createdAt: string
  }
  can: {
    usersUpdate: boolean
  }
}>()

const home = ref({ icon: 'pi pi-home', command: () => router.get('/dashboard') })
const model = ref([
  { label: 'Usuários', command: () => router.get('/users') },
  { label: 'Detalhes do Usuário' },
])

const formatDate = (iso: string) => {
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-color">Detalhes do Usuário</h2>
      <Breadcrumb :home="home" :model="model" />
    </div>

    <div class="bg-surface-ground border border-surface rounded-lg flex-1 flex flex-col min-h-0">
      <div class="p-4 flex-1">
        <h3 class="text-lg font-semibold text-color mb-4 flex items-center w-full gap-4 after:content-[''] after:flex-1 after:border-b after:border-surface">Dados Gerais</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
          <div>
            <label class="block text-sm font-medium text-muted-color">Nome</label>
            <p class="mt-1 text-sm text-color">{{ userToShow.fullName || '-' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-muted-color">Email</label>
            <p class="mt-1 text-sm text-color">{{ userToShow.email }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-muted-color">Perfil</label>
            <p class="mt-1">
              <Tag v-if="userToShow.profile" :value="userToShow.profile.name" severity="info" />
              <span v-else class="text-sm text-muted-color">-</span>
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-muted-color">Criado em</label>
            <p class="mt-1 text-sm text-color">{{ formatDate(userToShow.createdAt) }}</p>
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-2 p-4 border-t border-surface">
        <Button v-if="can.usersUpdate" v-tooltip="'Editar usuário'" label="Editar" severity="warn" @click="$inertia.get(`/users/${userToShow.id}/edit`)" />
        <Button v-tooltip="'Voltar para listagem'" label="Voltar" severity="secondary" @click="$inertia.get('/users')" />
      </div>
    </div>
  </div>
</template>