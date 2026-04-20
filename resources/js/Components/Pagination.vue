<script setup lang="ts">
import { Link } from '@inertiajs/vue3'
import Icon from './Icon.vue'

const props = defineProps<{
  pagination: {
    total: number
    currentPage: number
    lastPage: number
    perPage: number
    firstItem: number
    lastItem: number
  }
  baseUrl: string
  search?: string
}>()

const pages = Array.from({ length: props.pagination.lastPage }, (_, i) => i + 1)

const getPageUrl = (page: number) => {
  const params = new URLSearchParams()
  params.set('page', String(page))
  if (props.search) params.set('search', props.search)
  return `${props.baseUrl}?${params.toString()}`
}
</script>

<template>
  <div v-if="pagination.lastPage > 1" class="flex items-center justify-between mt-4">
    <p class="text-sm text-gray-500 dark:text-gray-400">
      Mostrando {{ pagination.firstItem }}-{{ pagination.lastItem }} de {{ pagination.total }}
    </p>
    <div class="flex gap-1">
      <Link v-if="pagination.currentPage > 1" :href="getPageUrl(pagination.currentPage - 1)" class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
        <Icon name="chevron-left" cssClass="w-4 h-4 inline" />
      </Link>

      <template v-for="page in pages" :key="page">
        <span v-if="page === pagination.currentPage" class="px-3 py-1 text-sm border border-violet-600 bg-violet-50 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 rounded-md font-medium">{{ page }}</span>
        <Link v-else :href="getPageUrl(page)" class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">{{ page }}</Link>
      </template>

      <Link v-if="pagination.currentPage < pagination.lastPage" :href="getPageUrl(pagination.currentPage + 1)" class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
        <Icon name="chevron-right" cssClass="w-4 h-4 inline" />
      </Link>
    </div>
  </div>
</template>