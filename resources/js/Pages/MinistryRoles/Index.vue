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
const model = ref([{ label: 'Funções' }])

const props = defineProps<{
  ministryRoles: Array<{
    id: number
    name: string
    description: string | null
    createdAt: string
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
    ministryRolesRead: boolean
    ministryRolesCreate: boolean
    ministryRolesUpdate: boolean
    ministryRolesDelete: boolean
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
      router.get('/ministry-roles', { search: value }, { preserveState: true })
    } else if (value.length === 0) {
      router.get('/ministry-roles', {}, { preserveState: true })
    }
  }, 1000)
})

if (props.flash?.success) {
  toast.add({ severity: 'success', summary: 'Sucesso', detail: props.flash.success, life: 3000 })
}

const isFirstPage = computed(() => props.pagination.currentPage === 1)
const isLastPage = computed(() => props.pagination.currentPage === props.pagination.lastPage)

const changePage = (page: number) => {
  router.get('/ministry-roles', { page, search: props.search }, { preserveState: true })
}

const confirmDelete = (id: number) => {
  confirm.require({
    message: 'Tem certeza que deseja excluir esta função?',
    header: 'Confirmação',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Sim',
    rejectLabel: 'Não',
    rejectProps: { severity: 'danger' },
    accept: () => router.delete(`/ministry-roles/${id}`),
  })
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-2xl font-bold text-color">Funções</h2>
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
        v-if="can.ministryRolesCreate"
        label="Nova Função"
        @click="router.get('/ministry-roles/create')"
      />
    </div>

    <div
      class="bg-surface-ground border border-surface rounded-lg p-4 flex flex-1 flex-col min-h-0"
    >
      <DataTable
        :value="ministryRoles"
        :rows="pagination.perPage"
        lazy
        stripedRows
        size="small"
        scrollHeight="flex"
        :tableStyle="{ minWidth: '100%' }"
        class="flex-1"
      >
        <Column field="name" header="Nome" />
        <Column header="Descrição">
          <template #body="{ data }">
            {{ data.description || '—' }}
          </template>
        </Column>
        <Column header="Ações" :exportable="false" style="min-width: 8rem">
          <template #body="{ data }">
            <Button
              v-if="can.ministryRolesRead"
              v-tooltip="'Visualizar'"
              icon="pi pi-eye"
              text
              rounded
              severity="info"
              @click="router.get(`/ministry-roles/${data.id}`)"
            />
            <Button
              v-if="can.ministryRolesUpdate"
              v-tooltip="'Editar'"
              icon="pi pi-pencil"
              text
              rounded
              severity="warn"
              @click="router.get(`/ministry-roles/${data.id}/edit`)"
            />
            <Button
              v-if="can.ministryRolesDelete"
              v-tooltip="'Excluir'"
              icon="pi pi-trash"
              text
              rounded
              severity="danger"
              @click="confirmDelete(data.id)"
            />
          </template>
        </Column>
        <template #empty>
          <p class="text-center text-muted-color py-4">Nenhuma função encontrada</p>
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
</template>
