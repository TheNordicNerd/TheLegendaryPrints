<template>
  <div class="product-gallery flex gap-4">
    <!-- Thumbnail Column with Arrow Navigation (hidden on mobile) -->
    <div
      v-if="images.length > 1"
      class="thumbnail-navigation hidden lg:flex flex-shrink-0 w-20 flex-col gap-3"
    >
      <!-- Up Arrow (always visible) -->
      <button
        @click="scrollThumbnailsUp"
        :disabled="thumbnailStartIndex <= 0"
        class="arrow-button flex items-center justify-center p-2 rounded-lg bg-surface-raised border-2 transition-all duration-200"
        :class="
          thumbnailStartIndex > 0
            ? 'border-border-subtle hover:border-neutral-400 hover:bg-surface-sunken cursor-pointer'
            : 'border-border-subtle opacity-50 cursor-not-allowed'
        "
        aria-label="Show previous thumbnails"
      >
        <Icon
          name="i-lucide-chevron-up"
          size="20"
          :class="thumbnailStartIndex > 0 ? 'text-text-primary' : 'text-text-tertiary'"
        />
      </button>

      <!-- Thumbnails Container -->
      <div class="thumbnail-column flex-1 space-y-3 overflow-hidden max-h-[400px]">
        <button
          v-for="(image, index) in visibleThumbnails"
          :key="index + thumbnailStartIndex"
          @click="selectImage(index + thumbnailStartIndex)"
          class="thumbnail-button relative overflow-hidden rounded-lg bg-surface-raised border-2 transition-all duration-200 aspect-square group w-full h-[70px]"
          :class="[
            currentIndex === index + thumbnailStartIndex
              ? 'border-magenta shadow-md'
              : 'border-border-subtle hover:border-neutral-400 hover:shadow-sm',
          ]"
          :aria-label="`View image ${index + thumbnailStartIndex + 1}`"
          :aria-current="currentIndex === index + thumbnailStartIndex ? 'true' : undefined"
        >
          <NuxtImg
            :src="image"
            :alt="`${alt} - Image ${index + thumbnailStartIndex + 1}`"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            quality="70"
          />

          <!-- Active indicator border -->
          <div
            v-if="currentIndex === index + thumbnailStartIndex"
            class="absolute inset-0 ring-2 ring-magenta pointer-events-none rounded-lg"
          ></div>
        </button>
      </div>

      <!-- Down Arrow (always visible) -->
      <button
        @click="scrollThumbnailsDown"
        :disabled="thumbnailStartIndex + maxVisibleThumbnails >= images.length"
        class="arrow-button flex items-center justify-center p-2 rounded-lg bg-surface-raised border-2 transition-all duration-200"
        :class="
          thumbnailStartIndex + maxVisibleThumbnails < images.length
            ? 'border-border-subtle hover:border-neutral-400 hover:bg-surface-sunken cursor-pointer'
            : 'border-border-subtle opacity-50 cursor-not-allowed'
        "
        aria-label="Show next thumbnails"
      >
        <Icon
          name="i-lucide-chevron-down"
          size="20"
          :class="
            thumbnailStartIndex + maxVisibleThumbnails < images.length
              ? 'text-text-primary'
              : 'text-text-tertiary'
          "
        />
      </button>
    </div>

    <!-- Main Image Display -->
    <div
      class="main-image-wrapper flex-1 relative overflow-hidden rounded-lg bg-surface-raised shadow-lg"
    >
      <NuxtImg
        :src="selectedImage"
        :alt="alt"
        class="w-full aspect-square object-cover transition-transform duration-500"
        :class="{ 'scale-110': isZoomed }"
        quality="85"
        @mouseenter="isZoomed = true"
        @mouseleave="isZoomed = false"
      />

      <!-- Image Counter -->
      <div
        v-if="images.length > 1"
        class="absolute bottom-4 right-4 bg-surface-raised text-text-primary px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm"
      >
        {{ currentIndex + 1 }} / {{ images.length }}
      </div>

      <!-- Navigation Arrows (for mobile/tablet) -->
      <div
        v-if="images.length > 1 && currentIndex > 0"
        class="absolute left-4 top-1/2 -translate-y-1/2 lg:hidden"
      >
        <Button
          @click="previousImage"
          variant="custom"
          class="bg-surface-raised hover:bg-surface-overlay text-text-primary rounded-full shadow-lg hover:scale-110"
          icon="i-lucide-chevron-left"
          icon-size="24"
          size="md"
          aria-label="Previous image"
        />
      </div>

      <div
        v-if="images.length > 1 && currentIndex < images.length - 1"
        class="absolute right-4 top-1/2 -translate-y-1/2 lg:hidden"
      >
        <Button
          @click="nextImage"
          variant="custom"
          class="bg-surface-raised hover:bg-surface-overlay text-text-primary rounded-full shadow-lg hover:scale-110"
          icon="i-lucide-chevron-right"
          icon-size="24"
          size="md"
          aria-label="Next image"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  /**
   * ProductGallery Component
   *
   * Displays product images with:
   * - Main image with hover zoom
   * - Thumbnail navigation with arrow buttons
   * - Arrow navigation for mobile
   * - Image counter
   * - Keyboard navigation support
   *
   * @component
   */

  interface Props {
    /** Array of image URLs */
    images: string[];
    /** Alt text for images */
    alt?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    alt: "Product image",
  });

  // State
  const currentIndex = ref(0);
  const isZoomed = ref(false);
  const thumbnailStartIndex = ref(0);
  const maxVisibleThumbnails = 5; // Show 5 thumbnails at a time

  // Computed
  const selectedImage = computed(() => props.images[currentIndex.value] || props.images[0]);

  const visibleThumbnails = computed(() => {
    return props.images.slice(
      thumbnailStartIndex.value,
      thumbnailStartIndex.value + maxVisibleThumbnails,
    );
  });

  // Methods
  const selectImage = (index: number) => {
    currentIndex.value = index;

    // Auto-scroll thumbnails to show selected image
    if (index < thumbnailStartIndex.value) {
      thumbnailStartIndex.value = index;
    } else if (index >= thumbnailStartIndex.value + maxVisibleThumbnails) {
      thumbnailStartIndex.value = index - maxVisibleThumbnails + 1;
    }
  };

  const scrollThumbnailsUp = () => {
    if (thumbnailStartIndex.value > 0) {
      thumbnailStartIndex.value = Math.max(0, thumbnailStartIndex.value - 1);
    }
  };

  const scrollThumbnailsDown = () => {
    if (thumbnailStartIndex.value + maxVisibleThumbnails < props.images.length) {
      thumbnailStartIndex.value = Math.min(
        props.images.length - maxVisibleThumbnails,
        thumbnailStartIndex.value + 1,
      );
    }
  };

  const nextImage = () => {
    if (currentIndex.value < props.images.length - 1) {
      selectImage(currentIndex.value + 1);
    }
  };

  const previousImage = () => {
    if (currentIndex.value > 0) {
      selectImage(currentIndex.value - 1);
    }
  };

  // Keyboard navigation
  if (import.meta.client) {
    onMounted(() => {
      const handleKeydown = (event: KeyboardEvent) => {
        if (event.key === "ArrowLeft") {
          previousImage();
        } else if (event.key === "ArrowRight") {
          nextImage();
        }
      };

      window.addEventListener("keydown", handleKeydown);
      onUnmounted(() => {
        window.removeEventListener("keydown", handleKeydown);
      });
    });
  }
</script>

<style scoped>
  .main-image-wrapper {
    cursor: zoom-in;
  }

  .main-image-wrapper:hover {
    cursor: zoom-in;
  }

  .thumbnail-button {
    cursor: pointer;
  }

  .thumbnail-button:focus-visible {
    outline: 2px solid var(--color-border-focus);
    outline-offset: 2px;
  }

  /* Smooth transitions */
  .thumbnail-button img {
    will-change: transform;
  }

  /* Arrow button styling */
  .arrow-button {
    min-height: 40px;
    cursor: pointer;
  }

  .arrow-button:focus-visible {
    outline: 2px solid var(--color-border-focus);
    outline-offset: 2px;
  }

  /* Thumbnail navigation container */
  .thumbnail-navigation {
    min-height: 400px;
    max-height: calc(100vh - 300px);
  }

  .thumbnail-column {
    display: flex;
    flex-direction: column;
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .main-image-wrapper img,
    .thumbnail-button img,
    .thumbnail-button {
      transition-duration: 0.01ms !important;
    }
  }
</style>
