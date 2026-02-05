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

      // Add the Cloudinary image URL (prefixed with _ to hide from customer view)
      if (data.uploadedImage) {
        attributes.push({ key: '_Custom Design URL', value: data.uploadedImage });
      }

      // Add custom attributes for display in cart
      if (data.uploadedFileName) {
        attributes.push({ key: '_Design Filename', value: data.uploadedFileName });
      }

      // Store size, quantity, and price info with underscore prefix to hide from customer
      if (data.customSize) {
        attributes.push({ key: '_Custom Size', value: `${data.customSize}"` });
      }

      if (data.customQuantity) {
        attributes.push({ key: '_Custom Quantity', value: data.customQuantity.toString() });
      }

      if (data.customPrice) {
        attributes.push({ key: '_Custom Price', value: data.customPrice });
      }

      if (data.customPricePerUnit) {
        attributes.push({ key: '_Custom Price Per Unit', value: data.customPricePerUnit });
      }

      // Merge in any additional attributes passed from the product page (Shape, Finish, etc.)
      if (data.attributes && Array.isArray(data.attributes)) {
        attributes.push(...data.attributes);
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

      // Re-add with updated values and preserved attributes
      const attributes = [];

      // Preserve the Cloudinary image URL (prefixed with _ to hide from customer view)
      if (item.uploadedImage) {
        attributes.push({ key: '_Custom Design URL', value: item.uploadedImage });
      }

      // Preserve the filename
      if (item.uploadedFileName) {
        attributes.push({ key: '_Design Filename', value: item.uploadedFileName });
      }

      // Use updated or existing custom size
      const newSize = updates.customSize ?? item.customSize;
      if (newSize) {
        attributes.push({ key: 'Custom Size', value: `${newSize}"` });
      }

      // Use updated or existing custom quantity
      const newQuantity = updates.customQuantity ?? item.customQuantity;
      if (newQuantity) {
        attributes.push({ key: 'Custom Quantity', value: newQuantity.toString() });
      }

      // Preserve custom price (stored as totalPrice in the item)
      if (item.totalPrice) {
        attributes.push({ key: 'Custom Price', value: item.totalPrice.toFixed(2) });
      }

      // Preserve custom price per unit
      if (item.pricePerUnit) {
        attributes.push({ key: 'Custom Price Per Unit', value: item.pricePerUnit.toFixed(2) });
      }

      // Re-add the item
      await shopifyCart.addItem(item.merchandise.id, 1, attributes);
    },
  };
};
