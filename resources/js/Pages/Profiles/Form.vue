<script setup lang="ts">
import { useForm, router } from '@inertiajs/vue3'
import { ref, computed } from 'vue'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
import Message from 'primevue/message'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Breadcrumb from 'primevue/breadcrumb'
import FloatLabel from 'primevue/floatlabel'

const props = defineProps<{
  profile: {
    id: number
    name: string
    description: string | null
    permissions: Array<{ id: number; module: string; action: string }>
  } | null
  groupedPermissions: Record<string, Array<{ id: number; action: string }>>
  selectedPermissionIds: number[]
}>()

const isEditing = computed(() => !!props.profile)

const home = ref({ icon: 'pi pi-home', command: () => router.get('/dashboard') })
const model = computed(() => [
  { label: 'Perfis', command: () => router.get('/profiles') },
  { label: isEditing.value ? 'Editar Perfil' : 'Novo Perfil' },
])

const form = useForm({
  name: props.profile?.name || '',
  description: props.profile?.description || '',
  permissionIds: ref([...(props.selectedPermissionIds || [])]),
})

const activeTab = ref(0)

const submit = () => {
  if (props.profile) {
    form.put(`/profiles/${props.profile.id}`)
  } else {
    form.post('/profiles')
  }
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-color">{{ profile ? 'Editar Perfil' : 'Novo Perfil' }}</h2>
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
                  <InputText id="name" v-model="form.name" fluid />
                  <label for="name">Nome</label>
                </FloatLabel>
                <Message v-if="form.errors.name" severity="error" size="small">{{
                  form.errors.name
                }}</Message>
              </div>

              <div class="md:col-span-2 pt-4">
                <FloatLabel>
                  <Textarea id="description" v-model="form.description" rows="4" fluid />
                  <label for="description">Descrição</label>
                </FloatLabel>
                <Message v-if="form.errors.description" severity="error" size="small">{{
                  form.errors.description
                }}</Message>
              </div>
            </div>
          </TabPanel>

          <TabPanel header="Permissões">
            <div v-for="(perms, module) in groupedPermissions" :key="module" class="mb-6">
              <div class="font-semibold text-sm capitalize text-color mb-3">{{ module }}</div>
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                <div v-for="perm in perms" :key="perm.id" class="flex items-center gap-2">
                  <Checkbox
                    :value="perm.id"
                    v-model="form.permissionIds"
                    :inputId="`perm-${perm.id}`"
                  />
                  <label :for="`perm-${perm.id}`" class="text-sm text-color">{{
                    perm.action
                  }}</label>
                </div>
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
        <Button label="Cancelar" severity="secondary" outlined @click="$inertia.get('/profiles')" />
      </div>
    </form>
  </div>
</template>
