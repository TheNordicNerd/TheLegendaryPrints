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
  import { getFeaturedProducts } from "~/data/products";

  const products = getFeaturedProducts();
</script>

<style scoped></style>
