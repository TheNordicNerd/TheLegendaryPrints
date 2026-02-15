# Shopify Theme Conversion - Quick Start Guide

## ✅ What's Been Converted

Your Nuxt.js application has been successfully converted to a Shopify theme! Here's what's ready to use:

### Core Structure ✓
- **Layout**: Main theme layout with header, footer, and content areas
- **Styling**: All Tailwind CSS styling preserved with color scheme intact
- **Branding**: Magenta (#FF006E), Cyan (#00D9FF), and Yellow (#FED801) colors

### Pages & Templates ✓
1. **Homepage** (`templates/index.json`)
   - Hero section with CTA buttons
   - Best Sellers product grid

2. **Product Page** (`templates/product.liquid`)
   - Image gallery with thumbnails
   - Variant selection
   - Quantity controls
   - Add to cart functionality

3. **Collection Page** (`templates/collection.liquid`)
   - Product grid layout
   - Sorting options
   - Pagination

4. **Cart Page** (`templates/cart.liquid`)
   - Cart item management
   - Quantity updates
   - Order summary
   - Checkout button

### Components ✓
- **Header/Navbar**: Desktop + mobile navigation with dropdowns
- **Footer**: Multi-column layout with newsletter signup
- **Product Cards**: Reusable product display cards
- **Hero Section**: Customizable hero with animations
- **Best Sellers**: Dynamic product grid from collection

## 🚀 Getting Started (5 Minutes)

### Step 1: Install Shopify CLI
```bash
npm install -g @shopify/cli @shopify/theme
```

### Step 2: Navigate to Theme
```bash
cd shopify-theme
```

### Step 3: Connect to Your Store
```bash
shopify theme dev --store your-store.myshopify.com
```

This will open a local development preview where you can see your theme live!

### Step 4: Push to Shopify
```bash
shopify theme push --store your-store.myshopify.com
```

## 📋 Essential Setup Checklist

After deploying the theme, complete these steps:

### In Shopify Admin

- [ ] **Create menus** (Navigation)
  - Main menu for header
  - Footer menu for footer links

- [ ] **Create "best-sellers" collection** (Products > Collections)
  - Add your top products here
  - This powers the homepage section

- [ ] **Upload logo** (Online Store > Themes > Customize > Header)

- [ ] **Configure fonts** (Theme Settings)
  - Headings: Montserrat (Bold/Extrabold)
  - Body: Inter (Regular/Medium)

- [ ] **Add social links** (Theme Settings > Social Media)

- [ ] **Create required pages** (Online Store > Pages)
  - Privacy Policy
  - Terms of Service
  - Refund Policy
  - Contact

## 🎨 Tailwind CSS Setup

The theme uses Tailwind CSS. To compile styles:

```bash
# From project root
npm install -D tailwindcss

# Compile CSS
npx tailwindcss -i ./shopify-theme/assets/theme.css.liquid -o ./shopify-theme/assets/theme.css --minify
```

Or add to package.json:
```json
{
  "scripts": {
    "build:shopify-css": "tailwindcss -i ./shopify-theme/assets/theme.css.liquid -o ./shopify-theme/assets/theme.css --minify"
  }
}
```

Then run: `npm run build:shopify-css`

## 🔄 What Changed from Nuxt.js?

### Before (Nuxt.js)
```vue
<template>
  <div class="hero">
    <h1>{{ title }}</h1>
    <Button @click="navigate">Click me</Button>
  </div>
</template>

<script setup>
const title = ref('Hello')
</script>
```

### After (Shopify Liquid)
```liquid
<div class="hero">
  <h1>{{ section.settings.title }}</h1>
  <a href="{{ section.settings.button_link }}" class="button">
    {{ section.settings.button_text }}
  </a>
</div>

{% schema %}
{
  "name": "Hero",
  "settings": [
    {
      "type": "text",
      "id": "title",
      "label": "Title",
      "default": "Hello"
    }
  ]
}
{% endschema %}
```

**Key Differences:**
- Vue components → Liquid sections/snippets
- JavaScript state → Liquid variables
- API calls → Shopify's built-in objects (`{{ product }}`, `{{ collection }}`)
- Router navigation → Regular links
- Composables → Liquid filters and tags

## 📦 Recommended Apps for Missing Features

Your Nuxt app had some features that work better as Shopify apps:

### Custom Design Page → Product Customizer Apps
- **Zakeke** - Visual product customizer
- **Customily** - Design your own products
- **Product Personalizer** - Add custom text/images

### Reviews Section → Review Apps
- **Judge.me** - Reviews with photos
- **Loox** - Photo reviews
- **Stamped.io** - Reviews & loyalty

### Newsletter/Email → Email Marketing
- **Klaviyo** - Powerful email automation
- **Omnisend** - Email & SMS
- **Mailchimp** - Email marketing (Shopify has built-in integration)

## 🎯 What Still Needs Converting

From your original Nuxt app, these weren't converted (you can add them manually or use apps):

- [ ] **ProcessSection.vue** - The "how it works" section
- [ ] **ReviewsSection.vue** - Customer reviews (use Shopify review app instead)
- [ ] **Marquee.vue** - Scrolling text/logos
- [ ] **Custom Design Page** - Image upload for custom orders (use product customizer app)
- [ ] **Newsletter Popup Modal** - Use Shopify email app or Klaviyo

## 🔌 Why Shopify Plugins Now Work

### Before (Headless Nuxt):
- Shopify apps expected Liquid templates ❌
- Apps couldn't inject code into your Vue app ❌
- Apps couldn't customize checkout ❌

### Now (Shopify Theme):
- Apps can add sections via theme editor ✅
- Apps work with Liquid templates ✅
- Apps integrate with checkout ✅
- App blocks show up in theme customizer ✅

## 🎨 Customizing Your Theme

### Change Colors
Edit `layout/theme.liquid` around line 45:
```css
:root {
  --color-magenta: #FF006E;  /* Change this! */
  --color-cyan: #00D9FF;
  --color-yellow: #FED801;
}
```

### Edit Homepage
1. Go to Online Store > Themes > Customize
2. Click sections to edit content
3. Add/remove sections via the left sidebar

### Add New Section
Create `sections/your-section.liquid`:
```liquid
<div class="your-section">
  <h2>{{ section.settings.title }}</h2>
</div>

{% schema %}
{
  "name": "Your Section",
  "settings": [
    {
      "type": "text",
      "id": "title",
      "label": "Title"
    }
  ],
  "presets": [
    {
      "name": "Your Section"
    }
  ]
}
{% endschema %}
```

## 🆘 Troubleshooting

### Theme not showing CSS
1. Compile Tailwind CSS: `npm run build:shopify-css`
2. Push theme again: `shopify theme push`

### Products not showing on homepage
1. Create "best-sellers" collection
2. Add products to it
3. In theme editor, select that collection for Best Sellers section

### Navigation menu empty
1. Go to Navigation in Shopify admin
2. Create "main-menu"
3. Add links (Home, Products, Contact, etc.)

## 📚 Next Steps

1. **Test everything**: Browse your store, add products to cart, test checkout
2. **Add products**: Upload your product catalog
3. **Install apps**: Get product customizer and review apps
4. **Configure shipping**: Set up shipping rates
5. **Set up payments**: Connect payment providers
6. **Launch!** 🚀

## 💡 Pro Tips

- **Development Store**: Test on a free development store first
- **Backup**: Always backup before making changes
- **Version Control**: Keep theme code in git
- **Test Apps**: Test app integrations on dev store first
- **Performance**: Use Shopify's image optimization (it's automatic!)

## 📖 Learning Resources

- [Shopify Liquid Basics](https://shopify.dev/api/liquid)
- [Theme Architecture](https://shopify.dev/themes/architecture)
- [Shopify CLI Guide](https://shopify.dev/themes/tools/cli)
- [App Integration](https://shopify.dev/themes/architecture/sections/app-blocks)

---

**Questions?** Check the [full README](./shopify-theme/README.md) or Shopify's documentation!
