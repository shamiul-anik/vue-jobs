<template>
  <main>
    <Navbar />
    <RouterView />
  </main>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
import { RouterView } from 'vue-router'
</script>
