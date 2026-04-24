<script setup lang="ts">
import { router } from '@inertiajs/vue3'
import { ref } from 'vue'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Breadcrumb from 'primevue/breadcrumb'

const props = defineProps<{
  user: {
    id: number
    fullName: string | null
    email: string
    birthDate: string
    phone: string
    responsible1Name: string | null
    responsible1Phone: string | null
    responsible2Name: string | null
    responsible2Phone: string | null
    includeInScale: boolean
    profileId: number | null
    profile: { id: number; name: string } | null
    userTypeId: number | null
    userType: { id: number; name: string } | null
    birthCountry: { id: number; name: string } | null
    birthState: { id: number; name: string; uf: string } | null
    birthCity: { id: number; name: string } | null
    community: { id: number; name: string } | null
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
    sacraments: Array<{
      id: number
      sacramentTypeId: number
      sacramentType: { id: number; name: string } | null
      receivedDate: string
      receivedChurch: string
      receivedCountry: { id: number; name: string } | null
      receivedState: { id: number; name: string; uf: string } | null
      receivedCity: { id: number; name: string } | null
    }>
    ministryRoles: Array<{ id: number; name: string }>
    createdAt: string
  }
  can: {
    usersUpdate: boolean
  }
}>()

const home = ref({ icon: 'pi pi-home', command: () => router.get('/dashboard') })
const model = ref([
  { label: 'Usuarios', command: () => router.get('/users') },
  { label: 'Detalhes do Usuario' },
])

const formatDate = (iso: string) => {
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const formatDateTime = (iso: string) => {
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
      <h2 class="text-2xl font-bold text-color">Detalhes do Usuario</h2>
      <Breadcrumb :home="home" :model="model" />
    </div>

    <div class="bg-surface-ground border border-surface rounded-lg flex-1 flex flex-col min-h-0">
      <div class="p-4 flex-1 space-y-6">
        <section>
          <h3
            class="text-lg font-semibold text-color mb-4 flex items-center w-full gap-4 after:content-[''] after:flex-1 after:border-b after:border-surface"
          >
            Dados Gerais
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
            <div>
              <label class="block text-sm font-medium text-muted-color">Nome</label>
              <p class="mt-1 text-sm text-color">{{ user.fullName || '-' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-muted-color">Email</label>
              <p class="mt-1 text-sm text-color">{{ user.email }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-muted-color">Telefone</label>
              <p class="mt-1 text-sm text-color">{{ user.phone }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-muted-color">Data de nascimento</label>
              <p class="mt-1 text-sm text-color">{{ formatDate(user.birthDate) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-muted-color">Naturalidade</label>
              <p class="mt-1 text-sm text-color">
                {{ user.birthCity?.name || '' }}{{ user.birthState ? ', ' + user.birthState.uf : '' }}{{
                  user.birthCountry ? ' - ' + user.birthCountry.name : ''
                }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-muted-color">Perfil</label>
              <p class="mt-1">
                <Tag v-if="user.profile" :value="user.profile.name" severity="info" />
                <span v-else class="text-sm text-muted-color">-</span>
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-muted-color">Tipo de Usuario</label>
              <p class="mt-1">
                <Tag v-if="user.userType" :value="user.userType.name" severity="info" />
                <span v-else class="text-sm text-muted-color">-</span>
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-muted-color">Incluir na escala</label>
              <p class="mt-1">
                <Tag
                  :value="user.includeInScale ? 'Sim' : 'Nao'"
                  :severity="user.includeInScale ? 'success' : 'secondary'"
                />
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-muted-color">Comunidade</label>
              <p class="mt-1 text-sm text-color">{{ user.community?.name || '-' }}</p>
            </div>
          </div>

          <div
            v-if="user.responsible1Name || user.responsible1Phone || user.responsible2Name || user.responsible2Phone"
            class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-4"
          >
            <div>
              <label class="block text-sm font-medium text-muted-color">Responsavel 1</label>
              <p class="mt-1 text-sm text-color">
                {{ user.responsible1Name || '-' }} {{ user.responsible1Phone ? '(' + user.responsible1Phone + ')' : '' }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-muted-color">Responsavel 2</label>
              <p class="mt-1 text-sm text-color">
                {{ user.responsible2Name || '-' }} {{ user.responsible2Phone ? '(' + user.responsible2Phone + ')' : '' }}
              </p>
            </div>
          </div>
        </section>

        <section v-if="user.address">
          <h3
            class="text-lg font-semibold text-color mb-4 flex items-center w-full gap-4 after:content-[''] after:flex-1 after:border-b after:border-surface"
          >
            Endereco
          </h3>
          <p class="text-sm text-color">
            {{ user.address.street }}, {{ user.address.number }}
            <span v-if="user.address.complement"> - {{ user.address.complement }}</span>
            <span v-if="user.address.neighborhood"> - {{ user.address.neighborhood }}</span>
            <span v-if="user.address.city || user.address.state || user.address.country">
              <br />
              {{ user.address.city }}<span v-if="user.address.state">/{{ user.address.state }}</span>
              <span v-if="user.address.country"> - {{ user.address.country }}</span>
            </span>
            <br v-if="user.address.postalCode" />
            <span v-if="user.address.postalCode">CEP: {{ user.address.postalCode }}</span>
          </p>
        </section>

        <section v-if="user.sacraments.length">
          <h3
            class="text-lg font-semibold text-color mb-4 flex items-center w-full gap-4 after:content-[''] after:flex-1 after:border-b after:border-surface"
          >
            Sacramentos
          </h3>
          <div class="space-y-2">
            <div
              v-for="s in user.sacraments"
              :key="s.id"
              class="flex items-center gap-2 text-sm text-color"
            >
              <Tag :value="s.sacramentType?.name || 'Sacramento'" severity="info" />
              <span>{{ formatDate(s.receivedDate) }} - {{ s.receivedChurch }}</span>
              <span v-if="s.receivedCity" class="text-muted-color">
                ({{ s.receivedCity.name }}<span v-if="s.receivedState">/{{ s.receivedState.uf }}</span>)
              </span>
            </div>
          </div>
        </section>

        <section v-if="user.ministryRoles.length">
          <h3
            class="text-lg font-semibold text-color mb-4 flex items-center w-full gap-4 after:content-[''] after:flex-1 after:border-b after:border-surface"
          >
            Funcoes
          </h3>
          <div class="flex flex-wrap gap-2">
            <Tag v-for="mr in user.ministryRoles" :key="mr.id" :value="mr.name" severity="info" />
          </div>
        </section>
      </div>

      <div class="flex justify-end gap-2 p-4 border-t border-surface">
        <Button
          v-if="can.usersUpdate"
          v-tooltip="'Editar usuario'"
          label="Editar"
          severity="warn"
          @click="router.get(`/users/${user.id}/edit`)"
        />
        <Button
          v-tooltip="'Voltar para listagem'"
          label="Voltar"
          severity="secondary"
          @click="router.get('/users')"
        />
      </div>
    </div>
  </div>
</template>
