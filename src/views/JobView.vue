<template>
  <div>
    <section class="bg-green-50">
      <div class="container max-w-5xl mx-auto py-10 px-6">
        <div v-if="loading" class="text-center" aria-live="polite">
          <p class="text-xl">Loading job details...</p>
        </div>

        <div v-else-if="error" class="text-center">
          <p class="text-xl text-red-500">{{ error }}</p>

          <RouterLink
            to="/jobs"
            class="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition-all">
            <i class="fas fa-arrow-left text-sm transition-transform group-hover:-translate-x-1"></i>
            Back to Browse Jobs
          </RouterLink>

        </div>

        <div v-else>

          <RouterLink
            to="/jobs"
            class="group inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium transition-all">
            <i class="fas fa-arrow-left text-sm transition-transform group-hover:-translate-x-1"></i>
            Back to Browse Jobs
          </RouterLink>

          <div class="bg-gray-50 border border-gray-200 rounded-xl shadow-md relative hover:shadow-xl transition-shadow cursor-pointer p-4 md:p-8 mt-6">

            <div class="mb-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-medium">
              <i :class="[typeIcon, 'text-md px-0.5']"></i>
              {{ job.type }}
            </div>

            <div class="text-slate-500 my-2">
              Posted on {{ formattedCreatedAt }}
            </div>

            <h1 class="text-2xl md:text-3xl font-bold">{{ job.title }}</h1>
            <hr class="border-gray-200 my-3">

            <div class="text-xl font-semibold text-green-600 mb-6">
              <i class="fa-solid fa-money-bill-wave mr-2"></i>
              {{ job.salary }} / Year
            </div>

            <div class="mb-6">
              <h3 class="text-xl font-bold">Job Description</h3>
              <hr class="border-gray-200 my-2">
              <p class="whitespace-pre-line">{{ job.description }}</p>
            </div>

            <div v-if="job.company_name" class="mb-6">
              <h3 class="text-xl font-bold">Company Information</h3>
              <hr class="border-gray-200 my-2">
              <p class="font-semibold">{{ job.company_name }}</p>
              <div class="text-red-600 flex items-center my-1">
                <i class="fa-solid fa-location-dot mr-2"></i>
                <p>{{ job.location }}</p>
              </div>
              <p class="mt-1 whitespace-pre-line">{{ job.company_description }}</p>
            </div>

            <div class="mb-6">
              <h3 class="text-xl font-bold">Contact Information</h3>
              <hr class="border-gray-200 my-2">
              <div class="flex items-center gap-2 text-md">
                <i class="fa-solid fa-envelope text-green-600"></i>
                {{ job.contact_email }}
              </div>
              <div v-if="job.contact_phone" class="flex items-center gap-2 text-md mt-1">
                <i class="fa-solid fa-phone text-green-600"></i>
                {{ job.contact_phone }}
              </div>
            </div>

            <hr class="border-gray-200 my-6">

            <div v-if="isAdmin" class="flex justify-end gap-3">
              <RouterLink
                :to="`/edit-job/${job.id}`"
                class="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg cursor-pointer text-md transition-all duration-300">
                <i class="fas fa-edit mr-1"></i>
                Edit Job
              </RouterLink>
              <button
                @click="handleDelete"
                class="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg cursor-pointer text-md transition-all duration-300">
                <i class="fas fa-trash-alt mr-1"></i>
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
    @close="handleModalClose" />
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

// Icon for Job Type
const typeIcon = computed(() => {
  switch (job.value.type) {
    case 'Full-Time':
      return 'fa-solid fa-briefcase'
    case 'Part-Time':
      return 'fa-solid fa-clock'
    case 'Remote':
      return 'fa-solid fa-house-laptop'
    case 'Internship':
      return 'fa-solid fa-graduation-cap'
    default:
      return 'fa-solid fa-briefcase'
  }
})

// Formatted Created At
const formattedCreatedAt = computed(() => {
  // Force UTC by appending "Z"
  const raw = job.value.created_at
  if (!raw) return 'Unknown date'
  
  const d = new Date(raw.endsWith("Z") ? raw : raw + "Z")

  const datePart = d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Tokyo"
  })

  const timePart = d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Tokyo"
  })

  return `${datePart} at ${timePart.toLowerCase()}`
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
