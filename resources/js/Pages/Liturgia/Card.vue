<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Calendar from 'primevue/calendar'
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import type { LiturgiaData } from '@/lib/liturgia.js'
import { liturgicalColorClassMap } from '@/lib/liturgia.js'

const props = defineProps<{
  liturgia: LiturgiaData | null
}>()

const selectedDate = ref<Date | null>(null)

const colorClass = computed(() => {
  if (!props.liturgia) return 'bg-gray-300'
  return liturgicalColorClassMap[props.liturgia.cor] || 'bg-gray-300'
})

const primeiraLeitura = computed(() => props.liturgia?.leituras?.primeiraLeitura ?? [])
const salmo = computed(() => props.liturgia?.leituras?.salmo ?? [])
const evangelho = computed(() => props.liturgia?.leituras?.evangelho ?? [])

function onDateSelect() {
  if (!selectedDate.value) return
  const d = selectedDate.value
  const dia = String(d.getDate()).padStart(2, '0')
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const ano = d.getFullYear()
  window.location.search = `?dia=${dia}&mes=${mes}&ano=${ano}`
}

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  const dia = params.get('dia')
  const mes = params.get('mes')
  const ano = params.get('ano')
  if (dia && mes && ano) {
    const d = new Date(Number(ano), Number(mes) - 1, Number(dia))
    if (!Number.isNaN(d.getTime())) {
      selectedDate.value = d
    }
  }
})
</script>

<template>
  <div v-if="liturgia" class="mt-6">
    <div class="rounded-xl border border-surface shadow-sm bg-surface-ground overflow-hidden">
      <div class="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div class="flex items-center gap-3">
          <div
            class="w-4 h-4 rounded-full shrink-0"
            :class="colorClass"
            :title="liturgia.cor"
          />
          <h3 class="text-lg font-semibold text-color">{{ liturgia.liturgia }}</h3>
        </div>
        <Calendar
          v-model="selectedDate"
          dateFormat="dd/mm/yy"
          placeholder="Selecionar data"
          class="w-full md:w-auto"
          @date-select="onDateSelect"
        />
      </div>

      <div class="px-4 pb-4">
        <div v-if="liturgia.santo" class="mb-2 text-sm text-muted-color">
          <span class="font-medium text-color">Santo do dia:</span> {{ liturgia.santo }}
        </div>

        <div
          v-if="evangelho.length && evangelho[0].texto"
          class="mb-3 text-sm italic text-color bg-surface-50 dark:bg-surface-800 p-3 rounded-lg border border-surface"
        >
          "{{ evangelho[0].texto }}"
        </div>

        <Accordion :multiple="true" class="mt-2">
          <AccordionPanel v-if="primeiraLeitura.length" value="0">
            <AccordionHeader>Primeira Leitura</AccordionHeader>
            <AccordionContent>
              <div
                v-for="(item, idx) in primeiraLeitura"
                :key="`pl-${idx}`"
                class="mb-3 last:mb-0"
              >
                <p v-if="item.referencia" class="text-xs font-semibold text-muted-color mb-1">
                  {{ item.referencia }}
                </p>
                <p v-if="item.tema" class="text-sm font-medium text-color mb-1">
                  {{ item.tema }}
                </p>
                <p v-if="item.texto" class="text-sm text-color leading-relaxed">
                  {{ item.texto }}
                </p>
              </div>
            </AccordionContent>
          </AccordionPanel>

          <AccordionPanel v-if="salmo.length" value="1">
            <AccordionHeader>Salmo</AccordionHeader>
            <AccordionContent>
              <div
                v-for="(item, idx) in salmo"
                :key="`sl-${idx}`"
                class="mb-3 last:mb-0"
              >
                <p v-if="item.referencia" class="text-xs font-semibold text-muted-color mb-1">
                  {{ item.referencia }}
                </p>
                <p v-if="item.tema" class="text-sm font-medium text-color mb-1">
                  {{ item.tema }}
                </p>
                <p v-if="item.texto" class="text-sm text-color leading-relaxed">
                  {{ item.texto }}
                </p>
              </div>
            </AccordionContent>
          </AccordionPanel>

          <AccordionPanel v-if="evangelho.length" value="2">
            <AccordionHeader>Evangelho</AccordionHeader>
            <AccordionContent>
              <div
                v-for="(item, idx) in evangelho"
                :key="`ev-${idx}`"
                class="mb-3 last:mb-0"
              >
                <p v-if="item.referencia" class="text-xs font-semibold text-muted-color mb-1">
                  {{ item.referencia }}
                </p>
                <p v-if="item.tema" class="text-sm font-medium text-color mb-1">
                  {{ item.tema }}
                </p>
                <p v-if="item.texto" class="text-sm text-color leading-relaxed">
                  {{ item.texto }}
                </p>
              </div>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
      </div>
    </div>
  </div>

  <div
    v-else
    class="mt-6 rounded-xl border border-surface shadow-sm bg-surface-ground p-6 text-center text-muted-color"
  >
    <i class="pi pi-book text-2xl mb-2 block" />
    <p class="text-sm">Liturgia do dia indisponível no momento.</p>
  </div>
</template>
