<script setup lang="ts">
import { computed } from 'vue'
import { Link, useForm } from '@inertiajs/vue3'

const props = defineProps<{
  can: Record<string, boolean>
  currentUrl: string
}>()

interface MenuItem {
  label: string
  icon: string
  route?: string
  permission?: string
  action?: () => void
  divider?: boolean
}

const logoutForm = useForm({})

const navItems = computed<MenuItem[]>(() => {
  const items: MenuItem[] = [
    { label: 'Dashboard', icon: 'pi pi-home', route: '/dashboard' },
    { label: 'Usuários', icon: 'pi pi-users', route: '/users', permission: 'usersRead' },
    {
      label: 'Tipos de Usuário',
      icon: 'pi pi-tag',
      route: '/user-types',
      permission: 'userTypesRead',
    },
    { label: 'Perfis', icon: 'pi pi-shield', route: '/profiles', permission: 'profilesRead' },
    { label: 'Igrejas', icon: 'pi pi-building', route: '/churches', permission: 'churchesRead' },
  ]
  return items.filter((item) => !item.permission || props.can[item.permission])
})

const logoutItem: MenuItem = {
  label: 'Sair',
  icon: 'pi pi-sign-out',
  action: () => logoutForm.post('/logout'),
}

function isActive(url: string): boolean {
  return props.currentUrl === url || props.currentUrl.startsWith(url + '/')
}
</script>

<template>
  <div class="flex flex-col h-full">
    <nav class="flex flex-col gap-1 px-3 py-4">
      <Link
        v-for="item in navItems"
        :key="item.label"
        :href="item.route!"
        class="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors"
        :class="
          isActive(item.route!)
            ? 'bg-primary/10 text-primary'
            : 'text-muted-color hover:bg-emphasis hover:text-color'
        "
      >
        <i :class="item.icon" class="text-base" />
        {{ item.label }}
      </Link>
    </nav>

    <div class="mt-auto border-t border-surface px-3 py-4">
      <button
        type="button"
        class="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950 transition-colors"
        @click="logoutItem.action"
      >
        <i :class="logoutItem.icon" class="text-base" />
        {{ logoutItem.label }}
      </button>
    </div>
  </div>
</template>
