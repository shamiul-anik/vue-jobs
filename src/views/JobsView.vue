<template>
  <div>
    <!-- Filter Jobs -->
    <section class="bg-green-50 py-4">
      <div class="container mx-auto px-4">
        <div class="text-center">
          <span class="relative">
          <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input
            name="searchJob"
            v-model="searchQuery"
            type="text"
            class="w-full md:w-3xl p-3 pl-10 border bg-white border-green-500 rounded-lg focus:outline-green-500"
            placeholder="Filter jobs by title, location, or company..."
          />
          </span>
        </div>
      </div>
    </section>

    <!-- All Jobs -->
    <section class="bg-green-50 px-4 py-10">
      <div class="container-xl lg:container m-auto">
        <h2 class="text-3xl font-bold text-green-500 mb-6 text-center">
          Browse Jobs
        </h2>
        
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <JobSkeleton v-for="i in 6" :key="i" />
        </div>
        
        <div v-else-if="error" class="text-center">
          <p class="text-xl text-red-500">{{ error }}</p>
        </div>
        
        <div v-else-if="filteredJobs.length === 0" class="text-center">
          <p class="text-xl">No jobs found matching your search.</p>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <JobCard v-for="job in paginatedJobs" :key="job.id" :job="job" />
        </div>

        <!-- Pagination -->
        <Pagination
          v-if="filteredJobs.length > itemsPerPage"
          :current-page="currentPage"
          :total-pages="totalPages"
          @change-page="handlePageChange"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import JobCard from '../components/JobCard.vue'
import JobSkeleton from '../components/JobSkeleton.vue'
import Pagination from '../components/Pagination.vue'
import { jobsAPI } from '../services/api'
import { useSEO } from '../composables/useSEO'

const jobs = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('')

// Pagination state
const currentPage = ref(1)
const itemsPerPage = 6

const sortedJobs = computed(() => {
  // Show latest jobs first (assuming higher ID means later, or use created_at)
  return [...jobs.value].sort((a, b) => b.id - a.id)
})

const filteredJobs = computed(() => {
  if (!searchQuery.value) return sortedJobs.value
  
  const query = searchQuery.value.toLowerCase()
  return sortedJobs.value.filter(job => 
    job.title.toLowerCase().includes(query) ||
    job.location.toLowerCase().includes(query) ||
    (job.company_name && job.company_name.toLowerCase().includes(query)) ||
    job.type.toLowerCase().includes(query)
  )
})

const totalPages = computed(() => Math.ceil(filteredJobs.value.length / itemsPerPage))

const paginatedJobs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredJobs.value.slice(start, end)
})

const handlePageChange = (page) => {
  currentPage.value = page
  // Scroll to top of listings when page changes
  window.scrollTo({ top: 300, behavior: 'smooth' })
}

// Reset to page 1 when search query changes
watch(searchQuery, () => {
  currentPage.value = 1
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
