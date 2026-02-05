<template>
  <div class="custom-design-options space-y-6">
    <!-- Upload Design Section -->
    <ImageUpload ref="imageUploadRef" />

    <!-- Custom Design Options -->
    <DynamicOptionSelector
      v-for="option in customDesignOptions"
      :key="option.name"
      :option="optionToSelectorFormat(option)"
      :selected-value="selectedOptions[option.name]"
      :custom-value="customOptionValues[option.name]"
      @update:selected-value="(value) => selectOption(option.name, value)"
      @update:custom-value="(value) => updateCustomValue(option.name, value)"
    />

    <!-- Loading State -->
    <div v-if="isLoadingProduct" class="text-center py-4">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-magenta border-t-transparent"
      ></div>
      <p class="mt-2 text-sm text-text-secondary">Loading product options...</p>
    </div>

    <!-- Error State -->
    <div
      v-if="productError"
      class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
    >
      <p class="text-red-800 dark:text-red-200 text-sm">{{ productError }}</p>
    </div>

    <!-- Price Summary -->
    <PriceSummary
      v-if="currentProduct"
      :options="variantOptions"
      :selections="variantSelections"
      :custom-values="customOptionValues"
      :price="calculatedPrice"
    />
  </div>
</template>

<script setup lang="ts">
  import type { ShopifyProduct } from "~/composables/useShopify";
  import { customDesignOptions } from "~/config/customDesignOptions";

  // route
  const route = useRoute();
  // Selected options for ALL custom design options
  const selectedOptions = ref<Record<string, string>>({});
  const customOptionValues = ref<Record<string, string>>({});

  // Initialize with defaults
  customDesignOptions.forEach((option) => {
    const defaultVal = option.defaultValue || option.values[0];
    if (defaultVal) {
      selectedOptions.value[option.name] = defaultVal;
    }
  });

  // Current Shopify product based on Material + Shape
  const currentProduct = ref<ShopifyProduct | null>(null);
  const isLoadingProduct = ref(false);
  const productError = ref<string | null>(null);

  // Image upload ref
  const imageUploadRef = ref<any>(null);

  // Convert our config format to DynamicOptionSelector format
  const optionToSelectorFormat = (option: any) => ({
    name: option.name || "",
    values: option.values || [],
    type: (option.allowCustom ? "custom" : "standard") as "standard" | "custom",
    hasCustom: option.allowCustom || false,
    isRow: false,
  });

  // Watch Material + Shape and find the corresponding product
  watch(
    () => [selectedOptions.value.Material, selectedOptions.value.Shape],
    async ([material, shape]) => {
      if (!material || !shape) return;

      console.log("Looking for product with:", { material, shape });

      isLoadingProduct.value = true;
      productError.value = null;

      try {
        const { fetchProducts } = useShopifyProducts();
        const allProducts = await fetchProducts(250); // Fetch up to 250 products

        console.log("Searching through products:", allProducts.length);

        // Find product whose title contains both Material and Shape
        const matchingProduct = allProducts.find((product: any) => {
          const title = product.title.toLowerCase();
          const productType = route.params.productType as string;
          const capitalizedProductType = productType.charAt(0).toUpperCase() + productType.slice(1);

          const comparisonTitle = `${material} ${capitalizedProductType} - ${shape}`;

          console.log("Comparing:", title, "===", comparisonTitle.toLowerCase());

          const hasSameTitle = title === comparisonTitle.toLowerCase();

          return hasSameTitle;
        });

        console.log(matchingProduct);

        if (!matchingProduct) {
          productError.value = `No product found with "${material}" and "${shape}" in the title`;
          currentProduct.value = null;
          console.error("No matching product found");
        } else {
          currentProduct.value = matchingProduct;
          console.log("Found matching product:", matchingProduct.title);
        }
      } catch (error: any) {
        console.error("Error fetching products:", error);
        productError.value = `Failed to load products: ${error.message}`;
        currentProduct.value = null;
      } finally {
        isLoadingProduct.value = false;
      }
    },
    { immediate: true },
  );

  // Get the variant options that need to match (Size, Quantity, Laminate)
  // These are the options that exist as Shopify variant options
  const variantOptions = computed(() => {
    if (!currentProduct.value) return [];

    const { productOptions } = useProductOptions(currentProduct.value);
    return productOptions.value || [];
  });

  // Build selections for variant matching
  // Only match based on the variant options (Size, Quantity, Laminate)
  // Material and Shape are determined by which product we fetched
  const variantSelections = computed(() => {
    if (!currentProduct.value) return {};

    const selections: Record<string, string> = {};

    // Get the actual option names from the first variant's selectedOptions
    const firstVariant = currentProduct.value.variants?.edges?.[0]?.node;
    if (!firstVariant?.selectedOptions) {
      console.log("No variants found in product");
      return {};
    }

    const productOptionNames = firstVariant.selectedOptions.map((opt) => opt.name);
    console.log("Product option names from Shopify:", productOptionNames);

    // Build selections based on actual Shopify variant option names
    // Only match Size, Quantity, Laminate (NOT Material or Shape)
    productOptionNames.forEach((optionName: string) => {
      const lowerName = optionName.toLowerCase();

      if (lowerName.includes("size")) {
        const sizeValue = selectedOptions.value.Size;
        if (sizeValue) selections[optionName] = sizeValue;
      } else if (lowerName.includes("quantity") || lowerName.includes("qty")) {
        const qtyValue = selectedOptions.value.Quantity;
        if (qtyValue) selections[optionName] = qtyValue;
      } else if (lowerName.includes("laminate") || lowerName.includes("finish")) {
        const laminateValue = selectedOptions.value.Laminate;
        if (laminateValue) selections[optionName] = laminateValue;
      }
    });

    console.log("Built variant selections:", selections);

    return selections;
  });

  // Get the matching variant and price
  const calculatedPrice = computed(() => {
    if (!currentProduct.value) return "$0.00";

    const { formatPrice } = useShopify();
    const { getVariantInfo } = useProductOptions(currentProduct.value);

    // Get the matching variant based on Size, Quantity, Laminate
    const variantInfo = getVariantInfo(variantSelections.value, customOptionValues.value);

    if (variantInfo?.variant?.price) {
      return formatPrice(variantInfo.variant.price.amount, variantInfo.variant.price.currencyCode);
    }

    // Fallback to minimum price
    return formatPrice(
      currentProduct.value.priceRange.minVariantPrice.amount,
      currentProduct.value.priceRange.minVariantPrice.currencyCode,
    );
  });

  // Get the variant ID for cart operations
  const selectedVariantId = computed(() => {
    if (!currentProduct.value) {
      console.log("No current product");
      return null;
    }

    const { getVariantInfo } = useProductOptions(currentProduct.value);
    const variantInfo = getVariantInfo(variantSelections.value, customOptionValues.value, true); // Enable debug

    console.log("Variant matching:", {
      variantSelections: variantSelections.value,
      customValues: customOptionValues.value,
      variantInfo,
      availableVariants: currentProduct.value.variants?.edges?.length,
      allVariants: currentProduct.value.variants?.edges?.map((e) => ({
        id: e.node.id,
        title: e.node.title,
        selectedOptions: e.node.selectedOptions,
      })),
    });

    // If no variant found, log detailed error
    if (!variantInfo) {
      const firstFewVariants = currentProduct.value.variants?.edges?.slice(0, 3).map((e) => ({
        title: e.node.title,
        options: e.node.selectedOptions.map((opt: any) => `${opt.name}: ${opt.value}`).join(", "),
        rawOptions: e.node.selectedOptions,
      }));

      console.error("Failed to match variant. Debugging info:", {
        lookingFor: variantSelections.value,
        lookingForString: Object.entries(variantSelections.value).map(([k, v]) => `${k}: ${v}`).join(", "),
        firstThreeVariants: firstFewVariants,
      });
    }

    return variantInfo?.id || null;
  });

  // Get effective quantity
  const effectiveQuantity = computed(() => {
    const selectedQty = selectedOptions.value.Quantity;
    if (!selectedQty) return 100;

    if (selectedQty === "Custom" && customOptionValues.value.Quantity) {
      return parseInt(customOptionValues.value.Quantity || "100", 10) || 100;
    }

    return parseInt(selectedQty || "100", 10) || 100;
  });

  // Get effective size
  const effectiveSize = computed(() => {
    const selectedSize = selectedOptions.value.Size;
    if (!selectedSize) return 2;

    if (selectedSize === "Custom" && customOptionValues.value.Size) {
      return parseFloat(customOptionValues.value.Size) || 2;
    }

    // Parse size from string (e.g., "3\"" -> 3)
    return parseFloat(String(selectedSize).replace(/[^0-9.]/g, "")) || 2;
  });

  // Select an option
  const selectOption = (optionName: string, value: string) => {
    selectedOptions.value[optionName] = value;

    // If not selecting "Custom", clear custom value
    if (value !== "Custom" && customOptionValues.value[optionName]) {
      delete customOptionValues.value[optionName];
    }
  };

  // Update custom value
  const updateCustomValue = (optionName: string, value: string) => {
    customOptionValues.value[optionName] = value;
  };

  // Computed properties to access image upload component values
  const uploadedImage = computed(() => imageUploadRef.value?.uploadedImage);
  const uploadedImageUrl = computed(() => imageUploadRef.value?.uploadedImageUrl);
  const uploadedImagePublicId = computed(() => imageUploadRef.value?.uploadedImagePublicId);
  const uploadedFileName = computed(() => imageUploadRef.value?.uploadedFileName);
  const isUploading = computed(() => imageUploadRef.value?.isUploading);

  // Expose for parent component
  defineExpose({
    uploadedImage,
    uploadedImageUrl,
    uploadedImagePublicId,
    uploadedFileName,
    calculatedPrice,
    isUploading,
    selections: selectedOptions,
    customValues: customOptionValues,
    effectiveQuantity,
    effectiveSize,
    selectedVariantId,
    currentProduct,
    isLoadingProduct,
  });
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
