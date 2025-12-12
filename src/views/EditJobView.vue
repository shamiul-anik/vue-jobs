<template>
  <div>
    <section class="bg-green-50">
      <div class="container m-auto max-w-2xl py-24">
        <div v-if="loading" class="text-center">
          <p class="text-xl">Loading job data...</p>
        </div>
        
        <div v-else-if="error" class="text-center">
          <p class="text-xl text-red-500">{{ error }}</p>
          <RouterLink to="/jobs" class="text-green-500 hover:underline mt-4 inline-block" aria-label="Return to all jobs">
            Back to Jobs
          </RouterLink>
        </div>
        
        <div v-else class="bg-white px-6 py-8 mb-4 border-2 border-gray-200 shadow-lg rounded-lg m-4 md:m-0">
          <form @submit.prevent="handleSubmit">
            <h2 class="text-3xl text-center font-semibold mb-6">Edit Job</h2>

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

            <div class="flex justify-end gap-4">
              
              <RouterLink
                :to="`/jobs/${route.params.id}`"
                class="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full text-center"
              >
                Cancel
              </RouterLink>
              <button
                type="submit"
                :disabled="submitting"
                class="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline disabled:opacity-50"
              >
                {{ submitting ? 'Updating...' : 'Update Job' }}
              </button>
            </div>
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
    @close="handleModalClose"
  />
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
  try {
    await jobsAPI.updateJob(route.params.id, formData.value)
    showModalAlert('Success!', 'Job updated successfully!', 'success', () => {
      router.push(`/jobs/${route.params.id}`)
    })
  } catch (err) {
    showModalAlert('Error', 'Failed to update job. Please try again.', 'error')
    console.error('Error updating job:', err)
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
