<script setup lang="ts">
import { router } from '@inertiajs/vue3'
import { ref, watch, computed } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Breadcrumb from 'primevue/breadcrumb'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'

const home = ref({ icon: 'pi pi-home', command: () => router.get('/dashboard') })
const model = ref([{ label: 'Perfis' }])

const props = defineProps<{
  profiles: Array<{
    id: number
    name: string
    description: string | null
    permissions: Array<{ id: number; module: string; action: string }>
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
    profilesCreate: boolean
    profilesRead: boolean
    profilesUpdate: boolean
    profilesDelete: boolean
  }
  flash?: { success?: string | null }
}>()

const confirm = useConfirm()
const toast = useToast()
const searchInput = ref(props.search || '')

let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(searchInput, (value) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    if (value.length >= 2) {
      router.get('/profiles', { search: value }, { preserveState: true })
    } else if (value.length === 0) {
      router.get('/profiles', {}, { preserveState: true })
    }
  }, 1000)
})

if (props.flash?.success) {
  toast.add({ severity: 'success', summary: 'Sucesso', detail: props.flash.success, life: 3000 })
}

const isFirstPage = computed(() => props.pagination.currentPage === 1)
const isLastPage = computed(() => props.pagination.currentPage === props.pagination.lastPage)

const changePage = (page: number) => {
  router.get('/profiles', { page, search: props.search }, { preserveState: true })
}

const confirmDelete = (id: number) => {
  confirm.require({
    message: 'Tem certeza que deseja excluir este perfil?',
    header: 'Confirmação',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Sim',
    rejectLabel: 'Não',
    accept: () => router.delete(`/profiles/${id}`),
  })
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-2xl font-bold text-color">Perfis</h2>
      <Breadcrumb :home="home" :model="model" />
    </div>

    <div class="flex items-center justify-between mb-4">
      <span class="relative w-72">
        <i class="pi pi-search absolute left-3 top-1/2 -mt-2 text-muted-color" />
        <InputText v-model="searchInput" placeholder="Buscar por nome ou descrição..." class="w-full pl-10 !bg-white !rounded-xl !shadow-[0_2px_4px_rgba(0,0,0,0.1)]" />
      </span>
      <Button v-if="can.profilesCreate" label="Novo Perfil" icon="pi pi-plus" @click="$inertia.get('/profiles/create')" />
    </div>

    <div class="bg-surface-ground border border-surface rounded-lg p-4 flex flex-1 flex-col min-h-0">
      <DataTable
        :value="profiles"
        :rows="pagination.perPage"
        lazy
        stripedRows
        size="small"
        scrollHeight="flex"
        class="flex-1"
      >
        <Column field="name" header="Nome" />
        <Column field="description" header="Descrição">
          <template #body="{ data }">
            {{ data.description || '-' }}
          </template>
        </Column>
        <Column header="Permissões">
          <template #body="{ data }">
            {{ data.permissions.length }} permissões
          </template>
        </Column>
        <Column header="Ações" :exportable="false" style="min-width: 8rem">
          <template #body="{ data }">
            <Button v-if="can.profilesRead" v-tooltip="'Visualizar'" icon="pi pi-eye" text rounded severity="info" @click="$inertia.get(`/profiles/${data.id}`)" />
            <Button v-if="can.profilesUpdate" v-tooltip="'Editar'" icon="pi pi-pencil" text rounded severity="warn" @click="$inertia.get(`/profiles/${data.id}/edit`)" />
            <Button v-if="can.profilesDelete" v-tooltip="'Excluir'" icon="pi pi-trash" text rounded severity="danger" @click="confirmDelete(data.id)" />
          </template>
        </Column>
        <template #empty>
          <p class="text-center text-muted-color py-4">Nenhum perfil encontrado</p>
        </template>
      </DataTable>

      <div class="flex items-center justify-between mt-4 pt-3 border-t border-surface">
        <span class="text-sm text-muted-color">{{ pagination.firstItem }}-{{ pagination.lastItem }} de {{ pagination.total }}</span>
        <div class="flex items-center gap-1">
          <Button v-tooltip.top="'Primeira página'" icon="pi pi-angle-double-left" text rounded :disabled="isFirstPage" @click="changePage(1)" />
          <Button v-tooltip.top="'Página anterior'" icon="pi pi-angle-left" text rounded :disabled="isFirstPage" @click="changePage(pagination.currentPage - 1)" />
          <span class="text-sm px-2 text-muted-color">{{ pagination.currentPage }} / {{ pagination.lastPage }}</span>
          <Button v-tooltip.top="'Próxima página'" icon="pi pi-angle-right" text rounded :disabled="isLastPage" @click="changePage(pagination.currentPage + 1)" />
          <Button v-tooltip.top="'Última página'" icon="pi pi-angle-double-right" text rounded :disabled="isLastPage" @click="changePage(pagination.lastPage)" />
        </div>
      </div>
    </div>
  </div>
</template>