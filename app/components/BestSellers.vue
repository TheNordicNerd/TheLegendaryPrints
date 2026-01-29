<template>
  <Section inner-classes="text-center" outer-classes="py-12 md:py-24 bg-surface-sunken">
    <div class="max-w-7xl mx-auto">
      <SectionHeader
        title="Check Out Our Best Sellers"
        description="Choose from some of the top products others are looking at."
        show-more-button
      ></SectionHeader>

      <!-- Mobile: Compact cards in 2 columns (more products visible) -->
      <div class="grid grid-cols-2 gap-2 px-3 sm:gap-3 sm:px-4 md:hidden">
        <ShopifyProductCard
          v-for="product in shopifyProducts"
          :key="product.id"
          :product="product"
          compact
        />
      </div>

      <!-- Desktop: Full cards -->
      <div class="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 sm:px-0">
        <ShopifyProductCard
          v-for="product in shopifyProducts"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
  </Section>
</template>

<script setup lang="ts">
  import type { ShopifyProduct } from "~/composables/useShopify";

  const { fetchProductsFromCollection } = useShopifyProducts();
  const shopifyProducts = ref<ShopifyProduct[]>([]);

  // Fetch products from "best-sellers" collection on mount
  onMounted(async () => {
    try {
      const fetchedProducts = await fetchProductsFromCollection("best-sellers", 4);

      shopifyProducts.value = fetchedProducts.filter((product) => product.title !== "SAMPLE PACK");
    } catch (error) {
      // Silently fail - products will remain empty array
    }
  });
</script>

<style scoped></style>
