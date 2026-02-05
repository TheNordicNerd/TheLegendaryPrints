<template>
  <!-- Compact Mobile Version -->

  <NuxtLink
    :to="`/products/${product.handle}`"
    class="shopify-product-card-compact bg-surface-raised rounded-xl w-full sm:rounded-2xl shadow-lg hover:shadow-md overflow-hidden transition-all duration-300 flex flex-col"
  >
    <div v-if="product.featuredImage?.url" class="aspect-square overflow-hidden w-full">
      <NuxtImg
        tabindex="-1"
        :src="product.featuredImage.url"
        :alt="product.featuredImage.altText || product.title"
        class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        loading="lazy"
      />
    </div>

    <div v-else class="w-full h-full flex items-center justify-center text-text-tertiary">
      <Icon name="i-lucide-image" size="32" class="sm:size-48" />
    </div>

    <!-- Product Info (Compact) -->
    <div class="px-2 pb-2 sm:px-3 sm:pb-3 flex flex-col flex-1">
      <!-- Product Title -->
      <component
        :is="headingLevel"
        class="text-xs pt-4 sm:text-sm mb-2 text-center font-bold text-text-primary leading-tight line-clamp-2 flex-1"
        tabindex="-1"
      >
        {{ product.title }}
      </component>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
  import type { ShopifyProduct } from "~/composables/useShopify";

  interface Props {
    product: ShopifyProduct;
    compact?: boolean;
    headingLevel?: "h2" | "h3";
  }

  const props = withDefaults(defineProps<Props>(), {
    compact: false,
    headingLevel: "h2",
  });

  const { formatPrice: shopifyFormatPrice } = useShopify();

  // Format price
  const formatPrice = (amount: string) => {
    return shopifyFormatPrice(amount, props.product.priceRange.minVariantPrice.currencyCode);
  };

  // Strip HTML tags from description
  const stripHtml = (html: string) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "");
  };
</script>

<style scoped>
  .shopify-product-card,
  .shopify-product-card-compact {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Text truncation */
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* Compact card specific styles */
  .shopify-product-card-compact {
    max-width: 100%;
    margin: 0 auto;
  }

  /* Ensure compact cards fill their grid cell on mobile */
  @media (max-width: 767px) {
    .shopify-product-card-compact {
      width: 100%;
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .shopify-product-card,
    .shopify-product-card-compact,
    .shopify-product-card img,
    .shopify-product-card-compact img {
      transition-duration: 0.01ms !important;
    }

    .shopify-product-card:hover,
    .shopify-product-card-compact:hover {
      transform: none !important;
    }
  }
</style>
