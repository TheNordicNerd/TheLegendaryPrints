<template>
  <NuxtLink
    :to="`/products/${product.handle}`"
    class="shopify-product-card group block bg-surface-raised rounded-lg border border-border-subtle overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-accent-500 hover:-translate-y-1"
  >
    <!-- Product Image -->
    <div class="relative aspect-square overflow-hidden bg-surface-sunken">
      <img
        v-if="product.featuredImage?.url"
        :src="product.featuredImage.url"
        :alt="product.featuredImage.altText || product.title"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center text-text-tertiary"
      >
        <Icon name="i-lucide-image" size="64" />
      </div>

      <!-- Badge for sale/new products (optional) -->
      <div v-if="showBadge" class="absolute top-3 right-3">
        <span
          class="px-3 py-1 text-xs font-bold rounded-full bg-accent-700 text-text-inverse shadow-md"
        >
          {{ badgeText }}
        </span>
      </div>
    </div>

    <!-- Product Info -->
    <div class="p-4 space-y-2">
      <!-- Product Title -->
      <h3 class="text-lg font-bold text-text-primary line-clamp-2 group-hover:text-accent-700 transition-colors">
        {{ product.title }}
      </h3>

      <!-- Product Description -->
      <p v-if="product.description" class="text-sm text-text-secondary line-clamp-2">
        {{ product.description }}
      </p>

      <!-- Price Range -->
      <div class="flex items-baseline gap-2 pt-2">
        <span class="text-2xl font-black text-accent-700">
          {{ formatPrice(product.priceRange.minVariantPrice.amount) }}
        </span>
        <span v-if="hasVariedPricing" class="text-sm text-text-tertiary">
          - {{ formatPrice(product.priceRange.maxVariantPrice.amount) }}
        </span>
      </div>

      <!-- Variant Count -->
      <p class="text-xs text-text-tertiary">
        {{ variantCount }} {{ variantCount === 1 ? 'option' : 'options' }} available
      </p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { ShopifyProduct } from '~/composables/useShopify';

interface Props {
  product: ShopifyProduct;
  showBadge?: boolean;
  badgeText?: string;
}

const props = defineProps<Props>();

const { formatPrice: shopifyFormatPrice } = useShopify();

// Format price
const formatPrice = (amount: string) => {
  return shopifyFormatPrice(amount, props.product.priceRange.minVariantPrice.currencyCode);
};

// Check if product has varied pricing
const hasVariedPricing = computed(() => {
  const min = parseFloat(props.product.priceRange.minVariantPrice.amount);
  const max = parseFloat(props.product.priceRange.maxVariantPrice.amount);
  return min !== max;
});

// Count variants
const variantCount = computed(() => {
  return props.product.variants.edges.length;
});
</script>

<style scoped>
.shopify-product-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.shopify-product-card:focus-visible {
  outline: 2px solid var(--color-accent-700);
  outline-offset: 2px;
}

/* Text truncation */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .shopify-product-card,
  .shopify-product-card img {
    transition-duration: 0.01ms !important;
  }

  .shopify-product-card:hover {
    transform: none !important;
  }
}
</style>
