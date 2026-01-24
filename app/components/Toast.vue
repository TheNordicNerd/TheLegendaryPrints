<template>
  <div class="toast-container fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast pointer-events-auto flex items-center gap-3 min-w-[300px] px-4 py-3 rounded-lg shadow-lg border"
        :class="toastClasses(toast.type)"
        @click="remove(toast.id)"
      >
        <Icon :name="getIcon(toast.type)" size="20" />
        <p class="flex-1 text-sm font-medium">{{ toast.message }}</p>
        <button
          @click.stop="remove(toast.id)"
          class="hover:opacity-70 transition-opacity"
          aria-label="Close"
        >
          <Icon name="i-lucide-x" size="16" />
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
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100px) scale(0.8);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(50px) scale(0.9);
}

.toast-move {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .toast-enter-active,
  .toast-leave-active,
  .toast-move {
    transition-duration: 0.01ms !important;
  }
}
</style>
