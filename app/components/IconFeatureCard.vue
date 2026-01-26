<template>
  <div
    class="feature-card p-6 rounded-lg transition-all duration-300"
    :class="[
      variant === 'elevated'
        ? 'bg-surface-raised border border-border-subtle hover:border-accent-500'
        : '',
    ]"
  >
    <!-- Step Number (optional) -->
    <div
      v-if="stepNumber"
      class="w-16 h-16 rounded-full bg-accent-700 text-text-inverse flex items-center justify-center text-2xl font-bold mb-4 relative z-10 shadow-lg mx-auto"
    >
      {{ stepNumber }}
    </div>

    <!-- Icon -->
    <div class="p-3 bg-accent-100 rounded-lg grid place-items-center w-fit mb-4 mx-auto">
      <Icon :name="icon" size="32" class="text-accent-700" />
    </div>

    <!-- Title -->
    <h3 class="text-xl text-center font-bold text-text-primary mb-2">
      {{ title }}
    </h3>

    <!-- Description -->
    <p class="text-text-secondary text-center">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    icon: string;
    title: string;
    description: string;
    stepNumber?: number;
    variant?: "default" | "elevated";
  }

  withDefaults(defineProps<Props>(), {
    variant: "default",
  });
</script>

<style scoped>
  .feature-card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .feature-card:hover {
    transform: translateY(-4px);
  }

  @media (prefers-reduced-motion: reduce) {
    .feature-card {
      transition-duration: 0.01ms !important;
    }

    .feature-card:hover {
      transform: none !important;
    }
  }
</style>
