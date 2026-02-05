/**
 * Custom Design Product Mapping
 *
 * Maps Material + Shape combinations to Shopify product handles
 * Each combination corresponds to a specific product in Shopify
 */

export interface ProductMapping {
  material: string;
  shape: string;
  productHandle: string;
  displayName: string;
}

/**
 * Product mapping for all Material + Shape combinations
 * Update these handles to match your actual Shopify product handles
 */
export const productMappings: ProductMapping[] = [
  // White Vinyl variants
  {
    material: "White Vinyl",
    shape: "Round",
    productHandle: "white-vinyl-stickers-round",
    displayName: "Custom White Vinyl Round Stickers",
  },
  {
    material: "White Vinyl",
    shape: "Square",
    productHandle: "white-vinyl-stickers-square",
    displayName: "Custom White Vinyl Square Stickers",
  },
  {
    material: "White Vinyl",
    shape: "Die-Cut",
    productHandle: "white-vinyl-stickers-die-cut",
    displayName: "Custom White Vinyl Die-Cut Stickers",
  },
  {
    material: "White Vinyl",
    shape: "Kiss-Cut",
    productHandle: "white-vinyl-stickers-kiss-cut",
    displayName: "Custom White Vinyl Kiss-Cut Stickers",
  },

  // Holographic variants
  {
    material: "Holographic",
    shape: "Round",
    productHandle: "holographic-stickers-round",
    displayName: "Custom Holographic Round Stickers",
  },
  {
    material: "Holographic",
    shape: "Square",
    productHandle: "holographic-stickers-square",
    displayName: "Custom Holographic Square Stickers",
  },
  {
    material: "Holographic",
    shape: "Die-Cut",
    productHandle: "holographic-stickers-die-cut",
    displayName: "Custom Holographic Die-Cut Stickers",
  },
  {
    material: "Holographic",
    shape: "Kiss-Cut",
    productHandle: "holographic-stickers-kiss-cut",
    displayName: "Custom Holographic Kiss-Cut Stickers",
  },

  // Clear variants
  {
    material: "Clear",
    shape: "Round",
    productHandle: "clear-stickers-round",
    displayName: "Custom Clear Round Stickers",
  },
  {
    material: "Clear",
    shape: "Square",
    productHandle: "clear-stickers-square",
    displayName: "Custom Clear Square Stickers",
  },
  {
    material: "Clear",
    shape: "Die-Cut",
    productHandle: "clear-stickers-die-cut",
    displayName: "Custom Clear Die-Cut Stickers",
  },
  {
    material: "Clear",
    shape: "Kiss-Cut",
    productHandle: "clear-stickers-kiss-cut",
    displayName: "Custom Clear Kiss-Cut Stickers",
  },
];

/**
 * Get product handle for a Material + Shape combination
 */
export const getProductHandle = (material: string, shape: string): string | null => {
  const mapping = productMappings.find((m) => m.material === material && m.shape === shape);
  return mapping?.productHandle || null;
};

/**
 * Get display name for a Material + Shape combination
 */
export const getProductDisplayName = (material: string, shape: string): string => {
  const mapping = productMappings.find((m) => m.material === material && m.shape === shape);
  return mapping?.displayName || `Custom ${material} ${shape} Stickers`;
};

/**
 * Get all available materials
 */
export const getAvailableMaterials = (): string[] => {
  return [...new Set(productMappings.map((m) => m.material))];
};

/**
 * Get all available shapes
 */
export const getAvailableShapes = (): string[] => {
  return [...new Set(productMappings.map((m) => m.shape))];
};

/**
 * Check if a Material + Shape combination exists
 */
export const isValidCombination = (material: string, shape: string): boolean => {
  return productMappings.some((m) => m.material === material && m.shape === shape);
};
