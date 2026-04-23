<script setup lang="ts">
import Tag from 'primevue/tag'
import LiturgiaCard from './Liturgia/Card.vue'
import type { LiturgiaData } from '@/lib/liturgia.js'

const props = defineProps<{
  can: {
    usersRead: boolean
    profilesRead: boolean
  }
  liturgia: LiturgiaData | null
}>()
</script>

<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-color">Dashboard</h2>
      <p class="text-muted-color text-sm mt-1">Bem-vindo ao Smart Schedule</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-if="can.usersRead"
        class="cursor-pointer rounded-lg border border-surface shadow-sm bg-surface-ground hover:shadow-md transition-shadow"
        @click="$inertia.get('/users')"
      >
        <div class="flex items-center gap-4 p-4">
          <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
            <i class="pi pi-users text-xl text-primary" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-color">Usuários</h3>
            <p class="text-sm text-muted-color">Gerenciar usuários do sistema</p>
          </div>
        </div>
      </div>
      <div v-else class="rounded-lg border border-surface shadow-sm bg-surface-ground">
        <div class="flex items-center gap-4 p-4">
          <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-surface-100">
            <i class="pi pi-users text-xl text-muted-color" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-muted-color">Usuários</h3>
            <Tag value="Sem permissão" severity="secondary" class="mt-1" />
          </div>
        </div>
      </div>

      <div
        v-if="can.profilesRead"
        class="cursor-pointer rounded-lg border border-surface shadow-sm bg-surface-ground hover:shadow-md transition-shadow"
        @click="$inertia.get('/profiles')"
      >
        <div class="flex items-center gap-4 p-4">
          <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
            <i class="pi pi-shield text-xl text-primary" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-color">Perfis</h3>
            <p class="text-sm text-muted-color">Gerenciar perfis e permissões</p>
          </div>
        </div>
      </div>
      <div v-else class="rounded-lg border border-surface shadow-sm bg-surface-ground">
        <div class="flex items-center gap-4 p-4">
          <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-surface-100">
            <i class="pi pi-shield text-xl text-muted-color" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-muted-color">Perfis</h3>
            <Tag value="Sem permissão" severity="secondary" class="mt-1" />
          </div>
        </div>
      </div>
    </div>

    <LiturgiaCard :liturgia="liturgia" />
  </div>
</template>
