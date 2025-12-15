<template>
  <div>
    <section class="bg-green-50">
      <div class="container m-auto py-10 px-6">
        <div v-if="loading" class="text-center">
          <p class="text-xl">Loading job details...</p>
        </div>
        
        <div v-else-if="error" class="text-center">
          <p class="text-xl text-red-500">{{ error }}</p>
          <RouterLink to="/jobs" class="text-green-500 hover:underline mt-4 inline-block">
            Back to Jobs
          </RouterLink>
        </div>
        
        <div v-else>
          <RouterLink
            to="/jobs"
            class="bg-slate-600 hover:bg-slate-700 text-white mb-6 px-4 py-2 rounded-lg"
          >
            <i class="fas fa-arrow-left mr-1"></i> Back to Job Listings
          </RouterLink>

          <div class="bg-white p-6 rounded-lg shadow-md mt-6">
            <div class="text-gray-500 mb-4">{{ job.type }}</div>
            <h1 class="text-3xl font-bold mb-4">{{ job.title }}</h1>
            
            <div class="text-gray-500 mb-4 flex items-center">
              <i class="fa-solid fa-location-dot text-lg text-orange-700 mr-2"></i>
              <p class="text-orange-700">{{ job.location }}</p>
            </div>

            <h3 class="text-green-500 text-lg font-bold mb-6">{{ job.salary }}</h3>

            <div class="mb-6">
              <h3 class="text-xl font-bold mb-2">Job Description</h3>
              <p class="whitespace-pre-line">{{ job.description }}</p>
            </div>

            <div v-if="job.company_name" class="mb-6">
              <h3 class="text-xl font-bold mb-2">Company</h3>
              <p class="font-semibold">{{ job.company_name }}</p>
              <p class="mt-2 whitespace-pre-line">{{ job.company_description }}</p>
            </div>

            <div class="mb-6">
              <h3 class="text-xl font-bold mb-2">Contact Information</h3>
              <p><strong>Email:</strong> {{ job.contact_email }}</p>
              <p v-if="job.contact_phone"><strong>Phone:</strong> {{ job.contact_phone }}</p>
            </div>

            <div v-if="isAdmin" class="flex justify-end gap-4">
              <RouterLink
                :to="`/edit-job/${job.id}`"
                class="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
              >
                Edit Job
              </RouterLink>
              <button
                @click="handleDelete"
                class="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
              >
                Delete Job
              </button>
            </div>
          </div>
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
    :confirm-text="modalConfig.confirmText"
    :cancel-text="modalConfig.cancelText"
    @confirm="handleModalConfirm"
    @cancel="handleModalCancel"
    @close="handleModalClose"
  />
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { jobsAPI } from '../services/api'
import Modal from '../components/Modal.vue'
import { useSEO } from '../composables/useSEO'
import { useAuth } from '../composables/useAuth'

const route = useRoute()
const router = useRouter()
const { user } = useAuth()
const job = ref({})
const loading = ref(true)
const error = ref(null)

const isAdmin = computed(() => {
  return user.value && user.value.role === 'admin'
})

// SEO state
const seoData = ref({
  title: 'Job Details | Vue Jobs',
  description: 'View job details and apply for Vue.js developer positions',
  keywords: 'Vue.js job, developer position, job details',
  canonical: window.location.href,
  image: window.location.origin + '/images/logo.png'
})

const { updateMetaTags } = useSEO(seoData)

// Modal state
const showModal = ref(false)
const modalConfig = ref({
  type: 'alert',
  variant: 'success',
  title: '',
  message: '',
  confirmText: 'OK',
  cancelText: 'Cancel'
})
let deleteConfirmed = false

onMounted(async () => {
  try {
    job.value = await jobsAPI.getJob(route.params.id)
  } catch (err) {
    error.value = 'Failed to load job details. The job may not exist.'
    console.error('Error fetching job:', err)
  } finally {
    loading.value = false
  }
})

// Update SEO when job data is loaded
watch(job, (newJob) => {
  if (newJob.title) {
    seoData.value = {
      title: `${newJob.title} - ${newJob.location} | Vue Jobs`,
      description: `${newJob.title} position at ${newJob.company_name || 'a great company'} in ${newJob.location}. ${newJob.description?.substring(0, 150)}...`,
      keywords: `${newJob.title}, Vue.js job, ${newJob.location}, ${newJob.type}, ${newJob.company_name}`,
      canonical: window.location.origin + '/jobs/' + newJob.id,
      image: window.location.origin + '/images/logo.png',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'JobPosting',
        'title': newJob.title,
        'description': newJob.description,
        'datePosted': newJob.created_at,
        'employmentType': newJob.type,
        'hiringOrganization': {
          '@type': 'Organization',
          'name': newJob.company_name || 'Vue Jobs',
          'description': newJob.company_description
        },
        'jobLocation': {
          '@type': 'Place',
          'address': {
            '@type': 'PostalAddress',
            'addressLocality': newJob.location
          }
        },
        'baseSalary': {
          '@type': 'MonetaryAmount',
          'currency': 'USD',
          'value': {
            '@type': 'QuantitativeValue',
            'value': newJob.salary,
            'unitText': 'YEAR'
          }
        }
      }
    }
    updateMetaTags()
  }
})

const handleDelete = async () => {
  showModalConfirm(
    'Delete Job',
    'Are you sure you want to delete this job? This action cannot be undone.',
    'warning'
  )
}

const showModalAlert = (title, message, variant = 'info', onConfirm = null) => {
  modalConfig.value = {
    type: 'alert',
    variant,
    title,
    message,
    confirmText: 'OK',
    onConfirm
  }
  showModal.value = true
}

const showModalConfirm = (title, message, variant = 'info') => {
  modalConfig.value = {
    type: 'confirm',
    variant,
    title,
    message,
    confirmText: 'Delete',
    cancelText: 'Cancel'
  }
  showModal.value = true
}

const handleModalConfirm = async () => {
  if (modalConfig.value.type === 'confirm') {
    try {
      await jobsAPI.deleteJob(job.value.id)
      showModalAlert('Success!', 'Job deleted successfully!', 'success', () => {
        router.push('/jobs')
      })
    } catch (err) {
      showModalAlert('Error', 'Failed to delete job. Please try again.', 'error')
      console.error('Error deleting job:', err)
    }
  }
}

const handleModalCancel = () => {
  showModal.value = false
}

const handleModalClose = () => {
  showModal.value = false
  if (modalConfig.value.onConfirm) {
    modalConfig.value.onConfirm()
  }
}
</script>
