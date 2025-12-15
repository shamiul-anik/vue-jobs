<template>
  <div class="bg-white rounded-xl shadow-md relative">
    <div class="p-4">
      <div class="mb-6">
        <div class="text-gray-600 my-2">{{ job.type }}</div>
        <h3 class="text-xl font-bold">{{ job.title }}</h3>
      </div>

      <div class="mb-5 min-h-12">
        {{ truncateDescription(job.description) }}
      </div>

      <h3 class="text-green-500 mb-2">
        {{ job.salary }}
      </h3>

      <div class="border border-gray-100 mb-5"></div>

      <div class="flex flex-col lg:flex-row justify-between items-center mb-4">
        <div class="text-orange-700">
          <i class="fa-solid fa-location-dot text-lg mr-1"></i>
          {{ job.location }}
        </div>
        <RouterLink
          :to="`/jobs/${job.id}`"
          class="h-9 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-center text-sm"
          :aria-label="`View details for ${job.title} position in ${job.location}`"
        >
          Read More
          <i class="fas fa-arrow-right ml-1"></i>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

interface Job {
  id: number
  type: string
  title: string
  description: string
  salary: string
  location: string
  company_name: string
  company_description?: string
  contact_email: string
  contact_phone?: string
  created_at?: string
}

const props = defineProps<{
  job: Job
}>()

const truncateDescription = (description: string): string => {
  if (!description) return ''
  return description.length > 90 ? description.substring(0, 90) + '...' : description
}
</script>
