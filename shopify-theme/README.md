# The Legendary Prints - Shopify Theme

This is a custom Shopify theme converted from the original Nuxt.js application. The theme maintains the same design and branding while being fully compatible with Shopify's ecosystem and plugin marketplace.

## 🎨 Theme Structure

```
shopify-theme/
├── assets/           # CSS, JavaScript, and images
│   ├── theme.css.liquid
│   ├── custom.css
│   └── theme.js
├── config/           # Theme settings
│   ├── settings_schema.json
│   └── settings_data.json
├── layout/           # Main layout files
│   └── theme.liquid
├── locales/          # Translation files
├── sections/         # Reusable sections
│   ├── header.liquid
│   ├── hero.liquid
│   ├── best-sellers.liquid
│   └── footer.liquid
├── snippets/         # Small reusable components
│   ├── meta-tags.liquid
│   └── product-card.liquid
└── templates/        # Page templates
    ├── index.json
    ├── product.liquid
    ├── collection.liquid
    └── cart.liquid
```

## 🚀 Installation & Deployment

### Option 1: Using Shopify CLI (Recommended)

1. **Install Shopify CLI**
   ```bash
   npm install -g @shopify/cli @shopify/theme
   ```

2. **Authenticate with Shopify**
   ```bash
   shopify auth login
   ```

3. **Navigate to the theme directory**
   ```bash
   cd shopify-theme
   ```

4. **Push theme to Shopify**
   ```bash
   shopify theme push --store your-store.myshopify.com
   ```

5. **Or develop locally with live preview**
   ```bash
   shopify theme dev --store your-store.myshopify.com
   ```

### Option 2: Manual Upload via Shopify Admin

1. **Zip the theme folder**
   ```bash
   cd shopify-theme
   zip -r legendary-prints-theme.zip *
   ```

2. **Upload to Shopify**
   - Go to your Shopify admin
   - Navigate to **Online Store > Themes**
   - Click **Upload theme**
   - Upload the zip file

3. **Publish the theme**
   - Once uploaded, click **Publish** to make it live

## 📦 Required Setup After Installation

### 1. Configure Menus
Go to **Online Store > Navigation** and create:
- **Main Menu** (`main-menu`): For the header navigation
- **Footer Menu** (`footer`): For footer links

### 2. Create Collections
Create these collections in **Products > Collections**:
- `best-sellers` - For the Best Sellers section on the homepage

### 3. Upload Logo
- Go to **Online Store > Themes > Customize**
- Click on the **Header** section
- Upload your logo image

### 4. Configure Theme Settings
- Navigate to **Theme Settings** in the theme editor
- Set up:
  - Fonts (Montserrat for headings, Inter for body)
  - Social media links
  - Favicon
  - Default social sharing image

### 5. Set Up Pages
Create these pages in **Online Store > Pages**:
- Privacy Policy
- Terms of Service
- Refund Policy
- Contact

## 🎨 Compiling Tailwind CSS

The theme uses Tailwind CSS for styling. To compile the CSS:

1. **Install dependencies** (from the root of your project):
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   ```

2. **Compile Tailwind** (from shopify-theme directory):
   ```bash
   npx tailwindcss -i ./assets/theme.css.liquid -o ./assets/theme.css --watch
   ```

   Or add to `package.json`:
   ```json
   {
     "scripts": {
       "build:css": "tailwindcss -i ./shopify-theme/assets/theme.css.liquid -o ./shopify-theme/assets/theme.css --minify",
       "watch:css": "tailwindcss -i ./shopify-theme/assets/theme.css.liquid -o ./shopify-theme/assets/theme.css --watch"
     }
   }
   ```

3. **Build for production**:
   ```bash
   npm run build:css
   ```

## 🎯 Key Features Converted

### ✅ Completed
- [x] Header/Navigation with dropdown menus
- [x] Hero section with CTA buttons
- [x] Best Sellers product grid
- [x] Product pages with variant selection
- [x] Collection pages with filtering/sorting
- [x] Shopping cart
- [x] Footer with newsletter signup
- [x] Responsive design (mobile-first)
- [x] Tailwind CSS styling
- [x] SEO meta tags
- [x] Accessibility features

### 📋 To Be Added (Optional)
- [ ] Process Section (needs to be converted from Vue)
- [ ] Reviews Section (consider using Shopify review apps like Judge.me or Loox)
- [ ] Custom Design page (consider using Product Customizer apps)
- [ ] Marquee section
- [ ] Newsletter popup modal
- [ ] Search functionality
- [ ] Blog template

## 🔌 Recommended Shopify Apps

Since you moved to Shopify to use plugins, here are recommended apps:

### Product Reviews
- **Judge.me** - Product reviews & ratings
- **Loox** - Photo reviews

### Product Customization
- **Zakeke** - Product customizer for custom designs
- **Customily** - Product personalization

### Email Marketing
- **Klaviyo** - Email marketing & automation
- **Omnisend** - Email & SMS marketing

### Analytics & Optimization
- **Lucky Orange** - Heatmaps & session recordings
- **Google & Facebook Pixels** - Built-in Shopify integration

## 🎨 Customization

### Editing Sections
Sections can be edited in the Shopify theme editor:
1. Go to **Online Store > Themes**
2. Click **Customize** on your theme
3. Click on any section to edit its content

### Changing Colors
Colors are defined as CSS variables in `layout/theme.liquid`:
```css
:root {
  --color-magenta: #FF006E;
  --color-cyan: #00D9FF;
  --color-yellow: #FED801;
  /* ... more colors */
}
```

### Adding New Sections
1. Create a new file in `sections/`
2. Add Liquid markup and schema
3. Add the section in the theme editor

## 🐛 Troubleshooting

### CSS not applying
- Make sure you've compiled Tailwind CSS
- Check that `theme.css` exists in `assets/`
- Verify CSS is being loaded in `layout/theme.liquid`

### Images not showing
- Upload images to Shopify's file storage
- Use Shopify's `image_url` filter for responsive images

### Sections not showing in editor
- Ensure each section has a `{% schema %}` block
- Check JSON syntax in schema
- Verify section is added to template JSON

## 📚 Resources

- [Shopify Theme Development Docs](https://shopify.dev/themes)
- [Liquid Template Language](https://shopify.dev/api/liquid)
- [Shopify CLI Documentation](https://shopify.dev/themes/tools/cli)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 💡 Next Steps

1. **Test the theme thoroughly** on a development store
2. **Add remaining sections** from your Nuxt app
3. **Install recommended apps** for functionality
4. **Set up product catalog** with proper collections
5. **Configure shipping and payment** settings
6. **Test checkout flow** end-to-end
7. **Launch!** 🚀

## 📝 Notes

- This theme maintains your original design and branding
- All Tailwind classes and colors have been preserved
- The theme is fully responsive and accessible
- JavaScript functionality has been converted to vanilla JS
- All Shopify apps will work seamlessly with this theme

## 🤝 Support

For theme issues or questions:
- Check the Shopify Theme documentation
- Review the Liquid template language docs
- Contact Shopify Support for platform-specific issues
