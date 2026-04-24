<script setup lang="ts">
import { useForm, router } from '@inertiajs/vue3'
import { ref, computed, watch, nextTick } from 'vue'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Button from 'primevue/button'
import Message from 'primevue/message'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Breadcrumb from 'primevue/breadcrumb'
import FloatLabel from 'primevue/floatlabel'

const props = defineProps<{
  church: {
    id: number
    name: string
    postalCode: string
    countryId: number | string
    stateId: number | string | null
    cityId: number | string | null
    neighborhood: string
    street: string
    number: string
    complement: string | null
    latitude: number | string | null
    longitude: number | string | null
  } | null
  countries: Array<{ id: number; name: string }>
  states: Array<{ id: number; name: string; uf: string }>
  cities: Array<{ id: number; name: string; stateId: number }>
}>()

const isEditing = computed(() => !!props.church)

const home = ref({ icon: 'pi pi-home', command: () => router.get('/dashboard') })
const model = computed(() => [
  { label: 'Igrejas', command: () => router.get('/churches') },
  { label: isEditing.value ? 'Editar Igreja' : 'Nova Igreja' },
])

const brasil = props.countries.find((c) => c.name === 'Brasil')
const rondonia = props.states.find((s) => s.name === 'Rondônia')

const form = useForm({
  name: props.church?.name || '',
  postalCode: props.church?.postalCode || '',
  countryId: props.church?.countryId ?? (brasil ? brasil.id : ('' as number | string)),
  stateId: props.church?.stateId ?? (rondonia ? rondonia.id : ('' as number | string | null)),
  cityId: props.church?.cityId ?? ('' as number | string | null),
  neighborhood: props.church?.neighborhood || '',
  street: props.church?.street || '',
  number: props.church?.number || '',
  complement: props.church?.complement || '',
  latitude: props.church?.latitude ?? ('' as number | string | null),
  longitude: props.church?.longitude ?? ('' as number | string | null),
})

const activeTab = ref(0)
const isFillingFromCep = ref(false)

const filteredCities = computed(() => {
  if (!form.stateId) return []
  return props.cities.filter((c) => c.stateId === Number(form.stateId))
})

watch(
  () => form.stateId,
  () => {
    if (isFillingFromCep.value) return
    form.cityId = ''
  },
  { flush: 'sync' }
)

function formatPostalCode(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 5) return digits
  return `${digits.slice(0, 5)}-${digits.slice(5)}`
}

watch(
  () => form.postalCode,
  (val) => {
    const formatted = formatPostalCode(val)
    if (formatted !== val) {
      form.postalCode = formatted
    }
  }
)

const cepLoading = ref(false)
const cepError = ref('')

