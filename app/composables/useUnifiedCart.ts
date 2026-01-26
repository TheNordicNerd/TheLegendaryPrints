/**
 * Unified Cart Composable
 * Now exclusively uses Shopify cart
 */

export const useUnifiedCart = () => {
  const shopifyCart = useShopifyCartStore();

  return {
    // State - direct access to Shopify cart
    items: computed(() => shopifyCart.items),
    itemCount: computed(() => shopifyCart.itemCount),
    totalQuantity: computed(() => shopifyCart.totalQuantity),
    totalPrice: computed(() => shopifyCart.total),
    formattedTotalPrice: computed(() => shopifyCart.formattedTotal),
    isEmpty: computed(() => shopifyCart.isEmpty),
    isLoading: computed(() => shopifyCart.isLoading),
    error: computed(() => shopifyCart.error),
    checkoutUrl: computed(() => shopifyCart.checkoutUrl),

    // Actions - direct delegation to Shopify cart
    async addItem(data: {
      merchandiseId: string;
      quantity: number;
      uploadedImage?: string;
      uploadedFileName?: string;
      customSize?: number;
      customQuantity?: number;
      customPrice?: string;
      customPricePerUnit?: string;
      attributes?: Array<{ key: string; value: string }>;
    }) {
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
    },

    async removeItem(id: string) {
      await shopifyCart.removeItem(id);
    },

    async updateQuantity(id: string, quantity: number) {
      await shopifyCart.updateQuantity(id, quantity);
    },

    async clearCart() {
      await shopifyCart.clearCart();
    },

    async initCart() {
      await shopifyCart.initCart();
    },

    async refreshCart() {
      await shopifyCart.refreshCart();
    },
  };
};
