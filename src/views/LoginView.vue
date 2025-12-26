<template>
  <div class="custom-min-height flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-green-50">
    <div class="max-w-md w-full">
      <!-- Logo and Title -->
      <div class="text-center mb-8">
        <svg class="mx-auto h-16 w-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" fill="#16A34A" opacity="0.1" />
          <circle cx="32" cy="24" r="8" fill="#16A34A" />
          <path d="M20 48C20 40.268 25.373 34 32 34C38.627 34 44 40.268 44 48" stroke="#16A34A" stroke-width="3" stroke-linecap="round" />
          <path d="M48 28L52 32L48 36M52 32H40" stroke="#16A34A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          Sign in to Your Account
        </h2>
        <!-- <p class="mt-2 text-sm text-gray-600">
          Access your Vue Jobs dashboard
        </p> -->
      </div>

      <!-- Login Form -->
      <div class="bg-white px-4 md:px-8 py-4 md:py-8 mb-4 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border border-gray-200">
        <form @submit.prevent="handleLogin" class="space-y-5">
          <!-- Error Message -->
          <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <i class="fas fa-exclamation-circle mr-2"></i>
            {{ errorMessage }}
          </div>

          <!-- Email Input -->
          <div>
            <label for="email" class="custom-label">
              Email Address
            </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              required
              class="custom-input"
              placeholder="you@example.com" />
          </div>

          <!-- Password Input -->
          <div>
            <label for="password" class="custom-label">
              Password
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="custom-input"
                placeholder="Enter your password" />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="custom-show-hide-password">
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="formData.rememberMe"
                type="checkbox"
                class="custom-checkbox" />
              <label for="remember-me" class="custom-checkbox-label">
                Remember me
              </label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-green-600 hover:text-green-500" aria-label="Reset your password">
                Forgot password?
              </a>
            </div>
          </div>

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
              <span class="flex items-center">
                <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
                <i v-else class="fas fa-sign-in-alt mr-2"></i>
                {{ loading ? 'Signing in...' : 'Sign In' }}
              </span>
            </button>
          </div>
        </form>

        <!-- Divider -->
        <!-- <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div> -->

        <!-- Social Login Buttons -->
        <!-- <div class="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <i class="fab fa-google text-red-500 mr-2"></i>
              Google
            </button>
            <button
              type="button"
              class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <i class="fab fa-github mr-2"></i>
              GitHub
            </button>
          </div>
        </div> -->

        <!-- Sign Up Link -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Don't have an account?
            <RouterLink to="/register" class="font-medium text-green-600 hover:text-green-500" aria-label="Create a new account">
              Sign up now
            </RouterLink>
          </p>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <Modal
      :show="showModal"
      :type="modalConfig.type"
      :variant="modalConfig.variant"
      :title="modalConfig.title"
      :message="modalConfig.message"
      @close="handleModalClose" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import Modal from '../components/Modal.vue'
import { useAuth } from '../composables/useAuth'
import httpClient from '../services/httpClient'

const router = useRouter()
const { login } = useAuth()
const loading = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')

// Modal state
const showModal = ref(false)
const modalConfig = ref({
  type: 'alert',
  variant: 'success',
  title: '',
  message: ''
})

const formData = ref({
  email: '',
  password: '',
  rememberMe: false
})

const handleLogin = async () => {
  errorMessage.value = ''
  loading.value = true

  try {
    const data = await httpClient.post("/api/users/login", {
      email: formData.value.email,
      password: formData.value.password,
    });

    // Store user info using auth composable (token is handled via HttpOnly cookie)
    login(data.user);

    showModalAlert('Success!', 'Login successful! Redirecting to dashboard...', 'success', () => {
      router.push('/')
    })
  } catch (err) {
    errorMessage.value = err.message || 'Login failed. Please check your credentials and try again.'
    console.error('Login error:', err)
  } finally {
    loading.value = false
  }
}

const showModalAlert = (title, message, variant = 'info', onConfirm = null) => {
  modalConfig.value = {
    type: 'alert',
    variant,
    title,
    message,
    onConfirm
  }
  showModal.value = true
}

const handleModalClose = () => {
  showModal.value = false
  if (modalConfig.value.onConfirm) {
    modalConfig.value.onConfirm()
  }
}
</script>
