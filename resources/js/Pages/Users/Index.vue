<script setup lang="ts">
import { router } from '@inertiajs/vue3'
import { ref, watch, computed } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Breadcrumb from 'primevue/breadcrumb'
import Dialog from 'primevue/dialog'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'

const home = ref({ icon: 'pi pi-home', command: () => router.get('/dashboard') })
const model = ref([{ label: 'Usuários' }])

const props = defineProps<{
  users: Array<{
    id: number
    fullName: string | null
    email: string
    phone: string
    profileId: number | null
    profile: { id: number; name: string } | null
    userType: { id: number; name: string } | null
  }>
  pagination: {
    total: number
    currentPage: number
    lastPage: number
    perPage: number
    firstItem: number
    lastItem: number
  }
  search: string
  can: {
    usersCreate: boolean
    usersRead: boolean
    usersUpdate: boolean
    usersDelete: boolean
    usersResetPassword: boolean
  }
  flash?: { success?: string | null; resetPassword?: string | null }
}>()

const confirm = useConfirm()
const toast = useToast()
const searchInput = ref(props.search || '')

let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(searchInput, (value) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    if (value.length >= 2) {
      router.get('/users', { search: value }, { preserveState: true })
    } else if (value.length === 0) {
      router.get('/users', {}, { preserveState: true })
    }
  }, 1000)
})

const isFirstPage = computed(() => props.pagination.currentPage === 1)
const isLastPage = computed(() => props.pagination.currentPage === props.pagination.lastPage)

const changePage = (page: number) => {
  router.get('/users', { page, search: props.search }, { preserveState: true })
}

if (props.flash?.success) {
  toast.add({ severity: 'success', summary: 'Sucesso', detail: props.flash.success, life: 3000 })
}

const resetPasswordDialog = ref(false)
const generatedPassword = ref('')
const resettingPassword = ref(false)

if (props.flash?.resetPassword) {
  generatedPassword.value = props.flash.resetPassword
  resetPasswordDialog.value = true
}

watch(
  () => props.flash?.resetPassword,
  (val) => {
    if (val) {
      generatedPassword.value = val
      resetPasswordDialog.value = true
    }
  }
)

const openResetPasswordDialog = (user: { id: number; fullName: string | null }) => {
  resettingPassword.value = true
  router.post(
    `/users/${user.id}/reset-password`,
    {},
    {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        resettingPassword.value = false
      },
      onError: () => {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao gerar nova senha', life: 3000 })
        resettingPassword.value = false
      },
    }
  )
}

const closeResetPasswordDialog = () => {
  resetPasswordDialog.value = false
  generatedPassword.value = ''
}

const copyPassword = async () => {
  try {
    await navigator.clipboard.writeText(generatedPassword.value)
    toast.add({ severity: 'success', summary: 'Copiado', detail: 'Senha copiada para a área de transferência', life: 2000 })
  } catch {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível copiar a senha', life: 3000 })
  }
}

