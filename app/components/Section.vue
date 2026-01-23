<template>
  <div :class="outerClass" class="relative">
    <!-- Background Image Layer -->
    <div
      v-if="backgroundImage"
      class="absolute inset-0 bg-cover bg-center bg-no-repeat"
      :style="backgroundImageStyle"
    ></div>

    <!-- Dark Overlay (only when background image exists) -->
    <div
      v-if="backgroundImage"
      class="absolute inset-0"
      :class="overlayClass"
      :style="overlayStyle"
    ></div>

    <!-- Content -->
    <div class="relative z-10">
      <slot name="outerArea"></slot>
      <div :class="innerClass">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    outerClasses?: string;
    innerClasses?: string;
    backgroundImage?: string;
    /** Overlay darkness level: 'light', 'medium', 'dark', or custom opacity (0-100) */
    overlayDarkness?: "light" | "medium" | "dark" | "none" | number;
  }

  const props = withDefaults(defineProps<Props>(), {
    overlayDarkness: "medium",
  });

  const outerClass = computed(() => {
    return "w-full" + (props.outerClasses ? " " + props.outerClasses : "");
  });

  const innerClass = computed(() => {
    return "w-full max-w-7xl mx-auto h-full" + (props.innerClasses ? " " + props.innerClasses : "");
  });

  // Compute background image style
  const backgroundImageStyle = computed(() => {
    if (!props.backgroundImage) return {};
    return {
      backgroundImage: `url(${props.backgroundImage})`,
    };
  });

  // Compute overlay darkness
  const overlayClass = computed(() => {
    if (!props.backgroundImage) return "";

    const darkness = props.overlayDarkness;

    // If it's a number, use custom opacity
    if (typeof darkness === "number") {
      const opacity = Math.min(100, Math.max(0, darkness)) / 100;
      return `bg-black`;
    }

    // Predefined darkness levels
    switch (darkness) {
      case "light":
        return "bg-black/30";
      case "medium":
        return "bg-black/50";
      case "dark":
        return "bg-black/70";
      case "none":
        return "";
      default:
        return "bg-black/50";
    }
  });

  // Get inline style for custom opacity
  const overlayStyle = computed(() => {
    if (typeof props.overlayDarkness === "number") {
      const opacity = Math.min(100, Math.max(0, props.overlayDarkness)) / 100;
      return { opacity };
    }
    return {};
  });
</script>

<style scoped></style>
