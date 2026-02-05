# Custom Pricing Alternatives (No Admin API Required)

Since you can't add a Shopify app, here are alternative approaches:

## Option 1: Line Item Properties (Recommended)

Use the existing Storefront API with line item properties to show custom pricing.

### Setup Steps:

1. **Create a "Custom Order" Product in Shopify**:
   - Go to Shopify Admin → Products → Add Product
   - Title: "Custom Sticker Order"
   - Price: Set to a base amount (e.g., $1.00)
   - This will be your "container" product for custom orders

2. **Get the Variant ID**:
   - Click on the product → Copy the product ID from URL
   - Or use GraphQL: `{ products(first: 1, query: "title:Custom") { edges { node { variants(first: 1) { edges { node { id } } } } } } }`

3. **Use the composable**:

```typescript
// In your checkout component
const { addCustomPricedItem, calculatePrice } = useCustomPricing();
const CUSTOM_ORDER_VARIANT_ID = 'gid://shopify/ProductVariant/YOUR_VARIANT_ID';

// Calculate price based on selections
const price = calculatePrice({
  size: '3x3',
  quantity: 100,
  finish: 'matte'
});

// Add to cart with custom properties
await addCustomPricedItem(CUSTOM_ORDER_VARIANT_ID, {
  title: 'Custom Sticker - 3x3 inch, Matte',
  calculatedPrice: price,
  quantity: 100,
  customizations: {
    'Size': '3x3 inch',
    'Finish': 'Matte',
    'Quantity': '100',
    'Calculated Total': `$${price.toFixed(2)}`
  }
});
```

### Limitations:
- The Shopify checkout will show the base product price, not your calculated price
- You'll need to manually adjust invoices or use this for quotes only
- Properties are visible on the order but don't affect the price

---

## Option 2: External Payment + Shopify Order Creation

Use an external payment processor and create orders manually:

1. **Calculate price on frontend**
2. **Collect payment via Stripe/PayPal**
3. **Create order in Shopify manually** or via webhook

```typescript
// Example flow
const checkoutExternal = async () => {
  // 1. Calculate final price
  const totalPrice = calculatePrice(options);

  // 2. Create Stripe checkout session
  const session = await $fetch('/api/stripe/create-session', {
    method: 'POST',
    body: {
      amount: totalPrice * 100, // cents
      orderDetails: { size, finish, quantity }
    }
  });

  // 3. Redirect to Stripe
  window.location.href = session.url;

  // 4. Webhook creates Shopify order after payment
};
```

---

## Option 3: Quote System (No Immediate Checkout)

Best for complex custom orders:

1. **Collect customer requirements**
2. **Show calculated price estimate**
3. **Customer submits quote request**
4. **You manually create and send invoice**

```typescript
const submitQuoteRequest = async (options) => {
  await $fetch('/api/quotes/submit', {
    method: 'POST',
    body: {
      customerEmail: 'customer@example.com',
      orderDetails: options,
      estimatedPrice: calculatePrice(options),
      uploadedFiles: ['design.png']
    }
  });

  // Show success message
  // "Quote submitted! We'll send an invoice within 24 hours"
};
```

---

## Option 4: Shopify POS (In-Person Sales)

If you have Shopify POS, you can:
- Create custom sale items with any price
- Send invoice/payment link to customer
- No API needed

---

## Option 5: Multiple Product Variants (Pre-defined)

Create products with common price points:

```
Product: "Custom Stickers - 100 qty"
Variants:
- 2x2 Matte - $25
- 2x2 Glossy - $28
- 3x3 Matte - $35
- 3x3 Glossy - $38
... etc
```

Then use the regular cart system.

**Pros**: Works with existing Shopify checkout
**Cons**: Limited flexibility, many variants to manage

---

## Recommended Approach

For your use case (custom stickers with dynamic pricing), I recommend:

1. **Option 1** if you want to use Shopify checkout (with manual price adjustment after)
2. **Option 2** if you want accurate pricing and are okay with external payment
3. **Option 3** if most orders need custom quotes anyway

Let me know which approach fits your workflow and I can help implement it!
