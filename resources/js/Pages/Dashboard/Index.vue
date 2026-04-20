<script setup lang="ts">
import { Link } from '@inertiajs/vue3'
import Icon from '../../Components/Icon.vue'

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
      <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h2>
      <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Bem-vindo ao Smart Schedule Paroquial</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center gap-3 mb-4">
          <Icon name="users" cssClass="w-8 h-8 text-violet-500" />
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Usuários</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Gerenciar usuários do sistema</p>
          </div>
        </div>
        <Link v-if="can.usersRead" href="/users" class="text-violet-600 dark:text-violet-400 text-sm font-medium hover:text-violet-800 dark:hover:text-violet-300">Ver listagem →</Link>
        <span v-else class="text-gray-400 dark:text-gray-500 text-sm">Sem permissão</span>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center gap-3 mb-4">
          <Icon name="shield" cssClass="w-8 h-8 text-violet-500" />
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Perfis</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Gerenciar perfis e permissões</p>
          </div>
        </div>
        <Link v-if="can.profilesRead" href="/profiles" class="text-violet-600 dark:text-violet-400 text-sm font-medium hover:text-violet-800 dark:hover:text-violet-300">Ver listagem →</Link>
        <span v-else class="text-gray-400 dark:text-gray-500 text-sm">Sem permissão</span>
      </div>
    </div>
  </div>
</template>