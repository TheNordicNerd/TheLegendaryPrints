/**
 * Unified Cart Composable
 * Switches between mock cart and Shopify cart based on environment configuration
 */

export const useUnifiedCart = () => {
  const config = useRuntimeConfig();
  const cartMode = config.public.cartMode || 'mock';

  // Get appropriate cart system
  const mockCart = useCart();
  const shopifyCart = useShopifyCartStore();

  const isShopifyMode = cartMode === 'shopify';

  return {
    // Mode info
    cartMode,
    isShopifyMode,

    // State - returns appropriate cart state based on mode
    items: computed(() => {
      if (isShopifyMode) {
        return shopifyCart.items;
      }
      return mockCart.items.value;
    }),

    itemCount: computed(() => {
      if (isShopifyMode) {
        return shopifyCart.itemCount;
      }
      return mockCart.itemCount.value;
    }),

    totalQuantity: computed(() => {
      if (isShopifyMode) {
        return shopifyCart.totalQuantity;
      }
      return mockCart.totalQuantity.value;
    }),

    totalPrice: computed(() => {
      if (isShopifyMode) {
        return shopifyCart.total;
      }
      return mockCart.totalPrice.value;
    }),

    formattedTotalPrice: computed(() => {
      if (isShopifyMode) {
        return shopifyCart.formattedTotal;
      }
      return mockCart.formattedTotalPrice.value;
    }),

    isEmpty: computed(() => {
      if (isShopifyMode) {
        return shopifyCart.isEmpty;
      }
      return mockCart.isEmpty.value;
    }),

    isLoading: computed(() => {
      if (isShopifyMode) {
        return shopifyCart.isLoading;
      }
      return false;
    }),

    error: computed(() => {
      if (isShopifyMode) {
        return shopifyCart.error;
      }
      return null;
    }),

    checkoutUrl: computed(() => {
      if (isShopifyMode) {
        return shopifyCart.checkoutUrl;
      }
      return null;
    }),

    // Actions - delegates to appropriate cart system
    async addItem(data: {
      productId?: string;
      productName?: string;
      productSlug?: string;
      merchandiseId?: string;
      size?: number;
      material?: string;
      quantity: number;
      pricePerUnit?: number;
      totalPrice?: number;
      customSize?: number;
      customQuantity?: number;
      uploadedImage?: string;
      uploadedFileName?: string;
      customPrice?: string;
      customPricePerUnit?: string;
      attributes?: Array<{ key: string; value: string }>; // Shopify cart line attributes
    }) {
      if (isShopifyMode) {
        // Shopify mode - requires merchandiseId
        if (!data.merchandiseId) {
          throw new Error('merchandiseId is required for Shopify mode');
        }

        // Build attributes array for Shopify
        const attributes = data.attributes || [];

        // Add custom image URL if provided
        if (data.uploadedImage) {
          attributes.push({ key: 'Custom Design URL', value: data.uploadedImage });
        }
        if (data.uploadedFileName) {
          attributes.push({ key: 'Design Filename', value: data.uploadedFileName });
        }
        if (data.customSize) {
          attributes.push({ key: 'Custom Size', value: `${data.customSize}"` });
        }
        if (data.customQuantity) {
          attributes.push({ key: 'Custom Quantity', value: data.customQuantity.toString() });
        }
        if (data.customPrice) {
          attributes.push({ key: 'Custom Price', value: data.customPrice });
        }
        if (data.customPricePerUnit) {
          attributes.push({ key: 'Custom Price Per Unit', value: data.customPricePerUnit });
        }

        // Add to Shopify cart with attributes
        await shopifyCart.addItem(data.merchandiseId, data.quantity, attributes);
      } else {
        // Mock mode - requires full product details
        if (!data.productId || !data.productName || !data.productSlug) {
          throw new Error('Product details are required for mock mode');
        }
        mockCart.addToCart(
          data.productId,
          data.productName,
          data.productSlug,
          data.size || 0,
          data.material || '',
          data.quantity,
          data.pricePerUnit || 0,
          data.totalPrice || 0,
          {
            customSize: data.customSize,
            customQuantity: data.customQuantity,
            uploadedImage: data.uploadedImage,
            uploadedFileName: data.uploadedFileName,
          }
        );
      }
    },

    async removeItem(id: string) {
      if (isShopifyMode) {
        await shopifyCart.removeItem(id);
      } else {
        mockCart.removeFromCart(id);
      }
    },

    async updateQuantity(id: string, quantity: number, customQuantity?: number) {
      if (isShopifyMode) {
        await shopifyCart.updateQuantity(id, quantity);
      } else {
        mockCart.updateQuantity(id, quantity, customQuantity);
      }
    },

    async clearCart() {
      if (isShopifyMode) {
        await shopifyCart.clearCart();
      } else {
        mockCart.clearCart();
      }
    },

    async initCart() {
      if (isShopifyMode) {
        await shopifyCart.initCart();
      }
      // Mock cart doesn't need initialization
    },

    async refreshCart() {
      if (isShopifyMode) {
        await shopifyCart.refreshCart();
      }
      // Mock cart doesn't need refresh
    },
  };
};
