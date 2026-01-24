/**
 * Shopify Initialization Plugin
 * Runs on app load to:
 * 1. Initialize/restore Shopify cart
 * 2. Fetch and cache products
 */

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig();
  const cartMode = config.public.cartMode;

  // Only run if in Shopify mode
  if (cartMode !== 'shopify') {
    console.log('📦 Running in mock cart mode');
    return;
  }

  console.log('🛍️ Initializing Shopify integration...');

  // Initialize cart
  const cart = useUnifiedCart();
  try {
    await cart.initCart();
    console.log('✅ Shopify cart initialized');
  } catch (error) {
    console.error('❌ Failed to initialize Shopify cart:', error);
  }

  // Fetch and cache products in the background
  const products = useShopifyProducts();
  try {
    await products.fetchProducts();
    console.log('✅ Shopify products loaded');
  } catch (error) {
    console.error('❌ Failed to load Shopify products:', error);
  }
});
