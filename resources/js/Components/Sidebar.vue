<script setup lang="ts">
import { Link } from '@inertiajs/vue3'
import Icon from './Icon.vue'
import { useForm } from '@inertiajs/vue3'

defineProps<{
  can: {
    usersRead: boolean
    profilesRead: boolean
  }
  currentUrl: string
  open: boolean
}>()

defineEmits<{
  close: []
}>()

const logoutForm = useForm({})
const logout = () => logoutForm.post('/logout')
</script>

<template>
  <aside class="fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200 ease-in-out" :class="open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'">
    <div class="flex items-center h-16 px-6 border-b border-gray-200 dark:border-gray-700">
      <h1 class="text-lg font-bold text-violet-700 dark:text-violet-400">Smart Schedule</h1>
    </div>

    <nav class="mt-4 px-4 space-y-1">
      <Link href="/dashboard"
        class="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors"
        :class="currentUrl === '/dashboard' ? 'bg-violet-50 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'">
        <Icon name="home" cssClass="w-5 h-5" />
        Dashboard
      </Link>
      <Link v-if="can.usersRead" href="/users"
        class="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors"
        :class="currentUrl === '/users' ? 'bg-violet-50 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'">
        <Icon name="users" cssClass="w-5 h-5" />
        Usuários
      </Link>
      <Link v-if="can.profilesRead" href="/profiles"
        class="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors"
        :class="currentUrl === '/profiles' ? 'bg-violet-50 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'">
        <Icon name="shield" cssClass="w-5 h-5" />
        Perfis
      </Link>
    </nav>

    <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
      <button type="button" @click="logout" class="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
        <Icon name="logout" cssClass="w-5 h-5" />
        Sair
      </button>
    </div>
  </aside>
</template>