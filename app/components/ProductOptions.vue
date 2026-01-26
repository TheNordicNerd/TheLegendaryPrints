<template>
  <div class="product-options space-y-6">
    <!-- Upload Design Section -->
    <ImageUpload ref="imageUploadRef" />

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
      console.log({ options });
      if (options && options.length > 0) {
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

  // Calculate price dynamically based on selections
  const calculatedPrice = computed(() => {
    const { calculateTotalPrice, formatPrice } = usePricing();

    // Get size from selections
    const sizeOption = dynamicOptions.value.find(
      (opt) => opt.name.toLowerCase() === "size"
    );
    let effectiveSize = 2; // Default 2" sticker

    if (sizeOption) {
      const selectedSize = selectedOptions.value[sizeOption.name];
      if (selectedSize === "Custom" && customOptionValues.value[sizeOption.name]) {
        effectiveSize = parseFloat(customOptionValues.value[sizeOption.name] || "2") || 2;
      } else if (selectedSize) {
        // Parse size from string (e.g., "3\"" -> 3)
        effectiveSize = parseFloat(selectedSize.replace(/[^0-9.]/g, '')) || 2;
      }
    }

    // Get material/finish from selections
    const materialOption = dynamicOptions.value.find(
      (opt) => opt.name.toLowerCase() === "material" || opt.name.toLowerCase() === "finish"
    );
    const effectiveMaterial = materialOption
      ? selectedOptions.value[materialOption.name] || "glossy"
      : "glossy";

    console.log('ProductOptions - Price calculation:', {
      sizeOption: sizeOption?.name,
      selectedSize: sizeOption ? selectedOptions.value[sizeOption.name] : 'N/A',
      effectiveSize,
      effectiveQuantity: effectiveQuantity.value,
      materialOption: materialOption?.name,
      selectedMaterial: materialOption ? selectedOptions.value[materialOption.name] : 'N/A',
      effectiveMaterial,
      selectedOptions: selectedOptions.value,
      customOptionValues: customOptionValues.value
    });

    // Calculate total price
    const totalPrice = calculateTotalPrice(effectiveSize, effectiveQuantity.value, effectiveMaterial);

    console.log('ProductOptions - Calculated total:', totalPrice);

    return formatPrice(totalPrice);
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
