/**
 * Shopify Cart Store
 * Manages cart state with Shopify Storefront API
 */

import { defineStore } from 'pinia';
import type { ShopifyCart } from '~/composables/useShopify';

export const useShopifyCartStore = defineStore(
  'shopifyCart',
  () => {
    // State
    const cart = ref<ShopifyCart | null>(null);
    const cartId = ref<string | null>(null);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    // Getters
    const items = computed(() => {
      if (!cart.value) return [];
      return cart.value.lines.edges.map((edge) => edge.node);
    });

    const itemCount = computed(() => {
      return cart.value?.totalQuantity || 0;
    });

    const totalQuantity = computed(() => {
      return cart.value?.totalQuantity || 0;
    });

    const subtotal = computed(() => {
      if (!cart.value) return '0.00';
      return cart.value.cost.subtotalAmount.amount;
    });

    const total = computed(() => {
      if (!cart.value) return '0.00';
      return cart.value.cost.totalAmount.amount;
    });

    const tax = computed(() => {
      if (!cart.value?.cost.totalTaxAmount) return '0.00';
      return cart.value.cost.totalTaxAmount.amount;
    });

    const formattedSubtotal = computed(() => {
      if (!cart.value) return '$0.00';
      const { formatPrice } = useShopify();
      return formatPrice(
        cart.value.cost.subtotalAmount.amount,
        cart.value.cost.subtotalAmount.currencyCode
      );
    });

    const formattedTotal = computed(() => {
      if (!cart.value) return '$0.00';
      const { formatPrice } = useShopify();
      return formatPrice(cart.value.cost.totalAmount.amount, cart.value.cost.totalAmount.currencyCode);
    });

    const formattedTax = computed(() => {
      if (!cart.value?.cost.totalTaxAmount) return '$0.00';
      const { formatPrice } = useShopify();
      return formatPrice(
        cart.value.cost.totalTaxAmount.amount,
        cart.value.cost.totalTaxAmount.currencyCode
      );
    });

    const checkoutUrl = computed(() => {
      return cart.value?.checkoutUrl || '';
    });

    const isEmpty = computed(() => {
      return !cart.value || cart.value.totalQuantity === 0;
    });

    // Actions
    /**
     * Create a new cart
     */
    const createNewCart = async () => {
      const { createCart } = useShopify();
      isLoading.value = true;
      error.value = null;

      try {
        const newCart = await createCart();
        if (newCart) {
          cart.value = newCart;
          cartId.value = newCart.id;
          if (typeof window !== 'undefined') {
            localStorage.setItem('shopifyCartId', newCart.id);
          }
        }
      } catch (err: any) {
        error.value = err.message || 'Failed to create cart';
        throw err;
      } finally {
        isLoading.value = false;
      }
    };

    /**
     * Initialize cart from localStorage or create new
     */
    const initCart = async () => {
      const { getCart } = useShopify();

      // Try to load cart ID from localStorage
      if (typeof window === 'undefined') return; // SSR safety

      const savedCartId = localStorage.getItem('shopifyCartId');

      try {
        if (savedCartId) {
          // Try to fetch existing cart
          isLoading.value = true;
          const existingCart = await getCart(savedCartId);
          if (existingCart) {
            cart.value = existingCart;
            cartId.value = existingCart.id;
          } else {
            await createNewCart();
          }
        } else {
          // Create new cart
          await createNewCart();
        }
      } catch (err: any) {
        console.error('Failed to initialize cart:', err);
        // If cart not found or error, create new one
        await createNewCart();
      } finally {
        isLoading.value = false;
      }
    };

    /**
     * Add item to cart
     */
    const addItem = async (
      merchandiseId: string,
      quantity: number = 1,
      attributes?: Array<{ key: string; value: string }>
    ) => {
      const { addToCart } = useShopify();

      // Ensure cart exists
      if (!cartId.value) {
        await createNewCart();
      }

      if (!cartId.value) {
        throw new Error('Failed to create cart');
      }

      isLoading.value = true;
      error.value = null;

      try {
        const lines = [{ merchandiseId, quantity, attributes }];
        const updatedCart = await addToCart(cartId.value, lines);
        if (updatedCart) {
          cart.value = updatedCart;
        }
      } catch (err: any) {
        error.value = err.message || 'Failed to add item to cart';
        throw err;
      } finally {
        isLoading.value = false;
      }
    };

    /**
     * Update item quantity
     */
    const updateQuantity = async (lineId: string, quantity: number) => {
      if (!cartId.value) return;

      const { updateCartLines } = useShopify();
      isLoading.value = true;
      error.value = null;

      try {
        const updatedCart = await updateCartLines(cartId.value, [{ id: lineId, quantity }]);
        if (updatedCart) {
          cart.value = updatedCart;
        }
      } catch (err: any) {
        error.value = err.message || 'Failed to update quantity';
        throw err;
      } finally {
        isLoading.value = false;
      }
    };

    /**
     * Remove item from cart
     */
    const removeItem = async (lineId: string) => {
      if (!cartId.value) return;

      const { removeFromCart } = useShopify();
      isLoading.value = true;
      error.value = null;

      try {
        const updatedCart = await removeFromCart(cartId.value, [lineId]);
        if (updatedCart) {
          cart.value = updatedCart;
        }
      } catch (err: any) {
        error.value = err.message || 'Failed to remove item';
        throw err;
      } finally {
        isLoading.value = false;
      }
    };

    /**
     * Clear cart
     */
    const clearCart = async () => {
      // Create new empty cart
      await createNewCart();
    };

    /**
     * Refresh cart data
     */
    const refreshCart = async () => {
      if (!cartId.value) return;

      const { getCart } = useShopify();
      isLoading.value = true;

      try {
        const updatedCart = await getCart(cartId.value);
        if (updatedCart) {
          cart.value = updatedCart;
        }
      } catch (err: any) {
        console.error('Failed to refresh cart:', err);
      } finally {
        isLoading.value = false;
      }
    };

    return {
      // State
      cart,
      cartId,
      isLoading,
      error,
      // Getters
      items,
      itemCount,
      totalQuantity,
      subtotal,
      total,
      tax,
      formattedSubtotal,
      formattedTotal,
      formattedTax,
      checkoutUrl,
      isEmpty,
      // Actions
      initCart,
      createNewCart,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      refreshCart,
    };
  },
  {
    persist: {
      storage: typeof window !== 'undefined' ? localStorage : undefined,
      pick: ['cartId'],
    },
  }
);
