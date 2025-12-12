<template>
  <div>
    <!-- Filter Jobs -->
    <section class="bg-green-50 py-4">
      <div class="container mx-auto px-4">
        <div class="relative">
          <input
            name="searchJob"
            v-model="searchQuery"
            type="text"
            class="w-full p-3 border bg-white border-green-500 rounded-lg focus:outline-green-500"
            placeholder="Filter jobs by title, location, or company..."
          />
        </div>
      </div>
    </section>

    <!-- All Jobs -->
    <section class="bg-green-50 px-4 py-10">
      <div class="container-xl lg:container m-auto">
        <h2 class="text-3xl font-bold text-green-500 mb-6 text-center">
          Browse Jobs
        </h2>
        
        <div v-if="loading" class="text-center">
          <p class="text-xl">Loading jobs...</p>
        </div>
        
        <div v-else-if="error" class="text-center">
          <p class="text-xl text-red-500">{{ error }}</p>
        </div>
        
        <div v-else-if="filteredJobs.length === 0" class="text-center">
          <p class="text-xl">No jobs found matching your search.</p>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <JobCard v-for="job in filteredJobs" :key="job.id" :job="job" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import JobCard from '../components/JobCard.vue'
import { jobsAPI } from '../services/api'
import { useSEO } from '../composables/useSEO'

const jobs = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('')

const filteredJobs = computed(() => {
  if (!searchQuery.value) return jobs.value
  
  const query = searchQuery.value.toLowerCase()
  return jobs.value.filter(job => 
    job.title.toLowerCase().includes(query) ||
    job.location.toLowerCase().includes(query) ||
    (job.company_name && job.company_name.toLowerCase().includes(query)) ||
    job.type.toLowerCase().includes(query)
  )
})

// SEO Configuration
useSEO({
  title: 'Browse All Vue.js Jobs | Vue Developer Opportunities',
  description: 'Browse all available Vue.js developer jobs. Filter by location, job type, and company. Find full-time, part-time, and remote Vue.js positions.',
  keywords: 'Vue.js jobs, browse Vue jobs, Vue developer positions, frontend jobs, JavaScript developer jobs',
  canonical: window.location.origin + '/jobs',
  image: window.location.origin + '/images/logo.png'
})

onMounted(async () => {
  try {
    jobs.value = await jobsAPI.getAllJobs()
  } catch (err) {
    error.value = 'Failed to load jobs. Please try again later.'
    console.error('Error fetching jobs:', err)
  } finally {
    loading.value = false
  }
})
</script>
