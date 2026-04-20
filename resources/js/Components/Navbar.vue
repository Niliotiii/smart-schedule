<script setup lang="ts">
import Icon from './Icon.vue'
import { useTheme } from '../Composables/useTheme'

defineProps<{
  auth: { user: { initials: string; fullName: string | null; email: string } | null }
}>()

defineEmits<{
  toggleSidebar: []
}>()

const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <header class="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center px-4 md:px-6">
    <button type="button" @click="$emit('toggleSidebar')" class="md:hidden p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
      <Icon name="menu" cssClass="w-6 h-6" />
    </button>

    <div class="flex-1"></div>

    <div class="flex items-center gap-3">
      <button type="button" @click="toggleTheme" class="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Alternar tema">
        <Icon v-if="!isDark" name="moon" cssClass="w-5 h-5" />
        <Icon v-else name="sun" cssClass="w-5 h-5" />
      </button>

      <template v-if="auth.user">
        <div class="w-8 h-8 bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 rounded-full flex items-center justify-center text-sm font-bold">
          {{ auth.user.initials }}
        </div>
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">{{ auth.user.fullName || auth.user.email }}</span>
      </template>
    </div>
  </header>
</template>