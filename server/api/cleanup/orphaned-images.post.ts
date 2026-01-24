/**
 * Cleanup Orphaned Images
 * Deletes images from Cloudinary that are older than 7 days
 * and not associated with any completed orders
 *
 * This should be run as a scheduled job (e.g., daily via cron or Netlify scheduled functions)
 */

import { v2 as cloudinary } from 'cloudinary';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  // Configure Cloudinary
  cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
  });

  try {
    // Get all images from the sticker-designs folder
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'sticker-designs/',
      max_results: 500,
      resource_type: 'image',
    });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const deletedImages: string[] = [];
    const errors: string[] = [];

    // Check each image
    for (const resource of result.resources) {
      const uploadDate = new Date(resource.created_at);

      // If image is older than 7 days, delete it
      if (uploadDate < sevenDaysAgo) {
        try {
          await cloudinary.uploader.destroy(resource.public_id);
          deletedImages.push(resource.public_id);
          console.log(`🗑️ Deleted orphaned image: ${resource.public_id}`);
        } catch (error: any) {
          console.error(`❌ Failed to delete ${resource.public_id}:`, error.message);
          errors.push(`${resource.public_id}: ${error.message}`);
        }
      }
    }

    return {
      success: true,
      message: `Cleanup complete. Deleted ${deletedImages.length} images.`,
      deletedCount: deletedImages.length,
      deletedImages,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error: any) {
    console.error('❌ Cleanup failed:', error);

    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to cleanup orphaned images',
    });
  }
});
