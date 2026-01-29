<template>
  <div class="relative mb-0 md:mb-10">
    <NuxtImg src="/LP Button.png" class="w-48 relative"> </NuxtImg>
    <Button
      v-bind="$props"
      :variant="variant || 'ghost'"
      :size="size || 'lg'"
      :rounded="rounded || 'sm'"
      class="absolute z-50 md:-left-2 md:-top-[76px] -top-[70px] left-0 hover-grow text-black hover:bg-transparent"
    />
  </div>
</template>

<script setup lang="ts">
  import type { ButtonProps } from "./Button.vue";

  interface GhostButtonProps extends ButtonProps {
    top: string;
    left: string;
  }
  defineProps<GhostButtonProps>();
</script>

<style lang="scss" scoped></style>
