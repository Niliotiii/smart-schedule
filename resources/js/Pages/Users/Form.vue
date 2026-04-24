<script setup lang="ts">
import { useForm, router } from '@inertiajs/vue3'
import { ref, computed, watch, nextTick } from 'vue'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Select from 'primevue/select'
import MultiSelect from 'primevue/multiselect'
import Button from 'primevue/button'
import Message from 'primevue/message'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Breadcrumb from 'primevue/breadcrumb'
import FloatLabel from 'primevue/floatlabel'
import ToggleSwitch from 'primevue/toggleswitch'

const props = defineProps<{
  user: {
    id: number
    fullName: string | null
    email: string
    birthDate: string
    phone: string
    birthCountryId: number | string
    birthStateId: number | string
    birthCityId: number | string
    responsible1Name: string | null
    responsible1Phone: string | null
    responsible2Name: string | null
    responsible2Phone: string | null
    profileId: number | null
    userTypeId: number | null
    includeInScale: boolean
    communityId: number | string | null
    address: {
      id?: number
      postalCode: string
      countryId: number | string
      stateId: number | string | null
      cityId: number | string | null
      neighborhood: string
      street: string
      number: string
      complement: string | null
    } | null
    sacraments: Array<{
      id?: number
      sacramentTypeId: number | string
      receivedDate: string
      receivedChurch: string
      receivedCountryId: number | string
      receivedStateId: number | string
      receivedCityId: number | string
    }>
    ministryRoleIds: number[]
  } | null
  profiles: Array<{ id: number; name: string }>
  userTypes: Array<{ id: number; name: string }>
  countries: Array<{ id: number; name: string }>
  states: Array<{ id: number; name: string; uf: string }>
  cities: Array<{ id: number; name: string; stateId: number }>
  sacramentTypes: Array<{ id: number; name: string }>
  ministryRoles: Array<{ id: number; name: string; description: string | null }>
  churches: Array<{ id: number; name: string }>
  canEditProfile: boolean
}>()

const isEditing = computed(() => !!props.user)

const home = ref({ icon: 'pi pi-home', command: () => router.get('/dashboard') })
const model = computed(() => [
  { label: 'Usuarios', command: () => router.get('/users') },
  { label: isEditing.value ? 'Editar Usuario' : 'Novo Usuario' },
])

const brasilId = props.countries.find((c) => c.name === 'Brasil')?.id ?? ('' as number | string)
const rondoniaId = props.states.find((s) => s.name === 'Rondônia')?.id ?? ('' as number | string)

const defaultAddress = () => ({
  postalCode: '',
  countryId: brasilId,
  stateId: rondoniaId as number | string | null,
  cityId: '' as number | string | null,
  neighborhood: '',
  street: '',
  number: '',
  complement: '' as string | null,
})

const form = useForm({
  fullName: props.user?.fullName || '',
  email: props.user?.email || '',
  password: '',
  passwordConfirmation: '',
  profileId: props.user?.profileId ?? ('' as number | string),
  userTypeId: props.user?.userTypeId ?? ('' as number | string),
  birthDate: props.user?.birthDate || '',
  phone: props.user?.phone || '',
  birthCountryId: props.user?.birthCountryId ?? brasilId,
  birthStateId: props.user?.birthStateId ?? rondoniaId,
  birthCityId: props.user?.birthCityId ?? ('' as number | string),
  responsible1Name: props.user?.responsible1Name || '',
  responsible1Phone: props.user?.responsible1Phone || '',
  responsible2Name: props.user?.responsible2Name || '',
  responsible2Phone: props.user?.responsible2Phone || '',
  includeInScale: props.user?.includeInScale ?? false,
  communityId: props.user?.communityId ?? ('' as number | string | null),
  address: props.user?.address ? { ...props.user.address } : defaultAddress(),
  sacraments: props.user?.sacraments?.length
    ? props.user.sacraments.map((s) => ({ ...s }))
    : [] as Array<{
        sacramentTypeId: number | string
        receivedDate: string
        receivedChurch: string
        receivedCountryId: number | string
        receivedStateId: number | string
        receivedCityId: number | string
      }>,
  ministryRoleIds: props.user?.ministryRoleIds || ([] as number[]),
})

