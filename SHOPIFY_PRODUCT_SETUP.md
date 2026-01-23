# Shopify Product Setup Guide

This guide explains how to set up products in Shopify and connect them to your website.

## Overview

To use Shopify mode, you need to:
1. Create products in Shopify Admin
2. Get the Shopify Variant IDs for each product option
3. Add those IDs to your product data in `app/data/products.ts`

---

## Step 1: Create Products in Shopify

### Example Product: Die Cut Stickers

1. **Go to Shopify Admin** → Products → Add product

2. **Product Details:**
   - Title: `Die Cut Stickers`
   - Description: Your product description
   - Product type: `Stickers`
   - Vendor: `The Legendary Prints`

3. **Add Variants:**

   Each combination of size and material needs a variant. For example:

   | Size | Material | Price | SKU |
   |------|----------|-------|-----|
   | 2" | Vinyl | $5.00 | DIE-2-VINYL |
   | 2" | Matte | $6.00 | DIE-2-MATTE |
   | 2" | Glossy | $6.50 | DIE-2-GLOSSY |
   | 2" | Holographic | $9.00 | DIE-2-HOLO |
   | 3" | Vinyl | $8.00 | DIE-3-VINYL |
   | 3" | Matte | $9.60 | DIE-3-MATTE |
   | ... | ... | ... | ... |

4. **Set up Variant Options:**
   - Option 1 name: `Size`
     - Values: 2", 3", 4", 5", etc.
   - Option 2 name: `Material`
     - Values: Vinyl, Matte, Glossy, Holographic

5. **Save the product**

---

## Step 2: Get Shopify Variant IDs

You need to get the Shopify ID for each variant. There are two methods:

### Method A: Using GraphQL API Explorer (Recommended)

1. Go to your Shopify Admin
2. Navigate to **Apps** → **Develop apps** → Your app → **API credentials**
3. Click **Storefront API** tab
4. Use the **GraphQL Explorer**

Run this query:

```graphql
{
  products(first: 50) {
    edges {
      node {
        id
        handle
        title
        variants(first: 50) {
          edges {
            node {
              id
              title
              selectedOptions {
                name
                value
              }
              price {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
}
```

This will return all products and their variant IDs. Look for something like:

```json
{
  "id": "gid://shopify/ProductVariant/44234567890123",
  "title": "2\" / Vinyl",
  "selectedOptions": [
    { "name": "Size", "value": "2\"" },
    { "name": "Material", "value": "Vinyl" }
  ]
}
```

### Method B: Using the Shopify API (programmatic)

Create a script in `scripts/fetch-shopify-variants.ts`:

```typescript
// This script fetches all variants from your Shopify store
const SHOPIFY_STORE_DOMAIN = 'your-store.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = 'your_token_here';

const query = `
{
  products(first: 50) {
    edges {
      node {
        id
        handle
        title
        variants(first: 50) {
          edges {
            node {
              id
              title
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
    }
  }
}
`;

const response = await fetch(
  `https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query }),
  }
);

