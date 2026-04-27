<script setup lang="ts">
import { ref } from 'vue'
import AppSidebar from '../Components/AppSidebar.vue'
import AppTopbar from '../Components/AppTopbar.vue'
import ConfirmDialog from 'primevue/confirmdialog'
import Toast from 'primevue/toast'

const sidebarOpen = ref(false)
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}
</script>

<template>
  <div class="min-h-screen bg-surface-section flex">
    <AppSidebar
      :can="$page.props.can as any"
      :currentUrl="$page.url"
      :open="sidebarOpen"
      @close="sidebarOpen = false"
    />

    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-20 bg-black/50 md:hidden"
      @click="sidebarOpen = false"
    />

    <div class="md:ml-64 min-h-screen flex flex-col flex-1 min-w-0">
      <AppTopbar :auth="$page.props.auth as any" @toggle-sidebar="toggleSidebar" />

      <main class="p-4 md:p-6 flex-1 flex flex-col">
        <slot />
      </main>
    </div>

    <ConfirmDialog
      :pt="{
        header: { class: 'px-6 pt-4 pb-2' },
        content: { class: 'px-6 pb-2 pt-0' },
        footer: { class: 'px-6 pb-4 pt-2' },
        rejectButton: { root: { class: 'bg-red-500 border-red-500 text-white hover:bg-red-600 hover:border-red-600' } },
      }"
    />
    <Toast />
  </div>
</template>