const activeTab = ref(0)
const isFillingFromCep = ref(false)

const filteredBirthCities = computed(() => {
  if (!form.birthStateId) return []
  return props.cities.filter((c) => c.stateId === Number(form.birthStateId))
})

const filteredAddressCities = computed(() => {
  if (!form.address.stateId) return []
  return props.cities.filter((c) => c.stateId === Number(form.address.stateId))
})

watch(
  () => form.birthStateId,
  () => {
    form.birthCityId = ''
  },
  { flush: 'sync' }
)

watch(
  () => form.address.stateId,
  () => {
    if (isFillingFromCep.value) return
    form.address.cityId = ''
  },
  { flush: 'sync' }
)

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 10) {
    if (digits.length <= 6) return digits
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}${digits.length > 6 ? '-' + digits.slice(6) : ''}`
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

watch(
  () => form.phone,
  (val) => {
    const formatted = formatPhone(val)
    if (formatted !== val) form.phone = formatted
  }
)

function formatPostalCode(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 5) return digits
  return `${digits.slice(0, 5)}-${digits.slice(5)}`
}

watch(
  () => form.address.postalCode,
  (val) => {
    const formatted = formatPostalCode(val)
    if (formatted !== val) form.address.postalCode = formatted
  }
)

const cepLoading = ref(false)
const cepError = ref('')

async function lookupCep() {
  const digits = form.address.postalCode.replace(/\D/g, '')
  if (digits.length !== 8) return

  cepLoading.value = true
  cepError.value = ''
  try {
    const res = await fetch(`/churches/lookup-cep?cep=${digits}`, {
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) {
      const data = await res.json()
      cepError.value = data.message || 'CEP nao encontrado'
      return
    }
    const data = await res.json()

    form.address.street = data.street || ''
    form.address.neighborhood = data.neighborhood || ''
    form.address.complement = data.complement || ''

    const matchedState = props.states.find((s) => s.uf === data.state)
    if (matchedState) {
      isFillingFromCep.value = true
      form.address.stateId = matchedState.id
      await nextTick()
      const matchedCity = props.cities.find(
        (c) =>
          c.stateId === matchedState.id &&
          c.name.toLowerCase() === (data.city || '').toLowerCase()
      )
      if (matchedCity) {
        form.address.cityId = matchedCity.id
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
  () => form.address.postalCode,
  () => {
    if (cepTimeout) clearTimeout(cepTimeout)
    const digits = form.address.postalCode.replace(/\D/g, '')
    if (digits.length === 8) {
      cepTimeout = setTimeout(lookupCep, 600)
    }
  }
)

function addSacrament() {
  form.sacraments.push({
    sacramentTypeId: '',
    receivedDate: '',
    receivedChurch: '',
    receivedCountryId: brasilId,
    receivedStateId: rondoniaId,
    receivedCityId: '',
  })
}

function removeSacrament(index: number) {
  form.sacraments.splice(index, 1)
}

const filteredSacramentCities = (stateId: number | string) => {
  if (!stateId) return []
  return props.cities.filter((c) => c.stateId === Number(stateId))
}

const submit = () => {
  const data = {
    fullName: form.fullName,
    email: form.email,
    password: form.password || undefined,
    passwordConfirmation: form.passwordConfirmation || undefined,
    profileId: form.profileId,
    userTypeId: form.userTypeId || null,
    birthDate: form.birthDate,
    phone: form.phone,
    birthCountryId: form.birthCountryId,
    birthStateId: form.birthStateId,
    birthCityId: form.birthCityId,
    responsible1Name: form.responsible1Name || null,
    responsible1Phone: form.responsible1Phone || null,
    responsible2Name: form.responsible2Name || null,
    responsible2Phone: form.responsible2Phone || null,
    includeInScale: form.includeInScale,
    communityId: form.communityId || null,
    address: {
      postalCode: form.address.postalCode,
      countryId: form.address.countryId,
      stateId: form.address.stateId,
      cityId: form.address.cityId,
      neighborhood: form.address.neighborhood,
      street: form.address.street,
      number: form.address.number,
      complement: form.address.complement || null,
    },
    sacraments: form.sacraments.map((s) => ({
      sacramentTypeId: s.sacramentTypeId,
      receivedDate: s.receivedDate,
      receivedChurch: s.receivedChurch,
      receivedCountryId: s.receivedCountryId,
      receivedStateId: s.receivedStateId,
      receivedCityId: s.receivedCityId,
    })),
    ministryRoleIds: form.ministryRoleIds.length > 0 ? form.ministryRoleIds : undefined,
  }

  if (props.user) {
    form.transform(() => data).put(`/users/${props.user!.id}`)
  } else {
    form.transform(() => data).post('/users')
  }
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-color">
        {{ isEditing ? 'Editar Usuario' : 'Novo Usuario' }}
      </h2>
      <Breadcrumb :home="home" :model="model" />
    </div>

    <form
      @submit.prevent="submit"
      class="bg-surface-ground border border-surface rounded-lg flex-1 flex flex-col min-h-0"
    >
      <div class="p-4 flex-1">
        <TabView v-model:activeIndex="activeTab">
          <TabPanel header="Informacoes Gerais">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="pt-4">
                <FloatLabel>
                  <InputText id="fullName" v-model="form.fullName" fluid :invalid="!!form.errors.fullName" />
                  <label for="fullName">Nome completo *</label>
                </FloatLabel>
                <Message v-if="form.errors.fullName" severity="error" size="small">{{
                  form.errors.fullName
                }}</Message>
              </div>

              <div class="pt-4">
                <FloatLabel>
                  <InputText id="email" v-model="form.email" type="email" fluid :invalid="!!form.errors.email" />
                  <label for="email">Email *</label>
                </FloatLabel>
                <Message v-if="form.errors.email" severity="error" size="small">{{
                  form.errors.email
                }}</Message>
              </div>

              <div class="pt-4">
                <FloatLabel>
                  <InputText id="phone" v-model="form.phone" fluid maxlength="20" :invalid="!!form.errors.phone" />
                  <label for="phone">Telefone *</label>
                </FloatLabel>
                <Message v-if="form.errors.phone" severity="error" size="small">{{ form.errors.phone }}</Message>
              </div>

              <div class="pt-4">
                <FloatLabel>
                  <InputText id="birthDate" v-model="form.birthDate" type="date" fluid :invalid="!!form.errors.birthDate" />
                  <label for="birthDate">Data de nascimento *</label>
                </FloatLabel>
                <Message v-if="form.errors.birthDate" severity="error" size="small">{{
                  form.errors.birthDate
                }}</Message>
              </div>

              <div class="pt-4">
                <FloatLabel>
                  <Select
                    id="birthCountryId"
                    v-model="form.birthCountryId"
                    :options="countries"
                    optionLabel="name"
                    optionValue="id"
                    showClear
                    fluid
                    :invalid="!!form.errors.birthCountryId"
                  />
                  <label for="birthCountryId">Pais de nascimento *</label>
                </FloatLabel>
                <Message v-if="form.errors.birthCountryId" severity="error" size="small">{{
                  form.errors.birthCountryId
                }}</Message>
              </div>

              <div class="pt-4">
                <FloatLabel>
                  <Select
                    id="birthStateId"
                    v-model="form.birthStateId"
                    :options="states"
                    optionLabel="name"
                    optionValue="id"
                    showClear
                    fluid
                    :invalid="!!form.errors.birthStateId"
                  />
                  <label for="birthStateId">Estado de nascimento *</label>
                </FloatLabel>
                <Message v-if="form.errors.birthStateId" severity="error" size="small">{{
                  form.errors.birthStateId
                }}</Message>
              </div>

              <div class="pt-4">
                <FloatLabel>
                  <Select
                    id="birthCityId"
                    v-model="form.birthCityId"
                    :options="filteredBirthCities"
                    optionLabel="name"
                    optionValue="id"
                    showClear
                    fluid
                    :invalid="!!form.errors.birthCityId"
                  />
                  <label for="birthCityId">Cidade de nascimento *</label>
                </FloatLabel>
                <Message v-if="form.errors.birthCityId" severity="error" size="small">{{
                  form.errors.birthCityId
                }}</Message>
              </div>

              <div class="pt-4">
                <FloatLabel>
                  <InputText id="responsible1Name" v-model="form.responsible1Name" fluid :invalid="!!form.errors.responsible1Name" />
                  <label for="responsible1Name">Responsavel 1 - Nome</label>
                </FloatLabel>
                <Message v-if="form.errors.responsible1Name" severity="error" size="small">{{
                  form.errors.responsible1Name
                }}</Message>
              </div>

              <div class="pt-4">
                <FloatLabel>
                  <InputText id="responsible1Phone" v-model="form.responsible1Phone" fluid maxlength="20" :invalid="!!form.errors.responsible1Phone" />
                  <label for="responsible1Phone">Responsavel 1 - Telefone</label>
                </FloatLabel>
                <Message v-if="form.errors.responsible1Phone" severity="error" size="small">{{
                  form.errors.responsible1Phone
                }}</Message>
              </div>

              <div class="pt-4">
                <FloatLabel>
                  <InputText id="responsible2Name" v-model="form.responsible2Name" fluid :invalid="!!form.errors.responsible2Name" />
                  <label for="responsible2Name">Responsavel 2 - Nome</label>
                </FloatLabel>
                <Message v-if="form.errors.responsible2Name" severity="error" size="small">{{
                  form.errors.responsible2Name
                }}</Message>
              </div>

              <div class="pt-4">
                <FloatLabel>
                  <InputText id="responsible2Phone" v-model="form.responsible2Phone" fluid maxlength="20" :invalid="!!form.errors.responsible2Phone" />
                  <label for="responsible2Phone">Responsavel 2 - Telefone</label>
                </FloatLabel>
                <Message v-if="form.errors.responsible2Phone" severity="error" size="small">{{
                  form.errors.responsible2Phone
                }}</Message>
              </div>

              <div class="pt-4">
                <FloatLabel>
                  <Select
                    id="profileId"
                    v-model="form.profileId"
                    :options="profiles"
                    optionLabel="name"
                    optionValue="id"
                    showClear
                    fluid
                    :disabled="!canEditProfile"
                    :invalid="!!form.errors.profileId"
                  />
                  <label for="profileId">Perfil *</label>
                </FloatLabel>
                <Message v-if="form.errors.profileId" severity="error" size="small">{{
                  form.errors.profileId
                }}</Message>
              </div>

              <div class="pt-4">
                <FloatLabel>
                  <Select
                    id="userTypeId"
                    v-model="form.userTypeId"
                    :options="userTypes"
                    optionLabel="name"
                    optionValue="id"
                    showClear
                    fluid
                    :invalid="!!form.errors.userTypeId"
                  />
                  <label for="userTypeId">Tipo de Usuario *</label>
                </FloatLabel>
                <Message v-if="form.errors.userTypeId" severity="error" size="small">{{
                  form.errors.userTypeId
                }}</Message>
              </div>

              <div class="pt-4 flex items-center gap-2">
                <ToggleSwitch id="includeInScale" v-model="form.includeInScale" :invalid="!!form.errors.includeInScale" />
                <label for="includeInScale" class="text-sm font-medium">Incluir na escala</label>
                <Message v-if="form.errors.includeInScale" severity="error" size="small">{{
                  form.errors.includeInScale
                }}</Message>
              </div>

              <div class="pt-4">
                <FloatLabel>
                  <Select
                    id="communityId"
                    v-model="form.communityId"
                    :options="churches"
                    optionLabel="name"
                    optionValue="id"
                    showClear
                    fluid
                    :invalid="!!form.errors.communityId"
                  />
                  <label for="communityId">Comunidade *</label>
                </FloatLabel>
                <Message v-if="form.errors.communityId" severity="error" size="small">{{
                  form.errors.communityId
                }}</Message>
              </div>

              <div v-if="!isEditing" class="pt-4">
                <FloatLabel>
                  <Password
                    id="password"
                    v-model="form.password"
                    :feedback="!isEditing"
                    toggleMask
                    fluid
                    :invalid="!!form.errors.password"
                  />
                  <label for="password">Senha *</label>
                </FloatLabel>
                <Message v-if="form.errors.password" severity="error" size="small">{{
                  form.errors.password
                }}</Message>
              </div>

              <div v-if="!isEditing" class="pt-4">
                <FloatLabel>
                  <Password
                    id="passwordConfirmation"
                    v-model="form.passwordConfirmation"
                    :feedback="false"
                    toggleMask
                    fluid
                    :invalid="!!form.errors.passwordConfirmation"
                  />
                  <label for="passwordConfirmation">Confirmar senha *</label>
                </FloatLabel>
                <Message
                  v-if="form.errors.passwordConfirmation"
                  severity="error"
                  size="small"
                >{{ form.errors.passwordConfirmation }}</Message>
              </div>

              <div v-if="isEditing" class="pt-4">
                <FloatLabel>
                  <Password
                    id="password"
                    v-model="form.password"
                    :feedback="false"
                    toggleMask
                    fluid
                    :invalid="!!form.errors.password"
                  />
                  <label for="password">Senha (manter atual)</label>
                </FloatLabel>
                <Message v-if="form.errors.password" severity="error" size="small">{{
                  form.errors.password
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
                    v-model="form.address.postalCode"
                    fluid
                    maxlength="9"
                    :disabled="cepLoading"
                    :invalid="!!form.errors['address.postalCode']"
                  />
                  <label for="postalCode">CEP *</label>
                </FloatLabel>
                <Message v-if="form.errors['address.postalCode']" severity="error" size="small">{{
                  form.errors['address.postalCode']
                }}</Message>
                <Message v-if="cepError" severity="error" size="small">{{ cepError }}</Message>
                <small v-if="cepLoading" class="text-muted-color">Buscando CEP...</small>
              </div>

              <div class="pt-4">
                <FloatLabel>
                  <Select
                    id="addressCountryId"
                    v-model="form.address.countryId"
                    :options="countries"
                    optionLabel="name"
                    optionValue="id"
                    showClear
                    fluid
                    :invalid="!!form.errors['address.countryId']"
                  />
                  <label for="addressCountryId">Pais *</label>
                </FloatLabel>
                <Message v-if="form.errors['address.countryId']" severity="error" size="small">{{
                  form.errors['address.countryId']
                }}</Message>
              </div>

              <div class="pt-4">
                <FloatLabel>
                  <Select
                    id="addressStateId"
                    v-model="form.address.stateId"
                    :options="states"
                    optionLabel="name"
                    optionValue="id"
                    showClear
                    fluid
                    :invalid="!!form.errors['address.stateId']"
                  />
                  <label for="addressStateId">Estado *</label>
                </FloatLabel>
                <Message v-if="form.errors['address.stateId']" severity="error" size="small">{{
                  form.errors['address.stateId']
                }}</Message>
              </div>

              <div class="pt-4">
                <FloatLabel>
                  <Select
                    id="addressCityId"
                    v-model="form.address.cityId"
                    :options="filteredAddressCities"
                    optionLabel="name"
                    optionValue="id"
                    showClear
                    fluid
                    :invalid="!!form.errors['address.cityId']"
                  />
                  <label for="addressCityId">Cidade *</label>
                </FloatLabel>
                <Message v-if="form.errors['address.cityId']" severity="error" size="small">{{
                  form.errors['address.cityId']
                }}</Message>
              </div>

              <div class="pt-4">
                <FloatLabel>
                  <InputText id="neighborhood" v-model="form.address.neighborhood" fluid :invalid="!!form.errors['address.neighborhood']" />
                  <label for="neighborhood">Bairro *</label>
                </FloatLabel>
                <Message v-if="form.errors['address.neighborhood']" severity="error" size="small">{{
                  form.errors['address.neighborhood']
                }}</Message>
              </div>

              <div class="pt-4">
                <FloatLabel>
                  <InputText id="street" v-model="form.address.street" fluid :invalid="!!form.errors['address.street']" />
                  <label for="street">Rua *</label>
                </FloatLabel>
                <Message v-if="form.errors['address.street']" severity="error" size="small">{{
                  form.errors['address.street']
                }}</Message>
              </div>

              <div class="pt-4">
                <FloatLabel>
                  <InputText id="number" v-model="form.address.number" fluid :invalid="!!form.errors['address.number']" />
                  <label for="number">Numero *</label>
                </FloatLabel>
                <Message v-if="form.errors['address.number']" severity="error" size="small">{{
                  form.errors['address.number']
                }}</Message>
              </div>

              <div class="pt-4">
                <FloatLabel>
                  <InputText id="complement" v-model="form.address.complement" fluid :invalid="!!form.errors['address.complement']" />
                  <label for="complement">Complemento</label>
                </FloatLabel>
                <Message v-if="form.errors['address.complement']" severity="error" size="small">{{
                  form.errors['address.complement']
                }}</Message>
              </div>
            </div>
          </TabPanel>

          <TabPanel header="Sacramentos">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <h3 class="text-md font-semibold">Sacramentos recebidos</h3>
                <Button
                  type="button"
                  icon="pi pi-plus"
                  label="Adicionar"
                  severity="secondary"
                  @click="addSacrament"
                />
              </div>

              <div
                v-for="(s, index) in form.sacraments"
                :key="index"
                class="border border-surface rounded-lg p-4 space-y-4"
              >
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-muted-color">Sacramento {{ index + 1 }}</span>
                  <Button
                    type="button"
                    icon="pi pi-trash"
                    severity="danger"
                    text
                    @click="removeSacrament(index)"
                  />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <FloatLabel>
                      <Select
                        :id="`sacramentTypeId-${index}`"
                        v-model="s.sacramentTypeId"
                        :options="sacramentTypes"
                        optionLabel="name"
                        optionValue="id"
                        showClear
                        fluid
                        :invalid="!!form.errors[`sacraments.${index}.sacramentTypeId`]"
                      />
                      <label :for="`sacramentTypeId-${index}`">Tipo de sacramento *</label>
                    </FloatLabel>
                    <Message
                      v-if="form.errors[`sacraments.${index}.sacramentTypeId`]"
                      severity="error"
                      size="small"
                    >{{ form.errors[`sacraments.${index}.sacramentTypeId`] }}</Message>
                  </div>

                  <div>
                    <FloatLabel>
                      <InputText
                        :id="`receivedDate-${index}`"
                        v-model="s.receivedDate"
                        type="date"
                        fluid
                        :invalid="!!form.errors[`sacraments.${index}.receivedDate`]"
                      />
                      <label :for="`receivedDate-${index}`">Data de recebimento *</label>
                    </FloatLabel>
                    <Message
                      v-if="form.errors[`sacraments.${index}.receivedDate`]"
                      severity="error"
                      size="small"
                    >{{ form.errors[`sacraments.${index}.receivedDate`] }}</Message>
                  </div>

                  <div>
                    <FloatLabel>
                      <InputText
                        :id="`receivedChurch-${index}`"
                        v-model="s.receivedChurch"
                        fluid
                        :invalid="!!form.errors[`sacraments.${index}.receivedChurch`]"
                      />
                      <label :for="`receivedChurch-${index}`">Igreja *</label>
                    </FloatLabel>
                    <Message
                      v-if="form.errors[`sacraments.${index}.receivedChurch`]"
                      severity="error"
                      size="small"
                    >{{ form.errors[`sacraments.${index}.receivedChurch`] }}</Message>
                  </div>

                  <div>
                    <FloatLabel>
                      <Select
                        :id="`receivedCountryId-${index}`"
                        v-model="s.receivedCountryId"
                        :options="countries"
                        optionLabel="name"
                        optionValue="id"
                        showClear
                        fluid
                        :invalid="!!form.errors[`sacraments.${index}.receivedCountryId`]"
                      />
                      <label :for="`receivedCountryId-${index}`">Pais *</label>
                    </FloatLabel>
                    <Message
                      v-if="form.errors[`sacraments.${index}.receivedCountryId`]"
                      severity="error"
                      size="small"
                    >{{ form.errors[`sacraments.${index}.receivedCountryId`] }}</Message>
                  </div>

                  <div>
                    <FloatLabel>
                      <Select
                        :id="`receivedStateId-${index}`"
                        v-model="s.receivedStateId"
                        :options="states"
                        optionLabel="name"
                        optionValue="id"
                        showClear
                        fluid
                        :invalid="!!form.errors[`sacraments.${index}.receivedStateId`]"
                      />
                      <label :for="`receivedStateId-${index}`">Estado *</label>
                    </FloatLabel>
                    <Message
                      v-if="form.errors[`sacraments.${index}.receivedStateId`]"
                      severity="error"
                      size="small"
                    >{{ form.errors[`sacraments.${index}.receivedStateId`] }}</Message>
                  </div>

                  <div>
                    <FloatLabel>
                      <Select
                        :id="`receivedCityId-${index}`"
                        v-model="s.receivedCityId"
                        :options="filteredSacramentCities(s.receivedStateId)"
                        optionLabel="name"
                        optionValue="id"
                        showClear
                        fluid
                        :invalid="!!form.errors[`sacraments.${index}.receivedCityId`]"
                      />
                      <label :for="`receivedCityId-${index}`">Cidade *</label>
                    </FloatLabel>
                    <Message
                      v-if="form.errors[`sacraments.${index}.receivedCityId`]"
                      severity="error"
                      size="small"
                    >{{ form.errors[`sacraments.${index}.receivedCityId`] }}</Message>
                  </div>
                </div>
              </div>

              <div v-if="form.sacraments.length === 0" class="text-sm text-muted-color">
                Nenhum sacramento cadastrado.
              </div>
            </div>
          </TabPanel>

          <TabPanel header="Funcoes">
            <div class="pt-4">
              <MultiSelect
                v-model="form.ministryRoleIds"
                :options="ministryRoles"
                optionLabel="name"
                optionValue="id"
                display="chip"
                placeholder="Selecione as funcoes ministeriais"
                class="w-full"
                :invalid="!!form.errors.ministryRoleIds"
              />
              <Message v-if="form.errors.ministryRoleIds" severity="error" size="small">{{
                form.errors.ministryRoleIds
              }}</Message>
            </div>
          </TabPanel>
        </TabView>
      </div>

      <div class="flex justify-end gap-2 p-4 border-t border-surface">
        <Button
          type="submit"
          label="Salvar"
          :disabled="form.processing"
          severity="info"
        />
        <Button label="Cancelar" severity="secondary" outlined @click="router.get('/users')" />
      </div>
    </form>
  </div>
</template>
