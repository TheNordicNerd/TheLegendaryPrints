# Cart Systems Documentation

This project supports two cart systems that can be toggled via environment configuration.

## Available Cart Systems

### 1. Mock Cart (Default)
- **Local storage** - Cart data stored in browser localStorage
- **Mock products** - Uses products from `~/data/products.ts`
- **Local pricing** - Prices calculated on the frontend
- **No checkout** - Simple alert/placeholder checkout
- **Best for**: Development, testing, demos without Shopify account

### 2. Shopify Cart
- **Shopify Storefront API** - Cart managed by Shopify
- **Real products** - Products from your Shopify store
- **Shopify pricing** - Prices managed in Shopify admin
- **Real checkout** - Redirects to Shopify's secure checkout
- **Best for**: Production, real transactions, inventory management

---

## Configuration

### Environment Variable

Set the cart mode in your `.env` file:

```env
# Use mock cart (default)
NUXT_PUBLIC_CART_MODE=mock

# OR use Shopify cart
NUXT_PUBLIC_CART_MODE=shopify
```

### Shopify Requirements

If using Shopify mode, you also need:

```env
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token_here
```

See [SHOPIFY_SETUP.md](./SHOPIFY_SETUP.md) for complete Shopify setup instructions.

---

## Using the Unified Cart

### In Components

Use the `useUnifiedCart()` composable which automatically uses the correct cart system:

```vue
<script setup lang="ts">
const cart = useUnifiedCart();

// Check which mode is active
console.log(cart.cartMode); // "mock" or "shopify"

// Add item to cart (works for both systems)
await cart.addItem({
  // Mock mode fields
  productId: 'product-1',
  productName: 'Custom Stickers',
  productSlug: 'custom-stickers',
  size: 3,
  material: 'vinyl',
  quantity: 100,
  pricePerUnit: 0.50,
  totalPrice: 50.00,

  // Shopify mode fields
  merchandiseId: 'gid://shopify/ProductVariant/123456',
});

// Access cart data (same API for both)
console.log(cart.items.value);
console.log(cart.itemCount.value);
console.log(cart.formattedTotalPrice.value);
console.log(cart.isEmpty.value);
</script>
```

### Cart Methods

All methods work with both systems:

```typescript
// Add item
await cart.addItem({ ...data });

// Remove item
await cart.removeItem(itemId);

// Update quantity
await cart.updateQuantity(itemId, newQuantity);

// Clear cart
await cart.clearCart();

// Initialize cart (Shopify only, no-op for mock)
await cart.initCart();

// Refresh cart (Shopify only, no-op for mock)
await cart.refreshCart();
```

### Cart State

Access cart state (reactive computed properties):

```typescript
cart.items           // Array of cart items
cart.itemCount       // Number of unique items
cart.totalQuantity   // Total quantity of all items
cart.totalPrice      // Total price (string in Shopify, number in mock)
cart.formattedTotalPrice  // Formatted price string
cart.isEmpty         // Boolean - is cart empty
cart.isLoading       // Boolean - loading state (Shopify only)
cart.error           // String | null - error message (Shopify only)
cart.checkoutUrl     // String | null - Shopify checkout URL (Shopify only)
```

---

## Implementation Details

### Mock Cart System

**Files:**
- `app/composables/useCart.ts` - Cart composable
- `app/stores/cart.ts` - Pinia store for cart state
- `app/data/products.ts` - Mock product data

**Features:**
- Persists to localStorage
- Client-side pricing calculation
- No external API calls
- Instant updates

**Limitations:**
- No real checkout
- No inventory management
- No order tracking
- No payment processing

### Shopify Cart System

**Files:**
- `app/composables/useShopify.ts` - Shopify API composable
- `app/stores/shopifyCart.ts` - Pinia store for Shopify cart
- `server/api/shopify/**` - API routes for Shopify
- `server/utils/shopify.ts` - Shopify GraphQL client

**Features:**
- Real Shopify products
- Secure checkout via Shopify
- Inventory management
- Order tracking in Shopify admin
- Payment processing
- Tax calculation
- Shipping rates

**Limitations:**
- Requires Shopify account
- API rate limits apply
- Network latency for API calls

---

## Migration Between Systems

### From Mock to Shopify

1. Set up Shopify store and products
2. Add Shopify credentials to `.env`
3. Change `NUXT_PUBLIC_CART_MODE=shopify`
4. Map mock product IDs to Shopify variant IDs
5. Update product pages to use Shopify data
6. Test checkout flow

### From Shopify to Mock

1. Change `NUXT_PUBLIC_CART_MODE=mock`
2. Ensure mock products exist in `~/data/products.ts`
3. No other changes needed (unified cart handles it)

---

## Checkout Flow

### Mock Cart

```
1. User clicks "Checkout"
   ↓
2. Alert placeholder
   ↓
3. Manual order processing (if needed)
```

### Shopify Cart

```
1. User clicks "Checkout"
   ↓
2. cart.checkoutUrl redirects to Shopify
   ↓
3. Customer completes payment (Shopify)
   ↓
4. Shopify processes order
   ↓
5. Redirect back to thank you page
```

---

## API Compatibility

The unified cart provides a consistent API regardless of mode:

| Method | Mock | Shopify | Notes |
|--------|------|---------|-------|
| `addItem()` | ✅ | ✅ | Different required fields |
| `removeItem()` | ✅ | ✅ | Same signature |
| `updateQuantity()` | ✅ | ✅ | Same signature |
| `clearCart()` | ✅ | ✅ | Same signature |
| `initCart()` | No-op | ✅ | Loads cart from Shopify |
| `refreshCart()` | No-op | ✅ | Syncs with Shopify |

---

## Switching Modes at Runtime

The cart mode is set at **build time** via environment variables and cannot be changed at runtime. To switch modes:

1. Update `.env` file
2. Restart dev server or rebuild
3. Clear localStorage (optional, to reset cart)

---

## Best Practices

### Development
- Use **mock mode** for local development
- Faster iteration, no API limits
- No Shopify account needed

### Staging
- Use **Shopify mode** with test store
- Test full checkout flow
- Verify product sync

### Production
- Use **Shopify mode** only
- Real products and checkout
- Monitor for API errors

---

## Troubleshooting

### Cart not persisting
- **Mock**: Check localStorage is enabled
- **Shopify**: Check cart ID is saved to localStorage

### Products not loading
- **Mock**: Verify products exist in `~/data/products.ts`
- **Shopify**: Check API credentials and permissions

### Checkout not working
- **Mock**: Expected - implement custom checkout or use Shopify
- **Shopify**: Verify `checkoutUrl` is returned from API

### Type errors
- Ensure you're passing the correct fields for the active mode
- Mock requires full product details
- Shopify requires `merchandiseId`

---

## Future Enhancements

- [ ] Add runtime mode switching via admin panel
- [ ] Support for additional cart systems (Stripe, custom)
- [ ] Automatic product sync between mock and Shopify
- [ ] Cart migration tool for switching modes
- [ ] Analytics integration for both systems
