<template>
  <div class="flex items-center justify-center space-x-2" aria-label="Pagination">
    <!-- Previous Button -->
    <button
      @click="$emit('change-page', currentPage - 1)"
      :disabled="currentPage === 1"
      class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer">
      <i class="fas fa-chevron-left mr-2"></i>
      Previous
    </button>

    <!-- Page Numbers -->
    <div class="hidden md:flex items-center space-x-1">
      <template v-for="page in visiblePages" :key="page">
        <button
          v-if="page !== '...'"
          @click="$emit('change-page', page)"
          :class="[
            'px-4 py-2 text-sm font-medium rounded-lg border transition-colors cursor-pointer',
            currentPage === page
              ? 'bg-green-600 border-green-600 text-white'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          ]">
          {{ page }}
        </button>
        <span
          v-else
          class="px-4 py-2 text-sm font-medium text-gray-700">
          ...
        </span>
      </template>
    </div>

    <!-- Mobile Page Indicator -->
    <span class="md:hidden text-sm font-medium text-gray-700">
      Page {{ currentPage }} of {{ totalPages }}
    </span>

    <!-- Next Button -->
    <button @click="$emit('change-page', currentPage + 1)" :disabled="currentPage === totalPages" class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer">
      Next
      <i class="fas fa-chevron-right ml-2"></i>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
})

defineEmits(['change-page'])

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5

  if (props.totalPages <= maxVisible) {
    for (let i = 1; i <= props.totalPages; i++) {
      pages.push(i)
    }
  } else {
    // Logic for ellipses
    if (props.currentPage <= 3) {
      pages.push(1, 2, 3, 4, '...', props.totalPages)
    } else if (props.currentPage >= props.totalPages - 2) {
      pages.push(1, '...', props.totalPages - 3, props.totalPages - 2, props.totalPages - 1, props.totalPages)
    } else {
      pages.push(1, '...', props.currentPage - 1, props.currentPage, props.currentPage + 1, '...', props.totalPages)
    }
  }

  return pages
})
</script>
