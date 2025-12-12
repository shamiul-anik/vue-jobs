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
            >
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
            >
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
        class="block bg-black text-white text-center py-4 px-6 rounded-xl hover:bg-gray-700"
      >
        View All Jobs
      </RouterLink>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import JobCard from '../components/JobCard.vue'
import { jobsAPI } from '../services/api'

const jobs = ref([])
const loading = ref(true)
const error = ref(null)

const recentJobs = computed(() => jobs.value.slice(0, 3))

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
