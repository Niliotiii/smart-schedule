<script setup lang="ts">
import { useForm, router } from '@inertiajs/vue3'
import { ref, computed } from 'vue'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import DatePicker from 'primevue/datepicker'
import Select from 'primevue/select'
import Button from 'primevue/button'
import Breadcrumb from 'primevue/breadcrumb'
import FloatLabel from 'primevue/floatlabel'
import Textarea from 'primevue/textarea'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'

const props = defineProps<{
  month: {
    id: number
    year: number
    month: number
    openedAt: string
    signalingDeadline: string
    isSignalingActive: boolean
    createdBy: { id: number; name: string } | null
    schedules: Array<{
      id: number
      day: number
      name: string
      description: string | null
      time: string | null
      community: { id: number; name: string } | null
      priest: { id: number; name: string } | null
      roles: Array<{ id: number; name: string; quantity: number }>
      assignments: Array<{ id: number; userId: number; userName: string; ministryRoleId: number; ministryRoleName: string }>
    }>
  }
  churches: Array<{ id: number; name: string }>
  priests: Array<{ id: number; name: string }>
  ministryRoles: Array<{ id: number; name: string }>
  userTypes: Array<{ id: number; name: string }>
  eligibleUsers: Array<{ id: number; name: string; ministryRoleIds: number[]; userTypeId: number | null }>
  flash?: { success?: string | null; error?: string | null; warning?: string | null }
}>()

const confirm = useConfirm()
const toast = useToast()
const generating = ref(false)
const editDialogVisible = ref(false)
const editingSchedule = ref<any>(null)
const isAddingSchedule = ref(false)

// Assignment management state
const assignDialogVisible = ref(false)
const assigningSchedule = ref<any>(null)
const assignUserId = ref<number | null>(null)
const assignRoleId = ref<number | null>(null)

// Role selector state
const roleSelectorRoleId = ref<number | null>(null)
const roleSelectorQty = ref(1)
const roleSelectorUserTypeId = ref<number | null>(null)
const slotAssignments = ref<Record<number, Array<{ userId: number | null; userTypeId: number | null }>>>({})

const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

const monthLabel = computed(() => `${monthNames[props.month.month - 1]} / ${props.month.year}`)

const home = ref({ icon: 'pi pi-home', command: () => router.get('/dashboard') })
const model = ref([
  { label: 'Meses de Escala', command: () => router.get('/schedules/months') },
  { label: 'Editar Escalas' },
])

const editForm = useForm({
  day: null as Date | number | null,
  name: '',
  description: '',
  time: '',
  communityId: null as number | null,
  priestId: null as number | null,
  ministryRoles: [] as Array<{ roleId: number; quantity: number }>,
})

const roleOptions = computed(() => {
  const selectedIds = new Set(editForm.ministryRoles.map(r => r.roleId))
  return props.ministryRoles.filter(r => !selectedIds.has(r.id))
})

function getRoleName(roleId: number) {
  return props.ministryRoles.find(r => r.id === roleId)?.name ?? '?'
}

function addRoleToForm() {
  if (!roleSelectorRoleId.value) return
  const roleId = roleSelectorRoleId.value
  const qty = roleSelectorQty.value
  const userTypeId = roleSelectorUserTypeId.value
  const existing = editForm.ministryRoles.find(r => r.roleId === roleId)
  if (existing) {
    existing.quantity += qty
  } else {
    editForm.ministryRoles.push({ roleId, quantity: qty })
  }
  initSlotsForRole(roleId, qty, userTypeId)
  roleSelectorRoleId.value = null
  roleSelectorQty.value = 1
  roleSelectorUserTypeId.value = null
}

function removeRoleFromForm(roleId: number) {
  editForm.ministryRoles = editForm.ministryRoles.filter(r => r.roleId !== roleId)
  delete slotAssignments.value[roleId]
}

function initSlotsForRole(roleId: number, qty: number, userTypeId: number | null = null) {
  const current = slotAssignments.value[roleId] || []
  for (let i = 0; i < qty; i++) {
    current.push({ userId: null, userTypeId })
  }
  slotAssignments.value = { ...slotAssignments.value, [roleId]: current }
}

function updateSlotUserId(roleId: number, slotIndex: number, userId: number | null) {
  const slots = slotAssignments.value[roleId]
  if (slots && slots[slotIndex]) {
    slots[slotIndex].userId = userId
    slotAssignments.value = { ...slotAssignments.value, [roleId]: [...slots] }
  }
}

