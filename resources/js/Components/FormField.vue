<script setup lang="ts">
import { computed } from 'vue'
import { useFormValidationInject } from '../Composables/useFormValidation'

const props = defineProps<{
  field: string
}>()

const { getFieldError } = useFormValidationInject()
const error = computed(() => getFieldError(props.field))
const invalid = computed(() => !!error.value)
</script>

<template>
  <div class="pt-4">
    <slot :invalid="invalid" :error="error" />
    <small v-if="error" class="text-red-500 block mt-1">{{ error }}</small>
  </div>
</template>
