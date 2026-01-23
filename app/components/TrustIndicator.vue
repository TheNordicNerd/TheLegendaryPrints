<template>
  <div class="flex items-center gap-2" :class="textColor">
    <Icon :name="icon" :size="iconSize" />
    <span :class="textSize">{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    icon: string;
    text: string;
    iconSize?: string | number;
    textSize?: string;
    textColor?: string;
  }

  withDefaults(defineProps<Props>(), {
    iconSize: "20",
    textSize: "text-sm",
    textColor: "",
  });
</script>

<style scoped></style>