function updateSlotUserTypeId(roleId: number, slotIndex: number, userTypeId: number | null) {
  const slots = slotAssignments.value[roleId]
  if (slots && slots[slotIndex]) {
    slots[slotIndex].userTypeId = userTypeId
    // Clear user if no longer matches the new user type
    if (userTypeId !== null && slots[slotIndex].userId !== null) {
      const user = props.eligibleUsers.find(u => u.id === slots[slotIndex].userId)
      if (user && user.userTypeId !== userTypeId) {
        slots[slotIndex].userId = null
      }
    }
    slotAssignments.value = { ...slotAssignments.value, [roleId]: [...slots] }
  }
}

function removeSlot(roleId: number, slotIndex: number) {
  const slots = slotAssignments.value[roleId]
  if (!slots) return
  slots.splice(slotIndex, 1)
  slotAssignments.value = { ...slotAssignments.value, [roleId]: [...slots] }
  // Decrement quantity in the form
  const roleEntry = editForm.ministryRoles.find(r => r.roleId === roleId)
  if (roleEntry) {
    roleEntry.quantity = slots.length
    if (slots.length === 0) {
      removeRoleFromForm(roleId)
    }
  }
}

const slotRows = computed(() => {
  const rows: Array<{ roleId: number; roleName: string; slotIndex: number; userId: number | null; userTypeId: number | null; eligible: Array<{ id: number; name: string }> }> = []
  for (const mr of editForm.ministryRoles) {
    const name = getRoleName(mr.roleId)
    const slots = slotAssignments.value[mr.roleId] || []
    for (let i = 0; i < slots.length; i++) {
      const assignedIds = new Set(
        slots
          .filter((_, idx) => idx !== i && _.userId !== null)
          .map((_) => _.userId!)
      )
      let eligible = props.eligibleUsers
        .filter((u) => u.ministryRoleIds.includes(mr.roleId))
        .filter((u) => !assignedIds.has(u.id))
      // Filter by user type if set on the slot
      if (slots[i].userTypeId !== null) {
        eligible = eligible.filter((u) => u.userTypeId === slots[i].userTypeId)
      }
      rows.push({
        roleId: mr.roleId,
        roleName: name,
        slotIndex: i,
        userId: slots[i].userId,
        userTypeId: slots[i].userTypeId,
        eligible,
      })
    }
  }
  return rows
})

function openAdd() {
  isAddingSchedule.value = true
  editingSchedule.value = null
  editForm.clearErrors()
  editForm.defaults({
    day: null,
    name: '',
    description: '',
    time: '',
    communityId: null,
    priestId: null,
    ministryRoles: [],
  })
  editForm.reset()
  roleSelectorRoleId.value = null
  roleSelectorQty.value = 1
  roleSelectorUserTypeId.value = null
  slotAssignments.value = {}
  editDialogVisible.value = true
}

function openEdit(schedule: any) {
  isAddingSchedule.value = false
  editingSchedule.value = schedule
  editForm.clearErrors()
  const dayDate = new Date(props.month.year, props.month.month - 1, schedule.day)
  editForm.defaults({
    day: dayDate,
    name: schedule.name,
    description: schedule.description || '',
    time: schedule.time || '',
    communityId: schedule.community?.id || null,
    priestId: schedule.priest?.id || null,
    ministryRoles: schedule.roles.map((r: any) => ({ roleId: r.id, quantity: r.quantity })),
  })
  editForm.reset()
  roleSelectorRoleId.value = null
  roleSelectorQty.value = 1
  roleSelectorUserTypeId.value = null
  // Build slotAssignments from existing roles and assignments
  const slots: Record<number, Array<{ userId: number | null; userTypeId: number | null }>> = {}
  for (const r of schedule.roles) {
    const qty = r.quantity
    const arr: Array<{ userId: number | null; userTypeId: number | null }> = []
    const roleAssignments = (schedule.assignments || []).filter((a: any) => a.ministryRoleId === r.id)
    for (let i = 0; i < qty; i++) {
      const assignment = roleAssignments[i]
      arr.push({ userId: assignment ? assignment.userId : null, userTypeId: r.userTypeId ?? null })
    }
    slots[r.id] = arr
  }
  slotAssignments.value = slots
  editDialogVisible.value = true
}

