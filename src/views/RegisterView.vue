<template>
  <div class="custom-min-height flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-green-50">
    <div class="max-w-md w-full">
      <!-- Logo and Title -->
      <div class="text-center mb-8">
        <svg class="mx-auto h-16 w-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" fill="#16A34A" opacity="0.1" />
          <circle cx="28" cy="24" r="8" fill="#16A34A" />
          <path d="M16 48C16 40.268 21.373 34 28 34C34.627 34 40 40.268 40 48" stroke="#16A34A" stroke-width="3" stroke-linecap="round" />
          <circle cx="46" cy="20" r="10" fill="white" stroke="#16A34A" stroke-width="2" />
          <path d="M46 16V24M42 20H50" stroke="#16A34A" stroke-width="2.5" stroke-linecap="round" />
        </svg>
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          Create Your Account
        </h2>
      </div>

      <!-- Sign Up Form -->
      <div class="bg-white px-4 md:px-8 py-4 md:py-8 mb-4 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border border-gray-200">
        <form @submit.prevent="handleRegister" class="space-y-5">
          <!-- Error Message -->
          <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-2">
            <i class="fas fa-exclamation-circle mr-2"></i>
            {{ errorMessage }}
          </div>

          <!-- Full Name Input -->
          <div>
            <label for="name" class="custom-label">
              Full Name
            </label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              required
              class="custom-input"
              placeholder="John Doe" />
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
                placeholder="Create a password" />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="custom-show-hide-password">
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>

          <!-- Confirm Password Input -->
          <div>
            <label for="confirmPassword" class="custom-label">
              Confirm Password
            </label>
            <div class="relative">
              <input
                id="confirmPassword"
                v-model="formData.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                class="custom-input"
                placeholder="Confirm your password" />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="custom-show-hide-password">
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
              class="custom-checkbox" />
            <label for="terms" class="custom-checkbox-label">
              I agree to the
              <button
                type="button"
                @click="openTermsModal"
                class="font-medium text-green-600 hover:text-green-500 cursor-pointer"
                aria-label="Read our terms and conditions">
                Terms and Conditions
              </button>
              and
              <button
                type="button"
                @click="openPrivacyModal"
                class="font-medium text-green-600 hover:text-green-500 cursor-pointer"
                aria-label="Read our privacy policy">
                Privacy Policy
              </button>
            </label>
          </div>

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
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

    <!-- Terms and Conditions Modal -->
    <Modal
      :show="showTermsModal"
      title="Terms and Conditions"
      max-width="2xl"
      @close="showTermsModal = false">
      <div class="prose prose-sm max-w-none text-gray-600 text-left">
        <p class="mb-4">Welcome to Vue Jobs. By using our platform, you agree to the following terms:</p>

        <h4 class="font-bold text-gray-800 mt-4 mb-2">1. User Accounts</h4>
        <p class="mb-4">You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.</p>

        <h4 class="font-bold text-gray-800 mt-4 mb-2">2. Job Postings</h4>
        <p class="mb-4">All job postings must be accurate and directly related to Vue.js or surrounding web technologies. Misleading or fraudulent listings will be removed immediately.</p>

        <h4 class="font-bold text-gray-800 mt-4 mb-2">3. Intellectual Property</h4>
        <p class="mb-4">The source code of this project is provided under the MIT License.
          However, the Vue logo and Vue trademark remain the exclusive property of the Vue team and are protected by international copyright and trademark laws.
          Usage of the Vue logo does not grant any rights or ownership over the Vue brand, and any use must comply with Vue’s official brand and trademark guidelines.</p>

        <h4 class="font-bold text-gray-800 mt-4 mb-2">4. Limitation of Liability</h4>
        <p class="mb-4">Vue Jobs shall not be liable for any damages arising out of your use of the platform or the employment interactions facilitated through it.</p>
      </div>
    </Modal>

    <!-- Privacy Policy Modal -->
    <Modal
      :show="showPrivacyModal"
      title="Privacy Policy"
      max-width="2xl"
      @close="showPrivacyModal = false">
      <div class="prose prose-sm max-w-none text-gray-600 text-left">
        <p class="mb-4">Your privacy is important to us. Here is how we handle your data:</p>

        <h4 class="font-bold text-gray-800 mt-4 mb-2">1. Information We Collect</h4>
        <p class="mb-4">We collect information provided by you during registration, including your name, email address, and job preferences.</p>

        <h4 class="font-bold text-gray-800 mt-4 mb-2">2. How We Use Information</h4>
        <p class="mb-4">We use your data to provide job matching services, send platform notifications, and improve the overall user experience.</p>

        <h4 class="font-bold text-gray-800 mt-4 mb-2">3. Data Security</h4>
        <p class="mb-4">We implement industry-standard security measures to protect your personal information from unauthorized access or disclosure.</p>

        <h4 class="font-bold text-gray-800 mt-4 mb-2">4. Your Rights</h4>
        <p class="mb-4">You have the right to access, update, or request the deletion of your personal data at any time via your account settings.</p>
      </div>
    </Modal>

    <!-- Generic Modal (Alerts) -->
    <Modal
      :show="showModal"
      :type="modalConfig.type"
      :variant="modalConfig.variant"
      :title="modalConfig.title"
      :message="modalConfig.message"
      @confirm="handleModalConfirm"
      @close="handleModalClose" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import Modal from '../components/Modal.vue'
import httpClient from '../services/httpClient'

const router = useRouter()
const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const errorMessage = ref('')

// Modal state
const showModal = ref(false)
const showTermsModal = ref(false)
const showPrivacyModal = ref(false)

const modalConfig = ref({
  type: 'alert',
  variant: 'success',
  title: '',
  message: ''
})

const openTermsModal = () => {
  showTermsModal.value = true
}

const openPrivacyModal = () => {
  showPrivacyModal.value = true
}

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
    const data = await httpClient.post("/api/users/register", {
      name: formData.value.name,
      email: formData.value.email,
      password: formData.value.password,
    });

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

const handleModalConfirm = () => {
  showModal.value = false
  if (modalConfig.value.onConfirm) {
    modalConfig.value.onConfirm()
  }
}

const handleModalClose = () => {
  showModal.value = false
}
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
