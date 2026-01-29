<template>
  <div
    class="toast-container fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none"
    aria-live="polite"
    aria-atomic="false"
  >
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        role="status"
        :aria-label="`${toast.type} notification: ${toast.message}`"
        class="toast pointer-events-auto flex items-center gap-3 min-w-[300px] px-4 py-3 rounded-lg shadow-lg border cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl"
        :class="toastClasses(toast.type)"
        @click="remove(toast.id)"
      >
        <Icon :name="getIcon(toast.type)" size="20" aria-hidden="true" class="flex-shrink-0" />
        <p class="flex-1 text-sm font-medium">{{ toast.message }}</p>
        <button
          @click.stop="remove(toast.id)"
          class="flex-shrink-0 hover:opacity-70 hover:rotate-90 transition-all duration-300"
          aria-label="Close notification"
        >
          <Icon name="i-lucide-x" size="16" aria-hidden="true" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
const { toasts, remove } = useToast();

const toastClasses = (type: 'success' | 'error' | 'info') => {
  const classes = {
    success: 'bg-success-50 border-success-500 text-success-900',
    error: 'bg-error-50 border-error-500 text-error-900',
    info: 'bg-accent-50 border-accent-500 text-accent-900',
  };
  return classes[type];
};

const getIcon = (type: 'success' | 'error' | 'info') => {
  const icons = {
    success: 'i-lucide-check-circle',
    error: 'i-lucide-alert-circle',
    info: 'i-lucide-info',
  };
  return icons[type];
};
</script>

<style scoped>
.toast-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100px) scale(0.7) rotate(5deg);
}

.toast-enter-to {
  opacity: 1;
  transform: translateX(0) scale(1) rotate(0deg);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(50px) scale(0.8);
}

.toast-move {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Hover effects */
.toast:hover {
  transform: scale(1.05);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .toast-enter-active,
  .toast-leave-active,
  .toast-move {
    transition-duration: 0.01ms !important;
  }

  .toast:hover {
    transform: none !important;
  }

  .toast button:hover {
    transform: none !important;
  }
}
</style>
