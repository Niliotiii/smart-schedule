<script setup lang="ts">
import { useForm } from '@inertiajs/vue3'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Message from 'primevue/message'

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
  <div class="w-full max-w-md bg-surface-ground rounded-lg shadow-md border border-surface p-8">
    <div class="text-center mb-6">
      <h1 class="text-2xl font-bold text-primary">Smart Schedule</h1>
      <p class="text-muted-color text-sm mt-1">Faça login para continuar</p>
    </div>

    <Message v-if="flash?.errors" severity="error" class="mb-4">{{ flash.errors }}</Message>

    <form @submit.prevent="submit" class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <label for="email" class="font-medium text-color">Email</label>
        <InputText id="email" v-model="form.email" type="email" />
        <Message v-if="form.errors.email" severity="error">{{ form.errors.email }}</Message>
      </div>

      <div class="flex flex-col gap-2">
        <label for="password" class="font-medium text-color">Senha</label>
        <Password id="password" v-model="form.password" :feedback="false" toggleMask />
        <Message v-if="form.errors.password" severity="error">{{ form.errors.password }}</Message>
      </div>

      <Button
        type="submit"
        label="Entrar"
        :disabled="form.processing"
        severity="info"
        class="w-full"
      />
    </form>
  </div>
</template>