const confirmDelete = (id: number) => {
  confirm.require({
    message: 'Tem certeza que deseja excluir este usuário?',
    header: 'Confirmação',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Sim',
    rejectLabel: 'Não',
    rejectProps: { severity: 'danger' },
    accept: () => router.delete(`/users/${id}`),
  })
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-2xl font-bold text-color">Usuários</h2>
      <Breadcrumb :home="home" :model="model" />
    </div>

    <div class="flex items-center justify-between mb-4">
      <span class="relative w-72">
        <i class="pi pi-search absolute left-3 top-1/2 -mt-2 text-muted-color" />
        <InputText
          v-model="searchInput"
          placeholder="Buscar..."
          class="w-full pl-10 !rounded-xl"
        />
      </span>
      <Button
        v-if="can.usersCreate"
        label="Novo Usuário"
        @click="$inertia.get('/users/create')"
      />
    </div>

    <div
      class="bg-surface-ground border border-surface rounded-lg p-4 flex flex-1 flex-col min-h-0"
    >
      <DataTable
        :value="users"
        :rows="pagination.perPage"
        lazy
        stripedRows
        size="small"
        scrollHeight="flex"
        :tableStyle="{ minWidth: '100%' }"
        class="flex-1"
      >
        <Column field="fullName" header="Nome">
          <template #body="{ data }">
            {{ data.fullName || '-' }}
          </template>
        </Column>
        <Column field="email" header="Email" />
        <Column field="phone" header="Telefone" />
        <Column field="profile" header="Perfil">
          <template #body="{ data }">
            {{ data.profile ? data.profile.name : '-' }}
          </template>
        </Column>
        <Column field="userType" header="Tipo">
          <template #body="{ data }">
            {{ data.userType ? data.userType.name : '-' }}
          </template>
        </Column>
        <Column header="Ações" :exportable="false" style="min-width: 8rem">
          <template #body="{ data }">
            <Button
              v-if="can.usersRead"
              v-tooltip="'Visualizar'"
              icon="pi pi-eye"
              text
              rounded
              severity="info"
              @click="$inertia.get(`/users/${data.id}`)"
            />
            <Button
              v-if="can.usersUpdate"
              v-tooltip="'Editar'"
              icon="pi pi-pencil"
              text
              rounded
              severity="warn"
              @click="$inertia.get(`/users/${data.id}/edit`)"
            />
            <Button
              v-if="can.usersDelete"
              v-tooltip="'Excluir'"
              icon="pi pi-trash"
              text
              rounded
              severity="danger"
              @click="confirmDelete(data.id)"
            />
            <Button
              v-if="can.usersResetPassword"
              v-tooltip="'Resetar Senha'"
              icon="pi pi-key"
              text
              rounded
              severity="help"
              :loading="resettingPassword"
              @click="openResetPasswordDialog(data)"
            />
          </template>
        </Column>
        <template #empty>
          <p class="text-center text-muted-color py-4">Nenhum usuário encontrado</p>
        </template>
      </DataTable>

      <div class="flex items-center justify-between mt-4 pt-3 border-t border-surface">
        <span class="text-sm text-muted-color"
          >{{ pagination.firstItem }}-{{ pagination.lastItem }} de {{ pagination.total }}</span
        >
        <div class="flex items-center gap-1">
          <Button
            v-tooltip.top="'Primeira página'"
            icon="pi pi-angle-double-left"
            text
            rounded
            :disabled="isFirstPage"
            @click="changePage(1)"
          />
          <Button
            v-tooltip.top="'Página anterior'"
            icon="pi pi-angle-left"
            text
            rounded
            :disabled="isFirstPage"
            @click="changePage(pagination.currentPage - 1)"
          />
          <span class="text-sm px-2 text-muted-color"
            >{{ pagination.currentPage }} / {{ pagination.lastPage }}</span
          >
          <Button
            v-tooltip.top="'Próxima página'"
            icon="pi pi-angle-right"
            text
            rounded
            :disabled="isLastPage"
            @click="changePage(pagination.currentPage + 1)"
          />
          <Button
            v-tooltip.top="'Última página'"
            icon="pi pi-angle-double-right"
            text
            rounded
            :disabled="isLastPage"
            @click="changePage(pagination.lastPage)"
          />
        </div>
      </div>
    </div>
  </div>

  <Dialog
    v-model:visible="resetPasswordDialog"
    header="Nova Senha Gerada"
    :modal="true"
    :closable="true"
    @hide="closeResetPasswordDialog"
    class="w-full max-w-md"
  >
    <div class="flex flex-col gap-4">
      <div
        class="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700"
      >
        <i class="pi pi-info-circle mr-1" />
        Copie a senha antes de fechar. Após fechar esta janela, não será possível visualizá-la novamente.
      </div>
      <div class="flex items-center gap-2">
        <InputText
          :value="generatedPassword"
          readonly
          class="flex-1 font-mono text-sm"
        />
        <Button
          icon="pi pi-copy"
          severity="info"
          text
          rounded
          v-tooltip="'Copiar'"
          @click="copyPassword"
        />
      </div>
    </div>
  </Dialog>
</template>
