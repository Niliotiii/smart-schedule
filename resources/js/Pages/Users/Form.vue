<script setup lang="ts">
import { Link, useForm } from '@inertiajs/vue3'
import Icon from '../../Components/Icon.vue'

const props = defineProps<{
  user: {
    id: number
    fullName: string | null
    email: string
    profileId: number | null
  } | null
  profiles: Array<{ id: number; name: string }>
}>()

const form = useForm({
  fullName: props.user?.fullName || '',
  email: props.user?.email || '',
  password: '',
  profileId: props.user?.profileId ?? '' as number | string,
})

const submit = () => {
  if (props.user) {
    form.put(`/users/${props.user.id}`)
  } else {
    form.post('/users')
  }
}
</script>

<template>
  <div>
    <div class="mb-6 flex items-center gap-4">
      <Link href="/users" class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
        <Icon name="chevron-left" cssClass="w-5 h-5" />
      </Link>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ user ? 'Editar Usuário' : 'Novo Usuário' }}</h2>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 max-w-2xl">
      <form @submit.prevent="submit">
        <div class="space-y-4">
          <div>
            <label for="fullName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome completo</label>
            <input type="text" v-model="form.fullName" id="fullName"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500">
            <p v-if="form.errors.fullName" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ form.errors.fullName }}</p>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input type="email" v-model="form.email" id="email" required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500">
            <p v-if="form.errors.email" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ form.errors.email }}</p>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Senha {{ user ? '(deixe vazio para manter a atual)' : '' }}
            </label>
            <input type="password" v-model="form.password" id="password" :required="!user"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500">
            <p v-if="form.errors.password" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ form.errors.password }}</p>
          </div>

          <div>
            <label for="profileId" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Perfil</label>
            <select v-model="form.profileId" id="profileId"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500">
              <option value="">Sem perfil</option>
              <option v-for="profile in profiles" :key="profile.id" :value="profile.id">{{ profile.name }}</option>
            </select>
            <p v-if="form.errors.profileId" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ form.errors.profileId }}</p>
          </div>

          <div class="flex gap-3 pt-4">
            <button type="submit" :disabled="form.processing"
              class="bg-violet-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-violet-700 transition-colors disabled:opacity-50">
              {{ user ? 'Atualizar' : 'Criar' }}
            </button>
            <Link href="/users" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Cancelar
            </Link>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>