<template>
  <Section inner-classes="p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold mb-6">Shopify API Test</h1>

      <div v-if="loading" class="text-lg">Loading products from Shopify...</div>

      <div
        v-else-if="error"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
      >
        <strong>Error:</strong> {{ error }}
      </div>

      <div v-else class="space-y-4">
        <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <strong>Success!</strong> Found {{ products?.length || 0 }} products
        </div>

        <div class="bg-blue-50 border border-blue-200 p-4 rounded">
          <p class="font-bold mb-2">
            Check your browser console (F12) to see the full product data!
          </p>
          <p class="text-sm text-gray-600">
            Open Developer Tools → Console tab to see detailed product information including variant
            IDs.
          </p>
        </div>

        <div class="space-y-4">
          <h2 class="text-2xl font-bold">Products:</h2>
          <div
            v-for="product in products"
            :key="product.id"
            class="border rounded-lg p-4 bg-white shadow"
          >
            <h3 class="text-xl font-bold">{{ product.title }}</h3>
            <p class="text-sm text-gray-600 mb-2">Handle: {{ product.handle }}</p>
            <p class="text-sm text-gray-600 mb-2">ID: {{ product.id }}</p>

            <div class="mt-4">
              <p class="font-semibold mb-2">Variants ({{ product.variants.edges.length }}):</p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div
                  v-for="variant in product.variants.edges"
                  :key="variant.node.id"
                  class="text-sm bg-gray-50 p-2 rounded"
                >
                  <p class="font-medium">{{ variant.node.title }}</p>
                  <p class="text-xs text-gray-500 break-all">{{ variant.node.id }}</p>
                  <p class="text-xs">Price: ${{ variant.node.price.amount }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Section>
</template>

<script setup lang="ts">
const { getProducts } = useShopify();

const products = ref<any[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    const result = await getProducts({ limit: 50 });

    if (result?.products) {
      products.value = result.products;

      // Log product data to console for inspection
      console.log('✅ Loaded', result.products.length, 'products from Shopify');
      result.products.forEach((product: any, index: number) => {
        console.log(`\n${index + 1}. ${product.title} (${product.handle})`);
        console.log('   Product ID:', product.id);
        console.log('   Variants:');
        product.variants.edges.forEach((variant: any) => {
          console.log(`   - ${variant.node.title}: ${variant.node.id}`);
          console.log(`     $${variant.node.price.amount} ${variant.node.price.currencyCode}`);
        });
      });
    } else {
      throw new Error('No products found in response');
    }
  } catch (err: any) {
    console.error('Shopify API Error:', err);
    error.value = err.message || 'Failed to fetch products';
  } finally {
    loading.value = false;
  }
});

// SEO
useSeoMeta({
  title: 'Shopify API Test',
  robots: 'noindex, nofollow',
});
</script>
