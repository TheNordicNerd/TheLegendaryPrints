/**
 * Cloudinary Composable
 * Helper functions for uploading images to Cloudinary
 */

export interface CloudinaryUploadResponse {
  success: boolean;
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  size: number;
  thumbnail: string;
}

export const useCloudinary = () => {
  /**
   * Upload an image to Cloudinary
   * @param file - File object or base64 string
   * @param filename - Optional filename
   * @returns Upload response with image URL
   */
  const uploadImage = async (
    file: File | string,
    filename?: string
  ): Promise<CloudinaryUploadResponse> => {
    let imageData: string;
    let imageName: string;

    // Convert File to base64 if needed
    if (typeof file === 'string') {
      imageData = file;
      imageName = filename || 'design';
    } else {
      imageData = await fileToBase64(file);
      imageName = filename || file.name;
    }

    // Upload to Cloudinary via API
    const response = await $fetch<CloudinaryUploadResponse>('/api/upload/image', {
      method: 'POST',
      body: {
        image: imageData,
        filename: imageName,
      },
    });

    return response;
  };

  /**
   * Convert File to base64 string
   */
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  /**
   * Validate image file
   */
  const validateImage = (file: File): { valid: boolean; error?: string } => {
    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Invalid file type. Please upload JPG, PNG, GIF, SVG, or WebP images.',
      };
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File size must be less than 10MB.',
      };
    }

    return { valid: true };
  };

  /**
   * Delete an image from Cloudinary
   * @param publicId - The public ID of the image to delete
   */
  const deleteImage = async (publicId: string): Promise<{ success: boolean }> => {
    try {
      const response = await $fetch<{ success: boolean }>('/api/upload/image', {
        method: 'DELETE',
        body: {
          publicId,
        },
      });
      return response;
    } catch (error) {
      console.error('Failed to delete image from Cloudinary:', error);
      throw error;
    }
  };

  return {
    uploadImage,
    deleteImage,
    validateImage,
    fileToBase64,
  };
};