function submitEdit() {
  editForm
    .transform((data) => {
      const assignments: Array<{ roleId: number; userId: number }> = []
      for (const [roleIdStr, slots] of Object.entries(slotAssignments.value)) {
        for (const slot of slots) {
          if (slot.userId !== null) {
            assignments.push({ roleId: Number(roleIdStr), userId: slot.userId })
          }
        }
      }
      return {
        ...data,
        day: data.day instanceof Date ? data.day.getDate() : data.day,
        assignments: assignments.length > 0 ? assignments : undefined,
      }
    })
    .submit(
      isAddingSchedule.value ? 'post' : 'put',
      isAddingSchedule.value
        ? `/schedules/months/${props.month.id}/schedules`
        : `/schedules/months/${props.month.id}/schedules/${editingSchedule.value?.id}`,
      {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          editDialogVisible.value = false
          editingSchedule.value = null
        },
      }
    )
}

function confirmDelete(scheduleId: number) {
  confirm.require({
    message: 'Tem certeza que deseja excluir esta escala? As sinalizações associadas também serão removidas.',
    header: 'Confirmação',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Sim',
    rejectLabel: 'Não',
    rejectProps: { severity: 'danger' },
    accept: () => {
      router.delete(`/schedules/months/${props.month.id}/schedules/${scheduleId}`, {
        preserveState: true,
        preserveScroll: true,
      })
    },
  })
}

