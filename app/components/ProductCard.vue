<template>
  <NuxtLink
    :to="`/products/${product.slug}`"
    class="product-card group bg-surface-raised rounded-lg overflow-hidden border border-border-subtle hover:border-accent-500 transition-all duration-300"
    role="listitem"
    :aria-label="`View ${product.name} details`"
  >
    <!-- Product Image -->
    <div class="relative overflow-hidden aspect-video bg-surface-sunken">
      <NuxtImg
        :src="product.thumbnailImg"
        :alt="product.name"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        :quality="imageQuality"
      />

      <!-- Hover Overlay -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <div class="absolute bottom-4 left-4 right-4 flex items-center justify-center">
          <span
            class="px-4 py-2 bg-accent-700 text-text-inverse font-bold rounded-lg flex items-center gap-2 shadow-lg"
          >
            <template v-if="variant === 'hero'"> Order Now </template>
            <template v-else>
              View Details
              <Icon name="i-lucide-arrow-right" size="18" aria-hidden="true" />
            </template>
          </span>
        </div>
      </div>

      <!-- Featured Badge -->
      <div
        v-if="product.featured && showFeaturedBadge"
        class="absolute top-3 right-3 px-2.5 py-1 bg-accent-700 text-text-inverse text-xs font-bold rounded-full shadow-lg"
      >
        Featured
      </div>
    </div>

    <!-- Product Info -->
    <div :class="variant === 'hero' ? 'p-4' : 'p-5'">
      <div class="flex items-start justify-between gap-2 mb-2">
        <h3
          :class="[
            'font-bold text-text-primary group-hover:text-accent-700 transition-colors duration-200',
            variant === 'hero' ? 'text-base sm:text-lg' : 'text-lg',
          ]"
        >
          {{ product.name }}
        </h3>
      </div>

      <p
        :class="[
          'text-text-secondary mb-3 line-clamp-2',
          variant === 'hero' ? 'text-xs sm:text-sm' : 'text-sm',
        ]"
      >
        {{ product.description }}
      </p>

      <!-- Tags -->
      <div v-if="showTags && product.tags" class="flex flex-wrap gap-1.5">
        <span
          v-for="tag in product.tags.slice(0, maxTags)"
          :key="tag"
          class="px-2 py-1 text-xs font-medium bg-surface-sunken text-text-secondary rounded transition-colors duration-200 group-hover:bg-accent-50 group-hover:text-accent-700"
        >
          {{ formatTag(tag) }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
  import type { Product } from "~/types/product";

  interface Props {
    /** Product data to display */
    product: Product;
    /** Card variant - hero for homepage, default for products page */
    variant?: "default" | "hero";
    /** Show product tags */
    showTags?: boolean;
    /** Maximum number of tags to show */
    maxTags?: number;
    /** Show featured badge */
    showFeaturedBadge?: boolean;
    /** Image quality (0-100) */
    imageQuality?: number;
  }

  const props = withDefaults(defineProps<Props>(), {
    variant: "default",
    showTags: true,
    maxTags: 2,
    showFeaturedBadge: false,
    imageQuality: 75,
  });

  // Format tag display
  const formatTag = (tag: string) => {
    return tag
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
</script>

<style scoped>
  .product-card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .product-card:hover {
    transform: translateY(-8px);
    box-shadow:
      0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }

  /* Text truncation */
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* Shimmer effect on hover */
  .product-card::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.5s;
    pointer-events: none;
    z-index: 1;
  }

  .product-card:hover::before {
    left: 100%;
  }

  /* Dark mode adjustments */
  @media (prefers-color-scheme: dark) {
    .product-card:hover {
      box-shadow:
        0 20px 25px -5px rgba(0, 0, 0, 0.5),
        0 10px 10px -5px rgba(0, 0, 0, 0.3);
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .product-card,
    .product-card::before {
      transition-duration: 0.01ms !important;
    }

    .product-card:hover {
      transform: none !important;
    }
  }
</style>
