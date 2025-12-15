<template>
  <main>
    <Navbar />
    <RouterView />
  </main>
</template>

<script setup lang="ts">import Navbar from './components/Navbar.vue'
import { RouterView } from 'vue-router'
</script>