<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from '../Components/Sidebar.vue'
import Navbar from '../Components/Navbar.vue'

const sidebarOpen = ref(false)
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <Sidebar
      :can="$page.props.can as any"
      :currentUrl="$page.url"
      :open="sidebarOpen"
      @close="sidebarOpen = false"
    />

    <div v-if="sidebarOpen" class="fixed inset-0 z-20 bg-black/50 md:hidden" @click="sidebarOpen = false"></div>

    <div class="md:ml-64 min-h-screen">
      <Navbar
        :auth="$page.props.auth as any"
        @toggle-sidebar="toggleSidebar"
      />

      <main class="p-4 md:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>