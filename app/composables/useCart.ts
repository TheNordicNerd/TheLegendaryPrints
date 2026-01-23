/**
 * useCart Composable
 *
 * Provides convenient methods for cart operations
 */

import { useCartStore } from "~/stores/cart";
import type { CartItem } from "~/stores/cart";

export const useCart = () => {
  const cartStore = useCartStore();

  /**
   * Add product to cart
   */
  const addToCart = (
    productId: string,
    productName: string,
    productSlug: string,
    size: number,
    material: string,
    quantity: number,
    pricePerUnit: number,
    totalPrice: number,
    options?: {
      customSize?: number;
      customQuantity?: number;
      uploadedImage?: string;
      uploadedFileName?: string;
    }
  ) => {
    cartStore.addItem({
      productId,
      productName,
      productSlug,
      size,
      material,
      quantity,
      pricePerUnit,
      totalPrice,
      ...options,
    });
  };

  /**
   * Remove item from cart
   */
  const removeFromCart = (id: string) => {
    cartStore.removeItem(id);
  };

  /**
   * Update item quantity
   */
  const updateQuantity = (id: string, quantity: number, customQuantity?: number) => {
    cartStore.updateItemQuantity(id, quantity, customQuantity);
  };

  /**
   * Clear all items from cart
   */
  const clearCart = () => {
    cartStore.clearCart();
  };

  /**
   * Get cart items
   */
  const items = computed(() => cartStore.items);

  /**
   * Get cart item count
   */
  const itemCount = computed(() => cartStore.itemCount);

  /**
   * Get total quantity
   */
  const totalQuantity = computed(() => cartStore.totalQuantity);

  /**
   * Get total price
   */
  const totalPrice = computed(() => cartStore.totalPrice);

  /**
   * Get formatted total price
   */
  const formattedTotalPrice = computed(() => cartStore.formattedTotalPrice);

  /**
   * Check if cart is empty
   */
  const isEmpty = computed(() => cartStore.isEmpty);

  return {
    // Methods
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,

    // Computed
    items,
    itemCount,
    totalQuantity,
    totalPrice,
    formattedTotalPrice,
    isEmpty,
  };
};
