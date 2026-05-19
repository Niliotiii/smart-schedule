<script setup lang="ts">
import { ref, computed } from 'vue'
import Dialog from 'primevue/dialog'

const props = defineProps<{
  userSchedules: Array<{
    id: number
    day: number
    year: number
    month: number
    name: string
    description: string | null
    time: string
    community: { id: number; name: string } | null
    priest: { id: number; name: string } | null
    isAssigned: boolean
    assignments: Array<{
      userId: number
      userName: string
      ministryRoleName: string
    }>
  }>
}>()

const now = new Date()
const viewYear = ref(now.getFullYear())
const viewMonth = ref(now.getMonth() + 1)

const ptBrLocale = {
  weekDays: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  months: [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ],
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

function firstDayOfMonth(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay()
}

const calendarDays = computed(() => {
  const totalDays = daysInMonth(viewYear.value, viewMonth.value)
  const startDay = firstDayOfMonth(viewYear.value, viewMonth.value)
  const days: Array<{
    day: number
    hasAssigned: boolean
    hasUnassigned: boolean
    hasAnySchedule: boolean
    schedules: typeof props.userSchedules
  } | null> = []

  for (let i = 0; i < startDay; i++) {
    days.push(null)
  }

  for (let d = 1; d <= totalDays; d++) {
    const schedules = props.userSchedules.filter(
      (s) => s.day === d && s.month === viewMonth.value && s.year === viewYear.value
    )
    const hasAnySchedule = schedules.length > 0
    const hasAssigned = schedules.some((s) => s.isAssigned)
    days.push({
      day: d,
      hasAssigned,
      hasUnassigned: hasAnySchedule && !hasAssigned,
      hasAnySchedule,
      schedules,
    })
  }

  return days
})

const dialogVisible = ref(false)
const selectedDaySchedules = ref<typeof props.userSchedules>([])
const selectedDayLabel = ref('')

function selectDay(day: number, schedules: typeof props.userSchedules) {
  selectedDaySchedules.value = schedules
  selectedDayLabel.value = `${ptBrLocale.months[viewMonth.value - 1]} ${day}, ${viewYear.value}`
  dialogVisible.value = true
}

function prevMonth() {
  if (viewMonth.value === 1) {
    viewMonth.value = 12
    viewYear.value--
  } else {
    viewMonth.value--
  }
}

function nextMonth() {
  if (viewMonth.value === 12) {
    viewMonth.value = 1
    viewYear.value++
  } else {
    viewMonth.value++
  }
}

const monthLabel = computed(() => {
  return `${ptBrLocale.months[viewMonth.value - 1]} ${viewYear.value}`
})
</script>

<template>
  <div>
    <!-- Month navigation -->
    <div class="flex items-center justify-between mb-4">
      <button
        type="button"
        class="p-2 rounded-md text-muted-color hover:bg-emphasis transition-colors"
        @click="prevMonth"
      >
        <i class="pi pi-chevron-left text-lg" />
      </button>
      <h3 class="text-lg font-semibold text-color">{{ monthLabel }}</h3>
      <button
        type="button"
        class="p-2 rounded-md text-muted-color hover:bg-emphasis transition-colors"
        @click="nextMonth"
      >
        <i class="pi pi-chevron-right text-lg" />
      </button>
    </div>

    <!-- Week day headers -->
    <div class="grid grid-cols-7 gap-1 mb-1">
      <div
        v-for="dayName in ptBrLocale.weekDays"
        :key="dayName"
        class="text-center text-xs font-medium text-muted-color py-1"
      >
        {{ dayName }}
      </div>
    </div>

    <!-- Calendar grid -->
    <div class="grid grid-cols-7 gap-1">
      <div
        v-for="(dayData, idx) in calendarDays"
        :key="idx"
        class="aspect-square"
      >
        <div
          v-if="dayData"
          class="w-full h-full flex flex-col items-center justify-center rounded-lg cursor-pointer transition-colors"
          :class="{
            'bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50': dayData.hasAssigned,
            'bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-900/50': dayData.hasUnassigned,
            'bg-surface-section hover:bg-emphasis': !dayData.hasAnySchedule,
          }"
          @click="selectDay(dayData.day, dayData.schedules)"
        >
          <span class="text-sm font-medium text-color">{{ dayData.day }}</span>
          <span
            class="mt-0.5 w-1.5 h-1.5 rounded-full"
            :class="{
              'bg-green-500': dayData.hasAssigned,
              'bg-amber-500': dayData.hasUnassigned,
              'bg-surface-300': !dayData.hasAnySchedule,
            }"
          />
        </div>
      </div>
    </div>

    <!-- Detail modal -->
    <Dialog
      v-model:visible="dialogVisible"
      modal
      :header="selectedDayLabel"
      :style="{ width: '500px' }"
      class="max-w-full"
    >
      <template v-if="selectedDaySchedules.length > 0">
        <div
          v-for="schedule in selectedDaySchedules"
          :key="schedule.id"
          class="mb-4 last:mb-0 rounded-lg border border-surface bg-surface-ground p-4"
        >
          <div class="flex items-start justify-between gap-2 mb-2">
            <h4 class="font-semibold text-color">{{ schedule.name }}</h4>
            <span class="text-sm text-muted-color shrink-0">{{ schedule.time }}</span>
          </div>

          <div class="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-color mb-3">
            <span v-if="schedule.community">
              <i class="pi pi-building mr-1" />{{ schedule.community.name }}
            </span>
            <span v-if="schedule.priest">
              <i class="pi pi-user mr-1" />{{ schedule.priest.name }}
            </span>
          </div>

          <div v-if="schedule.description" class="text-sm text-muted-color mb-3">
            {{ schedule.description }}
          </div>

          <div v-if="schedule.assignments.length > 0">
            <h5 class="text-xs font-semibold text-muted-color uppercase tracking-wider mb-2">
              Voluntários
            </h5>
            <div class="flex flex-wrap gap-2">
              <div
                v-for="assignment in schedule.assignments"
                :key="assignment.userId"
                class="flex items-center gap-1.5 text-sm bg-surface-section rounded-md px-2.5 py-1.5 border border-surface"
              >
                <i class="pi pi-user text-xs text-muted-color" />
                <span class="text-color">{{ assignment.userName }}</span>
                <span class="text-muted-color text-xs">—</span>
                <span class="text-primary font-medium">{{ assignment.ministryRoleName }}</span>
              </div>
            </div>
          </div>

          <div v-else class="text-sm text-muted-color">
            Nenhum voluntário alocado.
          </div>
        </div>
      </template>

      <div v-else class="text-center py-4 text-muted-color">
        <i class="pi pi-calendar text-2xl mb-2 block" />
        <p class="text-sm">Nenhuma escala neste dia.</p>
      </div>
    </Dialog>
  </div>
</template>
