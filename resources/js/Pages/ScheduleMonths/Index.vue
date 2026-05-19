<script setup lang="ts">
import { router } from '@inertiajs/vue3'
import { ref, computed, watch } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Tag from 'primevue/tag'
import Breadcrumb from 'primevue/breadcrumb'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'

const home = ref({ icon: 'pi pi-home', command: () => router.get('/dashboard') })
const model = ref([{ label: 'Meses de Escala' }])

const props = defineProps<{
  months: Array<{
    id: number
    year: number
    month: number
    openedAt: string
    signalingDeadline: string
    status: string
    createdBy: { id: number; name: string } | null
    scheduleCount: number
  }>
  can: {
    scheduleMonthsManage: boolean
  }
  flash?: { success?: string | null }
}>()

const confirm = useConfirm()
const toast = useToast()

const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

const formatMonth = (m: number, y: number) => `${monthNames[m - 1]} / ${y}`

const formatDate = (iso: string) => {
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const statusLabel = (status: string) => {
  const labels: Record<string, string> = {
    aberta: 'Aberta',
    disponivel: 'Disponível',
    rascunho: 'Rascunho',
    publicada: 'Publicada',
    encerrada: 'Encerrada',
  }
  return labels[status] || status
}

const statusSeverity = (status: string) => {
  const severities: Record<string, string> = {
    aberta: 'info',
    disponivel: 'success',
    rascunho: 'warn',
    publicada: 'contrast',
    encerrada: 'secondary',
  }
  return severities[status] || 'info'
}

if (props.flash?.success) {
  toast.add({ severity: 'success', summary: 'Sucesso', detail: props.flash.success, life: 3000 })
}

const confirmDelete = (id: number) => {
  confirm.require({
    message: 'Tem certeza que deseja excluir este mês? Esta ação também removerá todas as escalas e sinalizações associadas.',
    header: 'Confirmação',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Sim',
    rejectLabel: 'Não',
    rejectProps: { severity: 'danger' },
    accept: () => router.delete(`/schedules/months/${id}`),
  })
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-2xl font-bold text-color">Meses de Escala</h2>
      <Breadcrumb :home="home" :model="model" />
    </div>

    <div class="flex items-center justify-end mb-4">
      <Button
        v-if="can.scheduleMonthsManage"
        label="Abrir Mês"
        @click="$inertia.get('/schedules/months/create')"
      />
    </div>

    <div class="bg-surface-ground border border-surface rounded-lg p-4 flex flex-1 flex-col min-h-0">
      <DataTable
        :value="months"
        lazy
        stripedRows
        size="small"
        scrollHeight="flex"
        :tableStyle="{ minWidth: '100%' }"
        class="flex-1"
      >
        <Column header="Mês">
          <template #body="{ data }">
            <span class="font-medium">{{ formatMonth(data.month, data.year) }}</span>
          </template>
        </Column>
        <Column field="scheduleCount" header="Escalas" style="width: 6rem" />
        <Column header="Abertura">
          <template #body="{ data }">
            {{ formatDate(data.openedAt) }}
          </template>
        </Column>
        <Column header="Prazo Sinalização">
          <template #body="{ data }">
            {{ formatDate(data.signalingDeadline) }}
          </template>
        </Column>
        <Column header="Status">
          <template #body="{ data }">
            <Tag
              :value="statusLabel(data.status)"
              :severity="statusSeverity(data.status)"
            />
          </template>
        </Column>
        <Column field="createdBy" header="Aberto por">
          <template #body="{ data }">
            {{ data.createdBy?.name || '—' }}
          </template>
        </Column>
        <Column header="Ações" :exportable="false" style="width: 10rem">
          <template #body="{ data }">
            <div class="flex items-center gap-1">
              <Button
                v-tooltip="'Visualizar'"
                icon="pi pi-eye"
                text
                rounded
                severity="info"
                @click="$inertia.get(`/schedules/months/${data.id}`)"
              />
              <Button
                v-if="can.scheduleMonthsManage"
                v-tooltip="'Editar escalas'"
                icon="pi pi-pencil"
                text
                rounded
                severity="warn"
                @click="$inertia.get(`/schedules/months/${data.id}/edit`)"
              />
              <Button
                v-tooltip="'Sinalizar disponibilidade'"
                icon="pi pi-flag"
                text
                rounded
                severity="success"
                @click="$inertia.get(`/schedules/months/${data.id}/signal`)"
              />
            </div>
          </template>
        </Column>
        <template #empty>
          <p class="text-center text-muted-color py-4">Nenhum mês aberto encontrado</p>
        </template>
      </DataTable>
    </div>
  </div>
</template>
