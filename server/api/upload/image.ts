/**
 * Image Upload API Endpoint
 * Uploads and deletes images to/from Cloudinary for customer sticker designs
 */

import { v2 as cloudinary } from 'cloudinary';

export default defineEventHandler(async (event) => {
  // Handle DELETE requests
  if (event.method === 'DELETE') {
    const config = useRuntimeConfig();

    cloudinary.config({
      cloud_name: config.cloudinaryCloudName,
      api_key: config.cloudinaryApiKey,
      api_secret: config.cloudinaryApiSecret,
    });

    try {
      const body = await readBody(event);
      const { publicId } = body;

      if (!publicId) {
        throw createError({
          statusCode: 400,
          message: 'No public ID provided',
        });
      }

      // Delete from Cloudinary
      const result = await cloudinary.uploader.destroy(publicId);

      return {
        success: result.result === 'ok',
      };
    } catch (error: any) {
      console.error('Cloudinary delete error:', error);

      throw createError({
        statusCode: 500,
        message: error.message || 'Failed to delete image',
      });
    }
  }

  // Handle POST requests (upload)
  const config = useRuntimeConfig();

  // Debug: Log what we're getting
  console.log('🔧 Cloudinary Config:', {
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey ? '***' + config.cloudinaryApiKey.slice(-4) : 'undefined',
    api_secret: config.cloudinaryApiSecret ? '***' : 'undefined',
  });

  // Configure Cloudinary
  cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
  });

  try {
    // Read the request body (expects base64 image data)
    const body = await readBody(event);
    const { image, filename } = body;

    if (!image) {
      throw createError({
        statusCode: 400,
        message: 'No image data provided',
      });
    }

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(image, {
      folder: 'sticker-designs', // Organize uploads in a folder
      resource_type: 'auto', // Auto-detect file type
      public_id: filename ? filename.replace(/\.[^/.]+$/, '') : undefined, // Use filename without extension
      overwrite: false, // Don't overwrite existing files
      unique_filename: true, // Generate unique filename if exists
      transformation: [
        { width: 2000, height: 2000, crop: 'limit' }, // Max 2000px for print quality
        { quality: 'auto:best' }, // Optimize quality
        { fetch_format: 'auto' }, // Auto format selection
      ],
    });

    // Return the uploaded image data
    return {
      success: true,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      width: uploadResult.width,
      height: uploadResult.height,
      format: uploadResult.format,
      size: uploadResult.bytes,
      thumbnail: cloudinary.url(uploadResult.public_id, {
        width: 200,
        height: 200,
        crop: 'fill',
      }),
    };
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);

    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to upload image',
    });
  }
});
