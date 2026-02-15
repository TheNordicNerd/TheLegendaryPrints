# Quick Deployment Guide

## ✅ Fixed Issues
- ✅ Tailwind CSS is now compiled (49KB)
- ✅ SVG icon sizing is fixed
- ✅ All styling should now work correctly

## 🚀 Deploy to Shopify (2 Minutes)

### Option 1: Using Shopify CLI (Recommended)

```bash
# 1. Preview locally first (CSS auto-builds)
npm run shopify:dev
# Opens at http://127.0.0.1:9292

# 2. Push to Shopify (CSS auto-builds)
npm run shopify:push
```

### Option 2: Manual Upload

```bash
# 1. Build CSS
npm run shopify:build-css

# 2. Zip the theme
cd shopify-theme
zip -r ../legendary-prints-theme.zip *

# 3. Upload via Shopify Admin
# Go to: Online Store > Themes > Upload theme
```

## 🛠️ Available NPM Scripts

```bash
# Build Shopify CSS (one-time)
npm run shopify:build-css

# Watch CSS for changes (during development)
npm run shopify:watch-css

# Start Shopify theme dev server (builds CSS + starts preview)
npm run shopify:dev

# Build CSS and push to Shopify
npm run shopify:push
```

## 🎨 Making Style Changes

### If you edit Tailwind classes in Liquid files:
```bash
npm run shopify:build-css
```

### If you're actively working on styles:
```bash
npm run shopify:watch-css
```

## 📋 Post-Deployment Checklist

After uploading the theme:

### 1. Create Collections
- Go to **Products > Collections**
- Create a collection called `best-sellers`
- Add products to it

### 2. Set Up Menus
- Go to **Online Store > Navigation**
- Create/edit **Main menu** with links like:
  - Home → `/`
  - Products → `/collections/all`
  - Samples → `/products/sample-pack`
  - Contact → `/pages/contact`

### 3. Upload Logo
- Go to **Online Store > Themes**
- Click **Customize**
- Click on **Header** section
- Upload your logo image (`/public/lp-logo.png`)

### 4. Configure Theme Settings
In the theme customizer (Theme Settings):
- **Typography**: Set fonts (Montserrat/Inter are defaults)
- **Social Media**: Add your social links
- **Favicon**: Upload favicon
- **Share Image**: Upload default OG image

### 5. Add Products
- Upload your product catalog
- Assign products to collections
- Set featured images

## 🔧 Troubleshooting

### Icons still huge?
Make sure both CSS files are loaded in your browser's Network tab:
- `theme.css` (compiled Tailwind - 49KB)
- `custom.css` (SVG size fixes)

If they're not loading, check `layout/theme.liquid` has these lines:
```liquid
{{ 'theme.css' | asset_url | stylesheet_tag }}
{{ 'custom.css' | asset_url | stylesheet_tag }}
```

### CSS not applying?
1. Rebuild CSS: `npm run shopify:build-css`
2. Clear browser cache (Cmd+Shift+R / Ctrl+Shift+R)
3. Check browser console for 404 errors on CSS files

### Images not showing?
- Upload images to Shopify's Files (Settings > Files)
- Or place in `shopify-theme/assets/` directory
- Reference with: `{{ 'image.png' | asset_url }}`

## 🎯 Next Steps

1. **Test the theme** on a development store first
2. **Install recommended apps**:
   - **Zakeke** - Product customizer for custom stickers
   - **Judge.me** - Product reviews with photos
   - **Klaviyo** - Email marketing automation
3. **Add your products** and organize into collections
4. **Set up shipping** rates in Shopify settings
5. **Configure payments** (Shopify Payments recommended)
6. **Launch!** 🚀

## 💡 Pro Tips

- **Always test on dev store** before pushing to production
- **Use `npm run shopify:dev`** to see changes live
- **Keep theme in git** for version control
- **Backup before major changes** via Shopify admin
- **Check mobile** responsiveness in preview

## 📞 Need Help?

- [Shopify Theme Docs](https://shopify.dev/themes)
- [Shopify CLI Reference](https://shopify.dev/themes/tools/cli)
- [Liquid Cheat Sheet](https://www.shopify.com/partners/shopify-cheat-sheet)
