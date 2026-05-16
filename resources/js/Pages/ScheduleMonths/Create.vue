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
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'
import FormField from '../../Components/FormField.vue'
import { useFormValidation } from '../../Composables/useFormValidation'

const props = defineProps<{
  churches: Array<{ id: number; name: string }>
  priests: Array<{ id: number; name: string }>
  ministryRoles: Array<{ id: number; name: string }>
}>()

const home = ref({ icon: 'pi pi-home', command: () => router.get('/dashboard') })
const model = ref([
  { label: 'Meses de Escala', command: () => router.get('/schedules/months') },
  { label: 'Abrir Mês' },
])

const monthNames = [
  { value: 1, label: 'Janeiro' }, { value: 2, label: 'Fevereiro' },
  { value: 3, label: 'Março' }, { value: 4, label: 'Abril' },
  { value: 5, label: 'Maio' }, { value: 6, label: 'Junho' },
  { value: 7, label: 'Julho' }, { value: 8, label: 'Agosto' },
  { value: 9, label: 'Setembro' }, { value: 10, label: 'Outubro' },
  { value: 11, label: 'Novembro' }, { value: 12, label: 'Dezembro' },
]

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 13 }, (_, i) => ({
  value: currentYear + i,
  label: String(currentYear + i),
}))

interface ScheduleEntry {
  day: Date | null
  name: string
  description: string
  time: string
  communityId: number | null
  priestId: number | null
  ministryRoles: Array<{ roleId: number; quantity: number }>
  _key: number
}

let nextKey = 1
const schedules = ref<ScheduleEntry[]>([])

const form = useForm({
  year: currentYear,
  month: null as number | null,
  signalingPeriodDays: 7,
})

useFormValidation(form)

// Schedule dialog state
const scheduleDialogVisible = ref(false)
const editingScheduleKey = ref<number | null>(null)
const scheduleForm = ref<ScheduleEntry>({
  day: null, name: '', description: '', time: '',
  communityId: null, priestId: null, ministryRoles: [], _key: 0,
})
const dialogErrors = ref<Record<string, string>>({})

// Role selector state (per-dialog, not per-schedule)
const roleSelectorRoleId = ref<number | null>(null)
const roleSelectorQty = ref(1)

function resetScheduleForm() {
  scheduleForm.value = {
    day: null, name: '', description: '', time: '',
    communityId: null, priestId: null, ministryRoles: [], _key: 0,
  }
  roleSelectorRoleId.value = null
  roleSelectorQty.value = 1
}

function openAddSchedule() {
  editingScheduleKey.value = null
  resetScheduleForm()
  dialogErrors.value = {}
  scheduleDialogVisible.value = true
}

function openEditSchedule(schedule: ScheduleEntry) {
  editingScheduleKey.value = schedule._key
  scheduleForm.value = {
    day: schedule.day,
    name: schedule.name,
    description: schedule.description,
    time: schedule.time,
    communityId: schedule.communityId,
    priestId: schedule.priestId,
    ministryRoles: schedule.ministryRoles.map(r => ({ ...r })),
    _key: schedule._key,
  }
  roleSelectorRoleId.value = null
  roleSelectorQty.value = 1
  dialogErrors.value = {}
  scheduleDialogVisible.value = true
}

function addRoleToForm() {
  if (!roleSelectorRoleId.value) return
  const existing = scheduleForm.value.ministryRoles.find(r => r.roleId === roleSelectorRoleId.value)
  if (existing) {
    existing.quantity += roleSelectorQty.value
  } else {
    scheduleForm.value.ministryRoles.push({ roleId: roleSelectorRoleId.value, quantity: roleSelectorQty.value })
  }
  roleSelectorRoleId.value = null
  roleSelectorQty.value = 1
}

function removeRoleFromForm(roleId: number) {
  scheduleForm.value.ministryRoles = scheduleForm.value.ministryRoles.filter(r => r.roleId !== roleId)
}

function saveSchedule() {
  dialogErrors.value = {}

  const errs: Record<string, string> = {}
  if (!scheduleForm.value.day) errs.day = 'O campo dia é obrigatório'
  if (!scheduleForm.value.name) errs.name = 'O campo nome é obrigatório'
  if (!scheduleForm.value.time) errs.time = 'O campo horário é obrigatório'
  if (!scheduleForm.value.communityId) errs.communityId = 'O campo comunidade é obrigatório'
  if (!scheduleForm.value.priestId) errs.priestId = 'O campo padre é obrigatório'

  if (Object.keys(errs).length > 0) {
    dialogErrors.value = errs
    return
  }

  if (editingScheduleKey.value !== null) {
    const idx = schedules.value.findIndex(s => s._key === editingScheduleKey.value)
    if (idx !== -1) {
      schedules.value[idx] = { ...scheduleForm.value, _key: editingScheduleKey.value }
    }
  } else {
    scheduleForm.value._key = nextKey++
    schedules.value.push({ ...scheduleForm.value })
  }
  scheduleDialogVisible.value = false
}

