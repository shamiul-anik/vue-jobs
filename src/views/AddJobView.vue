<template>
  <div>
    <section class="bg-green-50">
      <div class="container m-auto max-w-2xl py-12">
        <h2 class="text-3xl font-bold text-green-500 mb-6 text-center">
          Add Job
        </h2>
        <div class="bg-white px-6 py-8 mb-4 shadow-lg rounded-lg border-2 border-gray-200 m-4 md:m-0">
          
          <!-- Validation Errors Alert -->
          <div v-if="validationErrors.length > 0" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p class="font-bold">Please correct the following errors:</p>
            <ul class="list-disc ml-5 mt-2">
              <li v-for="(error, index) in validationErrors" :key="index">
                {{ error.msg }}
              </li>
            </ul>
          </div>

          <form @submit.prevent="handleSubmit">
            <!-- <h2 class="text-3xl text-center font-semibold mb-6">Add Job</h2> -->

            <div class="mb-4">
              <label for="type" class="block text-gray-700 font-bold mb-2">Job Type</label>
              <select
                v-model="formData.type"
                id="type"
                class="border bg-white border-gray-300 rounded-lg w-full py-2 px-3 focus:outline-green-500"
                required
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Remote">Remote</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div class="mb-4">
              <label class="block text-gray-700 font-bold mb-2">Job Title</label>
              <input
                v-model="formData.title"
                type="text"
                class="border bg-white border-gray-300 rounded-lg w-full py-2 px-3 mb-2 focus:outline-green-500"
                placeholder="e.g. Senior Vue Developer"
                required
              />
            </div>

            <div class="mb-4">
              <label for="description" class="block text-gray-700 font-bold mb-2">Description</label>
              <textarea
                v-model="formData.description"
                id="description"
                class="border bg-white border-gray-300 rounded-lg w-full py-2 px-3 focus:outline-green-500"
                rows="4"
                placeholder="Add any job duties, expectations, requirements, etc"
              ></textarea>
            </div>

            <div class="mb-4">
              <label for="salary" class="block text-gray-700 font-bold mb-2">Salary</label>
              <select
                v-model="formData.salary"
                id="salary"
                class="border bg-white border-gray-300 rounded-lg w-full py-2 px-3 focus:outline-green-500"
                required
              >
                <option value="Under $50K">Under $50K</option>
                <option value="$50K - $60K">$50K - $60K</option>
                <option value="$60K - $70K">$60K - $70K</option>
                <option value="$70K - $80K">$70K - $80K</option>
                <option value="$80K - $90K">$80K - $90K</option>
                <option value="$90K - $100K">$90K - $100K</option>
                <option value="$100K - $125K">$100K - $125K</option>
                <option value="$125K - $150K">$125K - $150K</option>
                <option value="$150K - $175K">$150K - $175K</option>
                <option value="$175K - $200K">$175K - $200K</option>
                <option value="Over $200K">Over $200K</option>
              </select>
            </div>

            <div class="mb-4">
              <label class="block text-gray-700 font-bold mb-2">Location</label>
              <input
                v-model="formData.location"
                type="text"
                class="border bg-white border-gray-300 rounded-lg w-full py-2 px-3 mb-2 focus:outline-green-500"
                placeholder="Company Location"
                required
              />
            </div>

            <h3 class="text-2xl mb-5">Company Info</h3>

            <div class="mb-4">
              <label for="company" class="block text-gray-700 font-bold mb-2">Company Name</label>
              <input
                v-model="formData.company_name"
                type="text"
                id="company"
                class="border bg-white border-gray-300 rounded-lg w-full py-2 px-3 focus:outline-green-500"
                placeholder="Company Name"
              />
            </div>

            <div class="mb-4">
              <label for="company_description" class="block text-gray-700 font-bold mb-2">
                Company Description
              </label>
              <textarea
                v-model="formData.company_description"
                id="company_description"
                class="border bg-white border-gray-300 rounded-lg w-full py-2 px-3 focus:outline-green-500"
                rows="4"
                placeholder="What does your company do?"
              ></textarea>
            </div>

            <div class="mb-4">
              <label for="contact_email" class="block text-gray-700 font-bold mb-2">
                Contact Email
              </label>
              <input
                v-model="formData.contact_email"
                type="email"
                id="contact_email"
                class="border bg-white border-gray-300 rounded-lg w-full py-2 px-3 focus:outline-green-500"
                placeholder="Email address for applicants"
                required
              />
            </div>

            <div class="mb-4">
              <label for="contact_phone" class="block text-gray-700 font-bold mb-2">
                Contact Phone
              </label>
              <input
                v-model="formData.contact_phone"
                type="tel"
                id="contact_phone"
                class="border bg-white border-gray-300 rounded-lg w-full py-2 px-3 focus:outline-green-500"
                placeholder="Optional phone for applicants"
              />
            </div>

            <div>
              <button
                type="submit"
                :disabled="submitting"
                class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline disabled:opacity-50 cursor-pointer"
              >
                <i class="fas fa-plus-circle mr-1"></i>
                {{ submitting ? 'Adding Job...' : 'Add Job' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>

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

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { jobsAPI } from '../services/api'
import Modal from '../components/Modal.vue'

interface JobData {
  type: string
  title: string
  description: string
  salary: string
  location: string
  company_name: string
  company_description: string
  contact_email: string
  contact_phone: string
}

interface ValidationError {
  path: string
  msg: string
}

interface ModalConfig {
  type: 'alert'
  variant: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  onConfirm?: () => void
}

const router = useRouter()
const submitting = ref(false)
const validationErrors = ref<ValidationError[]>([])

// Modal state
const showModal = ref(false)
const modalConfig = ref<ModalConfig>({
  type: 'alert',
  variant: 'success',
  title: '',
  message: ''
})

const formData = ref<JobData>({
  type: 'Full-Time',
  title: '',
  description: '',
  salary: '$70K - $80K',
  location: '',
  company_name: '',
  company_description: '',
  contact_email: '',
  contact_phone: ''
})

const handleSubmit = async (): Promise<void> => {
  submitting.value = true
  validationErrors.value = [] // Clear previous errors

  try {
    const result = await jobsAPI.createJob(formData.value)
    showModalAlert('Success!', 'Job added successfully!', 'success', () => {
      router.push(`/jobs/${result.id}`)
    })
  } catch (err: any) {
    if (err.data && err.data.errors) {
      // Handle validation errors from backend
      validationErrors.value = err.data.errors
      // Scroll to top to see errors
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      // Generic error
      showModalAlert('Error', 'Failed to add job. Please try again.', 'error')
      console.error('Error creating job:', err)
    }
  } finally {
    submitting.value = false
  }
}

const showModalAlert = (title: string, message: string, variant: 'success' | 'error' | 'warning' | 'info' = 'info', onConfirm?: () => void): void => {
  modalConfig.value = {
    type: 'alert',
    variant,
    title,
    message,
    onConfirm
  }
  showModal.value = true
}

const handleModalClose = (): void => {
  showModal.value = false
  if (modalConfig.value.onConfirm) {
    modalConfig.value.onConfirm()
  }
}
</script>
