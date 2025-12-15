<template>
  <div class="bg-green-50 min-h-screen flex items-center justify-center px-4">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-green-700 mb-4">404</h1>
      <h2 class="text-3xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
      <p class="text-xl text-gray-600 mb-8">
        The page you are looking for does not exist.
      </p>
      <RouterLink
        to="/"
        class="mt-4 inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg"
      >
        Go Back Home
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
