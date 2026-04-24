<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import InputText from 'primevue/inputtext'
import InputMask from 'primevue/inputmask'

const props = defineProps<{
  modelValue: string
  id?: string
  fluid?: boolean
  invalid?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const focused = ref(false)

const displayValue = computed(() => {
  if (!props.modelValue) return ''
  // If already in dd/mm/yyyy format, return as-is
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(props.modelValue)) return props.modelValue
  // If in yyyy-mm-dd format, convert to dd/mm/yyyy
  if (/^\d{4}-\d{2}-\d{2}$/.test(props.modelValue)) {
    const [y, m, d] = props.modelValue.split('-')
    return `${d}/${m}/${y}`
  }
  return props.modelValue
})

const maskValue = computed({
  get: () => displayValue.value,
  set: (val: string) => {
    emit('update:modelValue', val)
  },
})

function handleBlur() {
  focused.value = false
  const val = maskValue.value
  if (val && /^\d{2}\/\d{2}\/\d{4}$/.test(val)) {
    const [d, m, y] = val.split('/')
    emit('update:modelValue', `${y}-${m}-${d}`)
  } else if (!val) {
    emit('update:modelValue', '')
  }
}

function onTextInput(e: Event) {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <InputMask
    v-if="focused || displayValue"
    :id="id"
    v-model="maskValue"
    mask="99/99/9999"
    slot-char="_"
    auto-clear
    :fluid="fluid"
    :invalid="invalid"
    @focus="focused = true"
    @blur="handleBlur"
  />
  <InputText
    v-else
    :id="id"
    :fluid="fluid"
    :invalid="invalid"
    placeholder=""
    @focus="focused = true"
    @input="onTextInput"
  />
</template>