function removeSchedule(key: number) {
  schedules.value = schedules.value.filter((s) => s._key !== key)
}

function getRoleName(roleId: number) {
  return props.ministryRoles.find(r => r.id === roleId)?.name ?? '?'
}

const roleOptions = computed(() => {
  const selectedIds = new Set(scheduleForm.value.ministryRoles.map(r => r.roleId))
  return props.ministryRoles.filter(r => !selectedIds.has(r.id))
})

const daysInMonth = computed(() => {
  if (!form.year || !form.month) return 31
  return new Date(form.year, form.month, 0).getDate()
})

function submit() {
  const data = {
    year: form.year,
    month: form.month,
    signalingPeriodDays: form.signalingPeriodDays,
    schedules: schedules.value.map((s) => ({
      day: s.day ? s.day.getDate() : null,
      name: s.name,
      description: s.description || null,
      time: s.time,
      communityId: s.communityId,
      priestId: s.priestId,
      ministryRoles: s.ministryRoles,
    })),
  }

  form.transform(() => data).post('/schedules/months')
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-color">Abrir Mês de Escala</h2>
      <Breadcrumb :home="home" :model="model" />
    </div>

    <form
      @submit.prevent="submit"
      class="bg-surface-ground border border-surface rounded-lg flex-1 flex flex-col min-h-0"
    >
      <div class="p-4 border-b border-surface">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormField field="year">
            <template #default="{ invalid }">
              <FloatLabel>
                <Select
                  id="year"
                  v-model="form.year"
                  :options="years"
                  optionLabel="label"
                  optionValue="value"
                  fluid
                  :invalid="invalid"
                />
                <label for="year">Ano *</label>
              </FloatLabel>
            </template>
          </FormField>

          <FormField field="month">
            <template #default="{ invalid }">
              <FloatLabel>
                <Select
                  id="month"
                  v-model="form.month"
                  :options="monthNames"
                  optionLabel="label"
                  optionValue="value"
                  showClear
                  fluid
                  :invalid="invalid"
                />
                <label for="month">Mês *</label>
              </FloatLabel>
            </template>
          </FormField>

          <FormField field="signalingPeriodDays">
            <template #default="{ invalid }">
              <FloatLabel>
                <InputNumber
                  id="signalingPeriodDays"
                  v-model="form.signalingPeriodDays"
                  :min="1"
                  :max="30"
                  fluid
                  :invalid="invalid"
                />
                <label for="signalingPeriodDays">Dias para sinalização *</label>
              </FloatLabel>
            </template>
          </FormField>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-color">Escalas</h3>
          <Button
            label="Adicionar Escala"
            icon="pi pi-plus"
            severity="info"
            size="small"
            @click="openAddSchedule"
          />
        </div>

        <DataTable
          :value="schedules"
          stripedRows
          size="small"
          scrollHeight="flex"
          :tableStyle="{ minWidth: '100%' }"
          class="flex-1"
        >
          <Column header="Dia" style="width: 5rem">
            <template #body="{ data }">
              {{ data.day ? data.day.getDate().toString().padStart(2, '0') : '—' }}
            </template>
          </Column>
          <Column field="name" header="Nome" />
          <Column header="Horário" style="width: 6rem">
            <template #body="{ data }">
              {{ data.time || '—' }}
            </template>
          </Column>
          <Column header="Funções">
            <template #body="{ data }">
              <div class="flex flex-wrap gap-1">
                <Tag
                  v-for="role in data.ministryRoles"
                  :key="role.roleId"
                  :value="role.quantity > 1 ? `${getRoleName(role.roleId)} (${role.quantity})` : getRoleName(role.roleId)"
                  severity="info"
                  rounded
                />
                <span v-if="!data.ministryRoles.length" class="text-muted-color">—</span>
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
                  @click="openEditSchedule(data)"
                />
                <Button
                  v-tooltip="'Excluir'"
                  icon="pi pi-trash"
                  text
                  rounded
                  severity="danger"
                  @click="removeSchedule(data._key)"
                />
              </div>
            </template>
          </Column>
          <template #empty>
            <p class="text-center text-muted-color py-4">
              Nenhuma escala cadastrada. Clique em "Adicionar Escala" para começar.
            </p>
          </template>
        </DataTable>
      </div>

      <div class="flex justify-end gap-2 p-4 border-t border-surface">
        <Button
          type="submit"
          label="Abrir Mês"
          :disabled="form.processing"
          severity="info"
        />
        <Button
          label="Cancelar"
          severity="secondary"
          outlined
          @click="$inertia.get('/schedules/months')"
        />
      </div>
    </form>

    <!-- Schedule Dialog -->
    <Dialog
      v-model:visible="scheduleDialogVisible"
      :header="editingScheduleKey !== null ? 'Editar Escala' : 'Nova Escala'"
      modal
      :style="{ width: '550px' }"
      :closable="false"
      @after-hide="dialogErrors = {}"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <FloatLabel>
            <DatePicker
              id="sf-day"
              v-model="scheduleForm.day"
              :minDate="new Date(form.year, form.month ? form.month - 1 : 0, 1)"
              :maxDate="new Date(form.year, form.month ? form.month - 1 : 0, daysInMonth)"
              dateFormat="dd/mm/yy"
              view="date"
              showIcon
              iconDisplay="input"
              fluid
              :invalid="!!dialogErrors.day"
              :manualInput="false"
            />
            <label for="sf-day">Dia *</label>
          </FloatLabel>
          <small v-if="dialogErrors.day" class="text-red-500 block mt-1">{{ dialogErrors.day }}</small>
        </div>

        <div>
          <FloatLabel>
            <InputText id="sf-name" v-model="scheduleForm.name" fluid :invalid="!!dialogErrors.name" />
            <label for="sf-name">Nome *</label>
          </FloatLabel>
          <small v-if="dialogErrors.name" class="text-red-500 block mt-1">{{ dialogErrors.name }}</small>
        </div>

        <div>
          <FloatLabel>
            <InputText id="sf-time" v-model="scheduleForm.time" type="time" fluid placeholder="" :invalid="!!dialogErrors.time" />
            <label for="sf-time">Horário *</label>
          </FloatLabel>
          <small v-if="dialogErrors.time" class="text-red-500 block mt-1">{{ dialogErrors.time }}</small>
        </div>

        <div>
          <FloatLabel>
            <Select
              id="sf-community"
              v-model="scheduleForm.communityId"
              :options="churches"
              optionLabel="name"
              optionValue="id"
              showClear
              fluid
              :invalid="!!dialogErrors.communityId"
            />
            <label for="sf-community">Comunidade *</label>
          </FloatLabel>
          <small v-if="dialogErrors.communityId" class="text-red-500 block mt-1">{{ dialogErrors.communityId }}</small>
        </div>

        <div>
          <FloatLabel>
            <Select
              id="sf-priest"
              v-model="scheduleForm.priestId"
              :options="priests"
              optionLabel="name"
              optionValue="id"
              showClear
              fluid
              :invalid="!!dialogErrors.priestId"
            />
            <label for="sf-priest">Padre *</label>
          </FloatLabel>
          <small v-if="dialogErrors.priestId" class="text-red-500 block mt-1">{{ dialogErrors.priestId }}</small>
        </div>

        <div>
          <FloatLabel>
            <InputText id="sf-desc" v-model="scheduleForm.description" fluid />
            <label for="sf-desc">Descrição</label>
          </FloatLabel>
        </div>
      </div>

      <!-- Role selector -->
      <div class="mt-4 pt-4 border-t border-surface">
        <label class="block text-sm font-medium text-muted-color mb-2">Funções</label>

        <div class="flex items-end gap-2 mb-3">
          <div class="flex-1">
            <FloatLabel>
              <Select
                id="sf-role-select"
                v-model="roleSelectorRoleId"
                :options="roleOptions"
                optionLabel="name"
                optionValue="id"
                showClear
                fluid
              />
              <label for="sf-role-select">Selecionar função</label>
            </FloatLabel>
          </div>
          <div style="width: 5rem">
            <InputNumber
              v-model="roleSelectorQty"
              :min="1"
              :max="99"
              fluid
            />
          </div>
          <Button
            icon="pi pi-plus"
            severity="info"
            :disabled="!roleSelectorRoleId"
            @click="addRoleToForm"
          />
        </div>

        <div class="flex flex-wrap gap-2">
          <div
            v-for="role in scheduleForm.ministryRoles"
            :key="role.roleId"
            class="flex items-center gap-1 bg-info rounded-full px-3 py-1 text-sm cursor-pointer"
            @click="removeRoleFromForm(role.roleId)"
          >
            <span>{{ getRoleName(role.roleId) }} ({{ role.quantity }})</span>
            <span class="pi pi-times-circle text-xs" />
          </div>
          <span v-if="!scheduleForm.ministryRoles.length" class="text-sm text-muted-color">
            Nenhuma função selecionada
          </span>
        </div>
      </div>

      <div class="flex justify-end gap-2 mt-6">
        <Button
          label="Salvar Escala"
          severity="info"
          @click="saveSchedule"
        />
        <Button
          label="Cancelar"
          severity="secondary"
          outlined
          @click="scheduleDialogVisible = false"
        />
      </div>
    </Dialog>
  </div>
</template>
