<script setup lang="ts">
import Card from 'primevue/card'
import Tag from 'primevue/tag'

defineProps<{
  can: {
    usersRead: boolean
    profilesRead: boolean
  }
}>()
</script>

<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-color">Dashboard</h2>
      <p class="text-muted-color text-sm mt-1">Bem-vindo ao Smart Schedule</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-if="can.usersRead" class="cursor-pointer" @click="$inertia.get('/users')">
        <Card>
          <template #header>
            <div class="flex items-center gap-4 p-6">
              <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                <i class="pi pi-users text-xl text-primary" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-color">Usuários</h3>
                <p class="text-sm text-muted-color">Gerenciar usuários do sistema</p>
              </div>
            </div>
          </template>
        </Card>
      </div>
      <div v-else>
        <Card>
          <template #header>
            <div class="flex items-center gap-4 p-6">
              <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-surface-100">
                <i class="pi pi-users text-xl text-muted-color" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-muted-color">Usuários</h3>
                <Tag value="Sem permissão" severity="secondary" class="mt-1" />
              </div>
            </div>
          </template>
        </Card>
      </div>

      <div v-if="can.profilesRead" class="cursor-pointer" @click="$inertia.get('/profiles')">
        <Card>
          <template #header>
            <div class="flex items-center gap-4 p-6">
              <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                <i class="pi pi-shield text-xl text-primary" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-color">Perfis</h3>
                <p class="text-sm text-muted-color">Gerenciar perfis e permissões</p>
              </div>
            </div>
          </template>
        </Card>
      </div>
      <div v-else>
        <Card>
          <template #header>
            <div class="flex items-center gap-4 p-6">
              <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-surface-100">
                <i class="pi pi-shield text-xl text-muted-color" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-muted-color">Perfis</h3>
                <Tag value="Sem permissão" severity="secondary" class="mt-1" />
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>