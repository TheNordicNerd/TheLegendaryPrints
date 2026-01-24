<template>
  <Section inner-classes="p-4">
    <!-- Loading State -->
    <div v-if="loadingShopify" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent-700 border-t-transparent"></div>
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
          <div>
            <h1 class="text-4xl lg:text-5xl mb-4 text-text-primary">{{ shopifyProduct.title }}</h1>
            <p class="text-lg text-text-secondary">{{ shopifyProduct.description }}</p>
          </div>

          <!-- Product Options -->
          <ProductOptions
            ref="productOptionsRef"
            :shopify-variant-options="shopifyVariantOptions"
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

    if (result) {
      shopifyProduct.value = result;
    } else {
      throw new Error('Product not found');
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

  const images = shopifyProduct.value.images?.edges.map(e => e.node.url) || [];

  // If no images in the images array, use featured image
  if (images.length === 0 && shopifyProduct.value.featuredImage?.url) {
    return [shopifyProduct.value.featuredImage.url];
  }

  return images;
});

// Extract unique variant options from Shopify product
const shopifyVariantOptions = computed(() => {
  if (!shopifyProduct.value) return null;

  const sizes = new Set<number>();
  const materials = new Set<string>();
  const quantities = new Set<number>();

  shopifyProduct.value.variants.edges.forEach((edge) => {
    const title = edge.node.title.toLowerCase();

    // Extract size (e.g., "2 inch", "3\"", "4 in")
    const sizeMatch = title.match(/(\d+(?:\.\d+)?)\s*(?:inch|in|"|')/i);
    if (sizeMatch && sizeMatch[1]) {
      sizes.add(parseFloat(sizeMatch[1]));
    }

    // Extract material/finish (matte, glossy, vinyl, holographic)
    if (title.includes('matte')) materials.add('matte');
    if (title.includes('glossy')) materials.add('glossy');
    if (title.includes('vinyl')) materials.add('vinyl');
    if (title.includes('holographic') || title.includes('holo')) materials.add('holographic');

    // Extract quantity if present
    const qtyMatch = title.match(/(\d+)\s*(?:pack|pcs|count)/i);
    if (qtyMatch && qtyMatch[1]) {
      quantities.add(parseInt(qtyMatch[1]));
    }
  });

  return {
    sizes: Array.from(sizes).sort((a, b) => a - b),
    materials: Array.from(materials),
    quantities: Array.from(quantities).sort((a, b) => a - b),
  };
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
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.title,
            description: product.description,
            image: product.featuredImage?.url,
            brand: {
              '@type': 'Brand',
              name: 'The Legendary Prints'
            },
            offers: {
              '@type': 'AggregateOffer',
              priceCurrency: 'USD',
              lowPrice: product.priceRange.minVariantPrice.amount,
              highPrice: product.priceRange.maxVariantPrice.amount,
              availability: product.availableForSale ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
              url: `https://thelegendaryprints.com/products/${product.handle}`
            }
          })
        }
      ]
    });
  }
});

// Product options ref
const productOptionsRef = ref<any>(null);

// Cart functionality
const cart = useUnifiedCart();
const toast = useToast();

// Find matching variant by size and material
const findVariantId = (size: number, material: string): string | null => {
  if (!shopifyProduct.value) return null;

  // First, try exact match
  let variant = shopifyProduct.value.variants.edges.find((edge) => {
    const title = edge.node.title.toLowerCase();
    const sizeMatch = title.match(/(\d+(?:\.\d+)?)\s*(?:inch|in|"|')/i);
    const hasMatchingSize = sizeMatch && sizeMatch[1] && parseFloat(sizeMatch[1]) === size;
    const hasMatchingMaterial = title.includes(material.toLowerCase());
    return hasMatchingSize && hasMatchingMaterial;
  });

  // If no exact match, find closest size with matching material
  if (!variant) {
    let closestVariant = null;
    let closestDiff = Infinity;

    shopifyProduct.value.variants.edges.forEach((edge) => {
      const title = edge.node.title.toLowerCase();
      const hasMatchingMaterial = title.includes(material.toLowerCase());

      if (hasMatchingMaterial) {
        const sizeMatch = title.match(/(\d+(?:\.\d+)?)\s*(?:inch|in|"|')/i);
        if (sizeMatch && sizeMatch[1]) {
          const variantSize = parseFloat(sizeMatch[1]);
          const diff = Math.abs(variantSize - size);

          if (diff < closestDiff) {
            closestDiff = diff;
            closestVariant = edge;
          }
        }
      }
    });

    variant = closestVariant || undefined;
  }

  // Final fallback: material match only
  if (!variant) {
    variant = shopifyProduct.value.variants.edges.find((edge) => {
      return edge.node.title.toLowerCase().includes(material.toLowerCase());
    });
  }

  // Last resort: first variant
  return variant?.node.id || shopifyProduct.value.variants.edges[0]?.node.id || null;
};

// Handle add to cart
const handleAddToCart = async () => {
  if (!productOptionsRef.value) {
    alert('Product options not loaded. Please refresh the page.');
    return;
  }

  if (!shopifyProduct.value) {
    alert('Product not loaded. Please refresh the page.');
    return;
  }

  const opts = productOptionsRef.value;

  const effectiveSize = opts.customSize || opts.selectedSize;
  const effectiveQuantity =
    opts.customQuantity && opts.customQuantity > 0
      ? opts.customQuantity
      : opts.selectedQuantity;

  // Calculate pricing
  const { calculateTotalPrice } = usePricing();
  const totalPrice = calculateTotalPrice(effectiveSize, effectiveQuantity, opts.selectedMaterial);
  const pricePerUnit = totalPrice / effectiveQuantity;

  // Add to cart
  try {
    // Find the matching Shopify variant
    const variantId = findVariantId(effectiveSize, opts.selectedMaterial);

    if (!variantId) {
      throw new Error(`No variant found for ${effectiveSize}" ${opts.selectedMaterial} stickers`);
    }

    await cart.addItem({
      merchandiseId: variantId,
      quantity: effectiveQuantity,
      uploadedImage: opts.uploadedImageUrl || opts.uploadedImage,
      uploadedFileName: opts.uploadedFileName,
      customSize: effectiveSize,
      customQuantity: effectiveQuantity,
      customPrice: totalPrice.toFixed(2),
      customPricePerUnit: pricePerUnit.toFixed(2),
    });

    // Show success toast
    toast.success(`Added ${effectiveQuantity.toLocaleString()} ${shopifyProduct.value.title} to cart!`);
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
</style>
