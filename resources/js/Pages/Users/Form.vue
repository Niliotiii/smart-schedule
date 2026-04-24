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
import FormField from '../../Components/FormField.vue'
import TabPanelError from '../../Components/TabPanelError.vue'
import { useFormValidation } from '../../Composables/useFormValidation'

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

const tabMap = {
  fullName: 0,
  email: 0,
  phone: 0,
  birthDate: 0,
  birthCountryId: 0,
  birthStateId: 0,
  birthCityId: 0,
  responsible1Name: 0,
  responsible1Phone: 0,
  responsible2Name: 0,
  responsible2Phone: 0,
  profileId: 0,
  userTypeId: 0,
  includeInScale: 0,
  communityId: 0,
  password: 0,
  passwordConfirmation: 0,
  'address.postalCode': 1,
  'address.countryId': 1,
  'address.stateId': 1,
  'address.cityId': 1,
  'address.neighborhood': 1,
  'address.street': 1,
  'address.number': 1,
  'address.complement': 1,
  sacraments: 2,
  ministryRoleIds: 3,
}

useFormValidation(form, tabMap)

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
          <TabPanel>
            <template #header>
              <TabPanelError :tabIndex="0" header="Informacoes Gerais" />
            </template>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField field="fullName">
                <template #default="{ invalid }">
                  <FloatLabel>
                    <InputText id="fullName" v-model="form.fullName" fluid :invalid="invalid" />
                    <label for="fullName">Nome completo *</label>
                  </FloatLabel>
                </template>
              </FormField>

              <FormField field="email">
                <template #default="{ invalid }">
                  <FloatLabel>
                    <InputText id="email" v-model="form.email" type="email" fluid :invalid="invalid" />
                    <label for="email">Email *</label>
                  </FloatLabel>
                </template>
              </FormField>

              <FormField field="phone">
                <template #default="{ invalid }">
                  <FloatLabel>
                    <InputText id="phone" v-model="form.phone" fluid maxlength="20" :invalid="invalid" />
                    <label for="phone">Telefone *</label>
                  </FloatLabel>
                </template>
              </FormField>

              <FormField field="birthDate">
                <template #default="{ invalid }">
                  <FloatLabel>
                    <InputText id="birthDate" v-model="form.birthDate" type="date" fluid :invalid="invalid" />
                    <label for="birthDate">Data de nascimento *</label>
                  </FloatLabel>
                </template>
              </FormField>

              <FormField field="birthCountryId">
                <template #default="{ invalid }">
                  <FloatLabel>
                    <Select
                      id="birthCountryId"
                      v-model="form.birthCountryId"
                      :options="countries"
                      optionLabel="name"
                      optionValue="id"
                      showClear
                      fluid
                      :invalid="invalid"
                    />
                    <label for="birthCountryId">Pais de nascimento *</label>
                  </FloatLabel>
                </template>
              </FormField>

              <FormField field="birthStateId">
                <template #default="{ invalid }">
                  <FloatLabel>
                    <Select
                      id="birthStateId"
                      v-model="form.birthStateId"
                      :options="states"
                      optionLabel="name"
                      optionValue="id"
                      showClear
                      fluid
                      :invalid="invalid"
                    />
                    <label for="birthStateId">Estado de nascimento *</label>
                  </FloatLabel>
                </template>
              </FormField>

              <FormField field="birthCityId">
                <template #default="{ invalid }">
                  <FloatLabel>
                    <Select
                      id="birthCityId"
                      v-model="form.birthCityId"
                      :options="filteredBirthCities"
                      optionLabel="name"
                      optionValue="id"
                      showClear
                      fluid
                      :invalid="invalid"
                    />
                    <label for="birthCityId">Cidade de nascimento *</label>
                  </FloatLabel>
                </template>
              </FormField>

              <FormField field="responsible1Name">
                <template #default="{ invalid }">
                  <FloatLabel>
                    <InputText id="responsible1Name" v-model="form.responsible1Name" fluid :invalid="invalid" />
                    <label for="responsible1Name">Responsavel 1 - Nome</label>
                  </FloatLabel>
                </template>
              </FormField>

              <FormField field="responsible1Phone">
                <template #default="{ invalid }">
                  <FloatLabel>
                    <InputText id="responsible1Phone" v-model="form.responsible1Phone" fluid maxlength="20" :invalid="invalid" />
                    <label for="responsible1Phone">Responsavel 1 - Telefone</label>
                  </FloatLabel>
                </template>
              </FormField>

              <FormField field="responsible2Name">
                <template #default="{ invalid }">
                  <FloatLabel>
                    <InputText id="responsible2Name" v-model="form.responsible2Name" fluid :invalid="invalid" />
                    <label for="responsible2Name">Responsavel 2 - Nome</label>
                  </FloatLabel>
                </template>
              </FormField>

              <FormField field="responsible2Phone">
                <template #default="{ invalid }">
                  <FloatLabel>
                    <InputText id="responsible2Phone" v-model="form.responsible2Phone" fluid maxlength="20" :invalid="invalid" />
                    <label for="responsible2Phone">Responsavel 2 - Telefone</label>
                  </FloatLabel>
                </template>
              </FormField>

              <FormField field="profileId">
                <template #default="{ invalid }">
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
                      :invalid="invalid"
                    />
                    <label for="profileId">Perfil *</label>
                  </FloatLabel>
                </template>
              </FormField>

              <FormField field="userTypeId">
                <template #default="{ invalid }">
                  <FloatLabel>
                    <Select
                      id="userTypeId"
                      v-model="form.userTypeId"
                      :options="userTypes"
                      optionLabel="name"
                      optionValue="id"
                      showClear
                      fluid
                      :invalid="invalid"
                    />
                    <label for="userTypeId">Tipo de Usuario *</label>
                  </FloatLabel>
                </template>
              </FormField>

              <FormField field="includeInScale">
                <template #default="{ invalid }">
                  <div class="flex items-center gap-2">
                    <ToggleSwitch id="includeInScale" v-model="form.includeInScale" :invalid="invalid" />
                    <label for="includeInScale" class="text-sm font-medium">Incluir na escala</label>
                  </div>
                </template>
              </FormField>

              <FormField field="communityId">
                <template #default="{ invalid }">
                  <FloatLabel>
                    <Select
                      id="communityId"
                      v-model="form.communityId"
                      :options="churches"
                      optionLabel="name"
                      optionValue="id"
                      showClear
                      fluid
                      :invalid="invalid"
                    />
                    <label for="communityId">Comunidade *</label>
                  </FloatLabel>
                </template>
              </FormField>

              <FormField v-if="!isEditing" field="password">
                <template #default="{ invalid }">
                  <FloatLabel>
                    <Password
                      id="password"
                      v-model="form.password"
                      :feedback="!isEditing"
                      toggleMask
                      fluid
                      :invalid="invalid"
                    />
                    <label for="password">Senha *</label>
                  </FloatLabel>
                </template>
              </FormField>

              <FormField v-if="!isEditing" field="passwordConfirmation">
                <template #default="{ invalid }">
                  <FloatLabel>
                    <Password
                      id="passwordConfirmation"
                      v-model="form.passwordConfirmation"
                      :feedback="false"
                      toggleMask
                      fluid
                      :invalid="invalid"
                    />
                    <label for="passwordConfirmation">Confirmar senha *</label>
                  </FloatLabel>
                </template>
              </FormField>

              <FormField v-if="isEditing" field="password">
                <template #default="{ invalid }">
                  <FloatLabel>
                    <Password
                      id="password"
                      v-model="form.password"
                      :feedback="false"
                      toggleMask
                      fluid
                      :invalid="invalid"
                    />
                    <label for="password">Senha (manter atual)</label>
                  </FloatLabel>
                </template>
              </FormField>
            </div>
          </TabPanel>

          <TabPanel>
            <template #header>
              <TabPanelError :tabIndex="1" header="Endereco" />
            </template>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField field="address.postalCode">
                <template #default="{ invalid }">
                  <FloatLabel>
                    <InputText
                      id="postalCode"
                      v-model="form.address.postalCode"
                      fluid
                      maxlength="9"
                      :disabled="cepLoading"
                      :invalid="invalid"
                    />
                    <label for="postalCode">CEP *</label>
                  </FloatLabel>
                </template>
              </FormField>

              <FormField field="address.countryId">
                <template #default="{ invalid }">
                  <FloatLabel>
                    <Select
                      id="addressCountryId"
                      v-model="form.address.countryId"
                      :options="countries"
                      optionLabel="name"
                      optionValue="id"
                      showClear
                      fluid
                      :invalid="invalid"
                    />
                    <label for="addressCountryId">Pais *</label>
                  </FloatLabel>
                </template>
              </FormField>

              <FormField field="address.stateId">
                <template #default="{ invalid }">
                  <FloatLabel>
                    <Select
                      id="addressStateId"
                      v-model="form.address.stateId"
                      :options="states"
                      optionLabel="name"
                      optionValue="id"
                      showClear
                      fluid
                      :invalid="invalid"
                    />
                    <label for="addressStateId">Estado *</label>
                  </FloatLabel>
                </template>
              </FormField>

              <FormField field="address.cityId">
                <template #default="{ invalid }">
                  <FloatLabel>
                    <Select
                      id="addressCityId"
                      v-model="form.address.cityId"
                      :options="filteredAddressCities"
                      optionLabel="name"
                      optionValue="id"
                      showClear
                      fluid
                      :invalid="invalid"
                    />
                    <label for="addressCityId">Cidade *</label>
                  </FloatLabel>
                </template>
              </FormField>

              <FormField field="address.neighborhood">
                <template #default="{ invalid }">
                  <FloatLabel>
                    <InputText id="neighborhood" v-model="form.address.neighborhood" fluid :invalid="invalid" />
                    <label for="neighborhood">Bairro *</label>
                  </FloatLabel>
                </template>
              </FormField>

              <FormField field="address.street">
                <template #default="{ invalid }">
                  <FloatLabel>
                    <InputText id="street" v-model="form.address.street" fluid :invalid="invalid" />
                    <label for="street">Rua *</label>
                  </FloatLabel>
                </template>
              </FormField>

              <FormField field="address.number">
                <template #default="{ invalid }">
                  <FloatLabel>
                    <InputText id="number" v-model="form.address.number" fluid :invalid="invalid" />
                    <label for="number">Numero *</label>
                  </FloatLabel>
                </template>
              </FormField>

              <FormField field="address.complement">
                <template #default="{ invalid }">
                  <FloatLabel>
                    <InputText id="complement" v-model="form.address.complement" fluid :invalid="invalid" />
                    <label for="complement">Complemento</label>
                  </FloatLabel>
                </template>
              </FormField>
              <Message v-if="cepError" severity="error" size="small">{{ cepError }}</Message>
              <small v-if="cepLoading" class="text-muted-color">Buscando CEP...</small>
            </div>
          </TabPanel>

          <TabPanel>
            <template #header>
              <TabPanelError :tabIndex="2" header="Sacramentos" />
            </template>
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
                  <FormField :field="`sacraments.${index}.sacramentTypeId`">
                    <template #default="{ invalid }">
                      <FloatLabel>
                        <Select
                          :id="`sacramentTypeId-${index}`"
                          v-model="s.sacramentTypeId"
                          :options="sacramentTypes"
                          optionLabel="name"
                          optionValue="id"
                          showClear
                          fluid
                          :invalid="invalid"
                        />
                        <label :for="`sacramentTypeId-${index}`">Tipo de sacramento *</label>
                      </FloatLabel>
                    </template>
                  </FormField>

                  <FormField :field="`sacraments.${index}.receivedDate`">
                    <template #default="{ invalid }">
                      <FloatLabel>
                        <InputText
                          :id="`receivedDate-${index}`"
                          v-model="s.receivedDate"
                          type="date"
                          fluid
                          :invalid="invalid"
                        />
                        <label :for="`receivedDate-${index}`">Data de recebimento *</label>
                      </FloatLabel>
                    </template>
                  </FormField>

                  <FormField :field="`sacraments.${index}.receivedChurch`">
                    <template #default="{ invalid }">
                      <FloatLabel>
                        <InputText
                          :id="`receivedChurch-${index}`"
                          v-model="s.receivedChurch"
                          fluid
                          :invalid="invalid"
                        />
                        <label :for="`receivedChurch-${index}`">Igreja *</label>
                      </FloatLabel>
                    </template>
                  </FormField>

                  <FormField :field="`sacraments.${index}.receivedCountryId`">
                    <template #default="{ invalid }">
                      <FloatLabel>
                        <Select
                          :id="`receivedCountryId-${index}`"
                          v-model="s.receivedCountryId"
                          :options="countries"
                          optionLabel="name"
                          optionValue="id"
                          showClear
                          fluid
                          :invalid="invalid"
                        />
                        <label :for="`receivedCountryId-${index}`">Pais *</label>
                      </FloatLabel>
                    </template>
                  </FormField>

                  <FormField :field="`sacraments.${index}.receivedStateId`">
                    <template #default="{ invalid }">
                      <FloatLabel>
                        <Select
                          :id="`receivedStateId-${index}`"
                          v-model="s.receivedStateId"
                          :options="states"
                          optionLabel="name"
                          optionValue="id"
                          showClear
                          fluid
                          :invalid="invalid"
                        />
                        <label :for="`receivedStateId-${index}`">Estado *</label>
                      </FloatLabel>
                    </template>
                  </FormField>

                  <FormField :field="`sacraments.${index}.receivedCityId`">
                    <template #default="{ invalid }">
                      <FloatLabel>
                        <Select
                          :id="`receivedCityId-${index}`"
                          v-model="s.receivedCityId"
                          :options="filteredSacramentCities(s.receivedStateId)"
                          optionLabel="name"
                          optionValue="id"
                          showClear
                          fluid
                          :invalid="invalid"
                        />
                        <label :for="`receivedCityId-${index}`">Cidade *</label>
                      </FloatLabel>
                    </template>
                  </FormField>
                </div>
              </div>

              <div v-if="form.sacraments.length === 0" class="text-sm text-muted-color">
                Nenhum sacramento cadastrado.
              </div>
            </div>
          </TabPanel>

          <TabPanel>
            <template #header>
              <TabPanelError :tabIndex="3" header="Funcoes" />
            </template>
            <FormField field="ministryRoleIds">
              <template #default="{ invalid }">
                <MultiSelect
                  v-model="form.ministryRoleIds"
                  :options="ministryRoles"
                  optionLabel="name"
                  optionValue="id"
                  display="chip"
                  placeholder="Selecione as funcoes ministeriais"
                  class="w-full"
                  :invalid="invalid"
                />
              </template>
            </FormField>
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
