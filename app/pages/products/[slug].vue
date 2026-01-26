<template>
  <Section inner-classes="p-4">
    <!-- Loading State -->
    <div v-if="loadingShopify" class="text-center py-12">
      <div
        class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent-700 border-t-transparent"
      ></div>
      <p class="mt-4 text-text-secondary">Loading product...</p>
    </div>

    <!-- Product Content -->
    <div v-else-if="shopifyProduct">
      <Breadcrumb :path="route.path" />

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 py-8">
        <!-- Product Gallery -->
        <div class="product-gallery-container">
          <ProductGallery
            :images="productImages"
            :alt="shopifyProduct.title"
            :thumbnail-columns="4"
          />
        </div>

        <!-- Product Info -->
        <div class="product-info flex flex-col gap-6">
          <div class="border border-border-subtle p-4 rounded-lg">
            <h1 class="text-4xl lg:text-5xl mb-4 text-text-primary">{{ shopifyProduct.title }}</h1>
            <div
              class="max-w-none max-h-[400px] overflow-y-auto description"
              v-html="shopifyProduct.descriptionHtml"
            />
          </div>

          <!-- Product Options -->
          <ProductOptions
            ref="productOptionsRef"
            :product="shopifyProduct"
            :loading="loadingShopify"
          />

          <!-- Add to Cart Button -->
          <div>
            <Button
              variant="primary"
              :disabled="!productOptionsRef?.uploadedImage"
              size="lg"
              :full-width="true"
              rounded="lg"
              icon-right="i-lucide-shopping-cart"
              right-icon-size="20"
              @click="handleAddToCart"
            >
              Add to Cart
            </Button>
            <p
              v-if="!productOptionsRef?.uploadedImage"
              class="text-sm text-text-secondary mt-2 text-center"
            >
              Please upload a design to continue
            </p>
          </div>
        </div>
      </div>
    </div>
  </Section>
</template>

