# SEO Guide for The Legendary Prints

Your site is now optimized for search engines with dynamic Shopify content!

## What's Implemented

### 1. Server-Side Rendering (SSR) ✅
- **Enabled**: `ssr: true` in `nuxt.config.ts`
- **Benefit**: Search engines can crawl and index your content immediately
- **How it works**: Each page is rendered on the server with full HTML content before being sent to the browser

### 2. Prerendering / Static Site Generation ✅
- **Configured**: Pages are prerendered at build time
- **Routes prerendered**:
  - `/` (Home)
  - `/about`
  - `/contact`
  - `/products`
  - `/cart`
  - `/products/[slug]` (Dynamic product pages from Shopify)

- **How it works**:
  - During build, Nuxt fetches all products from Shopify
  - Generates static HTML files for each product page
  - Crawlers see instant content without JavaScript

### 3. Dynamic Meta Tags ✅
Every product page includes:
- **Title**: Optimized with product name and keywords
- **Description**: Product description + value props
- **Open Graph**: Facebook/LinkedIn sharing previews
- **Twitter Cards**: Twitter sharing previews
- **Canonical URLs**: Prevents duplicate content issues

### 4. Structured Data (JSON-LD) ✅
Product pages include Schema.org markup:
```json
{
  "@type": "Product",
  "name": "Die-Cut Stickers",
  "description": "...",
  "brand": "The Legendary Prints",
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "USD",
    "lowPrice": "20.00",
    "availability": "InStock"
  }
}
```

**Benefits**:
- Rich snippets in Google search results
- Product prices shown in search
- Star ratings (if you add reviews)
- "In Stock" badge

### 5. Sitemap Generation
The `@nuxtjs/seo` module automatically generates:
- `sitemap.xml` - List of all pages
- `robots.txt` - Tells crawlers what to index

## Build & Deploy

### Local Build (Test Prerendering)
```bash
pnpm build
pnpm preview
```

This generates all static pages in `.output/public/`

### Netlify Deployment
Netlify automatically:
1. Runs `pnpm build`
2. Prerenders all pages
3. Deploys to CDN
4. Serves SSR for dynamic pages

**Environment Variables on Netlify**:
Make sure these are set in Netlify dashboard:
- `SHOPIFY_STORE_DOMAIN`
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN`
- `NUXT_PUBLIC_SITE_URL` (your production URL)
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## Testing SEO

### 1. View Source Test
Visit any product page and **View Page Source** (Ctrl+U / Cmd+U):
- ✅ You should see full HTML content (not just `<div id="app"></div>`)
- ✅ Meta tags should be visible in `<head>`
- ✅ Product title and description should be in the HTML

### 2. Google Search Console
1. Add your site: [Google Search Console](https://search.google.com/search-console)
2. Submit your sitemap: `https://yoursite.com/sitemap.xml`
3. Request indexing for key pages

### 3. Google Rich Results Test
Test structured data:
1. Go to [Rich Results Test](https://search.google.com/test/rich-results)
2. Enter a product page URL
3. Should show "Product" schema detected ✅

### 4. Lighthouse SEO Score
Run in Chrome DevTools:
```bash
# Open DevTools → Lighthouse → SEO
# Should score 90+ with SSR enabled
```

## How Product Pages are Discovered

### Crawling Flow:
1. **Homepage** → Crawler finds link to `/products`
2. **Products page** → Crawler finds links to individual products
3. **Product pages** → Each has unique URL: `/products/die-cut-stickers`

### Sitemap Flow:
1. Crawler reads `robots.txt`
2. Finds `sitemap.xml`
3. Discovers all product URLs immediately
4. Indexes everything faster

## Performance Tips

### 1. Image Optimization
Already implemented:
- Cloudinary handles image optimization
- Automatic format conversion (WebP)
- Lazy loading for images

### 2. Preload Critical Assets
Add to `nuxt.config.ts` if needed:
```ts
app: {
  head: {
    link: [
      { rel: 'preconnect', href: 'https://res.cloudinary.com' }
    ]
  }
}
```

### 3. Cache Control
Netlify automatically adds:
- Static assets: Cached for 1 year
- HTML pages: Cached with revalidation

## Monitoring & Analytics

### Google Analytics (Optional)
Install if you want traffic data:
```bash
pnpm add -D @nuxtjs/google-analytics
```

Then add to `nuxt.config.ts`:
```ts
modules: [
  ['@nuxtjs/google-analytics', {
    id: 'G-XXXXXXXXXX'
  }]
]
```

### Google Tag Manager (Better Option)
More flexible for tracking conversions:
```bash
pnpm add -D @nuxtjs/gtm
```

## Common SEO Issues (Fixed)

### ❌ Problem: JavaScript-Only Rendering
**Before**: Search engines see empty `<div id="app">`
**Fixed**: SSR renders full HTML on server ✅

### ❌ Problem: Duplicate Content
**Before**: Same product at multiple URLs
**Fixed**: Canonical URLs in meta tags ✅

### ❌ Problem: Missing Meta Descriptions
**Before**: Generic descriptions
**Fixed**: Dynamic descriptions per product ✅

### ❌ Problem: No Product Rich Snippets
**Before**: Plain search results
**Fixed**: JSON-LD structured data ✅

## Next Steps

### 1. Add Product Reviews
Install review app in Shopify → Automatically adds review schema

### 2. Add Breadcrumbs
Shows hierarchy in search results:
```
Home > Products > Die-Cut Stickers
```

### 3. Blog for Content Marketing
Create `/content/blog/` directory for blog posts:
- "How to Design Custom Stickers"
- "Vinyl vs Paper Stickers: Complete Guide"
- Drives organic traffic

### 4. Local SEO (If applicable)
Add LocalBusiness schema for physical location

## Resources

- [Nuxt SEO Documentation](https://nuxtseo.com/)
- [Google Search Central](https://developers.google.com/search)
- [Schema.org Product Markup](https://schema.org/Product)
- [Shopify SEO Best Practices](https://www.shopify.com/blog/seo)

## Verification Checklist

Before going live, verify:
- [ ] All product pages load with SSR
- [ ] Meta tags are unique per page
- [ ] Sitemap is accessible at `/sitemap.xml`
- [ ] Robots.txt allows crawling
- [ ] Images have alt text
- [ ] Links work (no 404s)
- [ ] Mobile-friendly (use Google Mobile-Friendly Test)
- [ ] HTTPS enabled (Netlify provides free SSL)
- [ ] Page speed is good (Lighthouse score 90+)

---

**Your site is now SEO-ready!** 🚀

Search engines can crawl and index all your Shopify products without needing JavaScript. The combination of SSR + prerendering + structured data gives you the best of both worlds: fast static pages with dynamic content.
