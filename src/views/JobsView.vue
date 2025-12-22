<template>
  <div class="custom-min-height">
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
              placeholder="Filter jobs by title, location, or company..." />
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

        <div v-if="loading" class="min-h-[693px] grid grid-cols-1 md:grid-cols-3 gap-6">
          <JobSkeleton v-for="i in 6" :key="i" />
        </div>

        <div v-else-if="error" class="text-center">
          <p class="text-xl text-red-500">{{ error }}</p>
        </div>

        <div v-else-if="filteredJobs.length === 0" class="text-center">
          <p class="text-xl">No jobs found matching your search.</p>
        </div>
        
        <div v-else class="min-h-[693px]">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <JobCard v-for="job in filteredJobs" :key="job.id" :job="job" />
          </div>
        </div>

        <!-- Pagination -->
        <Pagination
          v-if="totalPages > 1"
          :current-page="currentPage"
          :total-pages="totalPages"
          @change-page="handlePageChange" />
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
const totalJobs = ref(0)

// Pagination state
const currentPage = ref(1)
const itemsPerPage = 6

const fetchJobs = async () => {
  loading.value = true
  try {
    const data = await jobsAPI.getAllJobs({
      limit: itemsPerPage,
      page: currentPage.value
      // We could add 'q' param here if we moved search to server
    })

    if (data.jobs) {
      jobs.value = data.jobs
      totalJobs.value = data.total
    } else {
      // Fallback for cases where API might still return an array
      jobs.value = data
      totalJobs.value = data.length
    }
  } catch (err) {
    error.value = 'Failed to load jobs. Please try again later.'
    console.error('Error fetching jobs:', err)
  } finally {
    loading.value = false
  }
}

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

const totalPages = computed(() => Math.ceil(totalJobs.value / itemsPerPage))

const handlePageChange = async (page) => {
  currentPage.value = page
  await fetchJobs()
  // Scroll to top of listings when page changes
  window.scrollTo({ top: 300, behavior: 'smooth' })
}

// Reset to page 1 and potentially fetch all/filtered when search query changes
// Note: This is still client-side filtering on the current page.
// In a true server-side setup, we'd fetch filtered results from server.
watch(searchQuery, () => {
  currentPage.value = 1
  // If searching, we might want to fetch all or use a search API
  // For now, keeping it simple as per user request.
})

// SEO Configuration
useSEO({
  title: 'Browse All Vue.js Jobs | Vue Developer Opportunities',
  description: 'Browse all available Vue.js developer jobs. Filter by location, job type, and company. Find full-time, part-time, and remote Vue.js positions.',
  keywords: 'Vue.js jobs, browse Vue jobs, Vue developer positions, frontend jobs, JavaScript developer jobs',
  canonical: window.location.origin + '/jobs',
  image: window.location.origin + '/images/logo.png'
})

onMounted(fetchJobs)
</script>
