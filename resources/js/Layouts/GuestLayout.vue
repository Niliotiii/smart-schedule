<script setup lang="ts">
import { useTheme } from '../Composables/useTheme'

const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-surface-section relative">
    <button type="button" class="absolute top-4 right-4 p-2 rounded-md text-muted-color hover:bg-emphasis transition-colors" title="Alternar tema" @click="toggleTheme">
      <i v-if="!isDark" class="pi pi-moon text-lg" />
      <i v-else class="pi pi-sun text-lg" />
    </button>

    <slot />
  </div>
</template>