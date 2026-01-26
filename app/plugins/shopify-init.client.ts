/**
 * Shopify Initialization Plugin
 * Runs on app load to:
 * 1. Initialize/restore Shopify cart
 * 2. Fetch and cache products
 */

export default defineNuxtPlugin(async () => {
  // Initialize cart
  const cart = useUnifiedCart();
  try {
    await cart.initCart();
  } catch (error) {
    console.error("❌ Failed to initialize Shopify cart:", error);
  }

  // Fetch and cache products in the background
  const products = useShopifyProducts();
  try {
    await products.fetchProducts();
  } catch (error) {
    console.error("❌ Failed to load Shopify products:", error);
  }
});
