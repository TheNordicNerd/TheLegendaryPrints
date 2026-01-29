<template>
  <!-- Compact Mobile Version -->
  <div
    v-if="compact"
    class="shopify-product-card-compact bg-surface-raised rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md overflow-hidden transition-all duration-300 flex flex-col"
  >
    <!-- Product Image -->
    <div class="relative overflow-hidden p-2 sm:p-3">
      <div
        class="rounded-lg sm:rounded-xl aspect-square bg-gradient-to-b from-surface-base via-surface-raised to-surface-sunken"
      >
        <NuxtImg
          tabindex="-1"
          v-if="product.featuredImage?.url"
          :src="product.featuredImage.url"
          :alt="product.featuredImage.altText || product.title"
          class="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
        <div v-else class="w-full h-full flex items-center justify-center text-text-tertiary">
          <Icon name="i-lucide-image" size="32" class="sm:size-48" />
        </div>
      </div>
    </div>

    <!-- Product Info (Compact) -->
    <div class="px-2 pb-2 sm:px-3 sm:pb-3 flex flex-col flex-1">
      <!-- Product Title -->
      <h3 class="text-xs sm:text-sm mb-2 text-center font-bold text-text-primary leading-tight line-clamp-2 flex-1" tabindex="-1">
        {{ product.title }}
      </h3>

      <!-- Order Button -->
      <NuxtLink :to="`/products/${product.handle}`" class="block mt-auto">
        <Button
          tabindex="-1"
          variant="secondary"
          size="sm"
          :full-width="true"
          rounded="md"
          icon-left="i-lucide-shopping-cart"
          left-icon-size="14"
          class="font-semibold text-xs sm:text-sm py-1.5 sm:py-2 shadow-sm hover:shadow-md transition-all duration-300"
        >
          Order
        </Button>
      </NuxtLink>
    </div>
  </div>

  <!-- Full Desktop Version -->
  <div
    v-else
    class="shopify-product-card bg-surface-raised rounded-3xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 max-w-md mx-auto flex flex-col"
  >
    <!-- Product Image -->
    <div class="relative overflow-hidden p-8">
      <div
        class="rounded-2xl aspect-video bg-gradient-to-b from-surface-base via-surface-raised to-surface-sunken"
      >
        <NuxtImg
          tabindex="-1"
          v-if="product.featuredImage?.url"
          :src="product.featuredImage.url"
          :alt="product.featuredImage.altText || product.title"
          class="w-full h-full object-contain transition-transform duration-500 hover:scale-110"
          loading="lazy"
        />
        <div v-else class="w-full h-full flex items-center justify-center text-text-tertiary">
          <Icon name="i-lucide-image" size="64" />
        </div>
      </div>
    </div>

    <!-- Product Info -->
    <div class="px-8 pb-8 flex flex-col flex-1">
      <!-- Product Title -->
      <h3 class="text-lg mb-1 text-left font-bold text-text-primary leading-tight" tabindex="-1">
        {{ product.title }}
      </h3>

      <!-- Product Description -->
      <p class="text-left text-text-secondary leading-relaxed line-clamp-2 mb-2">
        {{
          stripHtml(product.description) ||
          "Custom vinyl stickers with vibrant colors and durable finish."
        }}
      </p>

      <!-- Price -->
      <div class="py-4 flex-1">
        <p class="text-left font-bold text-lg text-text-primary">
          {{ formatPrice(product.priceRange.minVariantPrice.amount) }}
        </p>
      </div>

      <!-- Add to Cart Button -->
      <NuxtLink :to="`/products/${product.handle}`" class="block mt-auto">
        <Button
          tabindex="-1"
          variant="secondary"
          size="lg"
          :full-width="true"
          rounded="xl"
          icon-left="i-lucide-shopping-cart"
          left-icon-size="20"
          class="font-bold text-lg py-4 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Order Now
        </Button>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ShopifyProduct } from "~/composables/useShopify";

  interface Props {
    product: ShopifyProduct;
    compact?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    compact: false,
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
