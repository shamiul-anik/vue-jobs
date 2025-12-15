<template>
  <div>
    <!-- Hero -->
    <section class="bg-green-700 py-20 mb-4">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div class="text-center">
          <h1 class="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
            Become a Vue Dev
          </h1>
          <p class="my-4 text-xl text-white">
            Find the Vue job that fits your skills and needs
          </p>
        </div>
      </div>
    </section>

    <!-- Developers and Employers -->
    <section class="py-4">
      <div class="container-xl lg:container m-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg">
          <div class="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 class="text-2xl font-bold">For Developers</h2>
            <p class="mt-2 mb-4">
              Browse our Vue jobs and start your career today
            </p>
            <RouterLink
              to="/jobs"
              class="inline-block bg-black text-white rounded-lg px-4 py-2 hover:bg-gray-700"
              aria-label="Browse all available Vue.js jobs"
            >
              <i class="fas fa-briefcase mr-1"></i>
              Browse Jobs
            </RouterLink>
          </div>
          <div class="bg-green-100 p-6 rounded-lg shadow-md">
            <h2 class="text-2xl font-bold">For Employers</h2>
            <p class="mt-2 mb-4">
              List your job to find the perfect developer for the role
            </p>
            <RouterLink
              to="/add-job"
              class="inline-block bg-green-500 text-white rounded-lg px-4 py-2 hover:bg-green-600"
              aria-label="Post a new job listing"
            >
              <i class="fas fa-plus-circle mr-1"></i>
              Add Job
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Browse Jobs -->
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
        
        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <JobCard v-for="job in recentJobs" :key="job.id" :job="job" />
        </div>
      </div>
    </section>

    <section class="m-auto max-w-lg my-10 px-6">
      <RouterLink
        to="/jobs"
        class="block bg-green-600 text-white text-center py-4 px-6 rounded-xl hover:bg-green-700"
        aria-label="View all available jobs"
      >
        <i class="fas fa-arrow-right mr-1"></i>
        View All Jobs
      </RouterLink>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import JobCard from '../components/JobCard.vue'
import { jobsAPI } from '../services/api'
import { useSEO } from '../composables/useSEO'

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

const jobs = ref<Job[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const recentJobs = computed(() => jobs.value.slice(0, 3))

// SEO Configuration
useSEO({
  title: 'Vue Jobs | Find Vue.js Developer Jobs & Opportunities',
  description: 'Discover the best Vue.js developer jobs and career opportunities. Browse full-time, part-time, and remote positions. Post your Vue job listings and connect with talented developers.',
  keywords: 'Vue.js jobs, Vue developer jobs, frontend developer, JavaScript jobs, remote Vue jobs, Vue.js careers',
  canonical: window.location.origin + '/',
  image: window.location.origin + '/images/logo.png',
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'Vue Jobs',
    'url': window.location.origin,
    'description': 'Find Vue.js developer jobs and career opportunities',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': window.location.origin + '/jobs?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  }
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
