<script setup lang="ts">
import { useForm } from '@inertiajs/vue3'
import GuestLayout from '../../Layouts/GuestLayout.vue'

const form = useForm({
  email: '',
  password: '',
})

const submit = () => form.post('/login')

defineProps<{
  flash?: { errors?: string | null }
}>()
</script>

<template>
  <div class="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-8">
    <div class="text-center mb-6">
      <h1 class="text-2xl font-bold text-violet-700 dark:text-violet-400">Smart Schedule</h1>
      <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Faça login para continuar</p>
    </div>

    <div v-if="flash?.errors" class="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-400 text-sm">
      <p>{{ flash.errors }}</p>
    </div>

    <form @submit.prevent="submit" class="space-y-4">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
        <input type="email" v-model="form.email" id="email" required
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500">
        <p v-if="form.errors.email" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ form.errors.email }}</p>
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Senha</label>
        <input type="password" v-model="form.password" id="password" required
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500">
        <p v-if="form.errors.password" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ form.errors.password }}</p>
      </div>

      <button type="submit" :disabled="form.processing"
        class="w-full bg-violet-600 text-white py-2 px-4 rounded-md hover:bg-violet-700 transition-colors font-medium disabled:opacity-50">
        Entrar
      </button>
    </form>
  </div>
</template>