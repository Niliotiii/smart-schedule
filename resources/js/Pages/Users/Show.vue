<script setup lang="ts">
import { Link } from '@inertiajs/vue3'
import Icon from '../../Components/Icon.vue'

defineProps<{
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

const formatDate = (iso: string) => {
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div>
    <div class="flex items-center gap-2 mb-6">
      <Link href="/users" class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
        <Icon name="chevron-left" cssClass="w-5 h-5" />
      </Link>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Detalhes do Usuário</h2>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 max-w-2xl">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Nome</label>
          <p class="mt-1 text-sm text-gray-900 dark:text-gray-100">{{ userToShow.fullName || '-' }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
          <p class="mt-1 text-sm text-gray-900 dark:text-gray-100">{{ userToShow.email }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Perfil</label>
          <p class="mt-1 text-sm text-gray-900 dark:text-gray-100">{{ userToShow.profile ? userToShow.profile.name : '-' }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Criado em</label>
          <p class="mt-1 text-sm text-gray-900 dark:text-gray-100">{{ formatDate(userToShow.createdAt) }}</p>
        </div>
      </div>

      <div class="flex gap-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Link v-if="can.usersUpdate" :href="`/users/${userToShow.id}/edit`" class="inline-flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-violet-700 transition-colors">
          <Icon name="pencil" cssClass="w-4 h-4" />
          Editar
        </Link>
        <Link href="/users" class="inline-flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md text-sm font-medium border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          Voltar
        </Link>
      </div>
    </div>
  </div>
</template>