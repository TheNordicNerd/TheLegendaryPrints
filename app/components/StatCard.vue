<template>
  <div class="text-center">
    <p
      class="font-black mb-2"
      :class="[valueSize === 'lg' ? 'text-4xl md:text-5xl' : 'text-3xl md:text-4xl', valueColor]"
    >
      {{ value }}
    </p>
    <p class="font-medium" :class="labelColor">{{ label }}</p>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    value: string | number;
    label: string;
    valueSize?: "default" | "lg";
    valueColor?: string;
    labelColor?: string;
  }

  withDefaults(defineProps<Props>(), {
    valueSize: "lg",
    valueColor: "text-accent-700",
    labelColor: "text-text-secondary",
  });
</script>

<style scoped></style>