const formatDate = (iso: string) => {
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

if (props.flash?.success) {
  toast.add({ severity: 'success', summary: 'Sucesso', detail: props.flash.success, life: 3000 })
}
if (props.flash?.error) {
  toast.add({ severity: 'error', summary: 'Erro', detail: props.flash.error, life: 3000 })
}
if (props.flash?.warning) {
  toast.add({ severity: 'warn', summary: 'Atenção', detail: props.flash.warning, life: 6000 })
}

function confirmGenerate() {
  confirm.require({
    message: 'A alocação automática irá substituir todas as alocações existentes para este mês. Deseja continuar?',
    header: 'Alocar Automaticamente',
    icon: 'pi pi-cog',
    acceptLabel: 'Gerar',
    rejectLabel: 'Cancelar',
    rejectProps: { severity: 'secondary' },
    accept: () => {
      generating.value = true
      router.post(`/schedules/months/${props.month.id}/generate`, {}, {
        preserveScroll: true,
        onFinish: () => { generating.value = false },
      })
    },
  })
}

function openAssign(schedule: any) {
  assigningSchedule.value = schedule
  assignUserId.value = null
  assignRoleId.value = null
  assignDialogVisible.value = true
}

function eligibleUsersForSchedule(schedule: any) {
  const scheduleRoleIds = new Set(schedule.roles.map((r: any) => r.id))
  return props.eligibleUsers.filter((u) =>
    u.ministryRoleIds.some((rid) => scheduleRoleIds.has(rid))
  )
}

function totalRolesQuantity(schedule: any) {
  return schedule.roles.reduce((sum: number, r: any) => sum + (r.quantity || 1), 0)
}

function totalAssignmentRolesCount(schedule: any) {
  return `${schedule.assignments?.length || 0}/${totalRolesQuantity(schedule)}`
}

function isFullyAllocated(schedule: any) {
  return (schedule.assignments?.length || 0) >= totalRolesQuantity(schedule)
}

function usersForRole(schedule: any, roleId: number) {
  const scheduleRoleIds = new Set(schedule.roles.map((r: any) => r.id))
  if (!scheduleRoleIds.has(roleId)) return []
  const assignedUserIds = new Set(
    (schedule.assignments || [])
      .filter((a: any) => a.ministryRoleId === roleId)
      .map((a: any) => a.userId)
  )
  return props.eligibleUsers.filter(
    (u) => u.ministryRoleIds.includes(roleId) && !assignedUserIds.has(u.id)
  )
}

function removeAssignment(scheduleId: number, assignmentId: number) {
  confirm.require({
    message: 'Remover esta alocação?',
    header: 'Confirmação',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Remover',
    rejectLabel: 'Cancelar',
    rejectProps: { severity: 'secondary' },
    accept: () => {
      router.delete(`/schedules/months/${props.month.id}/assignments/${assignmentId}`, {
        preserveState: true,
        preserveScroll: true,
      })
    },
  })
}

function submitAssign() {
  if (!assignUserId.value || !assignRoleId.value || !assigningSchedule.value) return
  router.post(
    `/schedules/months/${props.month.id}/assignments`,
    {
      scheduleId: assigningSchedule.value.id,
      userId: assignUserId.value,
      ministryRoleId: assignRoleId.value,
    },
    {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        assignDialogVisible.value = false
        assigningSchedule.value = null
      },
    }
  )
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-color">Editar Escalas — {{ monthLabel }}</h2>
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
              :value="month.isSignalingActive ? 'Aberto' : 'Encerrado'"
              :severity="month.isSignalingActive ? 'info' : 'secondary'"
            />
          </p>
        </div>
      </div>
    </div>

    <div class="bg-surface-ground border border-surface rounded-lg flex flex-1 flex-col min-h-0">
      <div class="p-4 flex-1 flex flex-col min-h-0">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-color">Escalas</h3>
          <div class="flex items-center gap-2">
            <Button
              label="Alocar Automaticamente"
              icon="pi pi-cog"
              severity="info"
              size="small"
              :loading="generating"
              :disabled="generating"
              @click="confirmGenerate"
            />
            <Button
              label="Adicionar Escala"
              icon="pi pi-plus"
              severity="info"
              size="small"
              @click="openAdd"
            />
          </div>
        </div>
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
          <Column header="Descrição">
            <template #body="{ data }">
              <span class="text-muted-color">{{ data.description || '—' }}</span>
            </template>
          </Column>
          <Column header="Alocações">
            <template #body="{ data }">
              <div class="flex items-center gap-2">
                <Tag
                  :value="totalAssignmentRolesCount(data)"
                  :severity="isFullyAllocated(data) ? 'success' : 'warn'"
                />
              </div>
            </template>
          </Column>
          <Column header="Ações" :exportable="false" style="width: 8rem">
            <template #body="{ data }">
              <div class="flex items-center gap-1">
                <Button
                  v-tooltip="'Editar'"
                  icon="pi pi-pencil"
                  text
                  rounded
                  severity="warn"
                  @click="openEdit(data)"
                />
                <Button
                  v-tooltip="'Excluir'"
                  icon="pi pi-trash"
                  text
                  rounded
                  severity="danger"
                  @click="confirmDelete(data.id)"
                />
              </div>
            </template>
          </Column>
          <template #empty>
            <p class="text-center text-muted-color py-4">Nenhuma escala cadastrada</p>
          </template>
        </DataTable>
      </div>

      <div class="flex justify-end gap-2 p-4 border-t border-surface">
        <Button
          v-tooltip="'Voltar para listagem'"
          label="Voltar"
          severity="secondary"
          @click="$inertia.get('/schedules/months')"
        />
      </div>
    </div>

    <Dialog
      v-model:visible="editDialogVisible"
      :header="isAddingSchedule ? 'Nova Escala' : 'Editar Escala — Dia ' + editingSchedule?.day"
      modal
      :style="{ width: '750px' }"
      :closable="false"
      @after-hide="editForm.clearErrors()"
    >
      <form @submit.prevent="submitEdit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FloatLabel>
              <DatePicker
                id="edit-day"
                v-model="editForm.day"
                :minDate="new Date(month.year, month.month - 1, 1)"
                :maxDate="new Date(month.year, month.month, 0)"
                dateFormat="dd/mm/yy"
                view="date"
                showIcon
                iconDisplay="input"
                fluid
                :invalid="!!editForm.errors.day"
                :manualInput="false"
              />
              <label for="edit-day">Dia *</label>
            </FloatLabel>
            <small v-if="editForm.errors.day" class="text-red-500 block mt-1">{{ editForm.errors.day }}</small>
          </div>

          <div>
            <FloatLabel>
              <InputText id="edit-name" v-model="editForm.name" fluid :invalid="!!editForm.errors.name" />
              <label for="edit-name">Nome *</label>
            </FloatLabel>
            <small v-if="editForm.errors.name" class="text-red-500 block mt-1">{{ editForm.errors.name }}</small>
          </div>

          <div>
            <FloatLabel>
              <InputText id="edit-time" v-model="editForm.time" type="time" fluid :invalid="!!editForm.errors.time" placeholder="" />
              <label for="edit-time">Horário *</label>
            </FloatLabel>
            <small v-if="editForm.errors.time" class="text-red-500 block mt-1">{{ editForm.errors.time }}</small>
          </div>

          <div>
            <FloatLabel>
              <Select
                id="edit-community"
                v-model="editForm.communityId"
                :options="churches"
                optionLabel="name"
                optionValue="id"
                showClear
                fluid
                :invalid="!!editForm.errors.communityId"
              />
              <label for="edit-community">Comunidade *</label>
            </FloatLabel>
            <small v-if="editForm.errors.communityId" class="text-red-500 block mt-1">{{ editForm.errors.communityId }}</small>
          </div>

          <div>
            <FloatLabel>
              <Select
                id="edit-priest"
                v-model="editForm.priestId"
                :options="priests"
                optionLabel="name"
                optionValue="id"
                showClear
                fluid
                :invalid="!!editForm.errors.priestId"
              />
              <label for="edit-priest">Padre *</label>
            </FloatLabel>
            <small v-if="editForm.errors.priestId" class="text-red-500 block mt-1">{{ editForm.errors.priestId }}</small>
          </div>

          <div>
            <FloatLabel>
              <Textarea id="edit-desc" v-model="editForm.description" fluid />
              <label for="edit-desc">Descrição</label>
            </FloatLabel>
          </div>
        </div>

        <!-- Role selector -->
        <div class="mt-4 pt-4 border-t border-surface">
          <label class="block text-sm font-medium text-muted-color mb-2">Adicionar Função</label>

          <div class="flex items-end gap-2 mb-3">
            <div class="flex-1">
              <Select
                id="edit-role-select"
                v-model="roleSelectorRoleId"
                :options="roleOptions"
                optionLabel="name"
                optionValue="id"
                showClear
                fluid
              />
            </div>
            <div style="width: 5rem">
              <InputNumber
                v-model="roleSelectorQty"
                :min="1"
                :max="99"
                fluid
              />
            </div>
            <div style="width: 8rem">
              <Select
                v-model="roleSelectorUserTypeId"
                :options="userTypes"
                optionLabel="name"
                optionValue="id"
                showClear
                fluid
                placeholder="Tipo"
              />
            </div>
            <Button
              icon="pi pi-plus"
              severity="info"
              :disabled="!roleSelectorRoleId"
              @click="addRoleToForm"
            />
          </div>

          <DataTable
            v-if="slotRows.length"
            :value="slotRows"
            size="small"
            stripedRows
          >
            <Column field="roleName" header="Função" style="width: 8rem" />
            <Column header="Vaga">
              <template #body="{ data }">
                #{{ data.slotIndex + 1 }}
              </template>
            </Column>
            <Column header="Tipo">
              <template #body="{ data }">
                <Select
                  :modelValue="data.userTypeId"
                  @update:modelValue="(val: number | null) => updateSlotUserTypeId(data.roleId, data.slotIndex, val)"
                  :options="userTypes"
                  optionLabel="name"
                  optionValue="id"
                  showClear
                  fluid
                  placeholder="Tipo"
                />
              </template>
            </Column>
            <Column header="Usuário">
              <template #body="{ data }">
                <Select
                  :modelValue="data.userId"
                  @update:modelValue="(val: number | null) => updateSlotUserId(data.roleId, data.slotIndex, val)"
                  :options="data.eligible"
                  optionLabel="name"
                  optionValue="id"
                  showClear
                  fluid
                  placeholder="Selecionar usuário"
                />
              </template>
            </Column>
            <Column style="width: 4rem">
              <template #body="{ data }">
                <Button
                  icon="pi pi-trash"
                  text
                  rounded
                  severity="danger"
                  size="small"
                  v-tooltip="'Remover vaga'"
                  @click="removeSlot(data.roleId, data.slotIndex)"
                />
              </template>
            </Column>
          </DataTable>
        </div>

        <div class="flex justify-end gap-2 mt-6">
          <Button
            type="submit"
            label="Salvar"
            :disabled="editForm.processing"
            severity="info"
          />
          <Button
            label="Cancelar"
            severity="secondary"
            outlined
            @click="editDialogVisible = false"
          />
        </div>
      </form>
    </Dialog>

    <!-- Assignment Dialog -->
    <Dialog
      v-model:visible="assignDialogVisible"
      header="Adicionar Alocação Manual"
      modal
      :style="{ width: '400px' }"
      :closable="false"
    >
      <div class="flex flex-col gap-4">
        <div>
          <label class="block text-sm font-medium text-muted-color mb-2">Função</label>
          <Select
            v-model="assignRoleId"
            :options="assigningSchedule?.roles || []"
            optionLabel="name"
            optionValue="id"
            showClear
            fluid
            placeholder="Selecione uma função"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-muted-color mb-2">Usuário</label>
          <Select
            v-model="assignUserId"
            :options="assignRoleId ? usersForRole(assigningSchedule, assignRoleId) : eligibleUsersForSchedule(assigningSchedule)"
            optionLabel="name"
            optionValue="id"
            showClear
            fluid
            placeholder="Selecione um usuário"
          />
        </div>
      </div>

      <div class="flex justify-end gap-2 mt-6">
        <Button
          label="Adicionar"
          :disabled="!assignUserId || !assignRoleId"
          severity="info"
          @click="submitAssign"
        />
        <Button
          label="Cancelar"
          severity="secondary"
          outlined
          @click="assignDialogVisible = false"
        />
      </div>
    </Dialog>
  </div>
</template>
