/**
 * Draft Order Composable
 * Use this to create custom-priced orders that bypass product variants
 */

export interface DraftOrderLineItem {
  title: string;
  price: number;
  quantity?: number;
  properties?: Array<{ name: string; value: string }>;
  taxable?: boolean;
}

export interface DraftOrderOptions {
  lineItems: DraftOrderLineItem[];
  customerEmail?: string;
  shippingAddress?: {
    first_name?: string;
    last_name?: string;
    address1?: string;
    address2?: string;
    city?: string;
    province?: string;
    country?: string;
    zip?: string;
    phone?: string;
  };
  note?: string;
}

export interface DraftOrderResponse {
  success: boolean;
  draftOrder: {
    id: string;
    name: string;
    invoiceUrl: string;
    totalPrice: string;
  };
}

export const useDraftOrder = () => {
  /**
   * Create a draft order with custom pricing
   *
   * @example
   * const { createDraftOrder } = useDraftOrder();
   *
   * const result = await createDraftOrder({
   *   lineItems: [
   *     {
   *       title: "Custom Sticker - 3x3 inch, Matte Finish, 100 qty",
   *       price: 45.99,
   *       quantity: 1,
   *       properties: [
   *         { name: "Size", value: "3x3 inch" },
   *         { name: "Finish", value: "Matte" },
   *         { name: "Quantity", value: "100" }
   *       ]
   *     }
   *   ],
   *   customerEmail: "customer@example.com",
   *   note: "Rush order - 3 day production"
   * });
   *
   * // Redirect to checkout
   * window.location.href = result.draftOrder.invoiceUrl;
   */
  const createDraftOrder = async (options: DraftOrderOptions): Promise<DraftOrderResponse> => {
    try {
      const data = await $fetch<DraftOrderResponse>('/api/shopify/draft-order/create', {
        method: 'POST',
        body: options,
      });

      return data;
    } catch (error: any) {
      console.error('Failed to create draft order:', error);
      throw error;
    }
  };

  /**
   * Create and redirect to checkout in one step
   */
  const checkoutWithCustomPrice = async (options: DraftOrderOptions) => {
    const result = await createDraftOrder(options);

    if (result.success && result.draftOrder.invoiceUrl) {
      // Redirect to Shopify checkout
      if (import.meta.client) {
        window.location.href = result.draftOrder.invoiceUrl;
      }
      return result;
    }

    throw new Error('Failed to create checkout URL');
  };

  return {
    createDraftOrder,
    checkoutWithCustomPrice,
  };
};
