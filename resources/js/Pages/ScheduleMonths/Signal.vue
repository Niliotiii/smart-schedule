<script setup lang="ts">
import { router } from '@inertiajs/vue3'
import { ref, computed } from 'vue'
import Carousel from 'primevue/carousel'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Message from 'primevue/message'
import Breadcrumb from 'primevue/breadcrumb'
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
      community: { id: number; name: string } | null
      priest: { id: number; name: string } | null
      roles: Array<{ id: number; name: string }>
      userSignal: string | null
    }>
  }
  flash?: { success?: string | null; error?: string | null }
}>()

const toast = useToast()
const processingId = ref<number | null>(null)

const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

const monthLabel = computed(() => `${monthNames[props.month.month - 1]} / ${props.month.year}`)

const weekdayNames = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']

function formatDayFull(day: number) {
  const d = new Date(props.month.year, props.month.month - 1, day)
  const dateStr = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const weekday = weekdayNames[d.getDay()]
  return `${dateStr} - ${weekday}`
}

const home = ref({ icon: 'pi pi-home', command: () => router.get('/dashboard') })
const model = ref([
  { label: 'Meses de Escala', command: () => router.get('/schedules/months') },
  { label: 'Sinalizar Disponibilidade' },
])

const formatDate = (iso: string) => {
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

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
      <Breadcrumb :home="home" :model="model" />
    </div>

    <Message
      v-if="!month.isSignalingActive"
      severity="warn"
      class="mb-4"
    >
      O período de sinalização deste mês já foi encerrado. Não é possível alterar suas respostas.
    </Message>

    <div
      v-if="month.schedules.length === 0"
      class="bg-surface-ground border border-surface rounded-lg p-8 text-center"
    >
      <p class="text-muted-color">Nenhuma escala disponível para sinalização neste mês.</p>
    </div>

    <div v-else class="flex-1 flex flex-col justify-center min-h-0">
      <Carousel
        :value="month.schedules"
        :numVisible="1"
        :numScroll="1"
        :responsiveOptions="[
          { breakpoint: '1024px', numVisible: 1, numScroll: 1 },
          { breakpoint: '768px', numVisible: 1, numScroll: 1 },
        ]"
        :showIndicators="false"
        :showNavigators="month.schedules.length > 1"
        :pt="{
          root: { class: 'flex flex-col' },
          container: { class: 'flex-1 flex items-center' },
          item: { class: 'flex justify-center' },
        }"
      >
      <template #item="slotProps">
        <div
          class="w-full max-w-md mx-auto bg-surface-ground border border-surface rounded-xl p-6 flex flex-col gap-4"
        >
          <div class="text-center">
            <Tag :value="formatDayFull(slotProps.data.day)" severity="info" class="mb-2" />
            <h3 class="text-xl font-bold text-color mt-2">{{ slotProps.data.name }}</h3>
          </div>

          <div class="space-y-2 text-sm">
            <div v-if="slotProps.data.time" class="flex justify-between">
              <span class="text-muted-color">Horário:</span>
              <span class="font-medium text-color">{{ slotProps.data.time }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-color">Comunidade:</span>
              <span class="font-medium text-color">{{ slotProps.data.community?.name || '—' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-color">Padre:</span>
              <span class="font-medium text-color">{{ slotProps.data.priest?.name || '—' }}</span>
            </div>
            <div v-if="slotProps.data.description" class="flex justify-between">
              <span class="text-muted-color">Descrição:</span>
              <span class="font-medium text-color text-right max-w-[60%]">{{ slotProps.data.description }}</span>
            </div>
            <div v-if="slotProps.data.roles.length" class="flex justify-between">
              <span class="text-muted-color">Funções:</span>
              <div class="flex flex-wrap gap-1 justify-end">
                <Tag
                  v-for="role in slotProps.data.roles"
                  :key="role.id"
                  :value="role.quantity > 1 ? `${role.name} (${role.quantity})` : role.name"
                  severity="info"
                  rounded
                />
              </div>
            </div>
          </div>

          <div v-if="slotProps.data.userSignal" class="text-center">
            <Tag
              :value="slotProps.data.userSignal === 'sim' ? 'Você marcou SIM' : 'Você marcou NÃO'"
              :severity="slotProps.data.userSignal === 'sim' ? 'success' : 'danger'"
              class="mb-2"
            />
          </div>

          <div v-if="month.isSignalingActive" class="flex gap-3 mt-2">
            <Button
              label="Sim"
              icon="pi pi-check"
              class="flex-1"
              :severity="slotProps.data.userSignal === 'sim' ? 'success' : 'secondary'"
              :outlined="slotProps.data.userSignal !== 'sim'"
              :loading="processingId === slotProps.data.id"
              :disabled="processingId !== null"
              @click="signal(slotProps.data.id, 'sim')"
            />
            <Button
              label="Não"
              icon="pi pi-times"
              class="flex-1"
              :severity="slotProps.data.userSignal === 'nao' ? 'danger' : 'secondary'"
              :outlined="slotProps.data.userSignal !== 'nao'"
              :loading="processingId === slotProps.data.id"
              :disabled="processingId !== null"
              @click="signal(slotProps.data.id, 'nao')"
            />
          </div>
        </div>
      </template>
      </Carousel>
    </div>
  </div>
</template>