<script setup lang="ts">
  import type { ShopifyProduct } from "~/composables/useShopify";

  const route = useRoute();

  // Get slug from route params with proper type handling
  const slug = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug;

  // Handle case where slug is missing
  if (!slug) {
    throw createError({
      statusCode: 404,
      statusMessage: "Product Not Found",
      fatal: true,
    });
  }

  // Fetch Shopify product
  const shopifyProduct = ref<ShopifyProduct | null>(null);
  const loadingShopify = ref(true);

  const { fetchProductByHandle } = useShopifyProducts();

  // Fetch product on mount
  onMounted(async () => {
    try {
      const result = await fetchProductByHandle(slug);

      console.log({ result });

      if (result) {
        shopifyProduct.value = result;
      } else {
        throw new Error("Product not found");
      }
    } catch (err: any) {
      // Throw 404 if product not found
      throw createError({
        statusCode: 404,
        statusMessage: "Product Not Found",
        fatal: true,
      });
    } finally {
      loadingShopify.value = false;
    }
  });

  // Get product images
  const productImages = computed(() => {
    if (!shopifyProduct.value) return [];

    const images = shopifyProduct.value.images?.edges.map((e) => e.node.url) || [];

    // If no images in the images array, use featured image
    if (images.length === 0 && shopifyProduct.value.featuredImage?.url) {
      return [shopifyProduct.value.featuredImage.url];
    }

    return images;
  });

  // SEO Meta Tags & Structured Data - Dynamic per product
  watchEffect(() => {
    if (shopifyProduct.value) {
      const product = shopifyProduct.value;

      useSeoMeta({
        title: `${product.title} | Premium Custom Stickers - TLP`,
        description: `${product.description} Order waterproof vinyl stickers with fast delivery and free design support. Upload your design today!`,
        ogTitle: `${product.title} - Custom Printing`,
        ogDescription: `${product.description} Premium waterproof vinyl, fast 3-5 day delivery, professional quality stickers.`,
        ogImage: product.featuredImage?.url,
        ogType: "website",
        twitterCard: "summary_large_image",
        twitterTitle: `${product.title} | Custom Stickers - TLP`,
        twitterDescription: `${product.description} Waterproof vinyl with fast delivery.`,
        twitterImage: product.featuredImage?.url,
      });

      // Add JSON-LD structured data for better SEO
      useHead({
        script: [
          {
            type: "application/ld+json",
            innerHTML: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: product.title,
              description: product.description,
              image: product.featuredImage?.url,
              brand: {
                "@type": "Brand",
                name: "The Legendary Prints",
              },
              offers: {
                "@type": "AggregateOffer",
                priceCurrency: "USD",
                lowPrice: product.priceRange.minVariantPrice.amount,
                highPrice: product.priceRange.maxVariantPrice.amount,
                availability: product.availableForSale
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
                url: `https://thelegendaryprints.com/products/${product.handle}`,
              },
            }),
          },
        ],
      });
    }
  });

  // Product options ref
  const productOptionsRef = ref<any>(null);

  // Cart functionality
  const cart = useUnifiedCart();
  const toast = useToast();

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!productOptionsRef.value) {
      alert("Product options not loaded. Please refresh the page.");
      return;
    }

    if (!shopifyProduct.value) {
      alert("Product not loaded. Please refresh the page.");
      return;
    }

    const opts = productOptionsRef.value;

    // Get selected options and custom values from ProductOptions component
    const selections = opts.selections;
    const customValues = opts.customValues;
    const effectiveQuantity = opts.effectiveQuantity;

    console.log("RAW OPTIONS from component:", {
      selections,
      customValues,
      effectiveQuantity,
      allOpts: opts,
    });

    // Use the new composable to get variant info
    const { getVariantInfo } = useProductOptions(shopifyProduct.value);
    const variantInfo = getVariantInfo(selections, customValues);

    if (!variantInfo) {
      toast.error(`No matching product variant found for your selections`);
      return;
    }

    // Get effective size (for cart attributes only)
    let effectiveSize = 2; // Default
    const sizeSelection = selections.Size || selections.size;
    if (sizeSelection === "Custom" && customValues.Size) {
      effectiveSize = parseFloat(customValues.Size) || 2;
    } else if (sizeSelection) {
      // Parse size from string (e.g., "3\"" -> 3)
      effectiveSize = parseFloat(String(sizeSelection).replace(/[^0-9.]/g, "")) || 2;
    }

    // Get price from the selected variant
    const variantPrice = parseFloat(variantInfo.variant.price.amount);
    const totalPrice = variantPrice;
    const pricePerUnit = variantPrice; // Variant price is already per unit or total based on Shopify setup

    console.log("Add to cart - variant pricing:", {
      variantPrice,
      totalPrice,
      pricePerUnit,
      effectiveQuantity,
      effectiveSize,
    });

    // Add to cart
    // IMPORTANT: Add quantity as 1 to avoid double-multiplication
    // The totalPrice already includes the quantity (e.g., 500 stickers)
    // Store the actual quantity in customQuantity attribute
    try {
      await cart.addItem({
        merchandiseId: variantInfo.id,
        quantity: 1, // Always 1 to prevent Shopify from multiplying the price
        uploadedImage: opts.uploadedImageUrl || opts.uploadedImage,
        uploadedFileName: opts.uploadedFileName,
        customSize: effectiveSize,
        customQuantity: effectiveQuantity,
        customPrice: totalPrice.toFixed(2),
        customPricePerUnit: pricePerUnit.toFixed(2),
      });

      // Show success toast
      toast.success(
        `Added ${effectiveQuantity.toLocaleString()} ${shopifyProduct.value.title} to cart!`,
      );

      console.log(
        "✅ Added variant to cart:",
        variantInfo.variant.title,
        "at",
        variantInfo.variant.price,
      );
    } catch (error: any) {
      toast.error(`Failed to add to cart: ${error.message}`);
      return;
    }
  };
</script>

