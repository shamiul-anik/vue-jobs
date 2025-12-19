<template>
  <div class="bg-white rounded-xl shadow-md relative">
    <div class="p-4">
      <div class="mb-2">
        <div class="inline-block bg-green-200 px-2 py-1 rounded-xl text-md text-gray-600">{{ job.type }}</div>
        <h3 class="text-xl font-bold mt-2">{{ job.title }}</h3>
        <div class="border border-gray-100 mt-3"></div>
      </div>

      <div class="mb-5 min-h-12">
        {{ truncateDescription(job.description) }}
      </div>

      <h3 class="text-green-600 mb-2">
        Salary: {{ job.salary }}
      </h3>

      <div class="border border-gray-100 mb-5"></div>

      <div class="flex justify-between items-center mb-4">
        <div class="text-orange-700">
          <i class="fa-solid fa-location-dot text-lg mr-1"></i>
          {{ job.location }}
        </div>
        <RouterLink
          :to="`/jobs/${job.id}`"
          class="h-9 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-center text-sm animate-pulse"
          :aria-label="`View details for ${job.title} position in ${job.location}`"
        >
          Read More
          <i class="fas fa-arrow-right ml-1"></i>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'

const props = defineProps({
  job: {
    type: Object,
    required: true
  }
})

const truncateDescription = (description) => {
  if (!description) return ''
  return description.length > 90 ? description.substring(0, 90) + '...' : description
}
</script>
