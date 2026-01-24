# Code Cleanup Plan

## Files to Remove (Deprecated/Unused)

### 1. Mock Cart System ❌ DELETE
Since you're using Shopify cart exclusively now:
- `app/composables/useCart.ts` - Wrapper around mock cart store
- `app/stores/cart.ts` - Mock cart implementation
- Only keep: `useUnifiedCart.ts` and `shopifyCart.ts`

### 2. Local Product Data ⚠️ KEEP (but minimal usage)
- `app/data/products.ts` - Still used by Navbar for dropdown menu
- **Action**: Update Navbar to use Shopify data instead
- Then we can remove this file

## Files Currently Using Local Products Data

1. **Navbar.vue** - Uses for dropdown menu generation
2. **BestSellers.vue** - Uses getFeaturedProducts()
3. **ProductCard.vue** - Uses Product type
4. **pages/products/index.vue** - Currently displays local products

## Cleanup Steps

### Step 1: Remove Mock Cart (Safe - Not Used Anymore)
```bash
rm app/composables/useCart.ts
rm app/stores/cart.ts
```

### Step 2: Update Components to Use Shopify Only

#### A. Update Navbar Dropdown
Replace local products with Shopify collection products

#### B. Update BestSellers Component
Fetch from Shopify instead of local data

#### C. Update Products Index Page
Already fetches from Shopify, but might import types from local data

### Step 3: Remove Local Products Data
After all components are updated:
```bash
rm app/data/products.ts
```

### Step 4: Clean Up Unused Utilities
Check if `shopifyVariants.ts` still needs Product type

## Files to Keep

### Composables ✅
- `useCloudinary.ts` - Image upload/delete
- `useHeroAnimation.ts` - Homepage animations
- `usePricing.ts` - Dynamic pricing calculations
- `useScrollAnimation.ts` - Scroll animations
- `useShopify.ts` - Shopify API wrapper
- `useShopifyProducts.ts` - Product fetching
- `useTheme.ts` - Dark/light mode
- `useToast.ts` - Toast notifications
- `useUnifiedCart.ts` - Cart abstraction (Shopify + future mock mode)

### Stores ✅
- `shopifyCart.ts` - Shopify cart state management

## Code Complexity to Review

### 1. ProductOptions.vue (654 lines)
Large component, consider splitting:
- Image upload section → `ImageUpload.vue`
- Size selector → `SizeSelector.vue`
- Material selector → `MaterialSelector.vue`
- Quantity selector → `QuantitySelector.vue`
- Price breakdown → `PriceBreakdown.vue`

**Decision**: Keep as-is for now (works well, breaking it up adds complexity)

### 2. Navbar.vue (541 lines)
Complex navigation with mobile/desktop logic
**Decision**: Keep as-is (single source of truth for navigation)

### 3. Product Page [slug].vue (340 lines)
Reasonable size, handles product loading and cart addition
**Decision**: Keep as-is

## Debug Code to Remove

### Product Page Debug Logs
Lines 198-213 in `[slug].vue`:
```typescript
console.log('🔍 Looking for variant:', { size, material });
console.log('📦 Available variants:');
shopifyProduct.value.variants.edges.forEach((edge, i) => {
  console.log(`  ${i + 1}. ${edge.node.title} (ID: ${edge.node.id})`);
});
```

**Action**: Remove or wrap in `if (process.dev)` checks

### Add to Cart Debug Logs
Lines 228-293 in `[slug].vue`:
```typescript
console.log('🛒 Add to cart clicked');
console.log('📦 Options:', { ... });
console.log('🔍 Variant lookup:', { ... });
console.log('📤 Adding to cart...');
console.log('💰 Pricing:', { ... });
console.log('✅ Successfully added to cart!');
```

**Action**: Remove or wrap in development mode checks

### Cloudinary Debug Logs
Line 12-16 in `server/api/upload/image.ts`:
```typescript
console.log('🔧 Cloudinary Config:', {
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey ? '***' + config.cloudinaryApiKey.slice(-4) : 'undefined',
  api_secret: config.cloudinaryApiSecret ? '***' : 'undefined',
});
```

**Action**: Remove for production

### Cart Debug Logs
Lines 124, 132 in `shopifyCart.ts`:
```typescript
console.log('✅ Loaded existing cart:', existingCart.id);
console.log('🆕 No saved cart, creating new one');
```

**Action**: Keep (useful for debugging cart issues)

## Estimated Cleanup Impact

- **Files removed**: 2 (useCart.ts, cart.ts, eventually products.ts)
- **Lines removed**: ~500-600 lines
- **Reduced bundle size**: ~10-15KB
- **Improved maintainability**: 1 cart system instead of 2

## Priority

1. **High Priority** - Remove mock cart (not used, confusing)
2. **Medium Priority** - Remove debug logs (production-ready)
3. **Low Priority** - Remove local products data (works, but redundant)
4. **Optional** - Split large components (working fine as-is)

---

Ready to execute? Let me know which parts you want to clean up!
