<template>
  <div class="bg-green-700 text-white py-16 border-t border-green-500">
    <div class="container mx-auto px-6">
      <div class="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
        <div class="flex flex-col items-center md:items-start space-y-4">
          <RouterLink class="flex shrink-0 items-center justify-center md:justify-start" to="/" aria-label="Vue Jobs Home">
            <img class="h-10 w-auto" src="/images/vue-jobs-logo.svg" alt="Vue Jobs Logo" />
            <span class="text-white text-2xl font-bold ml-2">Vue Jobs</span>
          </RouterLink>
          <p class="text-sm text-gray-50 max-w-xs text-center md:text-left">
            Empowering developers to find their next great opportunity in the Vue.js ecosystem.
          </p>
        </div>

        <div class="flex space-x-6">
          <a v-for="social in socialLinks" :key="social.icon" :href="social.url" class="group relative">
            <div class="absolute inset-0 bg-green-500 rounded-full blur-sm opacity-0 group-hover:opacity-50 transition-opacity"></div>
            <div class="relative w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-700 group-hover:bg-green-600 group-hover:text-white transition-all duration-300 transform group-hover:scale-110 border border-green-500 group-hover:ring-2 group-hover:ring-green-500">
              <i :class="social.icon"></i>
            </div>
          </a>
        </div>
      </div>

      <div class="divider"></div>

      <div class="flex flex-col md:flex-row justify-between items-center text-sm">
        <p class="mb-4 md:mb-0">&copy; {{ new Date().getFullYear() }} Vue Jobs. All Rights Reserved.</p>
        <div class="flex space-x-6">
          <a href="#" class="hover:text-white font-medium hover:underline transition-all duration-300 transform">Privacy Policy</a>
          <a href="#" class="hover:text-white font-medium hover:underline transition-all duration-300 transform">Terms of Service</a>
        </div>
      </div>
    </div>
  </div>

  <!-- <footer class="bg-slate-50 dark:bg-slate-950 py-16 border-t border-slate-200 dark:border-slate-900 transition-colors" v-reveal>
    <div class="container mx-auto px-4 md:px-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div class="col-span-1 md:col-span-1">
          <div class="flex items-center space-x-2 mb-6">
            <svg class="w-6 h-6" viewBox="0 0 128 128">
              <path fill="#42b883" d="M78.8,10L64,35.4L49.2,10H0l64,110l64-110C128,10,78.8,10,78.8,10z" />
              <path fill="#35495e" d="M78.8,10L64,35.4L49.2,10H25.6L64,76.5L102.4,10H78.8z" />
            </svg>
            <span class="font-bold text-xl tracking-tight">Vue Jobs</span>
          </div>
          <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            The #1 job board for Vue.js developers and companies looking to hire talent.
          </p>
          <div class="flex space-x-4 mt-6">
            <a v-for="social in socialLinks" :key="social.icon" :href="social.url" class="text-slate-400 hover:text-vue-green transition-colors text-lg">
              <i :class="social.icon"></i>
            </a>
          </div>
        </div>

        <div>
          <h4 class="font-bold mb-6 text-sm uppercase tracking-wider text-slate-900 dark:text-white">For Candidates</h4>
          <ul class="space-y-4 text-sm">
            <li><a href="#" class="text-slate-500 hover:text-vue-green dark:text-slate-400 transition-colors">Browse Jobs</a></li>
            <li><a href="#" class="text-slate-500 hover:text-vue-green dark:text-slate-400 transition-colors">Remote Jobs</a></li>
            <li><a href="#" class="text-slate-500 hover:text-vue-green dark:text-slate-400 transition-colors">Create Alerts</a></li>
            <li><a href="#" class="text-slate-500 hover:text-vue-green dark:text-slate-400 transition-colors">Candidate Login</a></li>
          </ul>
        </div>

        <div>
          <h4 class="font-bold mb-6 text-sm uppercase tracking-wider text-slate-900 dark:text-white">For Employers</h4>
          <ul class="space-y-4 text-sm">
            <li><a href="#" class="text-slate-500 hover:text-vue-green dark:text-slate-400 transition-colors">Post a Job</a></li>
            <li><a href="#" class="text-slate-500 hover:text-vue-green dark:text-slate-400 transition-colors">Pricing</a></li>
            <li><a href="#" class="text-slate-500 hover:text-vue-green dark:text-slate-400 transition-colors">Hiring Solutions</a></li>
            <li><a href="#" class="text-slate-500 hover:text-vue-green dark:text-slate-400 transition-colors">Company Login</a></li>
          </ul>
        </div>

        <div>
          <h4 class="font-bold mb-6 text-sm uppercase tracking-wider text-slate-900 dark:text-white">Newsletter</h4>
          <p class="text-xs text-slate-500 dark:text-slate-400 mb-4">Get the latest Vue.js jobs delivered weekly.</p>
          <div class="flex">
            <input type="email" placeholder="Email" class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-l-lg px-3 py-2 text-sm focus:outline-none">
            <button class="bg-vue-green text-white px-4 py-2 rounded-r-lg hover:bg-[#3aa675] transition-colors"><i class="fas fa-paper-plane"></i></button>
          </div>
        </div>
      </div>

      <div class="pt-8 border-t border-slate-200 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 dark:text-slate-500">
        <p class="mb-4 md:mb-0">&copy; {{ new Date().getFullYear() }} VueJobs.com. Built by the community.</p>
        <div class="flex space-x-6">
          <a href="#" class="hover:text-vue-green transition-colors">Privacy</a>
          <a href="#" class="hover:text-vue-green transition-colors">Terms</a>
          <a href="#" class="hover:text-vue-green transition-colors">Cookies</a>
        </div>
      </div>
    </div>
  </footer> -->
</template>

<script setup>
import { ref } from 'vue';

const socialLinks = [
  { icon: 'fab fa-facebook-f', url: '#' },
  { icon: 'fab fa-twitter', url: '#' },
  { icon: 'fab fa-github', url: 'https://github.com/shamiul-anik/vue-jobs' },
  { icon: 'fab fa-linkedin-in', url: '#' }
];
</script>

<style scoped></style>
