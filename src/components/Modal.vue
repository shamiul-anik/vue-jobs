<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4" @click.self="handleBackdropClick">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/40 backdrop-blur-sm"></div>

        <!-- Modal -->
        <div
          class="relative bg-white rounded-lg shadow-xl w-full p-6 transform transition-all overflow-hidden"
          :class="[maxWidthClass]">
          <!-- Close Button (Top Right) -->
          <button
            @click="handleCancel"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            aria-label="Close modal">
            <i class="fas fa-times text-xl"></i>
          </button>

          <!-- Icon -->
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4" :class="iconBgClass">
            <i :class="iconClass" class="text-2xl"></i>
          </div>

          <!-- Title -->
          <h3 class="text-lg font-semibold text-gray-900 text-center mb-2">
            {{ title }}
          </h3>

          <!-- Message / Slot Content -->
          <div class="mb-6 overflow-y-auto max-h-[60vh] px-2 text-center">
            <p v-if="message" class="text-sm text-gray-600">
              {{ message }}
            </p>
            <slot />
          </div>

          <!-- Actions -->
          <div class="flex gap-3" :class="type === 'confirm' ? 'justify-between' : 'justify-center'">
            <button
              v-if="type === 'confirm'"
              @click="handleCancel"
              class="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors cursor-pointer flex items-center justify-center">
              <i class="fas fa-times mr-2"></i>
              {{ cancelText }}
            </button>
            <button
              @click="handleConfirm"
              class="font-medium rounded-lg transition-colors bg-green-500 hover:bg-green-600 text-white cursor-pointer flex items-center justify-center"
              :class="[
                type === 'confirm' ? 'flex-1 px-4 py-2' : 'px-6 py-2',
                confirmButtonClass,
                confirmText === 'Delete' ? 'bg-red-500! hover:bg-red-600!' : ''
              ]">
              <i v-if="confirmText === 'Delete'" class="fas fa-trash-alt mr-2"></i>
              <i v-else class="fas fa-check mr-2"></i>
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'alert', // 'alert', 'confirm', 'success', 'error', 'warning'
    validator: (value) => ['alert', 'confirm', 'success', 'error', 'warning'].includes(value)
  },
  title: {
    type: String,
    default: 'Notification'
  },
  message: {
    type: String,
    default: ''
  },
  confirmText: {
    type: String,
    default: 'OK'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  variant: {
    type: String,
    default: 'info' // 'info', 'success', 'error', 'warning'
  },
  maxWidth: {
    type: String,
    default: 'md' // 'sm', 'md', 'lg', 'xl', '2xl'
  }
})

const emit = defineEmits(['confirm', 'cancel', 'close'])

const maxWidthClass = computed(() => {
  const classes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl'
  }
  return classes[props.maxWidth] || 'max-w-md'
})

const iconClass = computed(() => {
  const icons = {
    success: 'fas fa-check-circle text-green-600',
    error: 'fas fa-exclamation-circle text-red-600',
    warning: 'fas fa-exclamation-triangle text-yellow-600',
    info: 'fas fa-info-circle text-blue-600',
    confirm: 'fas fa-question-circle text-blue-600'
  }
  return icons[props.variant] || icons[props.type] || icons.info
})

const iconBgClass = computed(() => {
  const bgClasses = {
    success: 'bg-green-100',
    error: 'bg-red-100',
    warning: 'bg-yellow-100',
    info: 'bg-blue-100',
    confirm: 'bg-blue-100'
  }
  return bgClasses[props.variant] || bgClasses[props.type] || bgClasses.info
})

const confirmButtonClass = computed(() => {
  if (props.type === 'confirm') {
    return 'flex-1 bg-green-600 hover:bg-green-700 text-white'
  }
  const classes = {
    success: 'bg-green-600 hover:bg-green-700 text-white',
    error: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
    info: 'bg-blue-600 hover:bg-blue-700 text-white'
  }
  return classes[props.variant] || 'bg-blue-600 hover:bg-blue-700 text-white'
})

const handleConfirm = () => {
  emit('confirm')
  emit('close')
}

const handleCancel = () => {
  emit('cancel')
  emit('close')
}

const handleBackdropClick = () => {
  if (props.type !== 'confirm') {
    emit('close')
  }
}
</script>

<style scoped>
.modal-enter-active {
  transition: opacity 0s;
}

.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
  opacity: 0;
}
</style>
