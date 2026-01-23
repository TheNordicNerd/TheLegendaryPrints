/**
 * Cart Store
 *
 * Manages shopping cart state with Pinia and persistence
 */

import { defineStore } from "pinia";

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  size: number;
  customSize?: number;
  material: string;
  quantity: number;
  customQuantity?: number;
  uploadedImage?: string;
  uploadedFileName?: string;
  pricePerUnit: number;
  totalPrice: number;
  addedAt: number;
}

interface CartState {
  items: CartItem[];
}

export const useCartStore = defineStore("cart", {
  state: (): CartState => ({
    items: [],
  }),

  getters: {
    /**
     * Total number of items in cart
     */
    itemCount: (state): number => state.items.length,

    /**
     * Total quantity of all items
     */
    totalQuantity: (state): number => {
      return state.items.reduce((total, item) => {
        const qty = item.customQuantity && item.customQuantity >= 1000
          ? item.customQuantity
          : item.quantity;
        return total + qty;
      }, 0);
    },

    /**
     * Total price of all items
     */
    totalPrice: (state): number => {
      return state.items.reduce((total, item) => total + item.totalPrice, 0);
    },

    /**
     * Formatted total price
     */
    formattedTotalPrice(): string {
      return `$${this.totalPrice.toFixed(2)}`;
    },

    /**
     * Check if cart is empty
     */
    isEmpty: (state): boolean => state.items.length === 0,

    /**
     * Get item by ID
     */
    getItemById: (state) => (id: string): CartItem | undefined => {
      return state.items.find((item) => item.id === id);
    },
  },

  actions: {
    /**
     * Add item to cart
     */
    addItem(item: Omit<CartItem, "id" | "addedAt">) {
      const cartItem: CartItem = {
        ...item,
        id: this.generateId(),
        addedAt: Date.now(),
      };

      this.items.push(cartItem);
    },

    /**
     * Remove item from cart
     */
    removeItem(id: string) {
      const index = this.items.findIndex((item) => item.id === id);
      if (index > -1) {
        this.items.splice(index, 1);
      }
    },

    /**
     * Update item quantity
     */
    updateItemQuantity(id: string, quantity: number, customQuantity?: number) {
      const item = this.items.find((item) => item.id === id);
      if (item) {
        item.quantity = quantity;
        item.customQuantity = customQuantity;

        // Recalculate total price
        const effectiveQuantity = customQuantity && customQuantity >= 1000
          ? customQuantity
          : quantity;
        item.totalPrice = item.pricePerUnit * effectiveQuantity;
      }
    },

    /**
     * Clear entire cart
     */
    clearCart() {
      this.items = [];
    },

    /**
     * Generate unique ID for cart item
     */
    generateId(): string {
      return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    },
  },

  persist: true,
});
