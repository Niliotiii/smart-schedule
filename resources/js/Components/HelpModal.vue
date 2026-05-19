<script setup lang="ts">
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import Tag from 'primevue/tag'

const visible = defineModel<boolean>('visible', { default: false })
const activeTab = ref('0')
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Ajuda"
    :style="{ width: '600px' }"
    :closable="true"
    :dismissableMask="true"
    class="max-w-full"
  >
    <Tabs v-model:value="activeTab">
      <TabList>
        <Tab value="0">Regras de Alocação</Tab>
        <Tab value="1">Status de Escala</Tab>
      </TabList>

      <TabPanels>
        <TabPanel value="0">
          <div class="space-y-4 text-sm">
            <p class="text-color">
              A alocação automática distribui os voluntários nas escalas seguindo os critérios abaixo:
            </p>

            <div class="space-y-3">
              <div class="flex gap-3">
                <Tag value="1" severity="info" class="shrink-0 mt-0.5" />
                <div>
                  <strong class="text-color">Função necessária</strong>
                  <p class="text-muted-color mt-0.5">Apenas usuários que possuem a função exigida pela vaga são considerados candidatos.</p>
                </div>
              </div>

              <div class="flex gap-3">
                <Tag value="2" severity="info" class="shrink-0 mt-0.5" />
                <div>
                  <strong class="text-color">Disponibilidade confirmada</strong>
                  <p class="text-muted-color mt-0.5">Usuários que marcaram "Sim" para a escala têm prioridade na alocação. Usuários que marcaram "Não" são excluídos.</p>
                </div>
              </div>

              <div class="flex gap-3">
                <Tag value="3" severity="info" class="shrink-0 mt-0.5" />
                <div>
                  <strong class="text-color">Sem conflito de horário</strong>
                  <p class="text-muted-color mt-0.5">Um usuário não pode ser alocado em duas escalas no mesmo dia, evitando sobreposição.</p>
                </div>
              </div>

              <div class="flex gap-3">
                <Tag value="4" severity="info" class="shrink-0 mt-0.5" />
                <div>
                  <strong class="text-color">Distribuição equilibrada</strong>
                  <p class="text-muted-color mt-0.5">A alocação prioriza usuários com menos escalas no mês, garantindo que as vagas sejam distribuídas de forma justa.</p>
                </div>
              </div>

              <div class="flex gap-3">
                <Tag value="5" severity="info" class="shrink-0 mt-0.5" />
                <div>
                  <strong class="text-color">Tipo de usuário</strong>
                  <p class="text-muted-color mt-0.5">Se a vaga exigir um tipo de usuário específico (ex: Acólito, Coroinha), apenas usuários desse tipo são considerados.</p>
                </div>
              </div>

              <div class="flex gap-3">
                <Tag value="6" severity="info" class="shrink-0 mt-0.5" />
                <div>
                  <strong class="text-color">Ordem de processamento</strong>
                  <p class="text-muted-color mt-0.5">As escalas com menor número de candidatos são processadas primeiro, maximizando as chances de preenchimento de todas as vagas.</p>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>

        <TabPanel value="1">
          <div class="space-y-4 text-sm">
            <p class="text-color">
              Cada mês de escala pode assumir os seguintes status, com transições permitidas entre eles:
            </p>

            <div class="space-y-3">
              <div class="border border-surface rounded-lg p-3">
                <div class="flex items-center gap-2 mb-1">
                  <Tag value="Aberta" severity="info" />
                  <span class="text-xs text-muted-color">— status inicial</span>
                </div>
                <p class="text-muted-color text-xs mt-1">Quando o mês é criado. As escalas podem ser configuradas.</p>
                <div class="mt-2 text-xs">
                  <span class="text-muted-color">Pode ir para: </span>
                  <Tag value="Disponível" severity="success" rounded class="text-xs" />
                </div>
              </div>

              <div class="border border-surface rounded-lg p-3">
                <div class="flex items-center gap-2 mb-1">
                  <Tag value="Disponível" severity="success" />
                  <span class="text-xs text-muted-color">— sinalização ativa</span>
                </div>
                <p class="text-muted-color text-xs mt-1">Os voluntários podem sinalizar sua disponibilidade para as escalas deste mês.</p>
                <div class="mt-2 text-xs">
                  <span class="text-muted-color">Pode ir para: </span>
                  <Tag value="Aberta" severity="info" rounded class="text-xs" />
                  <Tag value="Rascunho" severity="warn" rounded class="text-xs ml-1" />
                </div>
              </div>

              <div class="border border-surface rounded-lg p-3">
                <div class="flex items-center gap-2 mb-1">
                  <Tag value="Rascunho" severity="warn" />
                  <span class="text-xs text-muted-color">— edição e alocação</span>
                </div>
                <p class="text-muted-color text-xs mt-1">Período de edição das escalas e alocação automática dos voluntários.</p>
                <div class="mt-2 text-xs">
                  <span class="text-muted-color">Pode ir para: </span>
                  <Tag value="Disponível" severity="success" rounded class="text-xs" />
                  <Tag value="Publicada" severity="contrast" rounded class="text-xs ml-1" />
                  <Tag value="Encerrada" severity="secondary" rounded class="text-xs ml-1" />
                </div>
              </div>

              <div class="border border-surface rounded-lg p-3">
                <div class="flex items-center gap-2 mb-1">
                  <Tag value="Publicada" severity="contrast" />
                  <span class="text-xs text-muted-color">— visível para todos</span>
                </div>
                <p class="text-muted-color text-xs mt-1">As escalas estão publicadas e visíveis para todos os usuários.</p>
                <div class="mt-2 text-xs">
                  <span class="text-muted-color">Pode ir para: </span>
                  <Tag value="Rascunho" severity="warn" rounded class="text-xs" />
                  <Tag value="Encerrada" severity="secondary" rounded class="text-xs ml-1" />
                </div>
              </div>

              <div class="border border-surface rounded-lg p-3">
                <div class="flex items-center gap-2 mb-1">
                  <Tag value="Encerrada" severity="secondary" />
                  <span class="text-xs text-muted-color">— status final</span>
                </div>
                <p class="text-muted-color text-xs mt-1">Mês encerrado. Nenhuma transição adicional é permitida.</p>
                <div class="mt-2 text-xs">
                  <span class="text-muted-color">Este é um status terminal.</span>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </Dialog>
</template>
