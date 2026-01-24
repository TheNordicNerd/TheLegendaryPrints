/**
 * Prerender Plugin
 * Dynamically generates routes for Shopify products to be prerendered
 */

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('prerender:generate', async (route) => {
    // Only run during build/prerender
    if (process.env.NODE_ENV !== 'production' && !process.env.PRERENDER) return;

    console.log('🔍 Fetching Shopify products for prerendering...');

    try {
      // Fetch products from Shopify collection
      const collectionHandle = 'custom-stickers'; // Your collection
      const url = `/api/shopify/collections/${collectionHandle}/products`;

      const response = await $fetch(url);
      const products = response.products || [];

      console.log(`✅ Found ${products.length} products to prerender`);

      // Generate routes for each product
      const productRoutes = products.map((product: any) => `/products/${product.handle}`);

      return productRoutes;
    } catch (error: any) {
      console.error('❌ Failed to fetch products for prerendering:', error.message);
      return [];
    }
  });
});
