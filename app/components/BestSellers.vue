<template>
  <Section inner-classes="text-center" outer-classes="py-12 md:py-24 bg-surface-sunken">
    <SectionHeader
      title="Check Out Our Best Sellers"
      description="Choose from some of the top products others are looking at."
      show-more-button
    ></SectionHeader>
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 sm:px-8 lg:px-12"
    >
      <ShopifyProductCard v-for="product in shopifyProducts" :key="product.id" :product="product" />
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
      const fetchedProducts = await fetchProductsFromCollection("best-sellers", 3);

      shopifyProducts.value = fetchedProducts.filter((product) => product.title !== "SAMPLE PACK");
    } catch (error) {
      // Silently fail - products will remain empty array
    }
  });
</script>

<style scoped></style>
