<template>
  <div class="product-options space-y-6">
    <!-- Stage 1: Product Configuration -->
    <div v-if="!showUploadStage" class="space-y-6">
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

      <!-- Continue to Upload Button (or Add to Cart for sample packs) -->
      <Button
        v-if="hasRequiredSelections && !isSamplePack"
        @click="showUploadStage = true"
        variant="primary"
        size="lg"
        :full-width="true"
        rounded="lg"
        icon-right="i-lucide-arrow-right"
        right-icon-size="20"
      >
        Continue to Upload Artwork
      </Button>
    </div>

    <!-- Stage 2: Upload Artwork -->
    <div v-else class="space-y-6">
      <!-- Back Button -->
      <button
        @click="showUploadStage = false"
        class="flex items-center gap-2 text-text-secondary hover:text-magenta transition-colors duration-200"
      >
        <Icon name="i-lucide-arrow-left" size="20" />
        <span>Back to Options</span>
      </button>

      <!-- Selected Options Summary -->
      <div class="bg-surface-raised p-4 rounded-lg border border-border-subtle">
        <h3 class="text-lg font-bold text-text-primary mb-3">Your Configuration</h3>
        <div class="space-y-2 text-sm">
          <div v-for="option in dynamicOptions" :key="option.name" class="flex justify-between">
            <span class="text-text-secondary">{{ option.name }}:</span>
            <span class="text-text-primary font-medium">
              {{ getDisplayValue(option.name) }}
            </span>
          </div>
          <div class="pt-2 border-t border-border-default flex justify-between">
            <span class="text-text-primary font-bold">Total:</span>
            <span class="text-magenta font-bold text-xl">{{ calculatedPrice }}</span>
          </div>
        </div>
      </div>

      <!-- Upload Design Section -->
      <ImageUpload ref="imageUploadRef" />
    </div>
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

  // Check if product has show_shapes tag
  const hasShapesEnabled = computed(() => {
    if (!props.product?.tags) return false;
    return props.product.tags.some((tag) => tag.toLowerCase() === "show_shapes");
  });

  // Check if product is a sample pack (no upload required)
  const isSamplePack = computed(() => {
    if (!props.product?.tags) return false;
    const hasSamplePackTag = props.product.tags.some((tag) => {
      const normalized = tag.toLowerCase().replace(/[_\s-]/g, "");
      return normalized === "samplepack" || normalized === "noupload";
    });
    return hasSamplePackTag;
  });

  // Get dynamic product options from Shopify variants
  const dynamicOptions = computed(() => {
    const options = productOptionsData.value?.productOptions.value || [];

    // If product has show_shapes tag, inject Shape option at the beginning
    if (hasShapesEnabled.value) {
      const shapeOption = {
        name: "Shape",
        type: "standard" as const,
        values: [
          {
            label: "Circle",
            value: "Circle",
            icon: "i-material-symbols-circle",
          },
          {
            label: "Square",
            value: "Square",
            icon: "i-material-symbols-square",
          },
          {
            label: "Custom",
            value: "Custom",
            icon: "i-material-symbols-kid-star",
          },
        ],
        hasCustom: false, // "Custom" here is a preset shape, not a custom input
      };

      // Check if Shape option doesn't already exist
      const hasShapeOption = options.some((opt) => opt.name.toLowerCase() === "shape");
      if (!hasShapeOption) {
        return [shapeOption, ...options];
      }
    }

    return options;
  });

  // Selected options (using reactive object)
  const selectedOptions = ref<Record<string, string>>({});
  const customOptionValues = ref<Record<string, string>>({});

  // Stage control
  const showUploadStage = ref(false);

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
              // Extract the actual value (handle both string and object formats)
              const valueToStore = typeof firstValue === "string" ? firstValue : firstValue.value;
              selectedOptions.value[option.name] = valueToStore;
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

    // If no quantity option exists (e.g., sample pack), default to 1
    if (!qtyOption) return 1;

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

    // If no options exist (simple product), use the default variant price
    if (dynamicOptions.value.length === 0) {
      return formatPrice(
        props.product.priceRange.minVariantPrice.amount,
        props.product.priceRange.minVariantPrice.currencyCode,
      );
    }

    // Get all actual Shopify variant option names from the product
    const actualVariantOptionNames = new Set<string>();
    if (props.product.variants?.edges?.length > 0) {
      const firstVariant = props.product.variants.edges[0]?.node;
      if (firstVariant?.selectedOptions) {
        firstVariant.selectedOptions.forEach((opt) => {
          actualVariantOptionNames.add(opt.name);
        });
      }
    }

    // Filter selections to only include actual variant options (exclude injected options like Shape)
    const variantSelections: Record<string, string> = {};
    const variantCustomValues: Record<string, string> = {};

    Object.keys(selectedOptions.value).forEach((key) => {
      if (actualVariantOptionNames.has(key)) {
        const value = selectedOptions.value[key];
        if (value) {
          variantSelections[key] = value;
        }
      }
    });

    Object.keys(customOptionValues.value).forEach((key) => {
      if (actualVariantOptionNames.has(key)) {
        const value = customOptionValues.value[key];
        if (value) {
          variantCustomValues[key] = value;
        }
      }
    });

    // Get the matching variant based on variant selections only
    const variantInfo = getVariantInfo(variantSelections, variantCustomValues);

    if (variantInfo?.variant?.price) {
      return formatPrice(variantInfo.variant.price.amount, variantInfo.variant.price.currencyCode);
    }

    // Fallback to minimum price
    return formatPrice(
      props.product.priceRange.minVariantPrice.amount,
      props.product.priceRange.minVariantPrice.currencyCode,
    );
  });

  // Check if all required selections are made
  const hasRequiredSelections = computed(() => {
    // If no options exist, consider selections complete (e.g., simple sample pack)
    if (dynamicOptions.value.length === 0) {
      return true;
    }

    // Check that all options have a selection (including Shape if applicable)
    return dynamicOptions.value.every((option) => {
      const selected = selectedOptions.value[option.name];
      if (!selected) return false;

      // If "Custom" is selected AND the option has hasCustom enabled, ensure custom value is provided
      if (selected === "Custom" && option.hasCustom) {
        return !!customOptionValues.value[option.name];
      }

      return true;
    });
  });

  // Get display value for an option
  const getDisplayValue = (optionName: string): string => {
    const value = selectedOptions.value[optionName];
    if (value === "Custom" && customOptionValues.value[optionName]) {
      return customOptionValues.value[optionName];
    }
    return value || "Not selected";
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
    selections,
    customValues,
    effectiveQuantity,
    dynamicOptions,
    showUploadStage,
    isSamplePack,
    hasRequiredSelections,
  });
</script>
