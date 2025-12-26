<template>
  <div>
    <!-- Hero -->
    <section class="bg-green-700 py-20 mb-4">
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div class="text-center">
          <h1
            class="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
            Elevate Your Vue Career
            <!-- Your Next Vue Adventure Starts Here -->
          </h1>
          <p class="my-4 text-lg md:text-xl text-white">
            Explore premium opportunities in the Vue.js ecosystem and land your
            dream role.
            <!-- Find the perfect fit for your skills and needs, whether it's remote, full-time, or contract. -->
          </p>
          <!-- https://framer.com/m/loadingSpinner-qP3z.js@eNbr5TbkKXpMirsOiFk0 -->
          <!-- Temporary PostHog Test Button -->
          <!-- <button 
            @click="triggerError"
            class="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer"
          >
            Trigger Test Error
          </button> -->
        </div>
      </div>
    </section>

    <!-- Developers and Employers -->
    <section class="pt-0 px-0 md:px md:pt-8 pb-4 md:pb-8">
      <div class="container-xl lg:container m-auto">
        <div
          class="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg p-4 md:p-0">
          <div class="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 class="text-2xl font-bold">For Developers</h2>
            <p class="mt-2 mb-4">
              Browse our Vue jobs and start your career today
            </p>
            <RouterLink
              to="/jobs"
              class="inline-block bg-black text-white rounded-lg px-4 py-2 hover:bg-gray-700"
              aria-label="Browse all available Vue.js jobs">
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
              aria-label="Post a new job listing">
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

        <Transition>
          <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <JobSkeleton v-for="i in 3" :key="i" />
          </div>

          <div v-else-if="error" class="text-center">
            <p class="text-xl text-red-500">{{ error }}</p>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <JobCard v-for="job in jobs" :key="job.id" :job="job" />
          </div>
        </Transition>
      </div>
    </section>

    <section class="max-w-lg m-auto flex justify-center items-center my-8 px-6">
      <RouterLink
        to="/jobs"
        class="group inline-flex items-center gap-2 border border-green-800 bg-green-600 hover:bg-green-700 text-white px-8 md:px-12 py-2 md:py-4 rounded-lg text-lg font-bold transition-all duration-300">
        View All Jobs
        <i
          class="fas fa-arrow-right transition-transform duration-300 group-hover:translate-x-1"></i>
      </RouterLink>
    </section>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { RouterLink } from "vue-router";
import JobCard from "../components/JobCard.vue";
import JobSkeleton from "../components/JobSkeleton.vue";
import { useSEO } from "../composables/useSEO";
import { useJobs } from "../composables/useJobs";

const { homeJobs: jobs, loading, error, fetchHomeJobs } = useJobs();

// SEO Configuration
useSEO({
  title: "Vue Jobs | Find Vue.js Developer Jobs & Opportunities",
  description:
    "Discover the best Vue.js developer jobs and career opportunities. Browse full-time, part-time, and remote positions. Post your Vue job listings and connect with talented developers.",
  keywords:
    "Vue.js jobs, Vue developer jobs, frontend developer, JavaScript jobs, remote Vue jobs, Vue.js careers",
  canonical: window.location.origin + "/",
  image: window.location.origin + "/images/logo.png",
  structuredData: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Vue Jobs",
    url: window.location.origin,
    description: "Find Vue.js developer jobs and career opportunities",
    potentialAction: {
      "@type": "SearchAction",
      target: window.location.origin + "/jobs?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  },
});

onMounted(fetchHomeJobs);

// PostHog Test Function to Track Error
const triggerError = () => {
  throw new Error("PostHog Test Error!");
};
</script>
