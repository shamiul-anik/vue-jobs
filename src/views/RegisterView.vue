<template>
  <div class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-green-50">
    <div class="max-w-md w-full">
      <!-- Logo and Title -->
      <div class="text-center mb-8">
        <svg class="mx-auto h-16 w-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" fill="#16A34A" opacity="0.1"/>
          <circle cx="28" cy="24" r="8" fill="#16A34A"/>
          <path d="M16 48C16 40.268 21.373 34 28 34C34.627 34 40 40.268 40 48" stroke="#16A34A" stroke-width="3" stroke-linecap="round"/>
          <circle cx="46" cy="20" r="10" fill="white" stroke="#16A34A" stroke-width="2"/>
          <path d="M46 16V24M42 20H50" stroke="#16A34A" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          Create Your Account
        </h2>
      </div>

      <!-- Sign Up Form -->
      <div class="bg-white py-8 px-6 shadow-md rounded-lg border border-gray-200">
        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- Full Name Input -->
          <div>
            <label for="name" class="block text-gray-700 font-bold mb-2">
              Full Name
            </label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              required
              class="border bg-white border-gray-300 rounded-lg w-full py-2 px-3 mb-2 focus:outline-green-500"
              placeholder="John Doe"
            />
          </div>

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
                placeholder="Create a password"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-4 right-2 top-2 pr-3 flex items-center text-gray-600 hover:text-gray-800"
              >
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>

          <!-- Confirm Password Input -->
          <div>
            <label for="confirmPassword" class="block text-gray-700 font-bold mb-2">
              Confirm Password
            </label>
            <div class="relative">
              <input
                id="confirmPassword"
                v-model="formData.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                class="border bg-white border-gray-300 rounded-lg w-full py-2 px-3 mb-2 focus:outline-green-500"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute inset-y-4 right-2 top-2 pr-3 flex items-center text-gray-600 hover:text-gray-800"
              >
                <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>

          <!-- Terms & Conditions -->
          <div class="flex items-start">
            <input
              id="terms"
              v-model="formData.agreeToTerms"
              type="checkbox"
              required
              class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1"
            />
            <label for="terms" class="ml-2 block text-sm text-gray-700">
              I agree to the 
              <a href="#" class="font-medium text-green-600 hover:text-green-500" aria-label="Read our terms and conditions">Terms and Conditions</a>
              and 
              <a href="#" class="font-medium text-green-600 hover:text-green-500" aria-label="Read our privacy policy">Privacy Policy</a>
            </label>
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
              <span class="flex items-center">
                <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
                <i v-else class="fas fa-user-plus mr-2"></i>
                {{ loading ? 'Creating account...' : 'Create Account' }}
              </span>
            </button>
          </div>
        </form>

        <!-- Sign In Link -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Already have an account?
            <RouterLink to="/login" class="font-medium text-green-600 hover:text-green-500" aria-label="Sign in to your existing account">
              Sign in here
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
const showConfirmPassword = ref(false)
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
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false
})

const handleRegister = async () => {
  errorMessage.value = ''

  // Validate passwords match
  if (formData.value.password !== formData.value.confirmPassword) {
    errorMessage.value = 'Passwords do not match'
    return
  }

  // Validate password length
  if (formData.value.password.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters long'
    return
  }

  loading.value = true

  try {
    const response = await fetch("/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.value.name,
        email: formData.value.email,
        password: formData.value.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.errors) {
        // Show validation errors
        throw new Error(data.errors.map(e => e.msg).join(", "));
      } else {
        throw new Error(data.error || "Registration failed");
      }
    }

    showModalAlert('Success!', 'Account created successfully! Redirecting to login...', 'success', () => {
      router.push('/login')
    })
  } catch (err) {
    errorMessage.value = err.message || 'Registration failed. Please try again.'
    console.error('Registration error:', err)
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
