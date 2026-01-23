<template>
  <div class="text-center mb-12">
    <h2
      class="font-bold mb-4"
      :class="[titleSize === 'lg' ? 'text-3xl md:text-5xl' : 'text-3xl md:text-4xl', titleColor]"
    >
      {{ title }}
    </h2>
    <p v-if="description" class="text-lg max-w-2xl mx-auto" :class="descriptionColor">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    title: string;
    description?: string;
    titleSize?: "default" | "lg";
    titleColor?: string;
    descriptionColor?: string;
  }

  withDefaults(defineProps<Props>(), {
    titleSize: "default",
    titleColor: "text-text-primary",
    descriptionColor: "text-text-secondary",
  });
</script>

<style scoped></style>
