<template>
  <div class="product-gallery">
    <!-- Main Image Display -->
    <div
      class="main-image-wrapper relative overflow-hidden rounded-lg bg-surface-raised shadow-lg mb-4"
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

    <!-- Thumbnail Grid -->
    <div v-if="images.length > 1" class="thumbnail-grid grid gap-3" :class="thumbnailGridClass">
      <button
        v-for="(image, index) in images"
        :key="index"
        @click="selectImage(index)"
        class="thumbnail-button relative overflow-hidden rounded-lg bg-surface-raised border-2 transition-all duration-200 aspect-square group"
        :class="[
          currentIndex === index
            ? 'border-accent-500 shadow-md scale-95'
            : 'border-border-subtle hover:border-accent-300 hover:shadow-sm',
        ]"
        :aria-label="`View image ${index + 1}`"
        :aria-current="currentIndex === index ? 'true' : undefined"
      >
        <NuxtImg
          :src="image"
          :alt="`${alt} - Image ${index + 1}`"
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          quality="70"
        />

        <!-- Active indicator overlay -->
        <div
          v-if="currentIndex === index"
          class="absolute inset-0 bg-primary-100 opacity-50 pointer-events-none"
        ></div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  /**
   * ProductGallery Component
   *
   * Displays product images with:
   * - Main image with hover zoom
   * - Thumbnail navigation
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
    /** Number of thumbnail columns */
    thumbnailColumns?: 3 | 4 | 5 | 6;
  }

  const props = withDefaults(defineProps<Props>(), {
    alt: "Product image",
    thumbnailColumns: 4,
  });

  // State
  const currentIndex = ref(0);
  const isZoomed = ref(false);

  // Computed
  const selectedImage = computed(() => props.images[currentIndex.value] || props.images[0]);

  const thumbnailGridClass = computed(() => {
    const columns = {
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
    };
    return columns[props.thumbnailColumns];
  });

  // Methods
  const selectImage = (index: number) => {
    currentIndex.value = index;
  };

  const nextImage = () => {
    if (currentIndex.value < props.images.length - 1) {
      currentIndex.value++;
    }
  };

  const previousImage = () => {
    if (currentIndex.value > 0) {
      currentIndex.value--;
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

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .main-image-wrapper img,
    .thumbnail-button img,
    .thumbnail-button {
      transition-duration: 0.01ms !important;
    }
  }
</style>
