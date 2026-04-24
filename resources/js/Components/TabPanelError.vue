<script setup lang="ts">
import { useFormValidationInject } from '../Composables/useFormValidation'
import { computed } from 'vue'

const props = defineProps<{
  header: string
  tabIndex: number
}>()

const { hasTabError } = useFormValidationInject()
const error = computed(() => hasTabError(props.tabIndex))
</script>

<template>
  <span :class="{ 'text-red-500 font-semibold': error }">{{ header }}</span>
  <span v-if="error" class="ml-2 pi pi-exclamation-circle text-red-500" />
</template>
