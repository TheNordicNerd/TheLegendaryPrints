<template>
  <div class="text-center mb-12 relative">
    <h2
      class="font-bold mb-4"
      :class="[titleSize === 'lg' ? 'text-3xl md:text-5xl' : 'text-3xl md:text-4xl', titleColor]"
    >
      {{ title }}
    </h2>
    <p v-if="description" class="text-lg max-w-2xl mx-auto" :class="descriptionColor">
      {{ description }}
    </p>
    <NuxtLink to="/products" class="absolute right-10 bottom-0">
      <Button
        v-if="showMoreButton"
        variant="ghost"
        label="See All Products"
        icon-right="i-lucide-arrow-right"
      />
    </NuxtLink>
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
