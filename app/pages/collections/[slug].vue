<template>
  <Section inner-classes="p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Collection Header -->
      <div v-if="collection" class="mb-8">
        <h1 class="text-4xl font-bold mb-4 text-text-primary">{{ collection.title }}</h1>
        <p v-if="collection.description" class="text-lg text-text-secondary max-w-3xl">
          {{ collection.description }}
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12" role="status" aria-live="polite">
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent-700 border-t-transparent"
          aria-hidden="true"
        ></div>
        <p class="mt-4 text-text-secondary">Loading products...</p>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="bg-error-50 border border-error-500 text-error-900 px-6 py-4 rounded-lg"
        role="alert"
      >
        <div class="flex items-center gap-3">
          <Icon name="i-lucide-alert-circle" size="24" />
          <div>
            <strong class="font-bold">Error:</strong>
            <span class="block sm:inline ml-2">{{ error }}</span>
          </div>
        </div>
      </div>

      <!-- Products Grid -->
      <div v-else-if="products.length > 0">
        <div class="mb-4 text-sm text-text-secondary">
          Showing {{ products.length }} {{ products.length === 1 ? "product" : "products" }}
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ShopifyProductCard v-for="product in products" :key="product.id" :product="product" />
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <Icon name="i-lucide-package-x" size="64" class="text-text-tertiary mx-auto mb-4" />
        <h2 class="text-2xl font-bold text-text-primary mb-2">No Products Found</h2>
        <p class="text-text-secondary">This collection doesn't have any products yet.</p>
      </div>
    </div>
  </Section>
</template>

<script setup lang="ts">
  import type { ShopifyProduct } from "~/composables/useShopify";

  const route = useRoute();
  const slug = route.params.slug as string;

  const { getCollectionProducts } = useShopify();

  const products = ref<ShopifyProduct[]>([]);
  const collection = ref<any>(null);
  const loading = ref(true);
  const error = ref<string | null>(null);

  onMounted(async () => {
    try {
      const result = await getCollectionProducts(slug, { limit: 50 });

      if (result) {
        collection.value = result.collection;
        products.value = result.products;
      }
    } catch (err: any) {
      console.error("Error loading collection:", err);
      error.value = err.message || "Failed to load collection";
    } finally {
      loading.value = false;
    }
  });

  // SEO Meta Tags
  useSeoMeta({
    title: () => `${collection.value?.title || "Collection"} - The Legendary Prints`,
    description: () => collection.value?.description || "Browse our custom sticker collection",
    ogTitle: () => collection.value?.title || "Collection",
    ogDescription: () => collection.value?.description || "Browse our custom sticker collection",
    ogType: "website",
  });
</script>

<style scoped></style>
