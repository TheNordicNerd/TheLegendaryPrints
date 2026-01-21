# Pricing Configuration Guide

All pricing is centralized in `/app/data/pricing.ts` for easy updates.

## Quick Update Guide

### 1. Update Base Prices by Product Type

Edit the `BASE_PRICING` object in `/app/data/pricing.ts`:

```typescript
export const BASE_PRICING: Record<string, Record<string, number>> = {
  "die-cut-stickers": {
    '2"': 75,    // $0.75 per sticker
    '3"': 125,   // $1.25 per sticker
    '4"': 200,   // $2.00 per sticker
    '5"': 300,   // $3.00 per sticker
  },
  "kiss-cut-stickers": {
    '2"': 65,    // $0.65 per sticker
    '3"': 110,   // $1.10 per sticker
    '4"': 180,   // $1.80 per sticker
    '5"': 275,   // $2.75 per sticker
  },
  "sticker-sheets": {
    '2"': 150,   // $1.50 per sticker
    '3"': 250,   // $2.50 per sticker
    '4"': 400,   // $4.00 per sticker
    '5"': 600,   // $6.00 per sticker
  },
};
```

**Note:** All prices are in cents (100 = $1.00)

---

### 2. Update Finish Multipliers

Edit the `FINISH_MULTIPLIERS` object:

```typescript
export const FINISH_MULTIPLIERS: Record<OrderFinish, number> = {
  Matte: 1.0,         // No price change
  Glossy: 1.1,        // +10% ($1.00 becomes $1.10)
  Clear: 1.2,         // +20%
  Holographic: 1.5,   // +50%
};
```

---

### 3. Update Volume Discounts

Edit the `VOLUME_DISCOUNTS` array:

```typescript
export const VOLUME_DISCOUNTS = [
  { minQuantity: 500, multiplier: 0.8, discount: "20%" },   // 20% off for 500+
  { minQuantity: 300, multiplier: 0.85, discount: "15%" },  // 15% off for 300+
  { minQuantity: 200, multiplier: 0.9, discount: "10%" },   // 10% off for 200+
  { minQuantity: 100, multiplier: 0.95, discount: "5%" },   // 5% off for 100+
];
```

**multiplier** = price multiplier (0.8 = 20% off, 0.9 = 10% off)

---

### 4. Update Shipping Rates

Edit the `SHIPPING_RATES` array:

```typescript
export const SHIPPING_RATES = [
  { minQuantity: 200, cost: 0 },      // Free shipping for 200+
  { minQuantity: 100, cost: 500 },    // $5.00 for 100-199
  { minQuantity: 0, cost: 800 },      // $8.00 for under 100
];
```

**cost** is in cents (500 = $5.00)

---

### 5. Update Tax Rate

Edit the `TAX_RATE` constant:

```typescript
export const TAX_RATE = 0.085;  // 8.5% tax
```

---

### 6. Update Size Options

Edit the `SIZE_OPTIONS` array to add/remove sizes:

```typescript
export const SIZE_OPTIONS = [
  { value: '2"', label: '2"', badge: undefined },
  { value: '3"', label: '3"', badge: "Popular" },
  { value: '4"', label: '4"', badge: undefined },
  { value: '5"', label: '5"', badge: undefined },
  { value: "custom", label: "Custom", badge: undefined },
];
```

---

### 7. Update Quantity Options

Edit the `QUANTITY_OPTIONS` array:

```typescript
export const QUANTITY_OPTIONS = [
  { value: 50, label: "50", badge: undefined },
  { value: 100, label: "100", badge: "5% off" },
  { value: 200, label: "200", badge: "10% off" },
  { value: 300, label: "300", badge: "15% off" },
  { value: 500, label: "500", badge: "20% off" },
  { value: 1000, label: "1000", badge: "20% off" },
];
```

---

### 8. Update Custom Size Limits

Edit the `CUSTOM_SIZE_LIMITS` object:

```typescript
export const CUSTOM_SIZE_LIMITS = {
  min: 2,      // Minimum 2 inches
  max: 12,     // Maximum 12 inches
  step: 0.1,   // Increment by 0.1 inches
};
```

---

### 9. Update Custom Quantity Limits

Edit the `CUSTOM_QUANTITY_LIMITS` object:

```typescript
export const CUSTOM_QUANTITY_LIMITS = {
  min: 25,   // Minimum 25 stickers
  step: 1,   // Increment by 1
};
```

---

## What Updates Automatically

When you update `/app/data/pricing.ts`, these components automatically reflect the changes:

✅ Product page configuration section
✅ Order breakdown component (sidebar pricing)
✅ Price per sticker calculations
✅ Volume discount badges and labels
✅ Shipping cost calculations
✅ Tax calculations
✅ Finish price multipliers
✅ Custom size/quantity validation

**No other files need to be modified!**

---

## Example: Updating Die-Cut Pricing

**Scenario:** Client wants die-cut stickers to be $0.10 cheaper for all sizes.

**Before:**
```typescript
"die-cut-stickers": {
  '2"': 75,   // $0.75
  '3"': 125,  // $1.25
  '4"': 200,  // $2.00
  '5"': 300,  // $3.00
},
```

**After:**
```typescript
"die-cut-stickers": {
  '2"': 65,   // $0.65 (was $0.75)
  '3"': 115,  // $1.15 (was $1.25)
  '4"': 190,  // $1.90 (was $2.00)
  '5"': 290,  // $2.90 (was $3.00)
},
```

Save the file, and the entire app updates automatically! 🎉

---

## TypeScript Types Available

The following types are exported for type safety:

- `ProductType` - "die-cut-stickers" | "kiss-cut-stickers" | "sticker-sheets"
- `SizeOption` - { value, label, badge? }
- `QuantityOption` - { value, label, badge? }
- `FinishOption` - { label, badge?, description? }
- `VolumeDiscountTier` - { minQuantity, multiplier, discount }
- `ShippingRateTier` - { minQuantity, cost }
- `PricingModel` - Complete pricing configuration interface

---

## Testing After Changes

1. Go to any product page (`/products/die-cut-stickers`)
2. Configure size, quantity, and finish
3. Check the "Price per sticker" breakdown
4. Verify "Order total" shows correct calculations
5. Test different quantities to verify volume discounts
6. Test custom size/quantity inputs

---

## Need Help?

All pricing logic is contained in:
- `/app/data/pricing.ts` - Configuration (update this!)
- `/app/composables/usePriceBreakdown.ts` - Calculation logic
- `/app/components/order/Breakdown.vue` - Display component
