/**
 * Dynamic Pricing Calculator
 * Based on quantity base prices with size and finish multipliers
 */

export const usePricing = () => {
  // Base price per unit for 2" stickers
  const BASE_PRICE_PER_UNIT = 0.2; // $0.20 per 2" sticker

  // Minimum order total
  const MINIMUM_ORDER_TOTAL = 20;

  /**
   * Get size multiplier
   */
  const getSizeMultiplier = (size: number): number => {
    if (size < 1 || size > 50) {
      throw new Error(`Invalid size: ${size}". Size must be between 1" and 50"`);
    }
    return size / 2;
  };

  /**
   * Get quantity discount percentage
   */
  const getQuantityDiscount = (quantity: number): number => {
    if (quantity >= 1000) return 0.15;
    if (quantity >= 500) return 0.1;
    return 0;
  };

  /**
   * Calculate total price for an order
   */
  const calculateTotalPrice = (
    size: number,
    quantity: number,
    finish: string = "glossy",
  ): number => {
    const sizeMult = getSizeMultiplier(size);

    // Calculate base total: $0.20 × quantity × size multiplier × finish multiplier
    const baseTotal = BASE_PRICE_PER_UNIT * quantity * sizeMult;

    // Apply quantity discount
    const discount = getQuantityDiscount(quantity);
    const totalWithDiscount = baseTotal * (1 - discount);

    // Enforce $20 minimum
    return Math.max(totalWithDiscount, MINIMUM_ORDER_TOTAL);
  };

  /**
   * Calculate price per unit
   */
  const calculatePricePerUnit = (
    size: number,
    quantity: number,
    finish: string = "glossy",
  ): number => {
    const totalPrice = calculateTotalPrice(size, quantity, finish);
    const pricePerUnit = totalPrice / quantity;

    // Round to 2 decimal places
    return Math.round(pricePerUnit * 100) / 100;
  };

  /**
   * Format price as currency string
   */
  const formatPrice = (amount: number): string => {
    // Round to 2 decimal places to avoid floating point precision issues
    const rounded = Math.round(amount * 100) / 100;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(rounded);
  };

  /**
   * Get pricing breakdown for display
   */
  const getPricingBreakdown = (size: number, quantity: number, finish: string = "glossy") => {
    if (quantity < 1) {
      return {
        valid: false,
        error: "Quantity must be at least 1",
        baseTotal: 0,
        discount: 0,
        discountAmount: 0,
        totalPrice: 0,
        pricePerUnit: 0,
        formattedBaseTotal: formatPrice(0),
        formattedDiscountAmount: formatPrice(0),
        formattedTotalPrice: formatPrice(0),
        formattedPricePerUnit: formatPrice(0),
        size: 0,
        quantity: 0,
        finish: "",
      };
    }

    // Calculate all pricing components
    const sizeMult = getSizeMultiplier(size);
    const baseTotal = BASE_PRICE_PER_UNIT * quantity * sizeMult;
    const discount = getQuantityDiscount(quantity);
    const discountAmount = baseTotal * discount;
    const totalWithDiscount = baseTotal * (1 - discount);
    const totalPrice = Math.max(totalWithDiscount, MINIMUM_ORDER_TOTAL);
    const pricePerUnit = totalPrice / quantity;

    return {
      valid: true,
      baseTotal,
      discount,
      discountAmount,
      pricePerUnit,
      totalPrice,
      formattedBaseTotal: formatPrice(baseTotal),
      formattedDiscountAmount: formatPrice(discountAmount),
      formattedPricePerUnit: formatPrice(pricePerUnit),
      formattedTotalPrice: formatPrice(totalPrice),
      size,
      quantity,
      finish,
    };
  };

  /**
   * Get quantity tiers for pricing table display
   */
  const getQuantityTiers = () => {
    return [
      { minQuantity: 20, label: "20-499", discountPercent: 0 },
      { minQuantity: 500, label: "500-999", discountPercent: 10 },
      { minQuantity: 1000, label: "1000+", discountPercent: 15 },
    ];
  };

  return {
    calculatePricePerUnit,
    calculateTotalPrice,
    formatPrice,
    getPricingBreakdown,
    getQuantityTiers,
    getSizeMultiplier,
    getQuantityDiscount,
  };
};
