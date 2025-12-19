<template>
  <div class="bg-gray-50 border border-gray-200 rounded-xl shadow-md relative hover:shadow-xl transition-shadow cursor-pointer hover:scale-105 hover:transition-all duration-500 hover:duration-500">
    <div class="p-6">
      <div class="mb-2">
        <div class="inline-block bg-green-200 px-2 py-1 rounded-xl text-md text-gray-600">
          <i :class="[typeIcon, 'text-md px-0.5']"></i>
          {{ job.type }}
        </div>
        <h3 class="text-xl font-bold mt-2">{{ job.title }}</h3>
        <div class="border border-gray-100 mt-3"></div>
      </div>

      <div class="mb-5 min-h-12">
        {{ truncateDescription(job.description) }}
      </div>

      <div class="border border-gray-100 mt-3"></div>

      <h3 class="text-green-600 font-semibold my-2">
        Salary: {{ job.salary }} / Year
      </h3>

      <div class="border border-gray-100 mb-3"></div>

      <div class="flex justify-between items-center mb-4">
        <div class="text-red-600">
          <i class="fa-solid fa-location-dot px-0.5"></i>
          {{ job.location }}
        </div>

        <RouterLink
          :to="`/jobs/${job.id}`"
          class="group inline-flex items-center gap-2 h-9 
         border border-green-500 text-green-600
         px-5 py-2 rounded-lg text-sm font-medium
         transition-all duration-300
         hover:bg-green-500 hover:text-white">
          Read More
          <i class="fas fa-arrow-right transition-transform duration-300 group-hover:translate-x-1"></i>
        </RouterLink>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  job: {
    type: Object,
    required: true
  }
})

const typeIcon = computed(() => {
  switch (props.job.type) {
    case 'Full-Time':
      return 'fa-solid fa-briefcase'
    case 'Part-Time':
      return 'fa-solid fa-clock'
    case 'Remote':
      return 'fa-solid fa-house-laptop'
    case 'Internship':
      return 'fa-solid fa-graduation-cap'
    default:
      return 'fa-solid fa-briefcase'
  }
})

const truncateDescription = (description) => {
  if (!description) return ''
  return description.length > 90 ? description.substring(0, 90) + '...' : description
}
</script>
