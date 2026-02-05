<template>
  <div class="animate-pulse" :class="containerClass">
    <!-- Card Skeleton -->
    <div v-if="type === 'card'" class="space-y-4">
      <div class="aspect-square bg-neutral-200 rounded-lg"></div>
      <div class="h-4 bg-neutral-200 rounded w-3/4"></div>
      <div class="h-4 bg-neutral-200 rounded w-1/2"></div>
    </div>

    <!-- Product Grid Skeleton -->
    <div v-else-if="type === 'product-grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in count" :key="i" class="space-y-4">
        <div class="aspect-square bg-neutral-200 rounded-lg"></div>
        <div class="h-4 bg-neutral-200 rounded w-3/4"></div>
        <div class="h-4 bg-neutral-200 rounded w-1/2"></div>
      </div>
    </div>

    <!-- Product Detail Skeleton -->
    <div v-else-if="type === 'product-detail'" class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      <!-- Image Gallery -->
      <div class="space-y-4">
        <div class="aspect-square bg-neutral-200 rounded-lg"></div>
        <div class="flex gap-2">
          <div v-for="i in 4" :key="i" class="w-20 h-20 bg-neutral-200 rounded"></div>
        </div>
      </div>

      <!-- Product Info -->
      <div class="space-y-6">
        <div class="space-y-3">
          <div class="h-8 bg-neutral-200 rounded w-3/4"></div>
          <div class="h-4 bg-neutral-200 rounded w-full"></div>
          <div class="h-4 bg-neutral-200 rounded w-5/6"></div>
        </div>
        <div class="space-y-3">
          <div class="h-6 bg-neutral-200 rounded w-1/3"></div>
          <div class="h-12 bg-neutral-200 rounded w-full"></div>
        </div>
        <div class="h-12 bg-neutral-200 rounded w-full"></div>
      </div>
    </div>

    <!-- Review Skeleton -->
    <div v-else-if="type === 'review'" class="space-y-3">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-neutral-200 rounded-full"></div>
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-neutral-200 rounded w-1/4"></div>
          <div class="h-3 bg-neutral-200 rounded w-1/6"></div>
        </div>
      </div>
      <div class="h-4 bg-neutral-200 rounded w-full"></div>
      <div class="h-4 bg-neutral-200 rounded w-5/6"></div>
    </div>

    <!-- Text Line Skeleton -->
    <div v-else-if="type === 'text'" :class="textClass">
      <div class="h-4 bg-neutral-200 rounded" :class="width"></div>
    </div>

    <!-- Hero Skeleton -->
    <div v-else-if="type === 'hero'" class="space-y-6">
      <div class="h-12 bg-neutral-200 rounded w-3/4 mx-auto"></div>
      <div class="h-6 bg-neutral-200 rounded w-1/2 mx-auto"></div>
      <div class="h-12 bg-neutral-200 rounded w-48 mx-auto"></div>
    </div>

    <!-- Best Sellers Section -->
    <div v-else-if="type === 'best-sellers'" class="space-y-6">
      <div class="h-8 bg-neutral-200 rounded w-1/3"></div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="i in 4" :key="i" class="space-y-3">
          <div class="aspect-square bg-neutral-200 rounded-lg"></div>
          <div class="h-4 bg-neutral-200 rounded w-3/4"></div>
          <div class="h-4 bg-neutral-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <!-- Custom -->
    <div v-else class="h-4 bg-neutral-200 rounded" :class="width"></div>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    type?: "card" | "product-grid" | "product-detail" | "review" | "text" | "hero" | "best-sellers";
    count?: number;
    width?: string;
    containerClass?: string;
    textClass?: string;
  }

  withDefaults(defineProps<Props>(), {
    type: "text",
    count: 6,
    width: "w-full",
    containerClass: "",
    textClass: "",
  });
</script>

<style scoped>
  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
</style>
