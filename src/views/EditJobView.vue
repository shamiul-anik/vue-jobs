<template>
  <div>
    <section class="bg-green-50">
      <div class="container m-auto max-w-2xl py-12">

        <h2 class="text-3xl font-bold text-green-500 mb-6 text-center">
          Edit Job
        </h2>

        <div v-if="loading" class="text-center">
          <p class="text-xl">Loading job data...</p>
        </div>

        <!-- <div v-else-if="error" class="text-center">
          <p class="text-xl text-red-500">{{ error }}</p>
          <RouterLink to="/jobs" class="text-green-500 hover:underline mt-4 inline-block" aria-label="Return to all jobs">
            Back to Jobs
          </RouterLink>
        </div> -->

        <div v-else-if="error" class="text-center">
          <p class="text-xl text-red-500">{{ error }}</p>

          <RouterLink
            to="/jobs"
            class="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition-all">
            <i class="fas fa-arrow-left text-sm transition-transform group-hover:-translate-x-1"></i>
            Back to Jobs Page
          </RouterLink>
        </div>

        <div v-else class="bg-white px-4 md:px-8 py-4 md:py-8 mb-4 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border-2 border-gray-200 m-4 md:m-0">

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
            <h3 class="text-2xl font-semibold">Job Details</h3>
            <div class="divider"></div>

            <div class="mb-4">
              <label for="type" class="custom-label">Job Type</label>
              <select
                v-model="formData.type"
                id="type"
                class="custom-select"
                required>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Remote">Remote</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div class="mb-4">
              <label class="custom-label">Job Title</label>
              <input
                v-model="formData.title"
                type="text"
                class="custom-input"
                placeholder="e.g. Senior Vue Developer"
                required />
            </div>

            <div class="mb-4">
              <label for="description" class="custom-label">Description</label>
              <textarea
                v-model="formData.description"
                id="description"
                class="custom-textarea"
                rows="4"
                placeholder="Add any job duties, expectations, requirements, etc"></textarea>
            </div>

            <div class="mb-4">
              <label for="salary" class="custom-label">Salary</label>
              <select
                v-model="formData.salary"
                id="salary"
                class="custom-select"
                required>
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

            <h3 class="text-2xl font-semibold mt-8">Company Information</h3>
            <div class="divider"></div>

            <div class="mb-4">
              <label for="company" class="custom-label">Company Name</label>
              <input
                v-model="formData.company_name"
                type="text"
                id="company"
                class="custom-input"
                placeholder="Company Name" />
            </div>

            <div class="mb-4">
              <label for="company_description" class="custom-label">
                Company Description
              </label>
              <textarea
                v-model="formData.company_description"
                id="company_description"
                class="custom-textarea"
                rows="4"
                placeholder="What does your company do?"></textarea>
            </div>

            <div class="mb-4">
              <label class="custom-label">Location</label>
              <input
                v-model="formData.location"
                type="text"
                class="custom-input"
                placeholder="Company Location"
                required />
            </div>

            <div class="mb-4">
              <label for="contact_email" class="custom-label">
                Contact Email
              </label>
              <input
                v-model="formData.contact_email"
                type="email"
                id="contact_email"
                class="custom-input"
                placeholder="Email address for applicants"
                required />
            </div>

            <div class="mb-4 md:mb-8">
              <label for="contact_phone" class="custom-label">
                Contact Phone
              </label>
              <input
                v-model="formData.contact_phone"
                type="tel"
                id="contact_phone"
                class="custom-input"
                placeholder="Optional phone for applicants" />
            </div>

            <div class="flex justify-end gap-3">
              <RouterLink
                :to="`/jobs/${route.params.id}`"
                class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-1.5 rounded-lg cursor-pointer text-md transition-all duration-300">
                <i class="fas fa-times mr-1"></i>
                Cancel Editing
              </RouterLink>
              <button
                type="submit"
                :disabled="submitting"
                class="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg cursor-pointer text-md transition-all duration-300">
                <i class="fas fa-edit mr-1"></i>
                {{ submitting ? 'Updating...' : 'Update Job' }}
              </button>
            </div>

            <!-- <div class="flex justify-end gap-4">
              <RouterLink
                :to="`/jobs/${route.params.id}`"
                class="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full text-center">
                <i class="fas fa-times mr-1"></i>
                Cancel
              </RouterLink>
              <button
                type="submit"
                :disabled="submitting"
                class="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline disabled:opacity-50 cursor-pointer">
                <i class="fas fa-edit mr-1"></i>
                {{ submitting ? 'Updating...' : 'Update Job' }}
              </button> 
            </div>-->

          </form>
        </div>
      </div>
    </section>
  </div>

  <!-- Modal -->
  <Modal
    :show="showModal"
    :type="modalConfig.type"
    :variant="modalConfig.variant"
    :title="modalConfig.title"
    :message="modalConfig.message"
    @close="handleModalClose" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { jobsAPI } from '../services/api'
import Modal from '../components/Modal.vue'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const error = ref(null)
const submitting = ref(false)
const validationErrors = ref([])

// Modal state
const showModal = ref(false)
const modalConfig = ref({
  type: 'alert',
  variant: 'success',
  title: '',
  message: ''
})

const formData = ref({
  type: '',
  title: '',
  description: '',
  salary: '',
  location: '',
  company_name: '',
  company_description: '',
  contact_email: '',
  contact_phone: ''
})

onMounted(async () => {
  try {
    const job = await jobsAPI.getJob(route.params.id)
    formData.value = { ...job }
  } catch (err) {
    error.value = 'Failed to load job data. The job may not exist.'
    console.error('Error fetching job:', err)
  } finally {
    loading.value = false
  }
})

const handleSubmit = async () => {
  submitting.value = true
  validationErrors.value = [] // Clear previous errors

  try {
    await jobsAPI.updateJob(route.params.id, formData.value)
    showModalAlert('Success!', 'Job updated successfully!', 'success', () => {
      router.push(`/jobs/${route.params.id}`)
    })
  } catch (err) {
    if (err.data && err.data.errors) {
      // Handle validation errors from backend
      validationErrors.value = err.data.errors
      // Scroll to top to see errors
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      // Generic error
      showModalAlert('Error', 'Failed to update job. Please try again.', 'error')
      console.error('Error updating job:', err)
    }
  } finally {
    submitting.value = false
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
