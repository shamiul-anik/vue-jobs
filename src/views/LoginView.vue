<template>
  <div class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-green-50">
    <div class="max-w-md w-full">
      <!-- Logo and Title -->
      <div class="text-center mb-8">
        <img class="mx-auto h-16 w-auto" src="/images/logo.png" alt="Vue Jobs Logo" />
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          Sign in to Your Account
        </h2>
        <!-- <p class="mt-2 text-sm text-gray-600">
          Access your Vue Jobs dashboard
        </p> -->
      </div>

      <!-- Login Form -->
      <div class="bg-white py-8 px-6 shadow-md rounded-lg border border-gray-200">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email Input -->
          <div>
            <label for="email" class="block text-gray-700 font-bold mb-2">
              Email Address
            </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              required
              class="border bg-white border-gray-300 rounded-lg w-full py-2 px-3 mb-2 focus:outline-green-500"
              placeholder="you@example.com"
            />
          </div>

          <!-- Password Input -->
          <div>
            <label for="password" class="block text-gray-700 font-bold mb-2">
              Password
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="border bg-white border-gray-300 rounded-lg w-full py-2 px-3 mb-2 focus:outline-green-500"
                placeholder="Enter your password"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-4 right-2 pr-3 flex items-center text-gray-600 hover:text-gray-800"
              >
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
                class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-green-600 hover:text-green-500">
                Forgot password?
              </a>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <i class="fas fa-exclamation-circle mr-2"></i>
            {{ errorMessage }}
          </div>

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
              {{ loading ? 'Signing in...' : 'Sign in' }}
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
              class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <i class="fab fa-google text-red-500 mr-2"></i>
              Google
            </button>
            <button
              type="button"
              class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
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
            <RouterLink to="/register" class="font-medium text-green-600 hover:text-green-500">
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
      @close="handleModalClose"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import Modal from '../components/Modal.vue'

const router = useRouter()
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
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // For demo purposes - accept any email/password
    if (formData.value.email && formData.value.password) {
      showModalAlert('Success!', 'Login successful! Redirecting to dashboard...', 'success', () => {
        router.push('/')
      })
    } else {
      errorMessage.value = 'Please enter both email and password'
    }
  } catch (err) {
    errorMessage.value = 'Login failed. Please check your credentials and try again.'
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

<style scoped>
/* Additional custom styles if needed */
</style>
