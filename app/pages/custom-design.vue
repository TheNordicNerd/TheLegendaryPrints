<template>
  <Section inner-classes="p-4">
    <Breadcrumb :path="route.path" />

    <div class="max-w-7xl mx-auto py-8">
      <!-- Page Header -->
      <div class="text-center mb-12">
        <h1 class="font-heading font-extrabold text-4xl md:text-5xl mb-4">
          Design Your Custom Stickers
        </h1>
        <p class="font-body text-lg text-text-secondary max-w-2xl mx-auto">
          Choose your material, configure your stickers, upload your design, and we'll handle the
          rest. Professional quality, fast turnaround.
        </p>
      </div>

      <!-- Stage 1: Material Selection -->
      <div v-if="currentStage === 1" class="space-y-6">
        <h2 class="text-2xl font-heading font-bold text-center mb-8">
          Choose Your Sticker Material
        </h2>

        <div v-if="loadingProducts" class="text-center py-12">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-magenta border-t-transparent"
          ></div>
          <p class="mt-4 text-text-secondary">Loading materials...</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="product in availableProducts"
            :key="product.id"
            @click="selectMaterial(product)"
            class="cursor-pointer"
          >
            <ShopifyProductCard :product="product" heading-level="h3" />
          </div>
        </div>
      </div>

      <!-- Stage 2 & 3: Product Configuration (Using ProductOptions component) -->
      <div
        v-if="currentStage >= 2 && selectedProduct"
        class="space-y-8 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8"
      >
        <!-- Product Gallery - Hidden on mobile, shown on desktop -->
        <div class="product-gallery-container hidden lg:block">
          <ProductGallery :images="productImages" :alt="selectedProduct.title" />
        </div>

        <!-- Product Options -->
        <div class="product-info flex flex-col gap-6">
          <div>
            <div class="flex items-center gap-2 mb-4">
              <button
                @click="goBackToMaterialSelection"
                class="text-sm text-magenta hover:text-magenta/80 flex items-center gap-1"
              >
                <Icon name="i-lucide-arrow-left" size="16" />
                Change Material
              </button>
            </div>
            <h2 class="font-heading font-bold text-3xl mb-2">{{ selectedProduct.title }}</h2>
            <p class="text-text-secondary">{{ getProductDescription(selectedProduct) }}</p>
          </div>

          <!-- ProductOptions Component (Stages 2 & 3) -->
          <ProductOptions ref="productOptionsRef" :product="selectedProduct" />

          <!-- Add to Cart Button (shown when on upload stage) -->
          <div v-if="productOptionsRef?.showUploadStage">
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
              Please upload your artwork to continue
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
  const toast = useToast();
  const cart = useUnifiedCart();

  // Current stage (1 = Material, 2 = Configure, 3 = Upload)
  const currentStage = ref(1);

  // Selected product
  const selectedProduct = ref<ShopifyProduct | null>(null);

  // Product options ref
  const productOptionsRef = ref<any>(null);

  // Available products (filtered to show only custom design products)
  const availableProducts = ref<ShopifyProduct[]>([]);
  const loadingProducts = ref(true);

  // Fetch products on mount
  onMounted(async () => {
    try {
      const { fetchProducts } = useShopifyProducts();
      const allProducts = await fetchProducts(250);

      // Filter to products that can be customized (exclude sample packs and non-upload items)
      availableProducts.value = allProducts.filter((product: ShopifyProduct) => {
        const tags = product.tags || [];

        // Exclude sample packs and products that don't need upload
        const isSamplePack = tags.some((tag) => {
          const normalized = tag.toLowerCase().replace(/[_\s-]/g, "");
          return normalized === "samplepack" || normalized === "noupload";
        });

        if (isSamplePack) return false;

        // Include products with custom/sticker related tags
        return tags.some(
          (tag) =>
            tag.toLowerCase().includes("sticker") ||
            tag.toLowerCase().includes("die-cut") ||
            tag.toLowerCase().includes("kiss-cut") ||
            tag.toLowerCase().includes("label"),
        );
      });

      // If no tagged products found, show all products except sample packs
      if (availableProducts.value.length === 0) {
        availableProducts.value = allProducts.filter((product: ShopifyProduct) => {
          const tags = product.tags || [];
          const isSamplePack = tags.some((tag) => {
            const normalized = tag.toLowerCase().replace(/[_\s-]/g, "");
            return normalized === "samplepack" || normalized === "noupload";
          });
          return !isSamplePack;
        });
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to load products. Please refresh the page.");
    } finally {
      loadingProducts.value = false;
    }
  });

  // Select material (move to stage 2)
  const selectMaterial = (product: ShopifyProduct) => {
    selectedProduct.value = product;
    currentStage.value = 2;

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Go back to material selection
  const goBackToMaterialSelection = () => {
    currentStage.value = 1;
    selectedProduct.value = null;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Watch for upload stage from ProductOptions
  watch(
    () => productOptionsRef.value?.showUploadStage,
    (showUpload) => {
      if (showUpload) {
        currentStage.value = 3;
      } else if (currentStage.value === 3) {
        currentStage.value = 2;
      }
    },
  );

  // Get product images
  const productImages = computed(() => {
    if (!selectedProduct.value) return [];

    const images = selectedProduct.value.images?.edges?.map((e: any) => e.node.url) || [];

    if (images.length === 0 && selectedProduct.value.featuredImage?.url) {
      return [selectedProduct.value.featuredImage.url];
    }

    return images;
  });

  // Get product description
  const getProductDescription = (product: ShopifyProduct) => {
    // Extract plain text from HTML description
    const div = document.createElement("div");
    div.innerHTML = product.descriptionHtml || "";
    return div.textContent || div.innerText || "Custom stickers with professional quality";
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    const opts = productOptionsRef.value;

    if (!opts || !selectedProduct.value) {
      toast.error("Product options not loaded. Please refresh the page.");
      return;
    }

    const selections = opts.selections;
    const customValues = opts.customValues;

    // Separate variant options from metafield options
    const variantOptions = ["Size", "Quantity", "Laminate"];

    const variantSelections: Record<string, string> = {};
    const metafieldSelections: Record<string, string> = {};

    Object.keys(selections).forEach((key) => {
      if (variantOptions.includes(key)) {
        variantSelections[key] = selections[key];
      } else {
        metafieldSelections[key] = selections[key];
      }
    });

    // Get variant info
    const { getVariantInfo } = useProductOptions(selectedProduct.value);
    const variantInfo = getVariantInfo(variantSelections, customValues);

    if (!variantInfo) {
      toast.error(`No matching product variant found for your selections`);
      return;
    }

    // Get effective values
    const effectiveQuantity = opts.effectiveQuantity || 1;
    const effectiveSize = parseFloat(selections.Size || customValues.Size || "2");

    // Get price
    const variantPrice = parseFloat(variantInfo.variant.price.amount);

    // Build metafield attributes
    const attributes: Array<{ key: string; value: string }> = [];

    Object.entries(metafieldSelections).forEach(([key, value]) => {
      if (value === "Custom" && customValues[key]) {
        attributes.push({ key, value: customValues[key] });
      } else {
        attributes.push({ key, value });
      }
    });

    // Add to cart
    try {
      // Use uploaded image if available, otherwise use product's featured image
      const cartImage = opts.uploadedImageUrl || opts.uploadedImage || selectedProduct.value.featuredImage?.url;

      await cart.addItem({
        merchandiseId: variantInfo.variant.id,
        quantity: 1,
        uploadedImage: cartImage,
        uploadedFileName: opts.uploadedFileName,
        customSize: effectiveSize,
        customQuantity: effectiveQuantity,
        customPrice: variantPrice.toFixed(2),
        customPricePerUnit: variantPrice.toFixed(2),
        attributes,
      });

      toast.success(
        `Added ${effectiveQuantity.toLocaleString()} ${selectedProduct.value.title} to cart!`,
      );

      // Reset and go back to stage 1
      setTimeout(() => {
        goBackToMaterialSelection();
      }, 1000);
    } catch (error: any) {
      toast.error(`Failed to add to cart: ${error.message}`);
    }
  };

  // SEO Meta Tags
  useSeoMeta({
    title: "Custom Sticker Design | Design Your Perfect Stickers - The Legendary Prints",
    description:
      "Design your perfect custom stickers. Choose material, shape, size, and finish. Upload your artwork and get professional-quality stickers in 24-48 hours.",
    ogTitle: "Custom Sticker Design - The Legendary Prints",
    ogDescription:
      "Create custom stickers with our easy design tool. Professional quality, fast delivery.",
    ogType: "website",
    twitterCard: "summary_large_image",
    twitterTitle: "Custom Sticker Design | TLP",
    twitterDescription: "Design your perfect custom stickers with professional quality.",
  });
</script>

<style scoped></style>
