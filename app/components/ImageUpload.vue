<template>
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
</template>

<script setup lang="ts">
  const uploadedImage = ref<string | null>(null);
  const uploadedFileName = ref('');
  const uploadedImageUrl = ref<string | null>(null);
  const uploadedImagePublicId = ref<string | null>(null);
  const isDragging = ref(false);
  const fileInput = ref<HTMLInputElement | null>(null);
  const isUploading = ref(false);

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
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  const processFile = async (file: File) => {
    const { uploadImage, validateImage } = useCloudinary();

    const validation = validateImage(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    try {
      isUploading.value = true;
      const result = await uploadImage(file, file.name);

      uploadedImage.value = result.url;
      uploadedImageUrl.value = result.url;
      uploadedImagePublicId.value = result.publicId;
      uploadedFileName.value = file.name;

      console.log('✅ Image uploaded to Cloudinary:', result.url);
    } catch (error: any) {
      console.error('❌ Failed to upload image:', error);
      alert(`Failed to upload image: ${error.message || 'Unknown error'}`);
      uploadedImage.value = null;
      uploadedImageUrl.value = null;
      uploadedImagePublicId.value = null;
      uploadedFileName.value = '';
    } finally {
      isUploading.value = false;
    }
  };

  const removeImage = async () => {
    if (uploadedImagePublicId.value) {
      try {
        const { deleteImage } = useCloudinary();
        await deleteImage(uploadedImagePublicId.value);
        console.log('✅ Image deleted from Cloudinary');
      } catch (error) {
        console.error('❌ Failed to delete image from Cloudinary:', error);
      }
    }

    uploadedImage.value = null;
    uploadedFileName.value = '';
    uploadedImageUrl.value = null;
    uploadedImagePublicId.value = null;
    if (fileInput.value) {
      fileInput.value.value = '';
    }
  };

  defineExpose({
    uploadedImage,
    uploadedImageUrl,
    uploadedImagePublicId,
    uploadedFileName,
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
</style>
