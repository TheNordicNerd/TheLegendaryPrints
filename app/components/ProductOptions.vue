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
        v-if="!uploadedImage"
        @click="triggerFileInput"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleDrop"
        @keydown.enter="triggerFileInput"
        @keydown.space.prevent="triggerFileInput"
        tabindex="0"
        role="button"
        aria-label="Click to upload image or drag and drop"
        class="upload-area border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200"
        :class="
          isDragging
            ? 'border-accent-500 bg-accent-50 scale-[0.98]'
            : 'border-border-default hover:border-accent-500 hover:bg-surface-sunken'
        "
      >
        <div class="flex flex-col items-center gap-3">
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
            max="12"
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
          Minimum: 1", Maximum: 12" (0.25" increments)
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
          class="quantity-option p-4 rounded-lg border-2 transition-all duration-200 text-center font-bold text-lg"
          :class="
            selectedQuantity === qty
              ? 'border-accent-700 bg-accent-700 text-text-inverse shadow-md scale-95'
              : 'border-border-subtle hover:border-accent-300 text-text-primary hover:bg-surface-sunken'
          "
        >
          {{ qty }}
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
      <div class="pt-4 border-t-2 border-border-default">
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

  // Size options
  const presetSizeOptions: Array<{ value: number; label: string }> = [
    { value: 2, label: '2"' },
    { value: 3, label: '3"' },
    { value: 4, label: '4"' },
    { value: 5, label: '5"' },
  ];

  // Material options
  const materialOptions = [
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

  // Quantity options
  const quantityOptions = [50, 100, 250, 500, 1000];

  // State
  const selectedSize = ref<number>(3);
  const customSize = ref<number | null>(null);
  const selectedMaterial = ref("vinyl");
  const selectedQuantity = ref(100);
  const customQuantity = ref<number | null>(null);
  const uploadedImage = ref<string | null>(null);
  const uploadedFileName = ref("");
  const isDragging = ref(false);
  const fileInput = ref<HTMLInputElement | null>(null);

  // Computed
  const selectedSizeLabel = computed(() => {
    // Use custom size if provided, otherwise use selected preset
    const effectiveSize = customSize.value || selectedSize.value;
    return `${effectiveSize}" × ${effectiveSize}"`;
  });

  const selectedMaterialLabel = computed(() => {
    const material = materialOptions.find((m) => m.value === selectedMaterial.value);
    return material?.label || "Not selected";
  });

  const displayQuantity = computed(() => {
    return customQuantity.value && customQuantity.value >= 1000
      ? customQuantity.value.toLocaleString()
      : selectedQuantity.value.toLocaleString();
  });

  const calculatedPrice = computed(() => {
    // Calculate based on square inches
    const basePrice = 0.1; // Price per square inch

    // Get the actual size in inches (use custom size if provided, otherwise use preset)
    const sizeInInches = customSize.value || selectedSize.value;

    // Calculate square inches (width × height, since it's square)
    const squareInches = sizeInInches * sizeInInches;

    const materialMultiplier =
      {
        vinyl: 1,
        matte: 1.2,
        glossy: 1.3,
        holographic: 1.8,
      }[selectedMaterial.value] || 1;

    const qty =
      customQuantity.value && customQuantity.value >= 1000
        ? customQuantity.value
        : selectedQuantity.value;

    const total = basePrice * squareInches * materialMultiplier * qty;
    return `$${total.toFixed(2)}`;
  });

  // Methods
  const handleSizeSelect = (size: number) => {
    selectedSize.value = size;
    // Reset custom size when selecting a preset size
    customSize.value = null;
  };

  const handleCustomSize = () => {
    if (customSize.value && customSize.value >= 1) {
      selectedSize.value = 0; // Deselect preset sizes
    }
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

  const processFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      uploadedImage.value = e.target?.result as string;
      uploadedFileName.value = file.name;
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    uploadedImage.value = null;
    uploadedFileName.value = "";
    if (fileInput.value) {
      fileInput.value.value = "";
    }
  };

  const handleCustomQuantity = () => {
    if (customQuantity.value && customQuantity.value >= 1000) {
      selectedQuantity.value = 0; // Deselect preset quantities
    }
  };

  // Expose selected values for parent component
  defineExpose({
    selectedSize,
    customSize,
    selectedMaterial,
    selectedQuantity,
    customQuantity,
    uploadedImage,
    calculatedPrice,
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
