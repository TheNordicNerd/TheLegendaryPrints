# Cloudinary Setup Guide

This guide will help you set up Cloudinary for image uploads in The Legendary Prints sticker store.

## Why Cloudinary?

- ✅ **Free tier**: 25 GB storage, 25 GB bandwidth/month (~25,000 images)
- ✅ **Easy to use**: Simple API, no complex configuration
- ✅ **Image optimization**: Automatic compression and format conversion
- ✅ **CDN included**: Fast delivery worldwide
- ✅ **Scalable**: Pay-as-you-grow pricing

## Step 1: Create a Free Cloudinary Account

1. Go to [https://cloudinary.com/users/register_free](https://cloudinary.com/users/register_free)
2. Sign up with your email (or use Google/GitHub login)
3. Verify your email address

## Step 2: Get Your API Credentials

1. After signing in, go to your [Dashboard](https://console.cloudinary.com/)
2. You'll see your **Account Details** at the top:
   - **Cloud Name** (e.g., `dxxxxxxxxx`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (click "👁️ Reveal" to see it)

## Step 3: Add Credentials to Your Project

1. Copy your `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add your Cloudinary credentials:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name_here
   CLOUDINARY_API_KEY=your_api_key_here
   CLOUDINARY_API_SECRET=your_api_secret_here
   ```

3. **Important**: Never commit your `.env` file to git! It's already in `.gitignore`.

## Step 4: Test the Upload

1. Start your development server:
   ```bash
   pnpm dev
   ```

2. Navigate to any product page (e.g., `/products/die-cut-stickers`)

3. Upload an image:
   - Click the upload area or drag & drop an image
   - You should see "Uploading..." then a preview
   - Check the browser console for "✅ Image uploaded to Cloudinary: [URL]"

4. Verify in Cloudinary:
   - Go to [Media Library](https://console.cloudinary.com/console/media_library)
   - You should see your uploaded image in the `sticker-designs` folder

## Step 5: Production Deployment

When deploying to production (Netlify, Vercel, etc.), add the environment variables to your hosting platform:

### Netlify:
1. Go to Site Settings → Environment Variables
2. Add the three Cloudinary variables
3. Redeploy your site

### Vercel:
1. Go to Project Settings → Environment Variables
2. Add the three Cloudinary variables
3. Redeploy

## How It Works

1. **User uploads image** → Stored locally for preview
2. **Image sent to Cloudinary** → Via `/api/upload/image` endpoint
3. **Cloudinary processes** → Optimizes, resizes, stores
4. **Returns URL** → Saved in cart as custom attribute
5. **At checkout** → Shopify order includes Cloudinary URL

## Free Tier Limits

- **Storage**: 25 GB
- **Bandwidth**: 25 GB/month
- **Transformations**: 25 credits/month
- **API calls**: Unlimited

For a small sticker business, this is plenty to start!

## Need Help?

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Cloudinary Support](https://support.cloudinary.com/)
- Check the browser console for error messages

## Security Notes

- ✅ API credentials are server-side only (never exposed to client)
- ✅ Images are uploaded from server, not directly from client
- ✅ Cloudinary URLs are public (safe to share)
- ✅ Free tier has rate limiting (protects against abuse)
