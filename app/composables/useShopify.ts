/**
 * Shopify Composable
 * Provides easy access to Shopify Storefront API from components
 */

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  vendor: string;
  productType: string;
  tags: string[];
  availableForSale: boolean;
  totalInventory: number;
  featuredImage: {
    id: string;
    url: string;
    altText: string;
    width: number;
    height: number;
  };
  images: {
    edges: Array<{
      node: {
        id: string;
        url: string;
        altText: string;
        width: number;
        height: number;
      };
    }>;
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  variants: {
    edges: Array<{
      node: ShopifyVariant;
    }>;
  };
}

export interface ShopifyVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number;
  price: {
    amount: string;
    currencyCode: string;
  };
  compareAtPrice?: {
    amount: string;
    currencyCode: string;
  };
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
  image?: {
    id: string;
    url: string;
    altText: string;
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: {
      amount: string;
      currencyCode: string;
    };
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
    totalTaxAmount?: {
      amount: string;
      currencyCode: string;
    };
  };
  lines: {
    edges: Array<{
      node: {
        id: string;
        quantity: number;
        attributes: Array<{
          key: string;
          value: string;
        }>;
        cost: {
          totalAmount: {
            amount: string;
            currencyCode: string;
          };
        };
        merchandise: ShopifyVariant & {
          product: {
            id: string;
            handle: string;
            title: string;
            featuredImage: {
              url: string;
              altText: string;
            };
          };
        };
      };
    }>;
  };
}

export const useShopify = () => {
  /**
   * Fetch all products
   */
  const getProducts = async (options?: {
    limit?: number;
    query?: string;
    sortKey?: string;
    reverse?: boolean;
  }) => {
    const params = new URLSearchParams();
    if (options?.limit) params.append("limit", options.limit.toString());
    if (options?.query) params.append("query", options.query);
    if (options?.sortKey) params.append("sortKey", options.sortKey);
    if (options?.reverse) params.append("reverse", "true");

    const data = await $fetch<{
      products: ShopifyProduct[];
      count: number;
    }>(`/api/shopify/products?${params.toString()}`);

    return data;
  };

  /**
   * Fetch single product by handle
   */
  const getProduct = async (handle: string) => {
    const data = await $fetch<ShopifyProduct>(`/api/shopify/products/${handle}`);
    return data;
  };

  /**
   * Create a new cart
   */
  const createCart = async (lines?: Array<{ merchandiseId: string; quantity: number }>) => {
    const data = await $fetch<ShopifyCart>("/api/shopify/cart/create", {
      method: "POST",
      body: { lines: lines || [] },
    });
    return data;
  };

  /**
   * Get cart by ID
   */
  const getCart = async (cartId: string) => {
    const data = await $fetch<ShopifyCart>('/api/shopify/cart/get', {
      method: 'POST',
      body: { cartId },
    });
    return data;
  };

  /**
   * Add items to cart
   */
  const addToCart = async (
    cartId: string,
    lines: Array<{
      merchandiseId: string;
      quantity: number;
      attributes?: Array<{ key: string; value: string }>;
    }>,
  ) => {
    const data = await $fetch<ShopifyCart>("/api/shopify/cart/add-lines", {
      method: "POST",
      body: { cartId, lines },
    });
    return data;
  };

  /**
   * Update cart line quantities
   */
  const updateCartLines = async (
    cartId: string,
    lines: Array<{ id: string; quantity: number }>,
  ) => {
    const data = await $fetch<ShopifyCart>("/api/shopify/cart/update-lines", {
      method: "POST",
      body: { cartId, lines },
    });
    return data;
  };

  /**
   * Remove items from cart
   */
  const removeFromCart = async (cartId: string, lineIds: string[]) => {
    const data = await $fetch<ShopifyCart>("/api/shopify/cart/remove-lines", {
      method: "POST",
      body: { cartId, lineIds },
    });
    return data;
  };

  /**
   * Fetch products from a collection
   */
  const getCollectionProducts = async (collectionHandle: string, options?: { limit?: number }) => {
    const params = new URLSearchParams();
    if (options?.limit) params.append("limit", options.limit.toString());

    const data = await $fetch<{
      collection: {
        id: string;
        title: string;
        handle: string;
        description: string;
      };
      products: ShopifyProduct[];
      count: number;
    }>(`/api/shopify/collections/${collectionHandle}/products?${params.toString()}`);

    return data;
  };

  /**
   * Format price for display
   */
  const formatPrice = (amount: string, currencyCode: string = "USD") => {
    const price = parseFloat(amount);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    }).format(price);
  };

  return {
    getProducts,
    getProduct,
    getCollectionProducts,
    createCart,
    getCart,
    addToCart,
    updateCartLines,
    removeFromCart,
    formatPrice,
  };
};
