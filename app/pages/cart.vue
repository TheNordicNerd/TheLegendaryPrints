<template>
  <Section inner-classes="p-4 py-12">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-4xl lg:text-5xl mb-8 text-text-primary">Shopping Cart</h1>

      <!-- Empty Cart State -->
      <div
        v-if="isEmpty"
        class="text-center py-16 bg-surface-raised rounded-lg border border-border-subtle"
      >
        <Icon name="i-lucide-shopping-cart" size="64" class="text-text-tertiary mx-auto mb-4" />
        <h2 class="text-2xl font-bold text-text-primary mb-2">Your cart is empty</h2>
        <p class="text-text-secondary mb-6">Add some products to get started!</p>
        <Button variant="primary" size="lg" rounded="lg" to="/products" icon-left="i-lucide-package">
          Browse Products
        </Button>
      </div>

      <!-- Cart Items -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Items List -->
        <div class="lg:col-span-2 space-y-4">
          <div
            v-for="item in items"
            :key="item.id"
            class="cart-item bg-surface-raised p-6 rounded-lg border border-border-subtle"
          >
            <div class="flex gap-6">
              <!-- Product Image Thumbnail -->
              <div
                v-if="item.uploadedImage"
                class="w-24 h-24 rounded-lg bg-surface-sunken border border-border-subtle flex-shrink-0 overflow-hidden"
              >
                <img
                  :src="item.uploadedImage"
                  :alt="item.uploadedFileName || 'Product image'"
                  class="w-full h-full object-cover"
                />
              </div>
              <div
                v-else
                class="w-24 h-24 rounded-lg bg-surface-sunken border border-border-subtle flex-shrink-0 flex items-center justify-center"
              >
                <Icon name="i-lucide-image" size="32" class="text-text-tertiary" />
              </div>

              <!-- Item Details -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 class="text-lg font-bold text-text-primary mb-1">
                      <NuxtLink
                        :to="`/products/${item.productSlug}`"
                        class="hover:text-accent-700 transition-colors"
                      >
                        {{ item.productName }}
                      </NuxtLink>
                    </h3>
                    <p class="text-sm text-text-secondary">
                      Size:
                      {{ item.customSize || item.size }}" × {{ item.customSize || item.size }}"
                    </p>
                    <p class="text-sm text-text-secondary capitalize">Material: {{ item.material }}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="i-lucide-trash-2"
                    aria-label="Remove item"
                    @click="removeFromCart(item.id)"
                    class="text-error-500 hover:text-error-600 hover:bg-error-50"
                  />
                </div>

                <!-- Quantity and Price -->
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="text-sm text-text-secondary">Quantity:</span>
                    <span class="font-medium text-text-primary">
                      {{
                        (item.customQuantity && item.customQuantity >= 1000
                          ? item.customQuantity
                          : item.quantity
                        ).toLocaleString()
                      }}
                    </span>
                  </div>
                  <div class="text-right">
                    <div class="text-xs text-text-secondary">
                      ${{ item.pricePerUnit.toFixed(2) }} per unit
                    </div>
                    <div class="text-xl font-black text-accent-700">
                      ${{ item.totalPrice.toFixed(2) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Cart Summary -->
        <div class="lg:col-span-1">
          <div
            class="cart-summary bg-surface-raised p-6 rounded-lg border-2 border-accent-700 shadow-lg sticky top-24"
          >
            <h2 class="text-2xl font-bold text-text-primary mb-6">Order Summary</h2>

            <div class="space-y-3 mb-6">
              <div class="flex justify-between text-text-secondary">
                <span>Items:</span>
                <span class="font-medium text-text-primary">{{ itemCount }}</span>
              </div>
              <div class="flex justify-between text-text-secondary">
                <span>Total Quantity:</span>
                <span class="font-medium text-text-primary">{{ totalQuantity.toLocaleString() }}</span>
              </div>
            </div>

            <div class="border-t-2 border-border-default pt-4 mb-6">
              <div class="flex items-baseline justify-between">
                <span class="text-lg font-bold text-text-primary">Subtotal:</span>
                <div class="text-right">
                  <div class="text-3xl font-black text-accent-700">{{ formattedTotalPrice }}</div>
                  <div class="text-xs text-text-secondary">+ shipping</div>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              :full-width="true"
              rounded="lg"
              icon-right="i-lucide-credit-card"
              right-icon-size="20"
              @click="handleCheckout"
            >
              Proceed to Checkout
            </Button>

            <Button
              variant="ghost"
              size="md"
              :full-width="true"
              rounded="lg"
              class="mt-3"
              @click="handleContinueShopping"
            >
              Continue Shopping
            </Button>

            <button
              @click="handleClearCart"
              class="w-full mt-4 text-sm text-error-500 hover:text-error-600 font-medium transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  </Section>
</template>

<script setup lang="ts">
  // Use unified cart (switches between mock and Shopify based on config)
  const cart = useUnifiedCart();
  const { items, itemCount, totalQuantity, formattedTotalPrice, isEmpty } = cart;
  const router = useRouter();

  const removeFromCart = async (id: string) => {
    await cart.removeItem(id);
  };

  const clearCart = async () => {
    await cart.clearCart();
  };

  // SEO Meta Tags
  useSeoMeta({
    title: "Shopping Cart | Review Your Order - TLP",
    description:
      "Review custom sticker order. View cart items, adjust quantities, and checkout for fast professional printing with 3-5 day delivery.",
    ogTitle: "Shopping Cart | Review Order - TLP",
    ogDescription: "Review and complete your custom sticker order with fast professional printing and delivery.",
    robots: "noindex, nofollow", // Cart pages shouldn't be indexed
  });

  const handleCheckout = () => {
    if (cart.isShopifyMode) {
      // Shopify mode: Redirect to Shopify's secure checkout
      const checkoutUrl = cart.checkoutUrl.value;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        alert("Unable to create checkout. Please try again.");
      }
    } else {
      // Mock mode: Show placeholder or redirect to custom checkout
      // TODO: Implement custom checkout page at /checkout
      alert("Checkout functionality coming soon! Switch to Shopify mode for real checkout.");
    }
  };

  const handleContinueShopping = () => {
    router.push("/products");
  };

  const handleClearCart = () => {
    if (confirm("Are you sure you want to clear your cart?")) {
      clearCart();
    }
  };
</script>

<style scoped>
  .cart-item {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .cart-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .cart-summary {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .cart-item,
    .cart-summary {
      transition-duration: 0.01ms !important;
    }
  }
</style>
