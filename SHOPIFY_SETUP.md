# Shopify Storefront API Integration Guide

Complete guide to setting up and using the Shopify integration.

## 📋 Table of Contents

1. [Shopify Setup](#shopify-setup)
2. [Environment Configuration](#environment-configuration)
3. [API Endpoints](#api-endpoints)
4. [Frontend Usage](#frontend-usage)
5. [Checkout Flow](#checkout-flow)
6. [Testing](#testing)

---

## 🛍️ Shopify Setup

### Step 1: Create a Shopify Store

1. Go to [Shopify](https://www.shopify.com/)
2. Sign up for a store (you can use a development store for free)
3. Complete the basic setup

### Step 2: Create a Custom App

1. In your Shopify admin, go to **Settings > Apps and sales channels**
2. Click **Develop apps**
3. Click **Create an app**
4. Name it: "The Legendary Prints Website"
5. Click **Create app**

### Step 3: Configure API Permissions

1. Click **Configure Storefront API scopes**
2. Enable these permissions:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_read_product_tags`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_checkouts`

3. Click **Save**

### Step 4: Get API Credentials

1. Click **API credentials** tab
2. Under **Storefront API access token**, click **Install app**
3. Copy the **Storefront API access token**
4. Your store domain is: `your-store.myshopify.com`

---

## ⚙️ Environment Configuration

### 1. Copy the example environment file

```bash
cp .env.example .env
```

### 2. Add your Shopify credentials

```env
# .env
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token_here

NUXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Restart your development server

```bash
npm run dev
```

---

## 🔌 API Endpoints

All Shopify API routes are prefixed with `/api/shopify/`

### Products

#### Get all products
```http
GET /api/shopify/products
Query Parameters:
  - limit: number (default 20, max 250)
  - query: string (search query)
  - sortKey: string (TITLE, PRICE, CREATED_AT, etc.)
  - reverse: boolean
```

#### Get product by handle
```http
GET /api/shopify/products/:handle
```

### Cart

#### Create cart
```http
POST /api/shopify/cart/create
Body: {
  lines?: Array<{
    merchandiseId: string,
    quantity: number
  }>
}
```

#### Get cart
```http
GET /api/shopify/cart/:id
```

#### Add items to cart
```http
POST /api/shopify/cart/add-lines
Body: {
  cartId: string,
  lines: Array<{
    merchandiseId: string,
    quantity: number
  }>
}
```

#### Update cart quantities
```http
POST /api/shopify/cart/update-lines
Body: {
  cartId: string,
  lines: Array<{
    id: string,
    quantity: number
  }>
}
```

#### Remove items from cart
```http
POST /api/shopify/cart/remove-lines
Body: {
  cartId: string,
  lineIds: Array<string>
}
```

---

## 💻 Frontend Usage

### Using the Composable

```vue
<script setup lang="ts">
const { getProducts, getProduct, formatPrice } = useShopify();

// Fetch products
const products = await getProducts({
  limit: 20,
  query: 'stickers',
  sortKey: 'PRICE',
  reverse: false
});

// Fetch single product
const product = await getProduct('custom-sticker-pack');

// Format price
const formattedPrice = formatPrice('19.99', 'USD'); // $19.99
</script>
```

### Using the Cart Store

```vue
<script setup lang="ts">
const cartStore = useShopifyCartStore();

// Initialize cart (call once in app.vue or layout)
await cartStore.initCart();

// Add item to cart
await cartStore.addItem('gid://shopify/ProductVariant/123456', 2);

// Update quantity
await cartStore.updateQuantity('gid://shopify/CartLine/123', 3);

// Remove item
await cartStore.removeItem('gid://shopify/CartLine/123');

// Access cart data
console.log(cartStore.itemCount); // Total items
console.log(cartStore.formattedTotal); // $49.99
console.log(cartStore.items); // Array of cart items
console.log(cartStore.checkoutUrl); // Shopify checkout URL
</script>
```

---

## 🛒 Checkout Flow

### Architecture

The checkout is handled by Shopify's secure checkout page. Here's the flow:

```
1. User adds items to cart (your site)
   ↓
2. Cart managed via Storefront API (your site)
   ↓
3. User clicks "Checkout" button
   ↓
4. Redirect to Shopify checkout URL (secure Shopify page)
   ↓
5. Customer completes payment (Shopify)
   ↓
6. Redirect back to your site (confirmation page)
```

### Implementation

#### 1. Cart Page Component

```vue
<template>
  <div>
    <h1>Shopping Cart</h1>

    <!-- Cart Items -->
    <div v-for="item in cartStore.items" :key="item.id">
      <h3>{{ item.merchandise.product.title }}</h3>
      <p>{{ item.merchandise.title }}</p>
      <p>{{ formatPrice(item.cost.totalAmount.amount) }}</p>

      <button @click="cartStore.updateQuantity(item.id, item.quantity - 1)">-</button>
      <span>{{ item.quantity }}</span>
      <button @click="cartStore.updateQuantity(item.id, item.quantity + 1)">+</button>

      <button @click="cartStore.removeItem(item.id)">Remove</button>
    </div>

    <!-- Cart Summary -->
    <div>
      <p>Subtotal: {{ cartStore.formattedSubtotal }}</p>
      <p>Tax: {{ cartStore.formattedTax }}</p>
      <p>Total: {{ cartStore.formattedTotal }}</p>

      <!-- Checkout Button -->
      <a :href="cartStore.checkoutUrl" class="checkout-button">
        Proceed to Secure Checkout
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
const cartStore = useShopifyCartStore();
const { formatPrice } = useShopify();
</script>
```

#### 2. Product Page - Add to Cart

```vue
<template>
  <div>
    <h1>{{ product.title }}</h1>
    <p>{{ formatPrice(product.priceRange.minVariantPrice.amount) }}</p>

    <!-- Variant Selector -->
    <select v-model="selectedVariantId">
      <option
        v-for="variant in product.variants.edges"
        :key="variant.node.id"
        :value="variant.node.id"
        :disabled="!variant.node.availableForSale"
      >
        {{ variant.node.title }} - {{ formatPrice(variant.node.price.amount) }}
      </option>
    </select>

    <!-- Add to Cart -->
    <button
      @click="addToCart"
      :disabled="cartStore.isLoading"
    >
      {{ cartStore.isLoading ? 'Adding...' : 'Add to Cart' }}
    </button>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const cartStore = useShopifyCartStore();
const { getProduct, formatPrice } = useShopify();

const product = await getProduct(route.params.handle as string);
const selectedVariantId = ref(product.variants.edges[0].node.id);

const addToCart = async () => {
  await cartStore.addItem(selectedVariantId.value, 1);
  // Show success message or redirect to cart
  alert('Added to cart!');
};
</script>
```

#### 3. Initialize Cart in Layout

```vue
<!-- app.vue or layouts/default.vue -->
<script setup lang="ts">
const cartStore = useShopifyCartStore();

// Initialize cart on app mount
onMounted(async () => {
  await cartStore.initCart();
});
</script>
```

---

## 🧪 Testing

### Test with Mock Data

Before connecting to Shopify, you can test with mock data:

```typescript
// server/api/shopify/products.get.ts (add at top for testing)
const MOCK_MODE = !process.env.SHOPIFY_STORE_DOMAIN;

if (MOCK_MODE) {
  return {
    products: [
      {
        id: 'mock-1',
        handle: 'custom-die-cut-stickers',
        title: 'Custom Die-Cut Stickers',
        description: 'Premium custom stickers...',
        // ... more mock data
      }
    ],
    pageInfo: {},
    count: 1
  };
}
```

### Test Checklist

- [ ] Products load from Shopify
- [ ] Product detail page displays correctly
- [ ] Can add items to cart
- [ ] Can update cart quantities
- [ ] Can remove items from cart
- [ ] Cart persists after page refresh
- [ ] Checkout URL redirects to Shopify
- [ ] Back button returns to site after checkout

---

## 🎯 Next Steps

1. **Create Products in Shopify**
   - Add your sticker products
   - Set prices and variants (size, quantity, etc.)
   - Upload product images
   - Set inventory

2. **Update Product Pages**
   - Replace mock product data with Shopify API calls
   - Add variant selectors
   - Implement add to cart functionality

3. **Customize Checkout**
   - Configure Shopify checkout branding
   - Set up payment methods
   - Configure shipping rates
   - Set up email notifications

4. **Test Everything**
   - Test complete purchase flow
   - Test different product variants
   - Test cart persistence
   - Test error handling

5. **Go Live**
   - Remove mock data
   - Update environment variables for production
   - Test with real Shopify store
   - Monitor for errors

---

## 📚 Resources

- [Shopify Storefront API Docs](https://shopify.dev/api/storefront)
- [Shopify GraphQL Explorer](https://shopify.dev/api/storefront/reference)
- [Checkout Customization](https://shopify.dev/themes/checkout)

---

## ⚠️ Important Notes

1. **Cart Storage**: Cart IDs are stored in localStorage for persistence
2. **Security**: API credentials are server-side only (.env file)
3. **Checkout**: Shopify handles all payment processing (PCI compliant)
4. **Inventory**: Shopify manages inventory automatically
5. **Orders**: All orders are managed in Shopify admin

---

## 🐛 Troubleshooting

**Problem**: "Shopify credentials not configured"
- **Solution**: Add credentials to `.env` file and restart server

**Problem**: Cart not persisting
- **Solution**: Check localStorage is enabled and cart ID is being saved

**Problem**: Products not loading
- **Solution**: Verify Storefront API scopes are enabled in Shopify

**Problem**: Checkout URL not working
- **Solution**: Ensure cart has items and Shopify checkout is enabled
