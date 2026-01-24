/**
 * Products Data
 *
 * Product catalog for The Legendary Prints
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
  // Shopify integration (optional - for when using Shopify mode)
  shopifyProductId?: string;
  shopifyVariants?: {
    size: number;
    material: string;
    variantId: string; // Shopify variant ID like gid://shopify/ProductVariant/123456
  }[];
}

export const products: Product[] = [
  {
    id: "die-cut-stickers",
    name: "Die Cut Stickers",
    slug: "die-cut-stickers",
    description: "Custom die-cut stickers with precise cuts following your design's shape.",
    icon: "i-lucide-sticker",
    category: "die-cut",
    tags: ["custom-shape", "precision-cut", "popular"],
    thumbnailImg:
      "https://images.unsplash.com/photo-1484256017452-47f3e80eae7c?q=80&w=4170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    images: [
      "https://images.unsplash.com/photo-1484256017452-47f3e80eae7c?q=80&w=4170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.pexels.com/photos/9381081/pexels-photo-9381081.jpeg",
      "https://images.pexels.com/photos/16896038/pexels-photo-16896038.jpeg",
      "https://images.pexels.com/photos/19919391/pexels-photo-19919391.jpeg",
    ],
    featured: true,
  },
  {
    id: "kiss-cut-stickers",
    name: "Kiss Cut Stickers",
    slug: "kiss-cut-stickers",
    description: "Kiss cut stickers with backing that's easy to peel and apply.",
    icon: "i-lucide-scissors",
    category: "kiss-cut",
    tags: ["easy-peel", "with-backing", "popular"],
    thumbnailImg: "https://images.pexels.com/photos/9381081/pexels-photo-9381081.jpeg",
    images: [
      "https://images.pexels.com/photos/9381081/pexels-photo-9381081.jpeg",
      "https://images.pexels.com/photos/16896038/pexels-photo-16896038.jpeg",
      "https://images.unsplash.com/photo-1484256017452-47f3e80eae7c?q=80&w=4170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.pexels.com/photos/19919391/pexels-photo-19919391.jpeg",
    ],
    featured: true,
  },
  {
    id: "circle-stickers",
    name: "Circle Stickers",
    slug: "circle-stickers",
    description: "Durable circle stickers perfect for indoor and outdoor use.",
    icon: "i-lucide-circle",
    category: "shapes",
    tags: ["circular", "weather-resistant", "durable"],
    thumbnailImg: "https://images.pexels.com/photos/16896038/pexels-photo-16896038.jpeg",
    images: [
      "https://images.pexels.com/photos/16896038/pexels-photo-16896038.jpeg",
      "https://images.pexels.com/photos/19919391/pexels-photo-19919391.jpeg",
      "https://images.pexels.com/photos/9381081/pexels-photo-9381081.jpeg",
      "https://images.unsplash.com/photo-1484256017452-47f3e80eae7c?q=80&w=4170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    featured: true,
  },
  {
    id: "round-stickers",
    name: "Round Stickers",
    slug: "round-stickers",
    description: "Premium round stickers perfect for branding and labels. Waterproof and durable.",
    icon: "i-lucide-circle-dot",
    category: "shapes",
    tags: ["circular", "round", "weather-resistant"],
    thumbnailImg: "https://images.pexels.com/photos/16896038/pexels-photo-16896038.jpeg",
    images: [
      "https://images.pexels.com/photos/16896038/pexels-photo-16896038.jpeg",
      "https://images.pexels.com/photos/19919391/pexels-photo-19919391.jpeg",
      "https://images.pexels.com/photos/9381081/pexels-photo-9381081.jpeg",
      "https://images.unsplash.com/photo-1484256017452-47f3e80eae7c?q=80&w=4170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    featured: true,
  },
  {
    id: "sticker-sheets",
    name: "Sticker Sheets",
    slug: "sticker-sheets",
    description: "Premium Sticker Sheets for any surface or application.",
    icon: "i-lucide-palette",
    category: "sheets",
    tags: ["multi-pack", "sheets", "bulk"],
    thumbnailImg: "https://images.pexels.com/photos/19919391/pexels-photo-19919391.jpeg",
    images: [
      "https://images.pexels.com/photos/19919391/pexels-photo-19919391.jpeg",
      "https://images.unsplash.com/photo-1484256017452-47f3e80eae7c?q=80&w=4170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.pexels.com/photos/9381081/pexels-photo-9381081.jpeg",
      "https://images.pexels.com/photos/16896038/pexels-photo-16896038.jpeg",
    ],
    featured: true,
  },
];

/**
 * Get a product by slug
 */
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

/**
 * Get featured products
 */
export function getFeaturedProducts(): Product[] {
  return products.filter((product) => product.featured);
}