const data = await response.json();
console.log(JSON.stringify(data, null, 2));
```

Run with:
```bash
npx tsx scripts/fetch-shopify-variants.ts
```

---

## Step 3: Add Variant IDs to Product Data

Update `app/data/products.ts` with the Shopify variant IDs:

```typescript
export const products: Product[] = [
  {
    id: "die-cut-stickers",
    name: "Die Cut Stickers",
    slug: "die-cut-stickers",
    description: "Custom die-cut stickers...",
    icon: "i-lucide-sticker",
    category: "die-cut",
    tags: ["custom-shape", "precision-cut", "popular"],
    thumbnailImg: "https://...",
    featured: true,

    // Add Shopify integration
    shopifyProductId: "gid://shopify/Product/8234567890123",
    shopifyVariants: [
      // 2" variants
      {
        size: 2,
        material: "vinyl",
        variantId: "gid://shopify/ProductVariant/44234567890123",
      },
      {
        size: 2,
        material: "matte",
        variantId: "gid://shopify/ProductVariant/44234567890124",
      },
      {
        size: 2,
        material: "glossy",
        variantId: "gid://shopify/ProductVariant/44234567890125",
      },
      {
        size: 2,
        material: "holographic",
        variantId: "gid://shopify/ProductVariant/44234567890126",
      },

      // 3" variants
      {
        size: 3,
        material: "vinyl",
        variantId: "gid://shopify/ProductVariant/44234567890127",
      },
      {
        size: 3,
        material: "matte",
        variantId: "gid://shopify/ProductVariant/44234567890128",
      },
      // ... add all size/material combinations
    ],
  },
  // ... other products
];
```

---

## Step 4: Test the Integration

1. **Switch to Shopify mode:**
   ```env
   NUXT_PUBLIC_CART_MODE=shopify
   ```

2. **Add Shopify credentials:**
   ```env
   SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_token_here
   ```

3. **Restart dev server:**
   ```bash
   npm run dev
   ```

4. **Test adding to cart:**
   - Go to a product page
   - Select size and material
   - Click "Add to Cart"
   - Check that the item appears in cart
   - Click "Checkout" - should redirect to Shopify checkout

---

## Mapping Reference

### How the Variant Mapping Works

When a customer selects options on your product page:
- **User selects:** Size: 3", Material: Matte
- **Your code calls:** `getShopifyVariantId(product, 3, "matte")`
- **Function returns:** `"gid://shopify/ProductVariant/44234567890128"`
- **Added to Shopify cart** with that variant ID

### Important Notes

1. **Size format:** Use numbers (2, 3, 4, 5) not strings ("2\"")
2. **Material format:** Use lowercase (vinyl, matte, glossy, holographic)
3. **Exact matches:** Size and material must match exactly what's in your `shopifyVariants` array
4. **All combinations:** You need a variant for every size/material combination customers can select

---

## Common Issues

### "No Shopify variant found"

**Problem:** Product doesn't have variant configured for selected options.

**Solution:**
1. Check that product has `shopifyVariants` array
2. Verify size/material combination exists
3. Check for typos in material name (case-sensitive)

### "This product is not available in Shopify"

**Problem:** Product has no `shopifyVariants` at all.

**Solutions:**
1. Add Shopify variants to product data (see Step 3)
2. OR temporarily switch to mock mode for testing

### Variant ID not working

**Problem:** Invalid variant ID or variant doesn't exist in Shopify.

**Solution:**
1. Verify variant exists in Shopify admin
2. Check that variant ID is correct format: `gid://shopify/ProductVariant/[number]`
3. Use GraphQL explorer to get correct IDs

---

## Quick Start Checklist

- [ ] Create products in Shopify Admin
- [ ] Set up variants for all size/material combinations
- [ ] Get variant IDs using GraphQL API
- [ ] Add `shopifyProductId` and `shopifyVariants` to products in `app/data/products.ts`
- [ ] Add Shopify credentials to `.env`
- [ ] Set `NUXT_PUBLIC_CART_MODE=shopify`
- [ ] Restart dev server
- [ ] Test add to cart → checkout flow

---

## Example: Complete Product Setup

```typescript
{
  id: "kiss-cut-stickers",
  name: "Kiss Cut Stickers",
  slug: "kiss-cut-stickers",
  description: "Kiss cut stickers with backing...",
  icon: "i-lucide-scissors",
  category: "kiss-cut",
  tags: ["easy-peel", "with-backing"],
  thumbnailImg: "https://...",

  shopifyProductId: "gid://shopify/Product/8234567890456",
  shopifyVariants: [
    // Small sizes
    { size: 2, material: "vinyl", variantId: "gid://shopify/ProductVariant/44234567890200" },
    { size: 2, material: "matte", variantId: "gid://shopify/ProductVariant/44234567890201" },
    { size: 2, material: "glossy", variantId: "gid://shopify/ProductVariant/44234567890202" },
    { size: 2, material: "holographic", variantId: "gid://shopify/ProductVariant/44234567890203" },

    // Medium sizes
    { size: 3, material: "vinyl", variantId: "gid://shopify/ProductVariant/44234567890204" },
    { size: 3, material: "matte", variantId: "gid://shopify/ProductVariant/44234567890205" },
    { size: 3, material: "glossy", variantId: "gid://shopify/ProductVariant/44234567890206" },
    { size: 3, material: "holographic", variantId: "gid://shopify/ProductVariant/44234567890207" },

    // Add more as needed...
  ],
}
```

---

## Need Help?

- See [SHOPIFY_SETUP.md](./SHOPIFY_SETUP.md) for initial Shopify configuration
- See [CART_SYSTEMS.md](./CART_SYSTEMS.md) for cart mode documentation
- Check Shopify's [Storefront API docs](https://shopify.dev/api/storefront)
