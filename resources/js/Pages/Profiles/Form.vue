<script setup lang="ts">
import { Link, useForm } from '@inertiajs/vue3'
import Icon from '../../Components/Icon.vue'
import { ref } from 'vue'

const props = defineProps<{
  profile: {
    id: number
    name: string
    description: string | null
    permissions: Array<{ id: number; module: string; action: string }>
  } | null
  groupedPermissions: Record<string, Array<{ id: number; action: string }>>
  selectedPermissionIds: number[]
}>()

const form = useForm({
  name: props.profile?.name || '',
  description: props.profile?.description || '',
  permissionIds: ref([...(props.selectedPermissionIds || [])]),
})

const togglePermission = (id: number) => {
  const idx = form.permissionIds.indexOf(id)
  if (idx >= 0) {
    form.permissionIds.splice(idx, 1)
  } else {
    form.permissionIds.push(id)
  }
}

const submit = () => {
  if (props.profile) {
    form.put(`/profiles/${props.profile.id}`)
  } else {
    form.post('/profiles')
  }
}
</script>

<template>
  <div>
    <div class="mb-6 flex items-center gap-4">
      <Link href="/profiles" class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
        <Icon name="chevron-left" cssClass="w-5 h-5" />
      </Link>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ profile ? 'Editar Perfil' : 'Novo Perfil' }}</h2>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 max-w-2xl">
      <form @submit.prevent="submit">
        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome</label>
            <input type="text" v-model="form.name" id="name" required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500">
            <p v-if="form.errors.name" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ form.errors.name }}</p>
          </div>

          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição</label>
            <textarea v-model="form.description" id="description" rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"></textarea>
            <p v-if="form.errors.description" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ form.errors.description }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Permissões</label>
            <div v-for="(perms, module) in groupedPermissions" :key="module" class="mb-3">
              <h4 class="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize mb-2">{{ module }}</h4>
              <div class="flex flex-wrap gap-3">
                <label v-for="perm in perms" :key="perm.id" class="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <input type="checkbox" :checked="form.permissionIds.includes(perm.id)" @change="togglePermission(perm.id)"
                    class="rounded border-gray-300 dark:border-gray-600 text-violet-600 focus:ring-violet-500">
                  {{ perm.action }}
                </label>
              </div>
            </div>
          </div>

          <div class="flex gap-3 pt-4">
            <button type="submit" :disabled="form.processing"
              class="bg-violet-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-violet-700 transition-colors disabled:opacity-50">
              {{ profile ? 'Atualizar' : 'Criar' }}
            </button>
            <Link href="/profiles" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Cancelar
            </Link>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>