/**
 * Dynamic Pricing Calculator
 * Based on quantity base prices with size and finish multipliers
 */

interface FinishMultipliers {
  [key: string]: number;
}

export const usePricing = () => {
  // Base price per unit for 2" stickers
  const BASE_PRICE_PER_UNIT = 0.2; // $0.20 per 2" sticker

  // Finish multipliers (currently neutral)
  const FINISH_MULTIPLIER: FinishMultipliers = {
    glossy: 1,
    matte: 1,
  };

  // Minimum order total
  const MINIMUM_ORDER_TOTAL = 20;

  /**
   * Get size multiplier - calculated dynamically as size / 2
   * Examples:
   * - 2" = 2/2 = 1x
   * - 10" = 10/2 = 5x
   * - 25" = 25/2 = 12.5x
   */
  const getSizeMultiplier = (size: number): number => {
    if (size < 1 || size > 50) {
      throw new Error(
        `Invalid size: ${size}". Size must be between 1" and 50"`,
      );
    }
    return size / 2;
  };

  /**
   * Get finish multiplier
   */
  const getFinishMultiplier = (finish: string): number => {
    return FINISH_MULTIPLIER[finish] || 1;
  };

  /**
   * Get quantity discount percentage
   */
  const getQuantityDiscount = (quantity: number): number => {
    if (quantity >= 1000) return 0.15; // 15% off
    if (quantity >= 500) return 0.10;  // 10% off
    return 0; // No discount
  };

  /**
   * Calculate total price for an order
   * Formula:
   * 1. Calculate base: $0.20 × quantity × sizeMultiplier × finishMultiplier
   * 2. Apply quantity discount: 10% off at 500+, 15% off at 1000+
   * 3. Apply $20 minimum if total is less
   */
  const calculateTotalPrice = (
    size: number,
    quantity: number,
    finish: string = "glossy",
  ): number => {
    const sizeMult = getSizeMultiplier(size);
    const finishMult = getFinishMultiplier(finish);

    // Calculate base total: $0.20 × quantity × size multiplier × finish multiplier
    const baseTotal = BASE_PRICE_PER_UNIT * quantity * sizeMult * finishMult;

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
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  /**
   * Get pricing breakdown for display
   */
  const getPricingBreakdown = (size: number, quantity: number, finish: string = "glossy") => {
    if (quantity < 1) {
      return {
        valid: false,
        error: "Quantity must be at least 1",
      };
    }

    const pricePerUnit = calculatePricePerUnit(size, quantity, finish);
    const totalPrice = calculateTotalPrice(size, quantity, finish);

    return {
      valid: true,
      pricePerUnit,
      totalPrice,
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
    getFinishMultiplier,
    getQuantityDiscount,
  };
};
