<template>
  <div
    class="shopify-product-card bg-surface-raised rounded-3xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 max-w-md mx-auto"
  >
    <!-- Product Image -->
    <div class="relative overflow-hidden p-8">
      <div
        class="rounded-2xl aspect-video bg-gradient-to-b from-surface-base via-surface-raised to-surface-sunken"
      >
        <NuxtImg
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
    <div class="px-8 pb-8">
      <!-- Product Title -->
      <h3 class="text-lg mb-1 text-left font-bold text-text-primary leading-tight">
        {{ product.title }}
      </h3>

      <!-- Product Description -->
      <p class="text-left text-text-secondary leading-relaxed line-clamp-2">
        {{
          stripHtml(product.description) ||
          "Custom vinyl stickers with vibrant colors and durable finish."
        }}
      </p>

      <!-- Price -->
      <div class="py-4">
        <p class="text-left font-bold text-lg text-text-primary">
          {{ formatPrice(product.priceRange.minVariantPrice.amount) }}
        </p>
      </div>

      <!-- Add to Cart Button -->
      <NuxtLink :to="`/products/${product.handle}`" class="block">
        <Button
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
  }

  const props = defineProps<Props>();

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
  .shopify-product-card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