async function lookupCep() {
  const digits = form.postalCode.replace(/\D/g, '')
  if (digits.length !== 8) return

  cepLoading.value = true
  cepError.value = ''
  try {
    const res = await fetch(`/churches/lookup-cep?cep=${digits}`, {
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) {
      const data = await res.json()
      cepError.value = data.message || 'CEP não encontrado'
      return
    }
    const data = await res.json()

    form.street = data.street || ''
    form.neighborhood = data.neighborhood || ''
    form.complement = data.complement || ''

    const matchedState = props.states.find((s) => s.uf === data.state)
    if (matchedState) {
      isFillingFromCep.value = true
      form.stateId = matchedState.id
      await nextTick()
      const matchedCity = props.cities.find(
        (c) => c.stateId === matchedState.id && c.name.toLowerCase() === (data.city || '').toLowerCase()
      )
      if (matchedCity) {
        form.cityId = matchedCity.id
      }
      isFillingFromCep.value = false
    }
  } catch {
    cepError.value = 'Erro ao buscar CEP'
  } finally {
    cepLoading.value = false
  }
}

let cepTimeout: ReturnType<typeof setTimeout> | null = null
watch(
  () => form.postalCode,
  () => {
    if (cepTimeout) clearTimeout(cepTimeout)
    const digits = form.postalCode.replace(/\D/g, '')
    if (digits.length === 8) {
      cepTimeout = setTimeout(lookupCep, 600)
    }
  }
)

const submit = () => {
  const data = {
    name: form.name,
    postalCode: form.postalCode,
    countryId: form.countryId,
    stateId: form.stateId || null,
    cityId: form.cityId || null,
    neighborhood: form.neighborhood,
    street: form.street,
    number: form.number,
    complement: form.complement || null,
    latitude: form.latitude || null,
    longitude: form.longitude || null,
  }

  if (props.church) {
    form.transform(() => data).put(`/churches/${props.church!.id}`)
  } else {
    form.transform(() => data).post('/churches')
  }
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-color">
        {{ isEditing ? 'Editar Igreja' : 'Nova Igreja' }}
      </h2>
      <Breadcrumb :home="home" :model="model" />
    </div>

    <form
      @submit.prevent="submit"
      class="bg-surface-ground border border-surface rounded-lg flex-1 flex flex-col min-h-0"
    >
      <div class="p-4 flex-1">
        <TabView v-model:activeIndex="activeTab">
          <TabPanel header="Informações Gerais">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="pt-4">
                <FloatLabel>
                  <InputText id="name" v-model="form.name" fluid required />
                  <label for="name">Nome</label>
                </FloatLabel>
                <Message v-if="form.errors.name" severity="error" size="small">{{
                  form.errors.name
                }}</Message>
              </div>
            </div>
          </TabPanel>

          <TabPanel header="Endereço">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="pt-4">
                <FloatLabel>
                  <InputText
                    id="postalCode"
                    v-model="form.postalCode"
                    fluid
                    maxlength="9"
                    :disabled="cepLoading"
                  />
                  <label for="postalCode">CEP</label>
                </FloatLabel>
                <Message v-if="form.errors.postalCode" severity="error" size="small">{{
                  form.errors.postalCode
                }}</Message>
                <Message v-if="cepError" severity="error" size="small">{{ cepError }}</Message>
                <small v-if="cepLoading" class="text-muted-color">Buscando CEP...</small>
              </div>

              <div class="pt-4">
                <FloatLabel>
                  <Select
                    id="countryId"
                    v-model="form.countryId"
                    :options="countries"
                    optionLabel="name"
                    optionValue="id"
                    showClear
                    fluid
                  />
                  <label for="countryId">País</label>
                </FloatLabel>
                <Message v-if="form.errors.countryId" severity="error" size="small">{{
                  form.errors.countryId
                }}</Message>
              </div>

              <div class="pt-4">
                <FloatLabel>
                  <Select
                    id="stateId"
                    v-model="form.stateId"
                    :options="states"
                    optionLabel="name"
                    optionValue="id"
                    showClear
                    fluid
                  />
                  <label for="stateId">Estado</label>
                </FloatLabel>
                <Message v-if="form.errors.stateId" severity="error" size="small">{{
                  form.errors.stateId
                }}</Message>
              </div>

              <div class="pt-4">
                <FloatLabel>
                  <Select
                    id="cityId"
                    v-model="form.cityId"
                    :options="filteredCities"
                    optionLabel="name"
                    optionValue="id"
                    showClear
                    fluid
                  />
                  <label for="cityId">Cidade</label>
                </FloatLabel>
                <Message v-if="form.errors.cityId" severity="error" size="small">{{
                  form.errors.cityId
                }}</Message>
              </div>

              <div class="pt-4">
                <FloatLabel>
                  <InputText id="neighborhood" v-model="form.neighborhood" fluid />
                  <label for="neighborhood">Bairro</label>
                </FloatLabel>
                <Message v-if="form.errors.neighborhood" severity="error" size="small">{{
                  form.errors.neighborhood
                }}</Message>
              </div>

              <div class="pt-4">
                <FloatLabel>
                  <InputText id="street" v-model="form.street" fluid />
                  <label for="street">Rua</label>
                </FloatLabel>
                <Message v-if="form.errors.street" severity="error" size="small">{{
                  form.errors.street
                }}</Message>
              </div>

              <div class="pt-4">
                <FloatLabel>
                  <InputText id="number" v-model="form.number" fluid />
                  <label for="number">Número</label>
                </FloatLabel>
                <Message v-if="form.errors.number" severity="error" size="small">{{
                  form.errors.number
                }}</Message>
              </div>

              <div class="pt-4">
                <FloatLabel>
                  <InputText id="complement" v-model="form.complement" fluid />
                  <label for="complement">Complemento</label>
                </FloatLabel>
                <Message v-if="form.errors.complement" severity="error" size="small">{{
                  form.errors.complement
                }}</Message>
              </div>

              <div class="pt-4" v-if="church?.latitude || church?.longitude">
                <p class="text-sm text-muted-color">
                  Latitude: {{ church.latitude }} | Longitude: {{ church.longitude }}
                </p>
              </div>
            </div>
          </TabPanel>
        </TabView>
      </div>

      <div class="flex justify-end gap-2 p-4 border-t border-surface">
        <Button
          v-if="activeTab === 1"
          type="submit"
          label="Salvar"
          :disabled="form.processing"
          severity="info"
        />
        <Button label="Cancelar" severity="secondary" outlined @click="$inertia.get('/churches')" />
      </div>
    </form>
  </div>
</template>
