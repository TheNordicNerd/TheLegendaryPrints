<template>
  <Section inner-classes="p-4">
    <Breadcrumb :path="route.path" />
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 py-8">
      <!-- Product Gallery -->
      <div class="product-gallery-container">
        <ProductGallery
          :images="product.images || [product.thumbnailImg]"
          :alt="product.name"
          :thumbnail-columns="4"
        />
      </div>

      <!-- Product Info -->
      <div class="product-info flex flex-col gap-6">
        <div>
          <h1 class="text-4xl lg:text-5xl mb-4 text-text-primary">{{ product.name }}</h1>
          <p class="text-lg text-text-secondary">{{ product.description }}</p>
        </div>

        <!-- Product Options -->
        <ProductOptions ref="productOptionsRef" />

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
  </Section>
</template>

<script setup lang="ts">
  import { getProductBySlug } from "~/data/products";
  import { getShopifyVariantId } from "~/utils/shopifyVariants";
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

  const product = getProductBySlug(slug);

  // Handle case where product is not found
  if (!product) {
    throw createError({
      statusCode: 404,
      statusMessage: "Product Not Found",
      fatal: true,
    });
  }

  // SEO Meta Tags - Dynamic per product
  useSeoMeta({
    title: `${product.name} | Premium Custom Stickers - TLP`,
    description: `${product.description} Order waterproof vinyl stickers with fast delivery and free design support. Upload your design today!`,
    ogTitle: `${product.name} - Custom Printing`,
    ogDescription: `${product.description} Premium waterproof vinyl, fast 3-5 day delivery, professional quality stickers.`,
    ogImage: product.thumbnailImg,
    ogType: "website",
    twitterCard: "summary_large_image",
    twitterTitle: `${product.name} | Custom Stickers - TLP`,
    twitterDescription: `${product.description} Waterproof vinyl with fast delivery.`,
    twitterImage: product.thumbnailImg,
  });

  // Structured Data - Product Schema
  useHead({
    script: [
      {
        type: "application/ld+json",
        innerHTML: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.description,
          image: product.images || [product.thumbnailImg],
          brand: {
            "@type": "Brand",
            name: "The Legendary Prints",
          },
          category: product.category,
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "USD",
            lowPrice: "2.99",
            highPrice: "199.99",
            availability: "https://schema.org/InStock",
            url: `https://thelegendaryprints.com/products/${product.slug}`,
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            reviewCount: "547",
            bestRating: "5",
            worstRating: "1",
          },
        }),
      },
      {
        type: "application/ld+json",
        innerHTML: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://thelegendaryprints.com",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Products",
              item: "https://thelegendaryprints.com/products",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: product.name,
              item: `https://thelegendaryprints.com/products/${product.slug}`,
            },
          ],
        }),
      },
    ],
  });

  // Product options ref
  const productOptionsRef = ref<any>(null);

  // Cart functionality - use unified cart for both mock and Shopify
  const cart = useUnifiedCart();
  const router = useRouter();

  // Handle add to cart
  const handleAddToCart = async () => {
    if (productOptionsRef.value) {
      const opts = productOptionsRef.value;
      const effectiveSize = opts.customSize || opts.selectedSize;
      const effectiveQuantity =
        opts.customQuantity && opts.customQuantity >= 1000
          ? opts.customQuantity
          : opts.selectedQuantity;

      // Calculate price per unit
      const basePrice = 0.1; // Price per square inch
      const squareInches = effectiveSize * effectiveSize;
      const materialMultipliers: Record<string, number> = {
        vinyl: 1,
        matte: 1.2,
        glossy: 1.3,
        holographic: 1.8,
      };
      const materialMultiplier = materialMultipliers[opts.selectedMaterial] || 1;
      const pricePerUnit = basePrice * squareInches * materialMultiplier;
      const totalPrice = pricePerUnit * effectiveQuantity;

      // Add to cart - works for both mock and Shopify mode
      try {
        if (cart.isShopifyMode) {
          // Shopify mode: Get variant ID for this product configuration
          const variantId = getShopifyVariantId(product, effectiveSize, opts.selectedMaterial);

          if (!variantId) {
            throw new Error('This product is not available in Shopify. Please add Shopify variant IDs to the product data.');
          }

          await cart.addItem({
            merchandiseId: variantId,
            quantity: effectiveQuantity,
          });
        } else {
          // Mock mode: Use full product details
          await cart.addItem({
            productId: product.id,
            productName: product.name,
            productSlug: product.slug,
            size: opts.selectedSize,
            material: opts.selectedMaterial,
            quantity: opts.selectedQuantity,
            pricePerUnit,
            totalPrice,
            customSize: opts.customSize,
            customQuantity: opts.customQuantity,
            uploadedImage: opts.uploadedImage,
            uploadedFileName: opts.uploadedFileName,
          });
        }
      } catch (error: any) {
        alert(`Failed to add to cart: ${error.message}`);
        return;
      }

      // Show success message and navigate to cart
      const message = `Added ${product.name} to cart!\n\nQuantity: ${effectiveQuantity.toLocaleString()}\nPrice: $${totalPrice.toFixed(2)}`;
      if (confirm(`${message}\n\nGo to cart?`)) {
        router.push("/cart");
      }
    }
  };
</script>

<style scoped></style>
