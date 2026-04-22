<script setup lang="ts">
import { router } from '@inertiajs/vue3'
import { ref } from 'vue'
import Button from 'primevue/button'
import Breadcrumb from 'primevue/breadcrumb'

const props = defineProps<{
  church: {
    id: number
    name: string
    address: {
      postalCode: string
      street: string
      number: string
      complement: string | null
      neighborhood: string
      city: string | null
      state: string | null
      country: string | null
    } | null
    createdAt: string
  }
  can: {
    churchesUpdate: boolean
    churchesDelete: boolean
  }
}>()

const home = ref({ icon: 'pi pi-home', command: () => router.get('/dashboard') })
const model = ref([
  { label: 'Igrejas', command: () => router.get('/churches') },
  { label: 'Detalhes da Igreja' },
])

const formatDate = (iso: string) => {
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-color">Detalhes da Igreja</h2>
      <Breadcrumb :home="home" :model="model" />
    </div>

    <div class="bg-surface-ground border border-surface rounded-lg flex-1 flex flex-col min-h-0">
      <div class="p-4 flex-1">
        <h3
          class="text-lg font-semibold text-color mb-4 flex items-center w-full gap-4 after:content-[''] after:flex-1 after:border-b after:border-surface"
        >
          Dados Gerais
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
          <div>
            <label class="block text-sm font-medium text-muted-color">Nome</label>
            <p class="mt-1 text-sm text-color">{{ church.name }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-muted-color">Criado em</label>
            <p class="mt-1 text-sm text-color">{{ formatDate(church.createdAt) }}</p>
          </div>
        </div>

        <h3
          class="text-lg font-semibold text-color mb-4 mt-6 flex items-center w-full gap-4 after:content-[''] after:flex-1 after:border-b after:border-surface"
        >
          Endereço
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
          <div>
            <label class="block text-sm font-medium text-muted-color">CEP</label>
            <p class="mt-1 text-sm text-color">{{ church.address?.postalCode || '—' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-muted-color">Rua</label>
            <p class="mt-1 text-sm text-color">{{ church.address?.street || '—' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-muted-color">Número</label>
            <p class="mt-1 text-sm text-color">{{ church.address?.number || '—' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-muted-color">Complemento</label>
            <p class="mt-1 text-sm text-color">{{ church.address?.complement || '—' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-muted-color">Bairro</label>
            <p class="mt-1 text-sm text-color">{{ church.address?.neighborhood || '—' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-muted-color">Cidade / Estado / País</label>
            <p class="mt-1 text-sm text-color">
              {{ church.address?.city || '—' }}{{ church.address?.state ? ` / ${church.address.state}` : '' }}{{ church.address?.country ? ` / ${church.address.country}` : '' }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-muted-color">Latitude / Longitude</label>
            <p class="mt-1 text-sm text-color">
              {{ church.address?.latitude != null ? church.address.latitude : '—' }} / {{ church.address?.longitude != null ? church.address.longitude : '—' }}
            </p>
            <p v-if="church.address?.latitude != null &amp;&amp; church.address?.longitude != null" class="mt-2 text-xs text-muted-color">
              Dados de localização fornecidos por <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">OpenStreetMap</a>.
            </p>
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-2 p-4 border-t border-surface">
        <Button
          v-if="can.churchesUpdate"
          v-tooltip="'Editar igreja'"
          label="Editar"
          severity="warn"
          @click="$inertia.get(`/churches/${church.id}/edit`)"
        />
        <Button
          v-tooltip="'Voltar para listagem'"
          label="Voltar"
          severity="secondary"
          @click="$inertia.get('/churches')"
        />
      </div>
    </div>
  </div>
</template>
