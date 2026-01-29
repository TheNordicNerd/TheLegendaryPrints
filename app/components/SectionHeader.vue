<template>
  <div class="mb-12">
    <!-- Flex container: column on mobile, row on desktop -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
      <!-- Title and Description (centered) -->
      <div class="flex-1 text-center lg:text-left">
        <h2
          class="font-bold mb-4"
          :class="[
            titleSize === 'lg' ? 'text-3xl md:text-5xl' : 'text-3xl md:text-4xl',
            titleColor,
          ]"
        >
          {{ title }}
        </h2>
        <p v-if="description" class="text-lg max-w-2xl mx-auto lg:mx-0" :class="descriptionColor">
          {{ description }}
        </p>
      </div>

      <!-- Button (right on desktop, below on mobile) -->
      <div v-if="showMoreButton" class="flex-shrink-0 text-center lg:text-right">
        <NuxtLink to="/products">
          <Button variant="ghost" label="See All Products" icon-right="i-lucide-arrow-right" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    title: string;
    description?: string;
    titleSize?: "default" | "lg";
    titleColor?: string;
    descriptionColor?: string;
    showMoreButton?: boolean;
  }

  withDefaults(defineProps<Props>(), {
    titleSize: "default",
    titleColor: "text-text-primary",
    descriptionColor: "text-text-secondary",
    showMoreButton: false,
  });
</script>

<style scoped></style>
