<script setup lang="ts">
import { useForm, router } from '@inertiajs/vue3'
import { ref, computed } from 'vue'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Select from 'primevue/select'
import Button from 'primevue/button'
import Message from 'primevue/message'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Breadcrumb from 'primevue/breadcrumb'
import FloatLabel from 'primevue/floatlabel'

const props = defineProps<{
  user: {
    id: number
    fullName: string | null
    email: string
    profileId: number | null
  } | null
  profiles: Array<{ id: number; name: string }>
}>()

const isEditing = computed(() => !!props.user)

const home = ref({ icon: 'pi pi-home', command: () => router.get('/dashboard') })
const model = computed(() => [
  { label: 'Usuários', command: () => router.get('/users') },
  { label: isEditing.value ? 'Editar Usuário' : 'Novo Usuário' },
])

const form = useForm({
  fullName: props.user?.fullName || '',
  email: props.user?.email || '',
  password: '',
  passwordConfirmation: '',
  profileId: props.user?.profileId ?? ('' as number | string),
})

const activeTab = ref(0)

const submit = () => {
  if (props.user) {
    form.transform((data) => ({
      fullName: data.fullName,
      email: data.email,
      ...(data.password ? { password: data.password } : {}),
      profileId: data.profileId,
    })).put(`/users/${props.user.id}`)
  } else {
    form.post('/users')
  }
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-color">{{ isEditing ? 'Editar Usuário' : 'Novo Usuário' }}</h2>
      <Breadcrumb :home="home" :model="model" />
    </div>

    <form @submit.prevent="submit" class="bg-surface-ground border border-surface rounded-lg flex-1 flex flex-col min-h-0">
      <div class="p-4 flex-1">
        <TabView v-model:activeIndex="activeTab">
          <TabPanel header="Informações Pessoais">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FloatLabel>
                  <InputText id="fullName" v-model="form.fullName" fluid />
                  <label for="fullName">Nome completo</label>
                </FloatLabel>
                <Message v-if="form.errors.fullName" severity="error" size="small">{{ form.errors.fullName }}</Message>
              </div>

              <div>
                <FloatLabel>
                  <InputText id="email" v-model="form.email" type="email" fluid />
                  <label for="email">Email</label>
                </FloatLabel>
                <Message v-if="form.errors.email" severity="error" size="small">{{ form.errors.email }}</Message>
              </div>
            </div>
          </TabPanel>

          <TabPanel header="Segurança">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FloatLabel>
                  <Password id="password" v-model="form.password" :feedback="!isEditing" toggleMask fluid />
                  <label for="password">Senha{{ isEditing ? ' (manter atual)' : '' }}</label>
                </FloatLabel>
                <Message v-if="form.errors.password" severity="error" size="small">{{ form.errors.password }}</Message>
              </div>

              <div v-if="!isEditing">
                <FloatLabel>
                  <Password id="passwordConfirmation" v-model="form.passwordConfirmation" :feedback="false" toggleMask fluid />
                  <label for="passwordConfirmation">Confirmar senha</label>
                </FloatLabel>
                <Message v-if="form.errors.passwordConfirmation" severity="error" size="small">{{ form.errors.passwordConfirmation }}</Message>
              </div>

              <div>
                <FloatLabel>
                  <Select id="profileId" v-model="form.profileId" :options="profiles" optionLabel="name" optionValue="id" showClear fluid />
                  <label for="profileId">Perfil</label>
                </FloatLabel>
                <Message v-if="form.errors.profileId" severity="error" size="small">{{ form.errors.profileId }}</Message>
              </div>
            </div>
          </TabPanel>
        </TabView>
      </div>

      <div class="flex justify-end gap-2 p-4 border-t border-surface">
        <Button v-if="activeTab === 1" type="submit" label="Salvar" :disabled="form.processing" severity="info" />
        <Button label="Cancelar" severity="secondary" outlined @click="$inertia.get('/users')" />
      </div>
    </form>
  </div>
</template>