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
          <div>
            <h1 class="text-4xl lg:text-5xl mb-4 text-text-primary">{{ shopifyProduct.title }}</h1>
            <p class="text-lg text-text-secondary">{{ shopifyProduct.description }}</p>
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

    console.log('RAW OPTIONS from component:', {
      selections,
      customValues,
      effectiveQuantity,
      allOpts: opts
    });

    // Use the new composable to get variant info
    const { getVariantInfo } = useProductOptions(shopifyProduct.value);
    const variantInfo = getVariantInfo(selections, customValues);

    if (!variantInfo) {
      toast.error(`No matching product variant found for your selections`);
      return;
    }

    // Calculate pricing
    const { calculateTotalPrice } = usePricing();

    // Get effective size (check both selections and custom values)
    let effectiveSize = 2; // Default
    const sizeSelection = selections.Size || selections.size;
    if (sizeSelection === 'Custom' && customValues.Size) {
      effectiveSize = parseFloat(customValues.Size) || 2;
    } else if (sizeSelection) {
      // Parse size from string (e.g., "3\"" -> 3)
      effectiveSize = parseFloat(String(sizeSelection).replace(/[^0-9.]/g, '')) || 2;
    }

    // Get effective material
    const effectiveMaterial = selections.Material || selections.material || 'glossy';

    console.log('Add to cart - pricing calculation:', {
      effectiveSize,
      effectiveQuantity,
      effectiveMaterial,
      selections,
      customValues
    });

    const totalPrice = calculateTotalPrice(effectiveSize, effectiveQuantity, effectiveMaterial);
    const pricePerUnit = totalPrice / effectiveQuantity;

    console.log('Add to cart - calculated prices:', {
      totalPrice,
      pricePerUnit
    });

    // Add to cart
    try {
      await cart.addItem({
        merchandiseId: variantInfo.id,
        quantity: effectiveQuantity,
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

      console.log("✅ Added variant to cart:", variantInfo.variant.title, "at", variantInfo.variant.price);
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
