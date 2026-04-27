<script setup lang="ts">
import { ref } from 'vue'
import { router } from '@inertiajs/vue3'
import { useTheme } from '../Composables/useTheme'
import Menu from 'primevue/menu'

defineProps<{
  auth: { user: { initials: string; fullName: string | null; email: string } | null }
}>()

defineEmits<{
  toggleSidebar: []
}>()

const { isDark, toggleTheme } = useTheme()

const menu = ref<InstanceType<typeof Menu>>()

const userMenuItems = ref([
  {
    label: 'Perfil',
    icon: 'pi pi-user',
    command: () => router.get('/account/profile'),
  },
])

function toggleMenu(event: Event) {
  menu.value?.toggle(event)
}
</script>

<template>
  <header
    class="sticky top-0 z-20 h-16 flex items-center px-4 md:px-6 bg-surface-ground border-b border-surface"
  >
    <button
      type="button"
      class="md:hidden p-2 rounded-md text-muted-color hover:bg-emphasis"
      @click="$emit('toggleSidebar')"
    >
      <i class="pi pi-bars text-xl" />
    </button>

    <span class="text-lg font-bold text-primary ml-2">Smart Schedule</span>

    <div class="flex-1" />

    <div class="flex items-center gap-3">
      <button
        type="button"
        class="p-2 rounded-md text-muted-color hover:bg-emphasis transition-colors"
        title="Alternar tema"
        @click="toggleTheme"
      >
        <i v-if="!isDark" class="pi pi-moon text-lg" />
        <i v-else class="pi pi-sun text-lg" />
      </button>

      <template v-if="auth.user">
        <button
          type="button"
          class="flex items-center gap-2 p-1.5 rounded-lg hover:bg-emphasis transition-colors"
          @click="toggleMenu"
        >
          <div
            class="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-bold"
          >
            {{ auth.user.initials }}
          </div>
          <span class="text-sm font-medium text-color hidden sm:block">{{
            auth.user.fullName || auth.user.email
          }}</span>
          <i class="pi pi-chevron-down text-xs text-muted-color hidden sm:block" />
        </button>
        <Menu ref="menu" :model="userMenuItems" :popup="true" />
      </template>
    </div>
  </header>
</template>
