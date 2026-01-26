/**
 * Shopify Products Composable
 * Handles fetching, caching, and syncing products from Shopify
 */

import type { ShopifyProduct } from "./useShopify";

export const useShopifyProducts = () => {
  const { getProducts, getProduct } = useShopify();

  // Cache products in localStorage
  const CACHE_KEY = "shopify_products_cache_v3"; // Changed cache key to force refresh with collection
  const CACHE_DURATION = 1000 * 60 * 60; // 1 hour
  const COLLECTION_HANDLE = "custom-stickers"; // Default collection to fetch from

  interface CachedProducts {
    products: ShopifyProduct[];
    timestamp: number;
  }

  /**
   * Get cached products from localStorage
   */
  const getCachedProducts = (): ShopifyProduct[] | null => {
    if (typeof window === "undefined") return null;

    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const data: CachedProducts = JSON.parse(cached);
      const now = Date.now();

      // Check if cache is expired
      if (now - data.timestamp > CACHE_DURATION) {
        localStorage.removeItem(CACHE_KEY);
        return null;
      }

      return data.products;
    } catch (error) {
      console.error("Failed to get cached products:", error);
      return null;
    }
  };

  /**
   * Cache products in localStorage
   */
  const cacheProducts = (products: ShopifyProduct[]) => {
    if (typeof window === "undefined") return;

    try {
      const data: CachedProducts = {
        products,
        timestamp: Date.now(),
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to cache products:", error);
    }
  };

  /**
   * Fetch all products from Shopify with caching
   */
  const fetchProducts = async (limit = 50, forceRefresh = false): Promise<ShopifyProduct[]> => {
    // Try to get cached products first
    if (!forceRefresh) {
      const cached = getCachedProducts();
      if (cached) {
        return cached;
      }
    }

    // Fetch from Shopify collection
    const data = await $fetch<{
      collection: any;
      products: ShopifyProduct[];
      count: number;
    }>(`/api/shopify/collections/${COLLECTION_HANDLE}/products?limit=${limit}`);

    if (data?.products) {
      // Cache the products
      cacheProducts(data.products);
      return data.products;
    }

    return [];
  };

  /**
   * Fetch a single product by handle
   */
  const fetchProductByHandle = async (handle: string): Promise<ShopifyProduct | null> => {
    try {
      // First try to get from cache
      const cached = getCachedProducts();
      if (cached) {
        const product = cached.find((p) => p.handle === handle);
        if (product) {
          return product;
        }
      }

      // Fetch from Shopify
      const product = await getProduct(handle);
      return product;
    } catch (error) {
      console.error("Failed to fetch product:", handle, error);
      return null;
    }
  };

  /**
   * Map Shopify variants to size options
   * Extract size from variant title (e.g., "1 inch", "2 inch", etc.)
   */
  const getVariantSizes = (product: ShopifyProduct): number[] => {
    const sizes = new Set<number>();

    product.variants.edges.forEach((edge) => {
      const title = edge.node.title.toLowerCase();

      // Extract size from variant title
      // Matches patterns like: "1 inch", "1\"", "1 in", "1-inch"
      const sizeMatch = title.match(/(\d+(?:\.\d+)?)\s*(?:inch|in|"|')/i);

      if (sizeMatch) {
        const size = parseFloat(sizeMatch[1]);
        sizes.add(size);
      }
    });

    return Array.from(sizes).sort((a, b) => a - b);
  };

  /**
   * Get variant ID for a specific size
   */
  const getVariantIdBySize = (product: ShopifyProduct, size: number): string | null => {
    const variant = product.variants.edges.find((edge) => {
      const title = edge.node.title.toLowerCase();
      const sizeMatch = title.match(/(\d+(?:\.\d+)?)\s*(?:inch|in|"|')/i);

      if (sizeMatch) {
        const variantSize = parseFloat(sizeMatch[1]);
        return variantSize === size;
      }

      return false;
    });

    return variant?.node.id || null;
  };

  /**
   * Get base price for a size from Shopify variant
   */
  const getVariantPrice = (product: ShopifyProduct, size: number): number | null => {
    const variant = product.variants.edges.find((edge) => {
      const title = edge.node.title.toLowerCase();
      const sizeMatch = title.match(/(\d+(?:\.\d+)?)\s*(?:inch|in|"|')/i);

      if (sizeMatch) {
        const variantSize = parseFloat(sizeMatch[1]);
        return variantSize === size;
      }

      return false;
    });

    if (variant) {
      return parseFloat(variant.node.price.amount);
    }

    return null;
  };

  /**
   * Clear product cache
   */
  const clearCache = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(CACHE_KEY);
  };

  return {
    fetchProducts,
    fetchProductByHandle,
    getVariantSizes,
    getVariantIdBySize,
    getVariantPrice,
    getCachedProducts,
    clearCache,
  };
};
