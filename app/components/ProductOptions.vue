<template>
  <div class="product-options space-y-6">
    <!-- Upload Design Section -->
    <div class="upload-section bg-surface-raised p-6 rounded-lg border border-border-subtle">
      <h3 class="text-xl font-bold mb-4 text-text-primary flex items-center gap-2">
        <Icon name="i-lucide-upload" size="20" />
        Upload Your Design
      </h3>

      <!-- Upload Area -->
      <div
        v-if="!uploadedImage || isUploading"
        @click="!isUploading && triggerFileInput()"
        @dragover.prevent="!isUploading && (isDragging = true)"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="!isUploading && handleDrop($event)"
        @keydown.enter="!isUploading && triggerFileInput()"
        @keydown.space.prevent="!isUploading && triggerFileInput()"
        tabindex="0"
        role="button"
        aria-label="Click to upload image or drag and drop"
        class="upload-area border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200"
        :class="
          isUploading
            ? 'border-accent-500 bg-accent-50 cursor-wait'
            : isDragging
              ? 'border-accent-500 bg-accent-50 scale-[0.98] cursor-pointer'
              : 'border-border-default hover:border-accent-500 hover:bg-surface-sunken cursor-pointer'
        "
      >
        <div v-if="isUploading" class="flex flex-col items-center gap-4">
          <div class="animate-bounce">
            <Icon name="i-lucide-image-up" size="48" class="text-accent-600" />
          </div>
        </div>
        <div v-else class="flex flex-col items-center gap-3">
          <div class="p-4 rounded-full bg-accent-100 grid place-items-center">
            <Icon name="i-lucide-image-plus" size="32" class="text-accent-500" />
          </div>
          <div>
            <p class="text-lg font-semibold text-text-primary mb-1">
              Drop your image here or click to browse
            </p>
            <p class="text-sm text-text-secondary">PNG, JPG, SVG up to 10MB</p>
          </div>
        </div>
      </div>

      <!-- Image Preview -->
      <div v-else class="image-preview-container">
        <div
          class="relative rounded-lg p-2 overflow-hidden bg-surface-sunken border border-border-subtle"
        >
          <img :src="uploadedImage" :alt="uploadedFileName" class="w-full h-64 object-contain" />
          <div class="absolute top-3 right-3 p-2">
            <Button
              @click="removeImage"
              variant="custom"
              class="bg-error-500 hover:bg-error-600 text-white rounded-full transition-colors duration-200 shadow-lg"
              icon="i-lucide-x"
              aria-label="Remove image"
            />
          </div>
        </div>
        <div class="mt-3 flex items-center justify-between">
          <div class="flex items-center gap-2 text-sm text-text-secondary">
            <Icon name="i-lucide-file-check" size="16" class="text-success-500" />
            <span>{{ uploadedFileName }}</span>
          </div>
          <button
            @click="triggerFileInput"
            type="button"
            aria-label="Change uploaded image"
            class="text-sm font-medium text-accent-500 hover:text-accent-600 transition-colors duration-200"
          >
            Change Image
          </button>
        </div>
      </div>

      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        @change="handleFileSelect"
        aria-label="Upload design image"
        class="hidden"
      />
    </div>

    <!-- Sticker Size -->
    <div class="option-section bg-surface-raised p-6 rounded-lg border border-border-subtle">
      <h3 id="size-label" class="text-xl font-bold mb-4 text-text-primary flex items-center gap-2">
        <Icon name="i-lucide-ruler" size="20" aria-hidden="true" />
        Sticker Size
      </h3>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3" role="group" aria-labelledby="size-label">
        <button
          v-for="size in presetSizeOptions"
          :key="size.value"
          type="button"
          @click="handleSizeSelect(size.value)"
          :aria-label="`Select ${size.label} size`"
          :aria-pressed="selectedSize === size.value"
          class="size-option p-4 rounded-lg border-2 transition-all duration-200 text-center font-bold text-lg"
          :class="
            selectedSize === size.value
              ? 'border-accent-700 bg-accent-700 text-text-inverse shadow-md scale-95'
              : 'border-border-subtle hover:border-accent-300 text-text-primary hover:bg-surface-sunken'
          "
        >
          {{ size.label }}
        </button>
      </div>

      <!-- Custom Size Input -->
      <div class="mt-4 pt-4 border-t border-border-subtle">
        <label for="custom-size-input" class="block text-sm font-medium text-text-secondary mb-2">
          Or enter custom size (square stickers)
        </label>
        <div class="relative">
          <input
            id="custom-size-input"
            v-model.number="customSize"
            type="number"
            min="1"
            max="50"
            step="0.25"
            placeholder="e.g., 6"
            aria-describedby="custom-size-hint"
            class="w-full px-4 py-3 pr-16 rounded-lg border-2 border-border-default focus:border-accent-500 focus:outline-none bg-surface-base text-text-primary transition-colors duration-200"
            @input="handleCustomSize"
          />
          <span
            class="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary font-medium"
            aria-hidden="true"
          >
            inches
          </span>
        </div>
        <p id="custom-size-hint" class="text-xs text-text-tertiary mt-1">
          Minimum: 1", Maximum: 50" (0.25" increments)
        </p>
      </div>
    </div>

    <!-- Sticker Material -->
    <div class="option-section bg-surface-raised p-6 rounded-lg border border-border-subtle">
      <h3
        id="material-label"
        class="text-xl font-bold mb-4 text-text-primary flex items-center gap-2"
      >
        <Icon name="i-lucide-layers" size="20" aria-hidden="true" />
        Material Type
      </h3>
      <div class="space-y-3" role="radiogroup" aria-labelledby="material-label">
        <button
          v-for="material in materialOptions"
          :key="material.value"
          type="button"
          role="radio"
          @click="selectedMaterial = material.value"
          :aria-checked="selectedMaterial === material.value"
          :aria-label="`${material.label}: ${material.description}`"
          class="material-option w-full p-4 rounded-lg border-2 transition-all duration-200 text-left"
          :class="
            selectedMaterial === material.value
              ? 'border-accent-700 bg-accent-700 shadow-md scale-[1.02]'
              : 'border-border-subtle hover:border-accent-300 hover:bg-surface-sunken'
          "
        >
          <div class="flex items-start gap-3">
            <div
              class="p-2 rounded-lg flex items-center justify-center transition-colors duration-200"
              :class="
                selectedMaterial === material.value
                  ? 'bg-text-inverse text-accent-700'
                  : 'bg-surface-sunken text-text-secondary'
              "
            >
              <Icon :name="material.icon" size="20" class="pb-0 mb-0" />
            </div>
            <div class="flex-1">
              <div
                class="font-bold text-base"
                :class="
                  selectedMaterial === material.value ? 'text-text-inverse' : 'text-text-primary'
                "
              >
                {{ material.label }}
              </div>
              <div
                class="text-sm mt-1"
                :class="
                  selectedMaterial === material.value ? 'text-text-inverse' : 'text-text-secondary'
                "
              >
                {{ material.description }}
              </div>
            </div>
            <div v-if="selectedMaterial === material.value" class="flex-shrink-0 text-text-inverse">
              <Icon name="i-lucide-check-circle-2" size="24" aria-hidden="true" />
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- Quantity -->
    <div class="option-section bg-surface-raised p-6 rounded-lg border border-border-subtle">
      <h3
        id="quantity-label"
        class="text-xl font-bold mb-4 text-text-primary flex items-center gap-2"
      >
        <Icon name="i-lucide-package" size="20" aria-hidden="true" />
        Quantity
      </h3>
      <div
        class="grid grid-cols-3 sm:grid-cols-5 gap-3"
        role="group"
        aria-labelledby="quantity-label"
      >
        <button
          v-for="qty in quantityOptions"
          :key="qty"
          type="button"
          @click="selectedQuantity = qty"
          :aria-label="`Select quantity of ${qty}`"
          :aria-pressed="selectedQuantity === qty"
          class="quantity-option p-4 rounded-lg border-2 transition-all duration-200 text-center font-bold text-lg relative"
          :class="
            selectedQuantity === qty
              ? 'border-accent-700 bg-accent-700 text-text-inverse shadow-md scale-95'
              : 'border-border-subtle hover:border-accent-300 text-text-primary hover:bg-surface-sunken'
          "
        >
          {{ qty }}
          <!-- Discount Badge -->
          <span
            v-if="getQuantityDiscountPercent(qty) > 0"
            class="absolute -top-2 -right-2 bg-success-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md"
          >
            {{ getQuantityDiscountPercent(qty) }}% off
          </span>
        </button>
      </div>

      <!-- Custom Quantity Input -->
      <div class="mt-4 pt-4 border-t border-border-subtle">
        <label
          for="custom-quantity-input"
          class="block text-sm font-medium text-text-secondary mb-2"
        >
          Or enter custom quantity (min. 1000)
        </label>
        <input
          id="custom-quantity-input"
          v-model.number="customQuantity"
          type="number"
          min="1000"
          placeholder="Enter quantity"
          aria-label="Custom quantity (minimum 1000)"
          class="w-full px-4 py-3 rounded-lg border-2 border-border-default focus:border-accent-500 focus:outline-none bg-surface-base text-text-primary transition-colors duration-200"
          @input="handleCustomQuantity"
        />
      </div>
    </div>

    <!-- Price Summary -->
    <div
      class="price-summary bg-surface-raised p-6 rounded-lg border-2 border-accent-700 shadow-lg"
      role="region"
      aria-labelledby="price-estimate-heading"
    >
      <div class="flex items-center justify-between mb-4">
        <h3 id="price-estimate-heading" class="text-xl font-bold text-text-primary">
          Price Estimate
        </h3>
        <Icon
          name="i-lucide-badge-dollar-sign"
          size="24"
          class="text-accent-700"
          aria-hidden="true"
        />
      </div>
      <div class="space-y-2 text-text-secondary mb-4">
        <div class="flex justify-between">
          <p>Size:</p>
          <p class="font-medium text-text-primary">{{ selectedSizeLabel }}</p>
        </div>
        <div class="flex justify-between">
          <p>Material:</p>
          <p class="font-medium text-text-primary">{{ selectedMaterialLabel }}</p>
        </div>
        <div class="flex justify-between">
          <p>Quantity:</p>
          <p class="font-medium text-text-primary">{{ displayQuantity }}</p>
        </div>
      </div>
      <div class="pt-4 border-t-2 border-border-default space-y-2">
        <!-- Subtotal -->
        <div class="flex justify-between text-sm">
          <p class="text-text-secondary">Subtotal:</p>
          <p class="font-medium text-text-primary">{{ priceBreakdown.formattedBaseTotal }}</p>
        </div>

        <!-- Discount (if applicable) -->
        <div v-if="priceBreakdown.discount > 0" class="flex justify-between text-sm">
          <p class="text-success-600 font-medium">
            Discount ({{ Math.round(priceBreakdown.discount * 100) }}% off):
          </p>
          <p class="font-medium text-success-600">-{{ priceBreakdown.formattedDiscountAmount }}</p>
        </div>

        <!-- Minimum order notice -->
        <div
          v-if="priceBreakdown.total === 20 && priceBreakdown.baseTotal < 20"
          class="flex justify-between text-sm"
        >
          <p class="text-text-tertiary italic">Minimum order:</p>
          <p class="font-medium text-text-tertiary italic">$20.00</p>
        </div>

        <!-- Total -->
        <div class="pt-2 border-t border-border-subtle">
          <div class="flex items-baseline justify-between">
            <p class="text-lg font-bold text-text-primary">Total:</p>
            <div class="text-right">
              <div class="text-3xl font-black text-accent-700">{{ calculatedPrice }}</div>
              <div class="text-xs text-text-secondary">+ shipping</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  /**
   * ProductOptions Component
   *
   * Handles product customization:
   * - Image upload with drag & drop
   * - Size selection
   * - Material selection
   * - Quantity selection
   * - Price calculation
   *
   * @component
   */

  interface ShopifyVariantOptions {
    sizes: number[];
    materials: string[];
    quantities: number[];
  }

  interface Props {
    shopifyVariantOptions?: ShopifyVariantOptions | null;
    loading?: boolean;
  }

  const props = defineProps<Props>();

  // Default size options
  const defaultSizeOptions: Array<{ value: number; label: string }> = [
    { value: 2, label: '2"' },
    { value: 3, label: '3"' },
    { value: 4, label: '4"' },
    { value: 5, label: '5"' },
  ];

  // Size options - use Shopify variants if available, otherwise use defaults
  const presetSizeOptions = computed(() => {
    if (props.shopifyVariantOptions?.sizes && props.shopifyVariantOptions.sizes.length > 0) {
      return props.shopifyVariantOptions.sizes.map((size) => ({
        value: size,
        label: `${size}"`,
      }));
    }
    return defaultSizeOptions;
  });

  // Material option definitions
  const allMaterialOptions = [
    {
      value: "vinyl",
      label: "Premium Vinyl",
      description: "Durable, waterproof, perfect for outdoor use",
      icon: "i-lucide-droplet",
    },
    {
      value: "matte",
      label: "Matte Finish",
      description: "Non-glossy, elegant look with no glare",
      icon: "i-lucide-circle-dashed",
    },
    {
      value: "glossy",
      label: "Glossy Finish",
      description: "Vibrant colors with high shine",
      icon: "i-lucide-sparkles",
    },
    {
      value: "holographic",
      label: "Holographic",
      description: "Eye-catching rainbow effect",
      icon: "i-lucide-rainbow",
    },
  ];

  // Material options - filter based on Shopify variants if available
  const materialOptions = computed(() => {
    if (
      props.shopifyVariantOptions?.materials &&
      props.shopifyVariantOptions.materials.length > 0
    ) {
      return allMaterialOptions.filter((m) =>
        props.shopifyVariantOptions!.materials.includes(m.value),
      );
    }
    return allMaterialOptions;
  });

  // Default quantity options
  const defaultQuantityOptions = [50, 100, 250, 500, 1000];

  // Quantity options - use Shopify variants if available, otherwise use defaults
  const quantityOptions = computed(() => {
    if (
      props.shopifyVariantOptions?.quantities &&
      props.shopifyVariantOptions.quantities.length > 0
    ) {
      return props.shopifyVariantOptions.quantities;
    }
    return defaultQuantityOptions;
  });

  // State
  const selectedSize = ref<number>(2);
  const customSize = ref<number | null>(null);
  const selectedMaterial = ref("glossy");
  const selectedQuantity = ref(100);
  const customQuantity = ref<number | null>(null);
  const uploadedImage = ref<string | null>(null);
  const uploadedFileName = ref("");
  const uploadedImageUrl = ref<string | null>(null); // Cloudinary URL
  const uploadedImagePublicId = ref<string | null>(null); // Cloudinary public ID
  const isDragging = ref(false);
  const fileInput = ref<HTMLInputElement | null>(null);
  const isUploading = ref(false); // Upload loading state

  // Watch for Shopify variant options and set defaults
  watch(
    () => props.shopifyVariantOptions,
    (options) => {
      if (options) {
        // Set default size to first available size (prefer 2" if available)
        if (options.sizes.length > 0 && selectedSize.value === 2 && !options.sizes.includes(2)) {
          const firstSize = options.sizes[0];
          if (firstSize !== undefined) {
            selectedSize.value = firstSize;
          }
        }

        // Set default material to first available material (prefer glossy if available)
        if (
          options.materials.length > 0 &&
          selectedMaterial.value === "glossy" &&
          !options.materials.includes("glossy")
        ) {
          const firstMaterial = options.materials[0];
          if (firstMaterial !== undefined) {
            selectedMaterial.value = firstMaterial;
          }
        }

        // Set default quantity to first available quantity (prefer 100 if available)
        if (
          options.quantities.length > 0 &&
          selectedQuantity.value === 100 &&
          !options.quantities.includes(100)
        ) {
          const firstQuantity = options.quantities[0];
          if (firstQuantity !== undefined) {
            selectedQuantity.value = firstQuantity;
          }
        }
      }
    },
    { immediate: true },
  );

  // Computed
  const selectedSizeLabel = computed(() => {
    // Use custom size if provided, otherwise use selected preset
    const effectiveSize = customSize.value || selectedSize.value;
    return `${effectiveSize}"`;
  });

  const selectedMaterialLabel = computed(() => {
    const material = materialOptions.value.find((m) => m.value === selectedMaterial.value);
    return material?.label || "Not selected";
  });

  const displayQuantity = computed(() => {
    // Use custom quantity if it's a valid number, otherwise use selected preset
    return customQuantity.value && customQuantity.value > 0
      ? customQuantity.value.toLocaleString()
      : selectedQuantity.value.toLocaleString();
  });

  const priceBreakdown = computed(() => {
    const { formatPrice, getQuantityDiscount, getSizeMultiplier, getFinishMultiplier } =
      usePricing();

    // Get the actual size in inches (use custom size if provided, otherwise use preset)
    const size = customSize.value || selectedSize.value;

    // Get the quantity (use custom quantity if valid, otherwise use preset)
    const qty =
      customQuantity.value && customQuantity.value > 0
        ? customQuantity.value
        : selectedQuantity.value;

    // Calculate breakdown
    const sizeMult = getSizeMultiplier(size);
    const finishMult = getFinishMultiplier(selectedMaterial.value);
    const baseTotal = 0.2 * qty * sizeMult * finishMult;
    const discount = getQuantityDiscount(qty);
    const discountAmount = baseTotal * discount;
    const totalWithDiscount = baseTotal - discountAmount;
    const total = Math.max(totalWithDiscount, 20);

    return {
      baseTotal,
      discount,
      discountAmount,
      total,
      formattedBaseTotal: formatPrice(baseTotal),
      formattedDiscountAmount: formatPrice(discountAmount),
      formattedTotal: formatPrice(total),
    };
  });

  const calculatedPrice = computed(() => {
    return priceBreakdown.value.formattedTotal;
  });

  // Methods
  const handleSizeSelect = (size: number) => {
    selectedSize.value = size;
    // Reset custom size when selecting a preset size
    customSize.value = null;
  };

  const handleCustomSize = () => {
    // Custom size input handler - no need to deselect presets
    // The computed properties will use customSize when it's valid
  };

  const triggerFileInput = () => {
    fileInput.value?.click();
  };

  const handleFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (event: DragEvent) => {
    isDragging.value = false;
    const file = event.dataTransfer?.files[0];
    if (file && file.type.startsWith("image/")) {
      processFile(file);
    }
  };

  const processFile = async (file: File) => {
    const { uploadImage, validateImage } = useCloudinary();

    // Validate file
    const validation = validateImage(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    try {
      isUploading.value = true;

      // Upload to Cloudinary (this shows the loading spinner)
      const result = await uploadImage(file, file.name);

      // After successful upload, set preview to Cloudinary URL
      uploadedImage.value = result.url;
      uploadedImageUrl.value = result.url;
      uploadedImagePublicId.value = result.publicId;
      uploadedFileName.value = file.name;

      console.log("✅ Image uploaded to Cloudinary:", result.url);
    } catch (error: any) {
      console.error("❌ Failed to upload image:", error);
      alert(`Failed to upload image: ${error.message || "Unknown error"}`);
      // Clear state on error
      uploadedImage.value = null;
      uploadedImageUrl.value = null;
      uploadedImagePublicId.value = null;
      uploadedFileName.value = "";
    } finally {
      isUploading.value = false;
    }
  };

  const removeImage = async () => {
    // Delete from Cloudinary if we have a public ID
    if (uploadedImagePublicId.value) {
      try {
        const { deleteImage } = useCloudinary();
        await deleteImage(uploadedImagePublicId.value);
        console.log("✅ Image deleted from Cloudinary");
      } catch (error) {
        console.error("❌ Failed to delete image from Cloudinary:", error);
        // Continue with local cleanup even if Cloudinary delete fails
      }
    }

    // Clear local state
    uploadedImage.value = null;
    uploadedFileName.value = "";
    uploadedImageUrl.value = null;
    uploadedImagePublicId.value = null;
    if (fileInput.value) {
      fileInput.value.value = "";
    }
  };

  const handleCustomQuantity = () => {
    // Custom quantity input handler - no need to deselect presets
    // The computed properties will use customQuantity when it's valid
  };

  // Helper to get discount percentage for a quantity (for display on buttons)
  const getQuantityDiscountPercent = (quantity: number): number => {
    const { getQuantityDiscount } = usePricing();
    return Math.round(getQuantityDiscount(quantity) * 100);
  };

  // Expose selected values for parent component
  defineExpose({
    selectedSize,
    customSize,
    selectedMaterial,
    selectedQuantity,
    customQuantity,
    uploadedImage,
    uploadedImageUrl,
    uploadedImagePublicId,
    uploadedFileName,
    calculatedPrice,
    isUploading,
  });
</script>

<style scoped>
  .upload-area {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .upload-area:focus-visible {
    outline: 2px solid var(--color-accent-700);
    outline-offset: 2px;
  }

  .size-option,
  .material-option,
  .quantity-option {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .size-option:focus-visible,
  .material-option:focus-visible,
  .quantity-option:focus-visible {
    outline: 2px solid var(--color-accent-700);
    outline-offset: 2px;
  }

  input:focus-visible {
    outline: 2px solid var(--color-accent-700);
    outline-offset: 2px;
  }

  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }

  /* Custom size transition */
  .custom-size-enter-active,
  .custom-size-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
  }

  .custom-size-enter-from,
  .custom-size-leave-to {
    opacity: 0;
    max-height: 0;
    transform: translateY(-10px);
  }

  .custom-size-enter-to,
  .custom-size-leave-from {
    opacity: 1;
    max-height: 200px;
    transform: translateY(0);
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .upload-area,
    .size-option,
    .material-option,
    .quantity-option,
    .custom-size-enter-active,
    .custom-size-leave-active {
      transition-duration: 0.01ms !important;
    }
  }
</style>
