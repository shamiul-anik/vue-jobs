<template>
  <div 
    v-if="isVisible"
    class="loader-container fixed inset-0 z-100 flex flex-col items-center justify-center transition-all duration-1000 ease-in-out"
    :class="{ 
      'opacity-0 pointer-events-none': !isVisible,
      'scale-110': isScaling 
    }"
  >
    <!-- Logo/Icon Container -->
    <div class="relative w-32 h-32 flex items-center justify-center mb-8">
      <!-- Animated Circle Border -->
      <svg 
        class="circular-loader absolute w-full h-full text-amber-400" 
        viewBox="0 0 100 100"
        :class="{ 'loading-complete': isComplete }"
      >
        <circle cx="50" cy="50" r="45" stroke="currentColor"></circle>
      </svg>
      
      <!-- Central Icon -->
      <div class="z-10 text-white text-5xl pulse-effect">
        <i class="fas fa-book-quran"></i>
      </div>
      
      <!-- Background Glow -->
      <div class="absolute inset-0 bg-emerald-600 rounded-full blur-xl opacity-20"></div>
    </div>

    <!-- Text Container -->
    <div class="text-center space-y-3 z-10 px-4">
      <h1 class="text-3xl md:text-4xl text-white font-serif-display tracking-widest uppercase">
        {{ titleMain }} <span class="text-amber-400">{{ titleAccent }}</span>
      </h1>
      <p class="text-emerald-200 text-xs md:text-sm tracking-widest font-light">
        {{ subtitle }}
      </p>
    </div>

    <!-- Linear Progress Bar -->
    <div class="w-64 h-1 bg-emerald-950 rounded-full mt-8 overflow-hidden relative border border-emerald-900/30">
      <div 
        class="h-full bg-amber-400 rounded-full transition-all ease-in-out"
        :style="{ width: progressWidth + '%', transitionDuration: duration + 'ms' }"
      ></div>
    </div>
    
    <div class="absolute bottom-10 text-emerald-300/40 text-[10px] tracking-[0.2em] uppercase font-light">
      A place where faith, knowledge, and unity flourish together.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits } from 'vue';

const props = defineProps({
  duration: {
    type: Number,
    default: 3000
  },
  titleMain: {
    type: String,
    default: 'Osaka'
  },
  titleAccent: {
    type: String,
    default: 'Masjid'
  },
  subtitle: {
    type: String,
    default: 'YOUR SPIRITUAL HOME IN THE CITY'
  }
});

const emit = defineEmits(['loaded']);

const isVisible = ref(true);
const isComplete = ref(false);
const progressWidth = ref(0);
const isScaling = ref(false);

onMounted(() => {
  // Trigger SVG stroke animation
  setTimeout(() => {
    isComplete.value = true;
  }, 100);

  // Trigger progress bar
  setTimeout(() => {
    progressWidth.value = 100;
  }, 200);

  // Completion sequence
  setTimeout(() => {
    isScaling.value = true;
    isVisible.value = false;
    
    // Emit event so parent knows content can be shown
    setTimeout(() => {
      emit('loaded');
    }, 1000);
  }, props.duration);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Lato:wght@300;400;700&display=swap');

.loader-container {
  background: radial-gradient(circle at center, #064e3b 0%, #022c22 100%);
  font-family: 'Lato', sans-serif;
}

.font-serif-display {
  font-family: 'Cinzel', serif;
}

/* Pulse Animation for central icon */
@keyframes pulse-ring {
  0% { transform: scale(0.8); opacity: 0.6; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(0.8); opacity: 0.6; }
}

.pulse-effect {
  animation: pulse-ring 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* SVG Circle Animation */
.circular-loader circle {
  fill: none;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-dasharray: 283; /* 2 * PI * R (45) */
  stroke-dashoffset: 283;
  transform-origin: 50% 50%;
  transform: rotate(-90deg);
  transition: stroke-dashoffset 3s cubic-bezier(0.4, 0, 0.2, 1);
}

.loading-complete circle {
  stroke-dashoffset: 0;
}

/* Ensure FontAwesome is available globally or via your main.js */
</style>