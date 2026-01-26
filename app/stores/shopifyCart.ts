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
      return cart.value.lines.edges.map((edge) => {
        const node = edge.node;
        const attributes = node.attributes || [];

        // Debug: log attributes to see what we're getting
        console.log('Cart line attributes:', attributes);

        // Extract custom attributes
        const uploadedImage = attributes.find(a => a.key === 'Custom Design URL')?.value;
        const uploadedFileName = attributes.find(a => a.key === 'Design Filename')?.value;
        const customSizeStr = attributes.find(a => a.key === 'Custom Size')?.value;
        const customQuantityStr = attributes.find(a => a.key === 'Custom Quantity')?.value;
        const customPriceStr = attributes.find(a => a.key === 'Custom Price')?.value;
        const customPricePerUnitStr = attributes.find(a => a.key === 'Custom Price Per Unit')?.value;

        console.log('Extracted custom values:', {
          customSizeStr,
          customQuantityStr,
          customPriceStr,
          customPricePerUnitStr
        });

        // Use custom pricing if available, otherwise fall back to Shopify pricing
        const totalPrice = customPriceStr ? parseFloat(customPriceStr) : parseFloat(node.cost.totalAmount.amount);
        const pricePerUnit = customPricePerUnitStr ? parseFloat(customPricePerUnitStr) : (totalPrice / node.quantity);

        console.log('Calculated prices:', { totalPrice, pricePerUnit });

        // Transform to cart item format for display
        return {
          ...node,
          uploadedImage,
          uploadedFileName,
          customSize: customSizeStr ? parseFloat(customSizeStr.replace('"', '')) : undefined,
          customQuantity: customQuantityStr ? parseInt(customQuantityStr) : undefined,
          // Add fields needed by cart page
          productName: node.merchandise.product.title,
          productSlug: node.merchandise.product.handle,
          size: customSizeStr ? parseFloat(customSizeStr.replace('"', '')) : 2,
          material: node.merchandise.title.toLowerCase().includes('matte') ? 'matte' : 'glossy',
          pricePerUnit,
          totalPrice,
        };
      });
    });

    const itemCount = computed(() => {
      return items.value.length || 0;
    });

    const totalQuantity = computed(() => {
      // Sum up custom quantities if available, otherwise use cart's totalQuantity
      const customTotal = items.value.reduce((sum, item) => {
        const qty = item.customQuantity || item.quantity;
        return sum + qty;
      }, 0);
      return customTotal || cart.value?.totalQuantity || 0;
    });

    const subtotal = computed(() => {
      if (!cart.value) return '0.00';
      // Calculate subtotal from custom pricing in items
      const customTotal = items.value.reduce((sum, item) => sum + item.totalPrice, 0);
      return customTotal > 0 ? customTotal.toFixed(2) : cart.value.cost.subtotalAmount.amount;
    });

    const total = computed(() => {
      if (!cart.value) return '0.00';
      // Use subtotal as total (no tax for now)
      return subtotal.value;
    });

    const tax = computed(() => {
      // No tax calculation for custom pricing
      return '0.00';
    });

    const formattedSubtotal = computed(() => {
      if (!cart.value) return '$0.00';
      return `$${subtotal.value}`;
    });

    const formattedTotal = computed(() => {
      if (!cart.value) return '$0.00';
      return `$${total.value}`;
    });

    const formattedTax = computed(() => {
      return '$0.00';
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
            console.log('✅ Loaded existing cart:', existingCart.id);
          } else {
            console.log('⚠️ Cart not found, creating new one');
            localStorage.removeItem('shopifyCartId'); // Clear invalid cart ID
            await createNewCart();
          }
        } else {
          // Create new cart
          console.log('🆕 No saved cart, creating new one');
          await createNewCart();
        }
      } catch (err: any) {
        console.error('❌ Failed to initialize cart:', err);
        // If cart not found or error, clear localStorage and create new one
        localStorage.removeItem('shopifyCartId');
        try {
          await createNewCart();
        } catch (createErr: any) {
          console.error('❌ Failed to create new cart:', createErr);
          error.value = 'Failed to initialize cart';
        }
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
