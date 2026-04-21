<script setup lang="ts">
import AppMenu from './AppMenu.vue'

defineProps<{
  can: Record<string, boolean>
  currentUrl: string
  open: boolean
}>()

defineEmits<{
  close: []
}>()
</script>

<template>
  <aside
    class="fixed inset-y-0 left-0 z-30 flex flex-col w-64 bg-surface-ground border-r border-surface transform transition-transform duration-200 ease-in-out"
    :class="open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
  >
    <div class="flex items-center h-16 shrink-0 px-6 border-b border-surface">
      <h1 class="text-lg font-bold text-primary">Smart Schedule</h1>
    </div>

    <div class="flex flex-col flex-1 min-h-0 overflow-y-auto">
      <AppMenu :can="can" :currentUrl="currentUrl" />
    </div>
  </aside>
</template>