# Brand Guidelines Implementation Guide
## The Legendary Prints

This document outlines how the brand guidelines have been implemented in the codebase.

---

## Table of Contents
1. [Brand Positioning](#brand-positioning)
2. [Typography System](#typography-system)
3. [Color Strategy](#color-strategy)
4. [Component Guidelines](#component-guidelines)
5. [Photography Guidelines](#photography-guidelines)
6. [Usage Examples](#usage-examples)

---

## Brand Positioning

### The Client
Small businesses, independent brands, and creators who need high-quality printed stickers on tight timelines. They value:
- **Speed** over lowest price
- **Reliability** and clear communication
- **Professional quality** with personal service

### Strategic Implications
1. **Justifies higher pricing** - Faster, safer, and more responsive
2. **Filters bad leads** - Price shoppers self-select out, time-sensitive operators self-select in
3. **Aligns with brand slogan** - "Professional prints. Personal service."

### Brand Message
We prioritize clients who value speed and reliability over lowest-cost production.

---

## Typography System

### Implementation Files
- `/app/assets/css/fonts.css` - Font definitions and hierarchy
- `/tailwind.config.ts` - Font family utilities

### Primary Typeface - Montserrat
**Purpose:** Headlines & Brand Emphasis

**Source:** Google Fonts

**Weights:**
- Bold (700) - Default for headings
- ExtraBold (800) - H1, H2, major emphasis

**Use Cases:**
- Headlines
- Section titles
- Marketing callouts
- Website hero text
- Short promotional phrases

**CSS Usage:**
```css
.font-heading    /* Montserrat */
font-weight: 700 /* Bold */
font-weight: 800 /* ExtraBold */
```

**Tailwind Classes:**
```html
<h1 class="font-heading font-extrabold">Major Headline</h1>
<h3 class="font-heading font-bold">Section Title</h3>
```

### Secondary Typeface - Inter
**Purpose:** Body & Utility Text

**Source:** Google Fonts

**Weights:**
- Regular (400) - Body copy
- Medium (500) - Emphasis in body text
- SemiBold (600) - Important UI elements

**Use Cases:**
- Body copy
- Product descriptions
- Invoices and receipts
- Emails and customer communication
- Website paragraphs and forms

**CSS Usage:**
```css
.font-body         /* Inter */
font-weight: 400   /* Regular */
font-weight: 500   /* Medium */
font-weight: 600   /* SemiBold */
```

**Tailwind Classes:**
```html
<p class="font-body font-regular">Body text</p>
<strong class="font-medium">Emphasis text</strong>
<label class="font-semibold">Form Label</label>
```

### Accent Typeface - Quirthy
**Purpose:** Limited Expressive Use

**Source:** Custom font (email)

**Weight:** Normal (400)

**Use Cases (USE SPARINGLY):**
- Small emphasis text
- Promotional badges
- Short callouts (e.g., "Fast Turnaround")
- Feature highlights

**Important:** This font should be used for **10% or less** of text content.

**CSS Usage:**
```css
.font-accent       /* Quirthy */
.badge-accent      /* For badges */
.callout-accent    /* For callouts */
```

**Tailwind Classes:**
```html
<span class="font-accent">Fast Turnaround!</span>
<div class="badge-accent">New</div>
```

**⚠️ Setup Required:**
The Quirthy font file needs to be added to the project:
1. Add font files to `/public/fonts/quirthy/`
2. Update `/app/assets/css/fonts.css` with @font-face declaration

### Typography Usage Rules
- ✅ Headlines **MUST** use Montserrat
- ✅ Body text **MUST** use Inter
- ✅ Accent type (Quirthy) is **OPTIONAL** and **LIMITED**
- ❌ Avoid script, handwritten, or novelty fonts (except Quirthy)
- ✅ Maintain strong contrast between text and background
- ❌ Do not outline body text or apply heavy effects

---

## Color Strategy

### Implementation Files
- `/app/assets/css/palettes.css` - Color variable definitions
- `/tailwind.config.ts` - Color configuration

### Color Philosophy
**"Brand stays neutral. Artwork brings the color."**

### 60-30-10 Rule
- **60%** - Neutral Scale (Primary UI background)
- **30%** - Brand Colors (Slate Blue + Muted Red)
- **10%** - CMYK Vibrant Accents (Highlights, CTAs, badges)

### Neutral Scale (60% Usage)
**Purpose:** Backgrounds, text, primary UI

| Shade | Color Name | Hex | Use Case |
|-------|-----------|-----|----------|
| 50 | Pure White | `#FFFFFF` | Primary background |
| 100 | Paper Gray | `#F2F3F5` | Subtle backgrounds |
| 200-400 | Light Grays | - | Borders, dividers |
| 500-700 | Mid Grays | - | Secondary text |
| 800-900 | Carbon Black | `#0B0B0B` | Primary text, dark backgrounds |

**Tailwind Classes:**
```html
<div class="bg-neutral-50 text-neutral-900">White bg, black text</div>
<div class="bg-neutral-800 text-neutral-50">Dark bg, white text</div>
```

### Brand Colors (30% Usage)

#### Primary - Slate Blue
**Purpose:** Buttons, links, icons, brand accents

**Main Color:** `#2C4FA3` (primary-500)

**Tailwind Classes:**
```html
<Button variant="primary">CTA Button</Button>
<a class="text-primary-500 hover:text-primary-600">Link</a>
```

#### Secondary - Muted Red
**Purpose:** Action-only (Order Now, Limited, Sale)

**Main Color:** `#A4161A` (secondary-500)

**Tailwind Classes:**
```html
<Button variant="secondary">Order Now</Button>
<span class="text-secondary-500">Sale!</span>
```

### CMYK Vibrant Accents (10% Usage)
**Purpose:** Sparingly for highlights, CTAs, promotional badges

**⚠️ Important:** Use these colors intentionally as accents, NOT everywhere!

#### Cyan - Vibrant Blue
**Main Color:** `#00B8D4` (cmyk-cyan-500)

**Use Cases:**
- Creative/design highlights
- "Design" or "Custom" badges
- Innovation callouts

**Tailwind Classes:**
```html
<div class="bg-cmyk-cyan-500 text-white">Custom Design</div>
<span class="text-cmyk-cyan-600">Design Service</span>
```

#### Magenta - Vibrant Pink
**Main Color:** `#E91E63` (cmyk-magenta-500)

**Use Cases:**
- Urgent/limited offers
- "Fast Turnaround" badges
- Energy and speed indicators

**Tailwind Classes:**
```html
<div class="bg-cmyk-magenta-500 text-white">48 Hour Rush!</div>
<span class="text-cmyk-magenta-600">Limited Time</span>
```

#### Yellow - Vibrant Yellow
**Main Color:** `#FFEB3B` (cmyk-yellow-500)

**Use Cases:**
- Attention-grabbing callouts
- "New" or "Featured" badges
- Highlight important info

**Tailwind Classes:**
```html
<div class="bg-cmyk-yellow-500 text-neutral-900">New Product!</div>
<span class="text-cmyk-yellow-700">Featured</span>
```

### Semantic Colors
**Purpose:** Status indicators, validation, feedback

| Type | Main Color | Use Case |
|------|-----------|----------|
| Success | `#22C55E` | Confirmations, success states |
| Error | `#EF4444` | Errors, validation failures |
| Warning | Yellow tones | Caution messages |
| Info | Slate Blue | Informational messages |

### Surface Colors
**Purpose:** Layering and depth

```css
--color-surface-base: #FFFFFF      /* Base layer */
--color-surface-raised: #FFFFFF    /* Cards, modals */
--color-surface-overlay: #FFFFFF   /* Overlays */
--color-surface-sunken: #F2F3F5    /* Recessed areas */
```

### Text Colors
**Purpose:** Hierarchy and readability

```css
--color-text-primary: #0B0B0B      /* Main text */
--color-text-secondary: #374151    /* Secondary info */
--color-text-tertiary: #6B7280     /* Tertiary info */
--color-text-disabled: #9CA3AF     /* Disabled state */
--color-text-inverse: #FFFFFF      /* On dark backgrounds */
--color-text-link: #2C4FA3         /* Links */
--color-text-link-hover: #234088   /* Link hover */
```

### Color Usage Best Practices

#### ✅ DO:
- Use vibrant CMYK colors as **accents and highlights**
- Anchor designs with **neutral colors** (black, white, dark gray)
- Maintain **strong contrast** for accessibility
- Use CMYK colors for **promotional badges** and **CTAs**
- Keep background neutral to let product photos shine

#### ❌ DON'T:
- Don't use vibrant colors everywhere
- Don't use CMYK colors for body text
- Don't mix too many vibrant colors in one section
- Don't use dark backgrounds without proper contrast

#### Example Patterns:

**Good - Balanced Hero Section:**
```html
<Section class="bg-neutral-800 text-white">
  <h1 class="font-heading font-extrabold">Custom Stickers</h1>
  <p class="font-body">Professional prints. Personal service.</p>
  <Button variant="secondary">Get Started</Button>
  <span class="badge-accent bg-cmyk-magenta-500">Fast Turnaround!</span>
</Section>
```

**Good - Product Card with Accent:**
```html
<div class="bg-surface-raised border border-border-subtle rounded-lg p-6">
  <img src="product.jpg" alt="Product">
  <h3 class="font-heading font-bold text-text-primary">Custom Stickers</h3>
  <p class="font-body text-text-secondary">High-quality vinyl</p>
  <div class="flex gap-2">
    <Button variant="primary">Order Now</Button>
    <span class="bg-cmyk-cyan-100 text-cmyk-cyan-700 px-3 py-1 rounded-full text-sm font-semibold">
      Free Proof
    </span>
  </div>
</div>
```

---

## Component Guidelines

### Button Component
**File:** `/app/components/Button.vue`

**Typography:**
- Uses Montserrat (heading font)
- Bold weight (700) by default

**Variants:**
```html
<!-- Primary - Slate Blue -->
<Button variant="primary">Main CTA</Button>

<!-- Secondary - Muted Red (for action items) -->
<Button variant="secondary">Order Now</Button>

<!-- Outline - Transparent with border -->
<Button variant="outline">Learn More</Button>

<!-- Ghost - Minimal style -->
<Button variant="ghost">Secondary Action</Button>

<!-- Custom - With CMYK colors -->
<Button
  variant="custom"
  bg-color="var(--color-cmyk-magenta-500)"
  text-color="white"
>
  Fast Service!
</Button>
```

**Size Options:**
- `sm` - Small buttons
- `md` - Default size
- `lg` - Large CTAs
- `xl` - Hero buttons

**Features:**
- Animated arrow with `show-arrow` prop
- Icon support with `icon-left` and `icon-right`
- Full width with `full-width`
- Disabled states with proper accessibility

### Card Components
**Best Practices:**
- White/neutral backgrounds (`bg-surface-raised`)
- Subtle borders (`border-border-subtle`)
- CMYK accent badges sparingly
- Clear typography hierarchy

### Form Components
**Best Practices:**
- Inter font for all form elements
- SemiBold weight for labels
- Clear error states with error color
- High contrast for accessibility

---

## Photography Guidelines

### Subject Focus

#### Primary Subjects:
- Stickers being printed, cut, stacked, or packaged
- Close-ups of finished prints
- Materials (vinyl, labels, sheets)
- Hands working (applying, peeling, packing)
- Branded products in real use (jars, packaging, boxes)

#### Secondary Subjects:
- Workspaces and equipment
- Orders in progress
- Clean shots of bulk quantities

### Composition & Framing
- ✅ Favor **close-up and medium shots**
- ✅ Crop tightly to emphasize **texture and color**
- ✅ Let prints **fill the frame**
- ✅ Use angles that suggest **motion or process**
- ❌ Avoid wide, empty room shots
- ❌ Avoid overly staged desk setups
- ❌ Avoid excessive props

### Lighting
- ✅ Bright, even lighting
- ✅ Natural light when possible
- ✅ Soft shadows preferred
- ❌ Avoid harsh, dramatic lighting
- ❌ Avoid dark moody setups

**Goal:** Show true color accuracy and material quality

### Color Treatment
- ✅ Let CMYK colors pop naturally
- ✅ Neutral backgrounds (white, black, gray, work surfaces)
- ❌ Avoid heavy filters or color grading
- ✅ Keep colors accurate to real prints

**Photography should support the idea that "what you see is what you get."**

### People in Photos (Optional)
If people appear:
- Focus on **hands or partial views**
- Natural actions, **not posed smiles**
- Clean, neutral clothing preferred

**People should feel working, not modeling.**

### What to Avoid
- ❌ Generic stock photos
- ❌ Overly corporate office imagery
- ❌ Excessive blur or depth effects
- ❌ Vintage or retro filters
- ❌ Dark, gritty, low-contrast photos

### Image Components
**File:** Components using images

**Implementation:**
```html
<!-- Using NuxtImg for optimization -->
<NuxtImg
  src="/images/stickers/custom-print.jpg"
  alt="Custom printed vinyl stickers being cut"
  loading="lazy"
  class="rounded-lg"
/>

<!-- Hero section with video background -->
<Section
  video-src="/hero.mp4"
  video-overlay-opacity="0.5"
>
  <!-- Content -->
</Section>
```

---

## Usage Examples

### Complete Page Example

```vue
<template>
  <div>
    <!-- Hero Section - Dark background, white text, vibrant accent -->
    <Section class="bg-neutral-800 text-white">
      <div class="max-w-5xl mx-auto text-center py-24">
        <h1 class="font-heading font-extrabold text-5xl mb-4">
          Custom Printed Vinyl<br>Stickers and Labels
        </h1>
        <p class="font-body font-medium text-xl text-neutral-50 mb-8">
          Professional prints. Personal service. Most orders ship in 24-48 hours.
        </p>
        <div class="flex gap-4 justify-center">
          <Button variant="secondary" size="lg">Get Started</Button>
          <Button variant="outline" size="lg">Learn More</Button>
        </div>
        <div class="mt-8">
          <span class="badge-accent bg-cmyk-magenta-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
            Fast Turnaround!
          </span>
        </div>
      </div>
    </Section>

    <!-- Features Section - Light background -->
    <Section class="bg-neutral-50">
      <div class="max-w-7xl mx-auto py-24">
        <SectionHeader
          title="Why Choose Us"
          subtitle="Speed, quality, and service you can trust"
        />
        <div class="grid md:grid-cols-3 gap-8 mt-12">
          <!-- Feature Card 1 -->
          <div class="bg-surface-raised border border-border-subtle rounded-lg p-8">
            <div class="bg-cmyk-cyan-100 text-cmyk-cyan-700 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Icon name="i-lucide-zap" size="32" />
            </div>
            <h3 class="font-heading font-bold text-xl text-text-primary mb-2">
              Fast Turnaround
            </h3>
            <p class="font-body text-text-secondary">
              Most orders ship within 24-48 hours. We prioritize your timeline.
            </p>
          </div>

          <!-- Feature Card 2 -->
          <div class="bg-surface-raised border border-border-subtle rounded-lg p-8">
            <div class="bg-cmyk-yellow-100 text-cmyk-yellow-700 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Icon name="i-lucide-shield-check" size="32" />
            </div>
            <h3 class="font-heading font-bold text-xl text-text-primary mb-2">
              Quality Guaranteed
            </h3>
            <p class="font-body text-text-secondary">
              Premium vinyl materials. Professional-grade printing. No cheap prints.
            </p>
          </div>

          <!-- Feature Card 3 -->
          <div class="bg-surface-raised border border-border-subtle rounded-lg p-8">
            <div class="bg-primary-100 text-primary-700 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Icon name="i-lucide-users" size="32" />
            </div>
            <h3 class="font-heading font-bold text-xl text-text-primary mb-2">
              Personal Service
            </h3>
            <p class="font-body text-text-secondary">
              Clear communication. Real people. We're with you every step.
            </p>
          </div>
        </div>
      </div>
    </Section>

    <!-- Product Grid - Neutral backgrounds let products shine -->
    <Section class="bg-white">
      <div class="max-w-7xl mx-auto py-24">
        <SectionHeader
          title="Our Products"
          subtitle="High-quality stickers for every need"
        />
        <div class="grid md:grid-cols-3 gap-8 mt-12">
          <ShopifyProductCard
            v-for="product in products"
            :key="product.id"
            :product="product"
          />
        </div>
      </div>
    </Section>

    <!-- CTA Section - Vibrant accent for action -->
    <Section class="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
      <div class="max-w-4xl mx-auto text-center py-24">
        <h2 class="font-heading font-extrabold text-4xl mb-4">
          Ready to Get Started?
        </h2>
        <p class="font-body font-medium text-xl text-neutral-100 mb-8">
          Fast turnaround. Professional quality. Personal service.
        </p>
        <Button variant="custom" bg-color="var(--color-cmyk-magenta-500)" text-color="white" size="lg">
          Order Custom Stickers
        </Button>
      </div>
    </Section>
  </div>
</template>
```

### Promotional Badge Examples

```vue
<!-- Fast Turnaround Badge -->
<span class="font-accent bg-cmyk-magenta-500 text-white px-4 py-2 rounded-full text-sm shadow-lg">
  48 Hour Rush!
</span>

<!-- New Product Badge -->
<span class="font-accent bg-cmyk-yellow-500 text-neutral-900 px-4 py-2 rounded-lg text-sm font-bold">
  New!
</span>

<!-- Custom Design Badge -->
<span class="font-accent bg-cmyk-cyan-500 text-white px-4 py-2 rounded-full text-sm">
  Custom Design Available
</span>

<!-- Limited Offer Badge -->
<span class="font-semibold bg-secondary-500 text-white px-4 py-2 rounded-lg text-sm uppercase tracking-wide">
  Limited Time
</span>
```

---

## Implementation Checklist

### ✅ Completed
- [x] Typography system (Montserrat + Inter)
- [x] Font hierarchy and weights
- [x] Color palette with CMYK accents
- [x] Tailwind configuration updates
- [x] Button component typography
- [x] Hero section brand messaging

### ⚠️ Pending
- [ ] Add Quirthy font files and @font-face declarations
- [ ] Review all components for typography consistency
- [ ] Audit color usage across components (ensure 60-30-10 balance)
- [ ] Update promotional badges to use accent font
- [ ] Review and update photography alt text
- [ ] Ensure all CTAs use appropriate button variants
- [ ] Update product descriptions to reflect brand positioning
- [ ] Review form components for Inter usage
- [ ] Add CMYK accent badges where appropriate
- [ ] Audit messaging across all pages

### 📋 To Do (Next Steps)
1. **Add Quirthy Font:**
   - Obtain font files (`.woff`, `.woff2`)
   - Place in `/public/fonts/quirthy/`
   - Add @font-face declaration to `/app/assets/css/fonts.css`

2. **Component Audit:**
   - Review all `.vue` files for typography consistency
   - Ensure proper use of `font-heading`, `font-body`, and `font-accent`
   - Check that CMYK colors are used sparingly (10% rule)

3. **Messaging Update:**
   - Update all copy to reflect "Professional prints. Personal service."
   - Emphasize speed and reliability over price
   - Highlight "Most orders ship in 24-48 hours"

4. **Photography:**
   - Audit existing images for brand alignment
   - Replace stock photos with authentic print shop imagery
   - Ensure neutral backgrounds (white/gray)
   - Show close-ups of actual printing process

---

## File Reference

### Key Configuration Files
- `/app/assets/css/fonts.css` - Typography definitions
- `/app/assets/css/palettes.css` - Color variables
- `/app/assets/css/animations.css` - Animation utilities
- `/app/assets/css/tailwind.css` - Tailwind base and utilities
- `/tailwind.config.ts` - Tailwind configuration
- `/nuxt.config.ts` - Nuxt configuration

### Component Files
- `/app/components/Button.vue` - Button component
- `/app/components/HeroSection.vue` - Hero section
- `/app/components/Section.vue` - Section wrapper
- `/app/components/SectionHeader.vue` - Section headers
- `/app/components/ShopifyProductCard.vue` - Product cards

### Asset Directories
- `/public/` - Static assets (images, videos, fonts)
- `/public/images/` - Image assets
- `/public/fonts/` - Font files (to be added)

---

## Support & Questions

For questions about brand implementation, refer to:
1. This implementation guide
2. Original brand guidelines document
3. Component documentation in respective `.vue` files

**Last Updated:** February 1, 2026
