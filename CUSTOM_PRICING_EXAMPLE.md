# Custom Pricing with Draft Orders

This guide shows how to create Shopify checkouts with custom pricing without using products/variants.

## Setup

1. **Get Shopify Admin API Access Token**:
   - Go to Shopify Admin → Settings → Apps and sales channels → Develop apps
   - Create a new app or use existing one
   - Configure Admin API scopes: `draft_orders` (read and write)
   - Install the app and copy the Admin API access token

2. **Add to .env**:
```env
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxx
```

## Usage Example

```vue
<template>
  <div>
    <h2>Custom Sticker Order</h2>
    <p>Size: 3x3 inch</p>
    <p>Finish: Matte</p>
    <p>Quantity: 100</p>
    <p>Price: $45.99</p>

    <Button @click="checkout" :disabled="loading">
      {{ loading ? 'Creating Checkout...' : 'Proceed to Checkout' }}
    </Button>
  </div>
</template>

<script setup lang="ts">
const { checkoutWithCustomPrice } = useDraftOrder();
const loading = ref(false);
const toast = useToast();

const checkout = async () => {
  loading.value = true;

  try {
    await checkoutWithCustomPrice({
      lineItems: [
        {
          title: 'Custom Sticker - 3x3 inch, Matte Finish',
          price: 45.99,
          quantity: 1,
          properties: [
            { name: 'Size', value: '3x3 inch' },
            { name: 'Finish', value: 'Matte' },
            { name: 'Quantity', value: '100' },
            { name: 'Design', value: 'customer-upload.png' }
          ],
          taxable: true
        }
      ],
      customerEmail: 'customer@example.com', // Optional
      note: 'Custom order from frontend calculator'
    });

    // User will be redirected to Shopify checkout
  } catch (error: any) {
    console.error('Checkout error:', error);
    toast.error('Failed to create checkout. Please try again.');
    loading.value = false;
  }
};
</script>
```

## API Reference

### `useDraftOrder()`

#### `createDraftOrder(options)`
Creates a draft order and returns the invoice URL.

**Parameters**:
```typescript
{
  lineItems: Array<{
    title: string;        // Product name/description
    price: number;        // Price in dollars
    quantity?: number;    // Default: 1
    properties?: Array<{  // Custom properties to show on order
      name: string;
      value: string;
    }>;
    taxable?: boolean;    // Default: true
  }>;
  customerEmail?: string;           // Pre-fill customer email
  shippingAddress?: {               // Pre-fill shipping address
    first_name?: string;
    last_name?: string;
    address1?: string;
    city?: string;
    province?: string;
    country?: string;
    zip?: string;
    phone?: string;
  };
  note?: string;                    // Internal order note
}
```

**Returns**:
```typescript
{
  success: boolean;
  draftOrder: {
    id: string;
    name: string;           // Order name like "#D123"
    invoiceUrl: string;     // Checkout URL
    totalPrice: string;     // Total in dollars
  };
}
```

#### `checkoutWithCustomPrice(options)`
Same as `createDraftOrder` but automatically redirects to checkout.

## Important Notes

1. **Admin API Required**: This approach requires Shopify Admin API access, not just Storefront API.

2. **No Inventory Tracking**: Draft orders bypass product inventory, so you manage stock separately.

3. **Payment Processing**: Shopify handles all payment processing through the invoice URL.

4. **Taxes**: Shopify automatically calculates taxes based on the shipping address and your tax settings.

5. **Shipping**: Shipping rates are calculated automatically at checkout based on your Shopify settings.

6. **Order Management**: Draft orders appear in Shopify Admin → Orders when completed.

## Alternative: Line Item Properties

If you want to use existing products but show custom pricing calculations, you can:
1. Create a single "Custom Order" product in Shopify with a low base price
2. Add custom line item properties to explain the pricing
3. Use Shopify Scripts/Functions (Plus plan) to adjust the price at checkout

This is more limited but doesn't require Admin API access.
