<template>
  <header>
    <Navbar />
  </header>
  <main>
    <Loader v-if="isLoading" />
    <RouterView v-else />
  </main>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { RouterView } from "vue-router";
import Navbar from "./components/Navbar.vue";
import Loader from "./components/Loader.vue";

const isLoading = ref(false);
const router = useRouter();

router.beforeEach((to, from, next) => {
  isLoading.value = true;
  next();
});

router.afterEach(() => {
  isLoading.value = false;
  // Add a 5 second delay to test the loading spinner
  // setTimeout(() => {
  //   isLoading.value = false;
  // }, 5000); // 5000 milliseconds = 5 seconds
});
</script>
