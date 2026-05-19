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
  <div
    class="w-full max-w-md rounded-xl shadow-lg border border-surface relative"
  >
    <!-- Top accent bar -->
    <div class="h-1.5 bg-gradient-to-r from-primary/60 via-primary to-primary/60 rounded-t-xl" />

    <div
      class="p-8 bg-gradient-to-br from-primary/[0.04] via-surface-ground to-primary/[0.07]"
    >
      <!-- Brand icon -->
      <div class="flex justify-center mb-4">
        <div
          class="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center"
        >
          <i class="pi pi-calendar-clock text-2xl text-primary" />
        </div>
      </div>

      <div class="text-center mb-6">
        <h1 class="text-3xl font-bold text-primary">Smart Schedule</h1>
        <p class="text-muted-color text-sm mt-1">Faça login para continuar</p>
      </div>

      <Message v-if="flash?.errors" severity="error" class="mb-4">{{ flash.errors }}</Message>
      <Message v-if="flash?.success" severity="success" class="mb-4">{{ flash.success }}</Message>

      <form @submit.prevent="submit" class="flex flex-col gap-4">
        <FormField field="email">
          <template #default="{ invalid }">
            <div class="flex flex-col gap-2">
              <label for="email" class="font-medium text-color">Email *</label>
              <InputText id="email" v-model="form.email" type="email" :invalid="invalid" />
            </div>
          </template>
        </FormField>

        <FormField field="password">
          <template #default="{ invalid }">
            <div class="flex flex-col gap-2">
              <label for="password" class="font-medium text-color">Senha *</label>
              <Password id="password" v-model="form.password" :feedback="false" toggleMask :invalid="invalid" class="w-full" />
            </div>
          </template>
        </FormField>

        <Button
          type="submit"
          label="Entrar"
          :disabled="form.processing"
          severity="info"
          class="w-full mt-2"
        />
      </form>
    </div>
  </div>
</template>

<style scoped>
:deep(.p-password),
:deep(.p-password-input) {
  width: 100% !important;
}
</style>
