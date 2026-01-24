/**
 * Product Type Definitions
 */

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  featured?: boolean;
  thumbnailImg: string;
  images?: string[];
  category: "die-cut" | "kiss-cut" | "shapes" | "sheets";
  tags: string[];
  // Shopify integration
  shopifyProductId?: string;
  shopifyVariants?: {
    size: number;
    material: string;
    variantId: string; // Shopify variant ID like gid://shopify/ProductVariant/123456
  }[];
}
