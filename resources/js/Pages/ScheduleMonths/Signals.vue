<script setup lang="ts">
import { router } from '@inertiajs/vue3'
import { ref, computed } from 'vue'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Message from 'primevue/message'
import Breadcrumb from 'primevue/breadcrumb'
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import { useToast } from 'primevue/usetoast'

const props = defineProps<{
  months: Array<{
    id: number
    year: number
    month: number
    status: string
    schedules: Array<{
      id: number
      day: number
      name: string
      description: string | null
      time: string
      community: { id: number; name: string } | null
      priest: { id: number; name: string } | null
      roles: Array<{ id: number; name: string; quantity: number }>
      userSignal: string | null
    }>
  }>
  flash?: { success?: string | null; error?: string | null }
}>()

const toast = useToast()
const processingId = ref<number | null>(null)

const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

const weekdayNames = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']

function formatDayFull(day: number, month: number, year: number) {
  const d = new Date(year, month - 1, day)
  const dateStr = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const weekday = weekdayNames[d.getDay()]
  return `${dateStr} - ${weekday}`
}

const home = ref({ icon: 'pi pi-home', command: () => router.get('/dashboard') })
const breadcrumbItems = ref([{ label: 'Sinalizar Disponibilidade' }])

function signal(scheduleId: number, response: 'sim' | 'nao') {
  processingId.value = scheduleId
  router.post(
    `/schedules/${scheduleId}/signal`,
    { response },
    {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        processingId.value = null
        toast.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: response === 'sim' ? 'Disponibilidade confirmada!' : 'Indisponibilidade registrada!',
          life: 3000,
        })
      },
      onError: () => {
        processingId.value = null
      },
      onFinish: () => {
        processingId.value = null
      },
    }
  )
}

if (props.flash?.success) {
  toast.add({ severity: 'success', summary: 'Sucesso', detail: props.flash.success, life: 3000 })
}
if (props.flash?.error) {
  toast.add({ severity: 'error', summary: 'Erro', detail: props.flash.error, life: 3000 })
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-color">Sinalizar Disponibilidade</h2>
      <Breadcrumb :home="home" :model="breadcrumbItems" />
    </div>

    <div
      v-if="months.length === 0"
      class="bg-surface-ground border border-surface rounded-lg p-8 text-center"
    >
      <p class="text-muted-color">Nenhuma escala disponível para sinalização no momento.</p>
      <Button
        label="Voltar ao Dashboard"
        icon="pi pi-home"
        severity="secondary"
        class="mt-4"
        @click="router.get('/dashboard')"
      />
    </div>

    <div v-else class="space-y-6">
      <Accordion :value="months.map((m) => String(m.id))" multiple>
        <AccordionPanel
          v-for="m in months"
          :key="m.id"
          :value="String(m.id)"
        >
          <AccordionHeader>
            <div class="flex items-center gap-3">
              <span class="font-semibold">{{ monthNames[m.month - 1] }} / {{ m.year }}</span>
              <Tag :value="`${m.schedules.length} escala${m.schedules.length !== 1 ? 's' : ''}`" severity="info" rounded />
            </div>
          </AccordionHeader>
          <AccordionContent>
            <div class="space-y-4 pt-2">
              <div
                v-for="s in m.schedules"
                :key="s.id"
                class="bg-surface-ground border border-surface rounded-xl p-5"
              >
                <div class="flex flex-col gap-3">
                  <div class="flex items-center justify-between">
                    <Tag :value="formatDayFull(s.day, m.month, m.year)" severity="info" />
                    <div v-if="s.userSignal">
                      <Tag
                        :value="s.userSignal === 'sim' ? 'Você marcou SIM' : 'Você marcou NÃO'"
                        :severity="s.userSignal === 'sim' ? 'success' : 'danger'"
                      />
                    </div>
                  </div>

                  <h3 class="text-lg font-bold text-color">{{ s.name }}</h3>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div v-if="s.time" class="flex gap-2">
                      <span class="text-muted-color">Horário:</span>
                      <span class="font-medium text-color">{{ s.time }}</span>
                    </div>
                    <div class="flex gap-2">
                      <span class="text-muted-color">Comunidade:</span>
                      <span class="font-medium text-color">{{ s.community?.name || '—' }}</span>
                    </div>
                    <div class="flex gap-2">
                      <span class="text-muted-color">Padre:</span>
                      <span class="font-medium text-color">{{ s.priest?.name || '—' }}</span>
                    </div>
                    <div v-if="s.roles.length" class="flex gap-2 items-start">
                      <span class="text-muted-color shrink-0">Funções:</span>
                      <div class="flex flex-wrap gap-1">
                        <Tag
                          v-for="role in s.roles"
                          :key="role.id"
                          :value="role.quantity > 1 ? `${role.name} (${role.quantity})` : role.name"
                          severity="info"
                          rounded
                        />
                      </div>
                    </div>
                  </div>

                  <div v-if="s.description" class="text-sm text-muted-color">
                    {{ s.description }}
                  </div>

                  <div class="flex gap-3 pt-1">
                    <Button
                      label="Sim"
                      icon="pi pi-check"
                      class="flex-1"
                      :severity="s.userSignal === 'sim' ? 'success' : 'secondary'"
                      :outlined="s.userSignal !== 'sim'"
                      :loading="processingId === s.id"
                      :disabled="processingId !== null"
                      @click="signal(s.id, 'sim')"
                    />
                    <Button
                      label="Não"
                      icon="pi pi-times"
                      class="flex-1"
                      :severity="s.userSignal === 'nao' ? 'danger' : 'secondary'"
                      :outlined="s.userSignal !== 'nao'"
                      :loading="processingId === s.id"
                      :disabled="processingId !== null"
                      @click="signal(s.id, 'nao')"
                    />
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
    </div>
  </div>
</template>
