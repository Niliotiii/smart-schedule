<script setup lang="ts">
import { ref } from 'vue'
import Tag from 'primevue/tag'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import LiturgiaCard from '../Liturgia/Card.vue'
import ScheduleCalendarCard from '../ScheduleCalendar/Card.vue'
import type { LiturgiaData } from '../../lib/liturgia'

const props = defineProps<{
  can: {
    scheduleMonthsRead: boolean
  }
  liturgia: LiturgiaData | null
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
    assignments: Array<{
      userId: number
      userName: string
      ministryRoleName: string
    }>
  }>
}>()

const activeTab = ref('0')
</script>

<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-color">Dashboard</h2>
      <p class="text-muted-color text-sm mt-1">Bem-vindo ao Smart Schedule</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-if="can.scheduleMonthsRead"
        class="cursor-pointer rounded-lg border border-surface shadow-sm bg-surface-ground hover:shadow-md transition-shadow"
        @click="$inertia.get('/schedules/signals')"
      >
        <div class="flex items-center gap-4 p-4">
          <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
            <i class="pi pi-flag text-xl text-primary" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-color">Sinalizar</h3>
            <p class="text-sm text-muted-color">Sinalizar disponibilidade para escalas</p>
          </div>
        </div>
      </div>
      <div v-else class="rounded-lg border border-surface shadow-sm bg-surface-ground">
        <div class="flex items-center gap-4 p-4">
          <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-surface-100">
            <i class="pi pi-flag text-xl text-muted-color" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-muted-color">Sinalizar</h3>
            <Tag value="Sem permissão" severity="secondary" class="mt-1" />
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6 rounded-xl border border-surface shadow-sm bg-surface-ground overflow-hidden">
      <Tabs v-model:value="activeTab">
        <TabList>
          <Tab value="0">Calendário de Escalas</Tab>
          <Tab value="1">Liturgia Diária</Tab>
        </TabList>

        <TabPanels>
          <TabPanel value="0">
            <ScheduleCalendarCard :user-schedules="userSchedules" />
          </TabPanel>
          <TabPanel value="1">
            <LiturgiaCard :liturgia="liturgia" />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  </div>
</template>
