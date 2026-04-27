<script setup lang="ts">
import { useForm, router } from '@inertiajs/vue3'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Breadcrumb from 'primevue/breadcrumb'
import FormField from '../../Components/FormField.vue'
import { useFormValidation } from '../../Composables/useFormValidation'
import { useToast } from 'primevue/usetoast'
import { ref } from 'vue'

const props = defineProps<{
  flash?: { success?: string | null; errors?: string | null }
}>()

const toast = useToast()

// Show flash messages on page load
if (props.flash?.success) {
  toast.add({ severity: 'success', summary: 'Sucesso', detail: props.flash.success, life: 3000 })
}

const home = ref({ icon: 'pi pi-home', command: () => router.get('/dashboard') })
const model = ref([{ label: 'Perfil' }])

const passwordForm = useForm({
  currentPassword: '',
  newPassword: '',
  newPasswordConfirmation: '',
})

const passwordTabMap = {
  currentPassword: 0,
  newPassword: 0,
  newPasswordConfirmation: 0,
}

useFormValidation(passwordForm, passwordTabMap)

const submitPassword = () => {
  passwordForm.put('/account/password', {
    onSuccess: () => {
      toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Senha alterada com sucesso. Faça login novamente.', life: 3000 })
    },
  })
}
</script>

<template>
  <div class="flex flex-col flex-1">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-color">Alterar Senha</h2>
      <Breadcrumb :home="home" :model="model" />
    </div>

    <form
      @submit.prevent="submitPassword"
      class="bg-surface-ground border border-surface rounded-lg p-4 flex flex-col gap-4"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField field="currentPassword">
          <template #default="{ invalid }">
            <Password
              id="currentPassword"
              v-model="passwordForm.currentPassword"
              :feedback="false"
              toggleMask
              fluid
              :invalid="invalid"
              placeholder="Senha atual"
            />
          </template>
        </FormField>

        <FormField field="newPassword">
          <template #default="{ invalid }">
            <Password
              id="newPassword"
              v-model="passwordForm.newPassword"
              toggleMask
              fluid
              :invalid="invalid"
              placeholder="Nova senha"
            />
          </template>
        </FormField>

        <FormField field="newPasswordConfirmation">
          <template #default="{ invalid }">
            <Password
              id="newPasswordConfirmation"
              v-model="passwordForm.newPasswordConfirmation"
              :feedback="false"
              toggleMask
              fluid
              :invalid="invalid"
              placeholder="Confirmar nova senha"
            />
          </template>
        </FormField>
      </div>

      <div class="flex justify-end gap-2 pt-2 border-t border-surface">
        <Button
          type="submit"
          :label="passwordForm.processing ? 'Alterando...' : 'Alterar Senha'"
          :loading="passwordForm.processing"
          :disabled="passwordForm.processing"
          severity="info"
        />
      </div>
    </form>
  </div>
</template>