<style scoped>
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }

  .description {
    /* Base text styles */
    :deep(p) {
      color: var(--color-text-secondary);
      font-size: 1rem;
      line-height: 1.75;
      margin: 1rem 0;
    }

    /* Headings */
    :deep(h1),
    :deep(h2),
    :deep(h3),
    :deep(h4),
    :deep(h5),
    :deep(h6) {
      color: var(--color-text-primary);
      font-weight: 700;
      margin: 1.5rem 0 0.75rem 0;
      line-height: 1.3;
    }

    :deep(h1) {
      font-size: 2rem;
    }

    :deep(h2) {
      font-size: 1.75rem;
    }

    :deep(h3) {
      font-size: 1.5rem;
    }

    :deep(h4) {
      font-size: 1.25rem;
    }

    :deep(h5),
    :deep(h6) {
      font-size: 1.125rem;
    }

    /* First element shouldn't have top margin */
    :deep(*:first-child) {
      margin-top: 0;
    }

    /* Bold and strong text */
    :deep(strong),
    :deep(b) {
      color: var(--color-accent-700);
      font-weight: 600;
    }

    /* Italic text */
    :deep(em),
    :deep(i) {
      font-style: italic;
    }

    /* Links */
    :deep(a) {
      color: var(--color-accent-600);
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    :deep(a:hover) {
      color: var(--color-accent-700);
      text-decoration: underline;
    }

    /* Lists */
    :deep(ul),
    :deep(ol) {
      margin: 1rem 0;
      padding-left: 1.75rem;
      color: var(--color-text-secondary);
    }

    :deep(ul) {
      list-style-type: disc;
    }

    :deep(ol) {
      list-style-type: decimal;
    }

    :deep(li) {
      margin: 0.5rem 0;
      line-height: 1.75;
    }

    :deep(li::marker) {
      color: var(--color-accent-700);
    }

    /* Nested lists */
    :deep(ul ul),
    :deep(ol ol),
    :deep(ul ol),
    :deep(ol ul) {
      margin: 0.25rem 0;
    }

    /* Blockquotes */
    :deep(blockquote) {
      border-left: 4px solid var(--color-accent-700);
      padding-left: 1rem;
      margin: 1.5rem 0;
      color: var(--color-text-secondary);
      font-style: italic;
    }

    /* Code blocks */
    :deep(pre) {
      background-color: var(--color-surface-sunken);
      border: 1px solid var(--color-border-default);
      border-radius: 0.5rem;
      padding: 1rem;
      margin: 1rem 0;
      overflow-x: auto;
    }

    :deep(code) {
      background-color: var(--color-surface-sunken);
      color: var(--color-accent-700);
      padding: 0.125rem 0.375rem;
      border-radius: 0.25rem;
      font-size: 0.875em;
      font-family: "Monaco", "Courier New", monospace;
    }

    :deep(pre code) {
      background-color: transparent;
      padding: 0;
      border-radius: 0;
    }

    /* Horizontal rules */
    :deep(hr) {
      border: none;
      border-top: 2px solid var(--color-border-default);
      margin: 2rem 0;
    }

    /* Tables */
    :deep(table) {
      width: 100%;
      border-collapse: collapse;
      margin: 1.5rem 0;
    }

    :deep(th),
    :deep(td) {
      padding: 0.75rem;
      border: 1px solid var(--color-border-default);
      text-align: left;
    }

    :deep(th) {
      background-color: var(--color-surface-raised);
      color: var(--color-text-primary);
      font-weight: 600;
    }

    :deep(td) {
      color: var(--color-text-secondary);
    }

    /* Images */
    :deep(img) {
      max-width: 100%;
      height: auto;
      border-radius: 0.5rem;
      margin: 1rem 0;
    }

    /* Custom scrollbar */
    scrollbar-width: thin;
    scrollbar-color: var(--color-accent-700) var(--color-surface-sunken);
  }

  .description::-webkit-scrollbar {
    width: 8px;
  }

  .description::-webkit-scrollbar-track {
    background: var(--color-surface-sunken);
    border-radius: 4px;
  }

  .description::-webkit-scrollbar-thumb {
    background: var(--color-accent-700);
    border-radius: 4px;
  }

  .description::-webkit-scrollbar-thumb:hover {
    background: var(--color-accent-800);
  }
</style>
