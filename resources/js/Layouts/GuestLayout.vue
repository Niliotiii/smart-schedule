<script setup lang="ts">
import { useTheme } from '../Composables/useTheme'
import Icon from '../Components/Icon.vue'

const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 relative">
    <button type="button" @click="toggleTheme" class="absolute top-4 right-4 p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" title="Alternar tema">
      <Icon v-if="!isDark" name="moon" cssClass="w-5 h-5" />
      <Icon v-else name="sun" cssClass="w-5 h-5" />
    </button>

    <slot />
  </div>
</template>