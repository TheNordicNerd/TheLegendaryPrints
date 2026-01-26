<template>
  <div class="product-options space-y-6">
    <!-- Upload Design Section -->
    <ImageUpload ref="imageUploadRef" v-if="dynamicOptions.length > 1" />

    <!-- Dynamic Product Options -->
    <DynamicOptionSelector
      v-for="option in dynamicOptions"
      :key="option.name"
      :option="option"
      :selected-value="selectedOptions[option.name]"
      :custom-value="customOptionValues[option.name]"
      @update:selected-value="(value) => selectOption(option.name, value)"
      @update:custom-value="(value) => updateCustomValue(option.name, value)"
    />

    <!-- Price Summary -->
    <PriceSummary
      :options="dynamicOptions"
      :selections="selectedOptions"
      :custom-values="customOptionValues"
      :price="calculatedPrice"
    />
  </div>
</template>

<script setup lang="ts">
  import type { ShopifyProduct } from "~/composables/useShopify";

  interface Props {
    product?: ShopifyProduct | null;
    loading?: boolean;
  }

  const props = defineProps<Props>();

  // Use the dynamic product options composable
  const productOptionsData = computed(() => {
    if (!props.product) return null;
    return useProductOptions(props.product);
  });

  // Get dynamic product options from Shopify variants
  const dynamicOptions = computed(() => {
    return productOptionsData.value?.productOptions.value || [];
  });

  // Selected options (using reactive object)
  const selectedOptions = ref<Record<string, string>>({});
  const customOptionValues = ref<Record<string, string>>({});

  // Initialize selected options with first value of each option
  watch(
    dynamicOptions,
    (options) => {
      if (options && options.length > 0) {
        if (options.length === 1 && options[0]?.name === "Title") options.pop();
        options.forEach((option) => {
          if (!selectedOptions.value[option.name] && option.values.length > 0) {
            const firstValue = option.values[0];
            if (firstValue) {
              selectedOptions.value[option.name] = firstValue;
            }
          }
        });
      }
    },
    { immediate: true },
  );

  // Image upload ref
  const imageUploadRef = ref<any>(null);

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

  // Computed values for parent component
  const selections = computed(() => selectedOptions.value);
  const customValues = computed(() => customOptionValues.value);

  const effectiveQuantity = computed(() => {
    const qtyOption = dynamicOptions.value.find(
      (opt) =>
        opt.name.toLowerCase().includes("quantity") || opt.name.toLowerCase().includes("qty"),
    );
    if (!qtyOption) return 100;

    const selectedQty = selectedOptions.value[qtyOption.name];
    if (!selectedQty) return 100;

    if (selectedQty === "Custom" && customOptionValues.value[qtyOption.name]) {
      return parseInt(customOptionValues.value[qtyOption.name] || "100", 10) || 100;
    }

    return parseInt(selectedQty || "100", 10) || 100;
  });

  // Get price from selected variant
  const calculatedPrice = computed(() => {
    if (!props.product) return "$0.00";

    const { formatPrice } = useShopify();
    const { getVariantInfo } = useProductOptions(props.product);

    // Get the matching variant based on current selections
    const variantInfo = getVariantInfo(selectedOptions.value, customOptionValues.value);

    if (variantInfo?.variant?.price) {
      return formatPrice(variantInfo.variant.price.amount, variantInfo.variant.price.currencyCode);
    }

    // Fallback to minimum price
    return formatPrice(
      props.product.priceRange.minVariantPrice.amount,
      props.product.priceRange.minVariantPrice.currencyCode,
    );
  });

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
    selections,
    customValues,
    effectiveQuantity,
  });
</script>
