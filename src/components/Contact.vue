<template>
  <section id="contact" class="py-10 md:py-20 bg-green-700 text-white transition-colors">
    <div class="container mx-auto px-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-60">

        <!-- Contact Info -->
        <div class="space-y-4">
          <h2 class="text-4xl font-bold">Get In Touch</h2>

          <div class="divider"></div>

          <p class="text-green-100 mb-12 text-lg">
            Have questions about job listings or our platform? Our team is here to help you find the perfect role or the right candidate.
          </p>

          <div class="space-y-8">
            <div v-for="(item, index) in contactDetails" :key="index" class="flex items-center space-x-5">
              <div class="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                <i :class="item.icon" class="text-xl"></i>
              </div>
              <div>
                <p class="font-bold text-lg">{{ item.title }}</p>
                <p class="text-green-200">{{ item.value }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="bg-white rounded-3xl p-8 lg:p-10 shadow-xl text-gray-900">

          <!-- Validation Errors Alert -->
          <div v-if="validationErrors.length > 0" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 text-sm" role="alert">
            <p class="font-bold">Please fix the following:</p>
            <ul class="list-disc ml-5 mt-1">
              <li v-for="(error, index) in validationErrors" :key="index">
                {{ error.msg }}
              </li>
            </ul>
          </div>

          <form @submit.prevent="submitForm" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="block text-sm font-bold ml-1">Name</label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-green-600 transition-all text-gray-900"
                  placeholder="Your Name">
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-bold ml-1">Email</label>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-green-600 transition-all text-gray-900"
                  placeholder="your@email.com">
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-bold ml-1">Subject</label>
              <div class="relative">
                <select
                  v-model="form.subject"
                  class="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-green-600 appearance-none transition-all cursor-pointer text-gray-900">
                  <option value="" disabled>Select Subject</option>
                  <option>Job Inquiry</option>
                  <option>Employer Partnership</option>
                  <option>Technical Support</option>
                  <option>Other</option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                  <i class="fas fa-chevron-down text-xs"></i>
                </div>
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-bold ml-1">Message</label>
              <textarea
                v-model="form.message"
                rows="4"
                required
                class="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-green-600 transition-all resize-none text-gray-900"
                placeholder="How can we help?"></textarea>
            </div>

            <button
              type="submit"
              :disabled="status === 'sending'"
              :class="[
                'w-full py-4 font-bold rounded-xl transition-all transform duration-200 flex items-center justify-center space-x-2 cursor-pointer',
                status === 'success' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-green-700 hover:bg-green-800 hover:-translate-y-1 text-white shadow-lg hover:shadow-green-500/30'
              ]">
              <span v-if="status === 'idle'"><i class="fas fa-paper-plane mr-1"></i> Send Message</span>
              <span v-else-if="status === 'sending'"><i class="fas fa-circle-notch fa-spin mr-1"></i> Sending...</span>
              <span v-else><i class="fas fa-check mr-1"></i> Message Sent!</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { contactSchema } from '../schemas/contact';

// Form Logic
const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
});

const status = ref('idle'); // idle, sending, success
const validationErrors = ref([]);

const validateForm = () => {
  const result = contactSchema.safeParse(form);
  if (!result.success) {
    const issues = result.error.errors || result.error.issues || [];
    validationErrors.value = issues.map(err => ({
      msg: err.message
    }));
    return false;
  }
  return true;
};

const submitForm = () => {
  validationErrors.value = [];

  if (!validateForm()) {
    return;
  }

  status.value = 'sending';

  // Simulate API call
  setTimeout(() => {
    status.value = 'success';

    // Reset after delay
    setTimeout(() => {
      status.value = 'idle';
      form.name = '';
      form.email = '';
      form.message = '';
      form.subject = '';
    }, 3000);
  }, 1500);
};

// Data for templates
const contactDetails = [
  { icon: 'fas fa-map-marker-alt', title: 'Location', value: 'Osaka, Japan' },
  { icon: 'fas fa-phone', title: 'Phone', value: '+81 080 1234 5678' },
  { icon: 'fas fa-envelope', title: 'Email', value: 'support@vue-jobs.com' }
];

const socialLinks = [
  { icon: 'fab fa-facebook-f', url: '#' },
  { icon: 'fab fa-twitter', url: '#' },
  { icon: 'fab fa-github', url: 'https://github.com/shamiul-anik/vue-jobs' },
  { icon: 'fab fa-linkedin-in', url: '#' }
];
</script>

<style scoped></style>
