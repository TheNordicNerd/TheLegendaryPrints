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
      // Build attributes array for Shopify - ONLY include Cloudinary image URL
      const attributes = data.attributes || [];

      // Add ONLY the Cloudinary image URL (prefixed with _ to hide from customer view)
      if (data.uploadedImage) {
        attributes.push({ key: '_Custom Design URL', value: data.uploadedImage });
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

    // Update cart item (Shopify doesn't support updating attributes, so we remove and re-add)
    async updateItem(lineId: string, updates: { customSize?: number; customQuantity?: number }) {
      // Find the item to get its details
      const item = shopifyCart.items.find((i) => i.id === lineId);
      if (!item) {
        throw new Error('Item not found in cart');
      }

      // Remove the old item
      await shopifyCart.removeItem(lineId);

      // Re-add with ONLY the Cloudinary image URL
      const attributes = [];

      // Preserve ONLY the Cloudinary image URL (prefixed with _ to hide from customer view)
      if (item.uploadedImage) {
        attributes.push({ key: '_Custom Design URL', value: item.uploadedImage });
      }

      // Re-add the item
      await shopifyCart.addItem(item.merchandise.id, 1, attributes);
    },
  };
};
