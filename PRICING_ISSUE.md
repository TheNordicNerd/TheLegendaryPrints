# Shopify Pricing Issue & Solutions

## Problem

Your cart shows the correct custom-calculated prices, but at Shopify checkout, customers are charged $0 (or the variant's base price in Shopify).

**Why?** Shopify cart line item attributes are just metadata - they don't affect checkout pricing. Shopify uses the variant's actual price from your product catalog.

## Current Implementation

1. Custom pricing calculated in `usePricing.ts` based on size/quantity
2. Prices stored as cart line attributes: `Custom Price`, `Custom Price Per Unit`
3. Cart page displays these custom prices correctly
4. BUT at checkout, Shopify ignores attributes and uses variant base price

## Available Solutions

### Option 1: Draft Orders API (Recommended for Custom Pricing)

**How it works:**
- Create a Shopify Draft Order with custom line item prices
- Generate an invoice URL for checkout
- Full control over pricing, discounts, and line items

**Pros:**
- Complete control over pricing
- Can set custom prices per line item
- Works with existing products
- Can add custom line item properties
- Proper order management in Shopify

**Cons:**
- Requires server-side implementation
- Need Shopify Admin API (not just Storefront API)
- More complex checkout flow

**Implementation:**
```typescript
// Server-side API route: /server/api/checkout/create-draft-order.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { lineItems, customerEmail } = body;

  // Create draft order with custom prices
  const draftOrder = await shopifyAdminClient.mutation({
    mutation: `
      mutation draftOrderCreate($input: DraftOrderInput!) {
        draftOrderCreate(input: $input) {
          draftOrder {
            id
            invoiceUrl
          }
        }
      }
    `,
    variables: {
      input: {
        email: customerEmail,
        lineItems: lineItems.map(item => ({
          variantId: item.variantId,
          quantity: item.quantity,
          customPrice: item.customPrice, // Your calculated price!
          customAttributes: [
            { key: "Custom Size", value: item.customSize },
            { key: "Design URL", value: item.designUrl }
          ]
        }))
      }
    }
  });

  return { invoiceUrl: draftOrder.draftOrderCreate.draftOrder.invoiceUrl };
});
```

### Option 2: Cart Transform Functions (Modern Shopify Plus)

**How it works:**
- Shopify Functions API to modify cart prices at checkout
- Requires Shopify Plus plan
- Function runs at checkout to adjust prices

**Pros:**
- Native Shopify integration
- Scales automatically
- Fast execution

**Cons:**
- Requires Shopify Plus ($2000+/month)
- More complex to set up
- Limited to certain use cases

### Option 3: Dynamic Product Variants (Current Approach Alternative)

**How it works:**
- Create actual Shopify variants for each size/quantity combo
- Set real prices in Shopify admin
- No custom pricing logic needed

**Pros:**
- Simple, uses standard checkout
- No custom code needed
- Works with Storefront API

**Cons:**
- MANY variants needed (size × quantity combos)
- Hard to maintain pricing updates
- Shopify variant limits (100 per product)
- Not scalable for truly custom sizes

### Option 4: Manual Order Processing

**How it works:**
- Let customers "checkout" with $0 order
- Capture their selections via attributes
- Send invoice manually via Shopify admin or payment link

**Pros:**
- Simplest implementation
- No additional API work
- Flexible pricing

**Cons:**
- Manual work required
- Poor customer experience
- Not automated
- No instant confirmation

## Recommended Solution: Draft Orders

For your use case (custom sizes, custom quantities, dynamic pricing), **Draft Orders** is the best fit.

### Implementation Plan

1. **Backend Setup:**
   - Add Shopify Admin API credentials
   - Create `/server/api/checkout/create-draft-order.post.ts`
   - Implement draft order creation with custom pricing

2. **Cart Update:**
   - Replace direct checkout URL with custom checkout flow
   - When user clicks "Checkout", call your API to create draft order
   - Redirect to draft order invoice URL

3. **Order Processing:**
   - Draft orders appear in Shopify admin
   - Customer pays through invoice link
   - Shopify processes payment and fulfillment normally

### Code Changes Needed

1. **Add Admin API credentials** to `.env`:
   ```env
   SHOPIFY_ADMIN_ACCESS_TOKEN=your_admin_api_token
   ```

2. **Create draft order API route**
3. **Update cart checkout flow** to use draft orders
4. **Handle success/failure callbacks**

### Alternative: Quick Fix (Not Recommended)

If you need a temporary solution:
1. Set actual variant prices in Shopify to match your $20 minimum
2. Add prominent note: "Final price will be calculated and confirmed before processing"
3. Manually review orders and send adjusted invoices

## Next Steps

1. Choose a solution (recommend Draft Orders)
2. Get Shopify Admin API access token
3. Implement draft order creation
4. Update checkout flow
5. Test with real products

## Resources

- [Shopify Draft Orders API](https://shopify.dev/docs/api/admin-rest/2024-01/resources/draftorder)
- [Cart Transforms (Plus)](https://shopify.dev/docs/apps/build/purchase-options/subscriptions/cart-transforms)
- [Line Item Attributes](https://shopify.dev/docs/api/storefront/2024-01/objects/Attribute)
