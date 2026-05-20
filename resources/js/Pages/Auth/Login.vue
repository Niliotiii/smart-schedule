<script setup lang="ts">
import { useForm } from '@inertiajs/vue3'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Message from 'primevue/message'
import FormField from '../../Components/FormField.vue'
import { useFormValidation } from '../../Composables/useFormValidation'

const form = useForm({
  email: '',
  password: '',
})

useFormValidation(form)

const submit = () => form.post('/login')

defineProps<{
  flash?: { errors?: string | null; success?: string | null }
}>()
</script>

<template>
  <div>
    <!-- Brand -->
    <div class="text-center mb-8">
      <div
        class="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4"
      >
        <i class="pi pi-calendar-clock text-2xl text-primary" />
      </div>
      <h1 class="text-2xl font-bold text-color">Smart Schedule</h1>
      <p class="text-muted-color text-sm mt-1">Faça login para continuar</p>
    </div>

    <Message v-if="flash?.errors" severity="error" class="mb-4">{{ flash.errors }}</Message>
    <Message v-if="flash?.success" severity="success" class="mb-4">{{ flash.success }}</Message>

    <form @submit.prevent="submit" class="flex flex-col gap-5">
      <FormField field="email">
        <template #default="{ invalid }">
          <div class="flex flex-col gap-1.5">
            <label for="email" class="text-sm font-medium text-color">Email</label>
            <InputText
              id="email"
              v-model="form.email"
              type="email"
              :invalid="invalid"
              placeholder="seu@email.com"
              class="w-full"
            />
          </div>
        </template>
      </FormField>

      <FormField field="password">
        <template #default="{ invalid }">
          <div class="flex flex-col gap-1.5">
            <div class="flex items-center justify-between">
              <label for="password" class="text-sm font-medium text-color">Senha</label>
            </div>
            <Password
              id="password"
              v-model="form.password"
              :feedback="false"
              toggleMask
              :invalid="invalid"
              placeholder="Sua senha"
              class="w-full"
            />
          </div>
        </template>
      </FormField>

      <Button
        type="submit"
        label="Entrar"
        :disabled="form.processing"
        class="w-full mt-1"
        size="large"
      />
    </form>
  </div>
</template>

<style scoped>
:deep(.p-password),
:deep(.p-password-input) {
  width: 100% !important;
}
</style>
