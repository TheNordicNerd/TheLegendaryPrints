<template>
  <div :class="outerClass" class="relative">
    <!-- Background Video Layer (z-index: 0) -->
    <video
      v-if="backgroundVideo"
      ref="videoRef"
      class="absolute inset-0 w-full h-full object-cover z-0"
      autoplay
      loop
      muted
      playsinline
    >
      <source :src="backgroundVideo" type="video/mp4" />
      Your browser does not support the video tag.
    </video>

    <!-- Background Image Layer (z-index: 0) -->
    <div
      v-if="backgroundImage"
      class="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
      :style="backgroundImageStyle"
    ></div>

    <!-- Dark Overlay (z-index: 1) - sits above video/image -->
    <div
      v-if="backgroundImage || backgroundVideo"
      class="absolute inset-0 z-10"
      :class="overlayClass"
      :style="overlayStyle"
    ></div>

    <!-- Content (z-index: 10) - sits above everything -->
    <div class="relative">
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
    backgroundVideo?: string;
    /** Video playback speed: 0.25 to 2.0 (default: 1.0) */
    videoSpeed?: number;
    /** Overlay darkness level: 'light', 'medium', 'dark', or custom opacity (0-100) */
    overlayDarkness?: "light" | "medium" | "dark" | "none" | number;
  }

  const props = withDefaults(defineProps<Props>(), {
    overlayDarkness: "medium",
    videoSpeed: 1.0,
  });

  const videoRef = ref<HTMLVideoElement | null>(null);

  // Set video playback speed when video is ready
  onMounted(() => {
    if (videoRef.value && props.videoSpeed) {
      videoRef.value.playbackRate = props.videoSpeed;
    }

    // Pause video for users who prefer reduced motion
    if (videoRef.value && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      videoRef.value.pause();
    }
  });

  // Watch for changes to videoSpeed prop
  watch(
    () => props.videoSpeed,
    (newSpeed) => {
      if (videoRef.value && newSpeed) {
        videoRef.value.playbackRate = newSpeed;
      }
    },
  );

  const outerClass = computed(() => {
    return "w-full px-4" + (props.outerClasses ? " " + props.outerClasses : "");
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
    if (!props.backgroundImage && !props.backgroundVideo) return "";

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
