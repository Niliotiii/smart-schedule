<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Calendar from 'primevue/calendar'
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import type { LiturgiaData } from '../../lib/liturgia'
import { liturgicalColorClassMap } from '../../lib/liturgia'

const props = defineProps<{
  liturgia: LiturgiaData | null
}>()

const selectedDate = ref<Date | null>(new Date())

const colorClass = computed(() => {
  if (!props.liturgia) return 'bg-gray-300'
  return liturgicalColorClassMap[props.liturgia.cor] || 'bg-gray-300'
})

const primeiraLeitura = computed(() => props.liturgia?.leituras?.primeiraLeitura ?? [])
const segundaLeitura = computed(() => props.liturgia?.leituras?.segundaLeitura ?? [])
const salmo = computed(() => props.liturgia?.leituras?.salmo ?? [])
const evangelho = computed(() => props.liturgia?.leituras?.evangelho ?? [])
const leiturasExtras = computed(() => props.liturgia?.leituras?.extras ?? [])
const oracoes = computed(() => props.liturgia?.oracoes ?? null)
const antifonas = computed(() => props.liturgia?.antifonas ?? null)

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
          :manual-input="false"
          :show-icon="true"
          :min-date="new Date(2000, 0, 1)"
          :max-date="new Date(2100, 11, 31)"
          @date-select="onDateSelect"
        />
      </div>

      <div v-if="liturgia.santo" class="px-4 pb-2 text-sm text-muted-color">
        <span class="font-medium text-color">Santo do dia:</span> {{ liturgia.santo }}
      </div>

      <div class="px-4 pb-4">
        <Accordion :multiple="true" class="mt-2">
          <!-- 1. Antífona de Entrada -->
          <AccordionPanel v-if="antifonas?.entrada" value="ant-entrada">
            <AccordionHeader>Antífona Entrada</AccordionHeader>
            <AccordionContent>
              <div class="text-sm text-color leading-relaxed whitespace-pre-line">
                {{ antifonas.entrada }}
              </div>
            </AccordionContent>
          </AccordionPanel>

          <!-- 2. Oração da Coleta -->
          <AccordionPanel v-if="oracoes?.coleta" value="ora-coleta">
            <AccordionHeader>Oração da Coleta</AccordionHeader>
            <AccordionContent>
              <div class="text-sm text-color leading-relaxed whitespace-pre-line">
                {{ oracoes.coleta }}
              </div>
            </AccordionContent>
          </AccordionPanel>

          <!-- 3. Primeira Leitura -->
          <AccordionPanel v-if="primeiraLeitura.length" value="lei-1">
            <AccordionHeader>Primeira Leitura</AccordionHeader>
            <AccordionContent>
              <div
                v-for="(item, idx) in primeiraLeitura"
                :key="`pl-${idx}`"
                class="mb-3 last:mb-0"
              >
                <div v-if="item.referencia" class="text-xs font-semibold text-muted-color mb-1">
                  {{ item.referencia }}
                </div>
                <div v-if="item.titulo" class="text-sm font-medium text-color mb-1">
                  {{ item.titulo }}
                </div>
                <div v-else-if="item.refrao" class="text-sm font-medium text-color mb-1">
                  {{ item.refrao }}
                </div>
                <div v-else-if="item.tema" class="text-sm font-medium text-color mb-1">
                  {{ item.tema }}
                </div>
                <div v-if="item.texto" class="text-sm text-color leading-relaxed whitespace-pre-line">
                  {{ item.texto }}
                </div>
              </div>
            </AccordionContent>
          </AccordionPanel>

          <!-- 4. Salmo Responsorial -->
          <AccordionPanel v-if="salmo.length" value="salmo">
            <AccordionHeader>Salmo Responsorial</AccordionHeader>
            <AccordionContent>
              <div
                v-for="(item, idx) in salmo"
                :key="`sl-${idx}`"
                class="mb-3 last:mb-0"
              >
                <div v-if="item.referencia" class="text-xs font-semibold text-muted-color mb-1">
                  {{ item.referencia }}
                </div>
                <div v-if="item.titulo" class="text-sm font-medium text-color mb-1">
                  {{ item.titulo }}
                </div>
                <div v-else-if="item.refrao" class="text-sm font-medium text-color mb-1">
                  {{ item.refrao }}
                </div>
                <div v-else-if="item.tema" class="text-sm font-medium text-color mb-1">
                  {{ item.tema }}
                </div>
                <div v-if="item.texto" class="text-sm text-color leading-relaxed whitespace-pre-line">
                  {{ item.texto }}
                </div>
              </div>
            </AccordionContent>
          </AccordionPanel>

          <!-- 5. Segunda Leitura -->
          <AccordionPanel v-if="segundaLeitura.length" value="lei-2">
            <AccordionHeader>Segunda Leitura</AccordionHeader>
            <AccordionContent>
              <div
                v-for="(item, idx) in segundaLeitura"
                :key="`sl2-${idx}`"
                class="mb-3 last:mb-0"
              >
                <div v-if="item.referencia" class="text-xs font-semibold text-muted-color mb-1">
                  {{ item.referencia }}
                </div>
                <div v-if="item.titulo" class="text-sm font-medium text-color mb-1">
                  {{ item.titulo }}
                </div>
                <div v-else-if="item.refrao" class="text-sm font-medium text-color mb-1">
                  {{ item.refrao }}
                </div>
                <div v-else-if="item.tema" class="text-sm font-medium text-color mb-1">
                  {{ item.tema }}
                </div>
                <div v-if="item.texto" class="text-sm text-color leading-relaxed whitespace-pre-line">
                  {{ item.texto }}
                </div>
              </div>
            </AccordionContent>
          </AccordionPanel>

          <!-- 6. Evangelho -->
          <AccordionPanel v-if="evangelho.length" value="evangelho">
            <AccordionHeader>Evangelho</AccordionHeader>
            <AccordionContent>
              <div
                v-for="(item, idx) in evangelho"
                :key="`ev-${idx}`"
                class="mb-3 last:mb-0"
              >
                <div v-if="item.referencia" class="text-xs font-semibold text-muted-color mb-1">
                  {{ item.referencia }}
                </div>
                <div v-if="item.titulo" class="text-sm font-medium text-color mb-1">
                  {{ item.titulo }}
                </div>
                <div v-else-if="item.refrao" class="text-sm font-medium text-color mb-1">
                  {{ item.refrao }}
                </div>
                <div v-else-if="item.tema" class="text-sm font-medium text-color mb-1">
                  {{ item.tema }}
                </div>
                <div v-if="item.texto" class="text-sm text-color leading-relaxed whitespace-pre-line">
                  {{ item.texto }}
                </div>
              </div>
            </AccordionContent>
          </AccordionPanel>

          <!-- 7. Leituras Extras -->
          <AccordionPanel v-if="leiturasExtras.length" value="lei-extras">
            <AccordionHeader>Leituras Extras</AccordionHeader>
            <AccordionContent>
              <div
                v-for="(item, idx) in leiturasExtras"
                :key="`lx-${idx}`"
                class="mb-3 last:mb-0"
              >
                <div v-if="item.referencia" class="text-xs font-semibold text-muted-color mb-1">
                  {{ item.referencia }}
                </div>
                <div v-if="item.titulo" class="text-sm font-medium text-color mb-1">
                  {{ item.titulo }}
                </div>
                <div v-else-if="item.refrao" class="text-sm font-medium text-color mb-1">
                  {{ item.refrao }}
                </div>
                <div v-else-if="item.tema" class="text-sm font-medium text-color mb-1">
                  {{ item.tema }}
                </div>
                <div v-if="item.texto" class="text-sm text-color leading-relaxed whitespace-pre-line">
                  {{ item.texto }}
                </div>
              </div>
            </AccordionContent>
          </AccordionPanel>

          <!-- 8. Oração sobre as Oferendas -->
          <AccordionPanel v-if="oracoes?.oferendas" value="ora-oferendas">
            <AccordionHeader>Oração sobre as Oferendas</AccordionHeader>
            <AccordionContent>
              <div class="text-sm text-color leading-relaxed whitespace-pre-line">
                {{ oracoes.oferendas }}
              </div>
            </AccordionContent>
          </AccordionPanel>

          <!-- 9. Oração Eucarística -->
          <AccordionPanel v-if="oracoes?.comunhao" value="ora-comunhao">
            <AccordionHeader>Oração Eucarística</AccordionHeader>
            <AccordionContent>
              <div class="text-sm text-color leading-relaxed whitespace-pre-line">
                {{ oracoes.comunhao }}
              </div>
            </AccordionContent>
          </AccordionPanel>

          <!-- 10. Orações Extras -->
          <AccordionPanel v-if="oracoes?.extras?.length" value="ora-extras">
            <AccordionHeader>Orações Extras</AccordionHeader>
            <AccordionContent>
              <div
                v-for="(extra, idx) in oracoes.extras"
                :key="`oe-${idx}`"
                class="mb-3 last:mb-0"
              >
                <span class="text-xs font-semibold text-muted-color"
                  >Oração {{ idx + 1 }}</span
                >
                <p class="text-sm text-color leading-relaxed whitespace-pre-line mt-1">
                  {{ extra }}
                </p>
              </div>
            </AccordionContent>
          </AccordionPanel>

          <!-- 11. Antífona da Comunhão -->
          <AccordionPanel v-if="antifonas?.comunhao" value="ant-comunhao">
            <AccordionHeader>Antífona Comunhão</AccordionHeader>
            <AccordionContent>
              <div class="text-sm text-color leading-relaxed whitespace-pre-line">
                {{ antifonas.comunhao }}
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
