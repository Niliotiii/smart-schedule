<script setup lang="ts">
import { router } from '@inertiajs/vue3'
import { ref, computed } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'
import Breadcrumb from 'primevue/breadcrumb'
import { useToast } from 'primevue/usetoast'

const props = defineProps<{
  month: {
    id: number
    year: number
    month: number
    openedAt: string
    signalingDeadline: string
    status: string
    createdBy: { id: number; name: string } | null
    schedules: Array<{
      id: number
      day: number
      name: string
      description: string | null
      time: string
      community: { id: number; name: string } | null
      priest: { id: number; name: string } | null
      roles: Array<{ id: number; name: string; quantity: number }>
      assignments: Array<{ id: number; userId: number; userName: string; ministryRoleId: number; ministryRoleName: string }>
      signals: Array<{ user: { id: number; name: string } | null; response: string; signaledAt: string }>
    }>
  }
  flash?: { success?: string | null }
}>()

const toast = useToast()

const dialogVisible = ref(false)
const selectedSchedule = ref<any>(null)

function viewAssignments(schedule: any) {
  selectedSchedule.value = schedule
  dialogVisible.value = true
}

const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

const monthLabel = computed(() => `${monthNames[props.month.month - 1]} / ${props.month.year}`)

const formatDate = (iso: string) => {
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

const signalCount = (schedule: typeof props.month.schedules[0]) => schedule.signals.length

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

const home = ref({ icon: 'pi pi-home', command: () => router.get('/dashboard') })
const model = ref([
  { label: 'Meses de Escala', command: () => router.get('/schedules/months') },
  { label: 'Visualizar Mês' },
])
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-color">{{ monthLabel }}</h2>
      <Breadcrumb :home="home" :model="model" />
    </div>

    <div class="bg-surface-ground border border-surface rounded-lg p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-muted-color">Abertura</label>
          <p class="mt-1 text-sm text-color">{{ formatDate(month.openedAt) }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-muted-color">Prazo de Sinalização</label>
          <p class="mt-1 text-sm text-color">{{ formatDate(month.signalingDeadline) }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-muted-color">Status</label>
          <p class="mt-1">
            <Tag
              :value="statusLabel(month.status)"
              :severity="statusSeverity(month.status)"
            />
          </p>
        </div>
      </div>
    </div>

    <div class="bg-surface-ground border border-surface rounded-lg flex flex-1 flex-col min-h-0">
      <div class="p-4 flex-1 flex flex-col min-h-0">
        <h3 class="text-lg font-semibold text-color mb-4">Escalas</h3>
        <DataTable
          :value="month.schedules"
          stripedRows
          size="small"
          scrollHeight="flex"
          :tableStyle="{ minWidth: '100%' }"
          class="flex-1"
        >
          <Column field="day" header="Dia" style="width: 5rem" />
          <Column field="name" header="Nome" />
          <Column header="Horário">
            <template #body="{ data }">
              {{ data.time || '—' }}
            </template>
          </Column>
          <Column header="Comunidade">
            <template #body="{ data }">
              {{ data.community?.name || '—' }}
            </template>
          </Column>
          <Column header="Padre">
            <template #body="{ data }">
              {{ data.priest?.name || '—' }}
            </template>
          </Column>
          <Column header="Funções">
            <template #body="{ data }">
              <div class="flex flex-wrap gap-1">
                <Tag
                  v-for="role in data.roles"
                  :key="role.id"
                  :value="role.quantity > 1 ? `${role.name} (${role.quantity})` : role.name"
                  severity="info"
                  rounded
                />
                <span v-if="!data.roles.length" class="text-muted-color">—</span>
              </div>
            </template>
          </Column>
          <Column header="Alocações" style="width: 8rem">
            <template #body="{ data }">
              <div class="flex items-center gap-2">
                <Tag
                  :value="`${data.assignments?.length || 0}/${data.roles.reduce((s: number, r: any) => s + (r.quantity || 1), 0)}`"
                  :severity="(data.assignments?.length || 0) >= data.roles.reduce((s: number, r: any) => s + (r.quantity || 1), 0) ? 'success' : 'warn'"
                />
                <Button
                  v-if="data.assignments?.length"
                  icon="pi pi-users"
                  text
                  rounded
                  size="small"
                  v-tooltip="'Ver voluntários'"
                  @click="viewAssignments(data)"
                />
              </div>
            </template>
          </Column>
          <Column header="Sinalizações" style="width: 8rem">
            <template #body="{ data }">
              {{ signalCount(data) }}
            </template>
          </Column>
          <Column header="Descrição">
            <template #body="{ data }">
              <span class="text-muted-color">{{ data.description || '—' }}</span>
            </template>
          </Column>
          <template #empty>
            <p class="text-center text-muted-color py-4">Nenhuma escala cadastrada</p>
          </template>
        </DataTable>
      </div>

      <div class="flex justify-end gap-2 p-4 border-t border-surface">
        <Button
          v-if="$page.props.can.scheduleMonthsManage && month.status === 'rascunho'"
          v-tooltip="'Editar escalas'"
          label="Editar"
          severity="warn"
          @click="$inertia.get(`/schedules/months/${month.id}/edit`)"
        />
        <Button
          v-tooltip="'Voltar para listagem'"
          label="Voltar"
          severity="secondary"
          @click="$inertia.get('/schedules/months')"
        />
      </div>
    </div>

    <Dialog
      v-model:visible="dialogVisible"
      modal
      :header="selectedSchedule ? `${selectedSchedule.name} — Dia ${selectedSchedule.day}` : ''"
      :style="{ width: '500px' }"
      class="max-w-full"
    >
      <template v-if="selectedSchedule?.assignments?.length">
        <div
          v-for="assignment in selectedSchedule.assignments"
          :key="assignment.id"
          class="flex items-center gap-3 py-2 border-b border-surface last:border-b-0"
        >
          <i class="pi pi-user text-muted-color" />
          <span class="text-color">{{ assignment.userName }}</span>
          <span class="text-muted-color text-xs">—</span>
          <Tag :value="assignment.ministryRoleName" severity="info" rounded />
        </div>
      </template>
      <div v-else class="text-center py-4 text-muted-color">
        <i class="pi pi-users text-2xl mb-2 block" />
        <p class="text-sm">Nenhum voluntário alocado.</p>
      </div>
    </Dialog>
  </div>
</template>
