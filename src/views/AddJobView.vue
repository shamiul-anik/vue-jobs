<template>
  <div>
    <section class="bg-green-50">
      <div class="container m-auto max-w-7xl py-12">
        <h2 class="text-3xl font-bold text-green-500 mb-6 text-center">
          Add Job
        </h2>
        <div class="bg-white px-4 md:px-8 py-4 md:py-8 mb-4 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border-2 border-gray-200 m-4 md:m-0">

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

            <div class="flex flex-col md:flex-row gap-8">
              <!-- Left Column: Job Details -->
              <div class="w-full md:w-1/2">
                <h3 class="text-2xl font-semibold">Job Details</h3>
                <div class="divider"></div>

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
                  <label for="description" class="custom-label">Description</label>
                  <textarea
                    v-model="formData.description"
                    id="description"
                    class="custom-textarea min-h-[197px]"
                    rows="7"
                    placeholder="Add any job duties, expectations, requirements, required technical skills etc."></textarea>
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
              </div>

              <!-- Right Column: Company Information -->
              <div class="w-full md:w-1/2">
                <h3 class="text-2xl font-semibold">Company Information</h3>
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
                    placeholder="Company Email Address"
                    required />
                </div>

                <div class="mb-6 md:mb-8">
                  <label for="contact_phone" class="custom-label">
                    Contact Phone
                  </label>
                  <input
                    v-model="formData.contact_phone"
                    type="tel"
                    id="contact_phone"
                    class="custom-input"
                    placeholder="Company Phone Number" />
                </div>
              </div>
            </div>

            <div class="flex items-center justify-end mb-3">
              <button
                type="submit"
                :disabled="submitting"
                class="group w-100 md:w-auto md:inline-flex md:items-center gap-2 
                      border border-green-800 bg-green-600 hover:bg-green-700 text-white
                      px-8 md:px-12 py-2 md:py-2 rounded-lg text-lg font-bold
                      transition-all duration-300 cursor-pointer">
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
      @close="handleModalClose" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { jobsAPI } from '../services/api'
import Modal from '../components/Modal.vue'
import { useJobs } from '../composables/useJobs'
import { jobSchema } from '../schemas/job'

const { clearCache } = useJobs()
const router = useRouter()
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

const validateForm = () => {
  const result = jobSchema.safeParse(formData.value)
  if (!result.success) {
    console.log('Validation failed:', result); // Debug log
    const errors = result.error.errors || result.error.issues || [];
    // Map Zod errors to the format expected by the template
    validationErrors.value = errors.map(err => ({
      msg: err.message
    }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return false
  }
  return true
}

const handleSubmit = async () => {
  validationErrors.value = [] // Clear previous errors

  // Frontend Validation
  if (!validateForm()) {
    return
  }

  submitting.value = true

  try {
    const result = await jobsAPI.createJob(formData.value)
    clearCache() // Invalidate cache
    showModalAlert('Success!', 'Job added successfully!', 'success', () => {
      router.push(`/jobs/${result.id}`)
    })
  } catch (err) {
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
