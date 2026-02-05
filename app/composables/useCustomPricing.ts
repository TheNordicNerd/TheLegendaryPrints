/**
 * Custom Pricing Composable
 *
 * This approach uses line item properties to display custom pricing details
 * while using a single "Custom Order" product in your Shopify store.
 *
 * Setup Required:
 * 1. Create a product in Shopify called "Custom Order" or "Custom Sticker"
 * 2. Set the base price to $0.01 (minimum)
 * 3. Get the variant ID from Shopify
 */

export interface CustomPricingItem {
  title: string;
  calculatedPrice: number;
  quantity: number;
  customizations: Record<string, string>; // e.g., { Size: "3x3", Finish: "Matte" }
  imageUrl?: string;
}

export const useCustomPricing = () => {
  const { addToCart } = useShopify();
  const { getCart } = useUnifiedCart();

  /**
   * Add custom priced item to cart using a base product with properties
   *
   * @param variantId - The Shopify variant ID of your "Custom Order" product
   * @param item - Custom pricing details
   *
   * @example
   * await addCustomPricedItem('gid://shopify/ProductVariant/xxxxx', {
   *   title: 'Custom Sticker - 3x3 inch, Matte Finish',
   *   calculatedPrice: 45.99,
   *   quantity: 100,
   *   customizations: {
   *     'Size': '3x3 inch',
   *     'Finish': 'Matte',
   *     'Quantity': '100',
   *     'Total Price': '$45.99'
   *   },
   *   imageUrl: 'https://...'
   * });
   */
  const addCustomPricedItem = async (
    variantId: string,
    item: CustomPricingItem
  ) => {
    const cart = await getCart();

    // Convert customizations to line item properties
    const attributes = [
      { key: '_custom_title', value: item.title },
      { key: '_calculated_price', value: `$${item.calculatedPrice.toFixed(2)}` },
      ...Object.entries(item.customizations).map(([key, value]) => ({
        key,
        value,
      })),
    ];

    if (item.imageUrl) {
      attributes.push({ key: '_custom_image', value: item.imageUrl });
    }

    await addToCart(cart.id, [
      {
        merchandiseId: variantId,
        quantity: 1, // Always 1 since the quantity is embedded in the customizations
        attributes,
      },
    ]);
  };

  /**
   * Calculate price based on custom options
   * This is where your pricing logic lives
   */
  const calculatePrice = (options: {
    size?: string;
    quantity?: number;
    finish?: string;
    design?: string;
  }): number => {
    let basePrice = 0;

    // Size pricing
    const sizeMultipliers: Record<string, number> = {
      '2x2': 0.25,
      '3x3': 0.35,
      '4x4': 0.45,
      '5x5': 0.60,
      '6x6': 0.80,
      'custom': 1.0,
    };

    // Finish pricing
    const finishMultipliers: Record<string, number> = {
      'matte': 1.0,
      'glossy': 1.1,
      'holographic': 1.5,
    };

    // Quantity discounts
    const quantityBreaks = [
      { min: 1, max: 49, price: 1.0 },
      { min: 50, max: 99, price: 0.8 },
      { min: 100, max: 249, price: 0.6 },
      { min: 250, max: 499, price: 0.5 },
      { min: 500, max: Infinity, price: 0.4 },
    ];

    const quantity = options.quantity || 1;
    const sizeKey = options.size?.toLowerCase() || '3x3';
    const finishKey = options.finish?.toLowerCase() || 'matte';

    // Find quantity bracket
    const bracket = quantityBreaks.find(
      (b) => quantity >= b.min && quantity <= b.max
    );

    if (!bracket) return 0;

    // Calculate: quantity × size × finish × quantity_bracket
    const sizePrice = sizeMultipliers[sizeKey] || sizeMultipliers['3x3'];
    const finishPrice = finishMultipliers[finishKey] || finishMultipliers['matte'];

    basePrice = quantity * sizePrice * finishPrice * bracket.price;

    return Math.max(basePrice, 1); // Minimum $1
  };

  return {
    addCustomPricedItem,
    calculatePrice,
  };
};
