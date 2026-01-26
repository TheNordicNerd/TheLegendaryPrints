<template>
  <Section inner-classes="text-center" outer-classes="py-12 md:py-24 bg-surface-sunken">
    <SectionHeader
      title="Check Out Our Best Sellers"
      description="Choose from some of the top products others are looking at."
    ></SectionHeader>
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 sm:px-8 lg:px-12"
      role="list"
    >
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        variant="hero"
        :show-tags="false"
        :image-quality="70"
      />
    </div>
  </Section>
</template>

<script setup lang="ts">
  import type { ShopifyProduct } from "~/composables/useShopify";
  import type { Product } from "~/types/product";

  const { fetchProducts, getCachedProducts } = useShopifyProducts();
  const shopifyProducts = ref<ShopifyProduct[]>([]);

  // Try to get cached products first
  if (import.meta.client) {
    const cached = getCachedProducts();
    if (cached) {
      shopifyProducts.value = cached;
    }
  }

  // Fetch fresh products on mount
  onMounted(async () => {
    try {
      const fetchedProducts = await fetchProducts(4);
      shopifyProducts.value = fetchedProducts;
    } catch (error) {
      // Silently fail - products will remain empty array
    }
  });

  // Transform Shopify products to match local Product interface
  const products = computed<Product[]>(() => {
    return shopifyProducts.value.map((shopifyProduct) => ({
      id: shopifyProduct.id,
      name: shopifyProduct.title,
      slug: shopifyProduct.handle,
      description: shopifyProduct.description,
      icon: "i-lucide-sticker",
      featured: true,
      thumbnailImg: shopifyProduct.featuredImage?.url || "",
      images: shopifyProduct.images?.edges.map((e) => e.node.url) || [],
      category: "die-cut" as const,
      tags: shopifyProduct.tags || [],
      shopifyProductId: shopifyProduct.id,
    }));
  });
</script>

<style scoped></style>
