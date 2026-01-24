/**
 * Shopify Variant Mapping Utilities
 * Helps map product options (size, material) to Shopify variant IDs
 */

import type { Product } from '~/types/product';

/**
 * Get Shopify variant ID based on product options
 */
export function getShopifyVariantId(
  product: Product,
  size: number,
  material: string
): string | null {
  if (!product.shopifyVariants || product.shopifyVariants.length === 0) {
    console.warn(`Product ${product.slug} has no Shopify variants configured`);
    return null;
  }

  // Find matching variant
  const variant = product.shopifyVariants.find(
    (v) => v.size === size && v.material.toLowerCase() === material.toLowerCase()
  );

  if (!variant) {
    console.warn(
      `No Shopify variant found for ${product.slug} with size ${size} and material ${material}`
    );
    return null;
  }

  return variant.variantId;
}

/**
 * Check if product has Shopify variants configured
 */
export function hasShopifyVariants(product: Product): boolean {
  return !!(product.shopifyVariants && product.shopifyVariants.length > 0);
}

/**
 * Get default Shopify variant (first one)
 */
export function getDefaultShopifyVariant(product: Product): string | null {
  if (!product.shopifyVariants || product.shopifyVariants.length === 0) {
    return null;
  }
  return product.shopifyVariants[0].variantId;
}
