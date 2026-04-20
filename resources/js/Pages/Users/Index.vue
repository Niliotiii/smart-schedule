<script setup lang="ts">
import { Link, router } from '@inertiajs/vue3'
import Icon from '../../Components/Icon.vue'
import Pagination from '../../Components/Pagination.vue'
import { ref } from 'vue'

const props = defineProps<{
  users: Array<{
    id: number
    fullName: string | null
    email: string
    profileId: number | null
    profile: { id: number; name: string } | null
  }>
  pagination: {
    total: number
    currentPage: number
    lastPage: number
    perPage: number
    firstItem: number
    lastItem: number
  }
  search: string
  can: {
    usersCreate: boolean
    usersRead: boolean
    usersUpdate: boolean
    usersDelete: boolean
  }
  flash?: { success?: string | null }
}>()

const searchInput = ref(props.search || '')

const doSearch = () => {
  router.get('/users', { search: searchInput.value }, { preserveState: true })
}

const deleteItem = (id: number) => {
  if (confirm('Tem certeza que deseja excluir este usuário?')) {
    router.delete(`/users/${id}`)
  }
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Usuários</h2>
      <Link v-if="can.usersCreate" href="/users/create" class="inline-flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-violet-700 transition-colors">
        <Icon name="plus" cssClass="w-4 h-4" />
        Novo Usuário
      </Link>
    </div>

    <div v-if="flash?.success" class="mb-4 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded text-green-700 dark:text-green-400 text-sm">
      {{ flash.success }}
    </div>

    <form @submit.prevent="doSearch" class="mb-4 flex gap-2">
      <input type="text" v-model="searchInput" :placeholder="'Buscar por nome ou email...'" class="flex-1 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 px-3 py-2 text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500">
      <button type="submit" class="inline-flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-violet-700 transition-colors">
        <Icon name="magnifying-glass" cssClass="w-4 h-4" />
        Buscar
      </button>
      <Link v-if="search" href="/users" class="inline-flex items-center gap-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md text-sm font-medium border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
        Limpar
      </Link>
    </form>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Nome</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Perfil</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="u in users" :key="u.id">
              <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">{{ u.fullName || '-' }}</td>
              <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{{ u.email }}</td>
              <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{{ u.profile ? u.profile.name : '-' }}</td>
              <td class="px-6 py-4 text-right space-x-1">
                <Link v-if="can.usersRead" :href="`/users/${u.id}`" class="inline-flex items-center justify-center p-1.5 rounded-md text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-900/30" title="Visualizar">
                  <Icon name="eye" cssClass="w-4 h-4" />
                </Link>
                <Link v-if="can.usersUpdate" :href="`/users/${u.id}/edit`" class="inline-flex items-center justify-center p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" title="Editar">
                  <Icon name="pencil" cssClass="w-4 h-4" />
                </Link>
                <button v-if="can.usersDelete" type="button" @click="deleteItem(u.id)" class="inline-flex items-center justify-center p-1.5 rounded-md text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30" title="Excluir">
                  <Icon name="trash" cssClass="w-4 h-4" />
                </button>
              </td>
            </tr>
            <tr v-if="users.length === 0">
              <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">Nenhum usuário encontrado</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Pagination :pagination="pagination" baseUrl="/users" :search="search" />
  </div>
</template>