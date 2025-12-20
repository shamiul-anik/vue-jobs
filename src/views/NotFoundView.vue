<template>
  <div class="custom-min-height bg-green-50 flex items-center justify-center px-4">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-red-600 mb-4">404</h1>
      <h2 class="text-3xl font-semibold text-red-600 mb-4">Page Not Found</h2>
      <p class="text-md md:text-xl text-gray-600 mb-8">
        The page you are looking for does not exist.
      </p>
      <!-- <RouterLink
        to="/"
        class="mt-4 inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg"
      >
        Go Back Home
      </RouterLink> -->

      <RouterLink
        to="/"
        class="group inline-flex items-center gap-2 py-3 px-6 rounded-full bg-green-500 hover:bg-green-600 text-white transition-all duration-300 font-medium text-md md:text-lg">
        <i class="fas fa-arrow-left text-sm transition-transform group-hover:-translate-x-1"></i>
        Back to Home Page
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
