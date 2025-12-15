<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" @click.self="handleBackdropClick">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
        
        <!-- Modal -->
        <div class="flex min-h-full items-center justify-center p-4">
          <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all">
            <!-- Icon -->
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4" :class="iconBgClass">
              <i :class="iconClass" class="text-2xl"></i>
            </div>
            
            <!-- Title -->
            <h3 class="text-lg font-semibold text-gray-900 text-center mb-2">
              {{ title }}
            </h3>
            
            <!-- Message -->
            <p class="text-sm text-gray-600 text-center mb-6">
              {{ message }}
            </p>
            
            <!-- Actions -->
            <div class="flex gap-3" :class="type === 'confirm' ? 'justify-between' : 'justify-center'">
              <button
                v-if="type === 'confirm'"
                @click="handleCancel"
                class="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
              >
                {{ cancelText }}
              </button>
              <button
                @click="handleConfirm"
                class="font-medium rounded-lg transition-colors bg-green-500 hover:bg-green-600 text-white"
                :class="[
                  type === 'confirm' ? 'flex-1 px-4 py-2' : 'px-6 py-2',
                  confirmButtonClass,
                  confirmText === 'Delete' ? 'bg-red-500! hover:bg-red-600!' : 'px-6 py-2'
                ]"
              >
                {{ confirmText }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type ModalType = 'alert' | 'confirm' | 'success' | 'error' | 'warning'
type ModalVariant = 'info' | 'success' | 'error' | 'warning' | 'confirm'

const props = withDefaults(defineProps<{
  show?: boolean
  type?: ModalType
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: ModalVariant
}>(), {
  show: false,
  type: 'alert',
  title: 'Notification',
  confirmText: 'OK',
  cancelText: 'Cancel',
  variant: 'info'
})

const emit = defineEmits<{
  confirm: []
  cancel: []
  close: []
}>()

const iconClass = computed((): string => {
  const icons: Record<string, string> = {
    success: 'fas fa-check-circle text-green-600',
    error: 'fas fa-exclamation-circle text-red-600',
    warning: 'fas fa-exclamation-triangle text-yellow-600',
    info: 'fas fa-info-circle text-blue-600',
    confirm: 'fas fa-question-circle text-blue-600'
  }
  return icons[props.variant] || icons[props.type] || icons.info
})

const iconBgClass = computed((): string => {
  const bgClasses: Record<string, string> = {
    success: 'bg-green-100',
    error: 'bg-red-100',
    warning: 'bg-yellow-100',
    info: 'bg-blue-100',
    confirm: 'bg-blue-100'
  }
  return bgClasses[props.variant] || bgClasses[props.type] || bgClasses.info
})

const confirmButtonClass = computed((): string => {
  if (props.type === 'confirm') {
    return 'flex-1 bg-green-600 hover:bg-green-700 text-white'
  }
  const classes: Record<string, string> = {
    success: 'bg-green-600 hover:bg-green-700 text-white',
    error: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
    info: 'bg-blue-600 hover:bg-blue-700 text-white'
  }
  return classes[props.variant] || 'bg-blue-600 hover:bg-blue-700 text-white'
})

const handleConfirm = (): void => {
  emit('confirm')
  emit('close')
}

const handleCancel = (): void => {
  emit('cancel')
  emit('close')
}

const handleBackdropClick = (): void => {
  if (props.type !== 'confirm') {
    emit('close')
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}
</style>
