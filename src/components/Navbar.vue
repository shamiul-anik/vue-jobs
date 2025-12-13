<template>
  <nav class="bg-green-700 border-b border-green-500" role="navigation" aria-label="Main navigation">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="flex h-20 items-center justify-between">
        <div class="flex flex-1 items-center justify-center md:items-stretch md:justify-between">
          <!-- Logo -->
          <RouterLink class="flex shrink-0 items-center mr-4" to="/" aria-label="Vue Jobs Home">
            <img class="h-10 w-auto" src="/images/logo.png" alt="Vue Jobs Logo" />
            <span class="hidden md:block text-white text-2xl font-bold ml-2">Vue Jobs</span>
          </RouterLink>
          
          <!-- Navigation Menu -->
          <div class="flex space-x-2 px-2">
            <RouterLink
              to="/"
              class="text-white hover:bg-green-900 hover:text-white rounded-md px-3 py-2"
              :class="{ 'bg-green-900': $route.path === '/' }"
              aria-label="Home page"
            >
              <i class="fas fa-home mr-1"></i>
              Home
            </RouterLink>
            <RouterLink
              to="/jobs"
              class="text-white hover:bg-green-900 hover:text-white rounded-md px-3 py-2"
              :class="{ 'bg-green-900': $route.path === '/jobs' }"
              aria-label="Browse all jobs"
            >
              <i class="fas fa-briefcase mr-1"></i>
              Jobs
            </RouterLink>
            <RouterLink
              to="/add-job"
              class="text-white hover:bg-green-900 hover:text-white rounded-md px-3 py-2"
              :class="{ 'bg-green-900': $route.path === '/add-job' }"
              aria-label="Post a new job"
            >
              <i class="fas fa-plus-circle mr-1"></i>
              Add Job
            </RouterLink>              
          </div>
          
          <!-- Login/Logout -->
          <div class="flex items-center space-x-2 px-2">
            <template v-if="!isAuthenticated">
              <RouterLink
                to="/login"
                class="bg-white text-green-800 hover:bg-green-900 hover:text-white rounded-lg px-4 py-2"
                :class="{ 'bg-green-900': $route.path === '/login' }"
                aria-label="Sign in to your account"
              >
                <i class="fas fa-sign-in-alt mr-1"></i>
                Login
              </RouterLink>
            </template>
            <template v-else>
              <span class="text-white font-medium mr-2 hidden md:inline-block">
                Hello, {{ user ? user.name : 'User' }}
              </span>
              <button
                @click="handleLogout"
                class="bg-white text-red-800 hover:bg-red-700 hover:text-white rounded-lg px-4 py-2 cursor-pointer transition-colors"
                aria-label="Sign out of your account"
              >
                <i class="fas fa-sign-out-alt mr-1"></i>
                Logout
              </button>
            </template>
          </div>

        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const { isAuthenticated, user, logout } = useAuth()
const router = useRouter()

const handleLogout = () => {
    logout()
    router.push('/login')
}
</script>
