# Reusable Components Guide

This document lists all reusable components and how to use them for easy maintenance.

## 🎨 Component Library

### 1. SectionHeader
**Location:** `app/components/SectionHeader.vue`

**Purpose:** Standardized section titles with optional descriptions.

**Props:**
- `title` (required): Section title text
- `description` (optional): Description text below title
- `titleSize`: `"default"` | `"lg"` (default: `"default"`)
- `titleColor`: Tailwind class (default: `"text-text-primary"`)
- `descriptionColor`: Tailwind class (default: `"text-text-secondary"`)

**Usage:**
```vue
<SectionHeader
  title="Why Choose Us?"
  description="Professional quality with unbeatable service"
/>

<!-- Custom colors for dark backgrounds -->
<SectionHeader
  title="Ready to Get Started?"
  description="Join thousands of satisfied customers"
  title-size="lg"
  title-color="text-white"
  description-color="text-white/90"
/>
```

**Used in:**
- FeaturesSection
- ProcessSection
- CTASection

---

### 2. IconFeatureCard
**Location:** `app/components/IconFeatureCard.vue`

**Purpose:** Feature/step cards with icon, title, and description.

**Props:**
- `icon` (required): Lucide icon name (e.g., `"i-lucide-check"`)
- `title` (required): Card title
- `description` (required): Card description text
- `stepNumber` (optional): Show numbered badge (for process steps)
- `variant`: `"default"` | `"elevated"` (default: `"default"`)

**Variants:**
- `default`: Flat card with hover effect
- `elevated`: Card with border, background, and hover lift

**Usage:**
```vue
<!-- Feature card with elevation -->
<IconFeatureCard
  icon="i-lucide-badge-check"
  title="Premium Quality"
  description="Professional-grade printing with vibrant colors"
  variant="elevated"
/>

<!-- Step card with number -->
<IconFeatureCard
  :step-number="1"
  icon="i-lucide-upload"
  title="Upload Your Design"
  description="Choose your product and upload your artwork"
/>
```

**Used in:**
- FeaturesSection (4 feature cards with `variant="elevated"`)
- ProcessSection (3 step cards with `stepNumber`)

---

### 3. TrustIndicator
**Location:** `app/components/TrustIndicator.vue`

**Purpose:** Small icon + text badges for trust signals.

**Props:**
- `icon` (required): Lucide icon name
- `text` (required): Badge text
- `iconSize`: Size in pixels (default: `"20"`)
- `textSize`: Tailwind class (default: `"text-sm"`)
- `textColor`: Tailwind class (default: `""`)

**Usage:**
```vue
<TrustIndicator
  icon="i-lucide-shield-check"
  text="100% Guarantee"
/>

<!-- Custom styling -->
<TrustIndicator
  icon="i-lucide-truck"
  text="Free Shipping"
  icon-size="24"
  text-size="text-base"
  text-color="text-white/80"
/>
```

**Used in:**
- CTASection (4 trust badges)

---

### 4. StatCard
**Location:** `app/components/StatCard.vue`

**Purpose:** Display statistics with large number and label.

**Props:**
- `value` (required): Stat value (string or number)
- `label` (required): Label text below value
- `valueSize`: `"default"` | `"lg"` (default: `"lg"`)
- `valueColor`: Tailwind class (default: `"text-accent-700"`)
- `labelColor`: Tailwind class (default: `"text-text-secondary"`)

**Usage:**
```vue
<StatCard value="2,847+" label="Happy Customers" />

<!-- Custom colors -->
<StatCard
  value="4.9/5"
  label="Average Rating"
  value-color="text-green-600"
  label-color="text-gray-600"
/>
```

**Used in:**
- TestimonialsSection (4 stats)

---

## 📝 Quick Update Guide

### Update Feature Card Text/Icon
**File:** `app/components/FeaturesSection.vue`

Just change the props:
```vue
<IconFeatureCard
  icon="i-lucide-NEW-ICON"
  title="NEW TITLE"
  description="NEW DESCRIPTION"
  variant="elevated"
/>
```

### Update Process Steps
**File:** `app/components/ProcessSection.vue`

Change step details:
```vue
<IconFeatureCard
  :step-number="1"
  icon="i-lucide-NEW-ICON"
  title="NEW STEP"
  description="NEW DESCRIPTION"
/>
```

### Update Trust Indicators
**File:** `app/components/CTASection.vue`

Change badge text:
```vue
<TrustIndicator icon="i-lucide-zap" text="NEW GUARANTEE TEXT" />
```

### Update Stats
**File:** `app/components/TestimonialsSection.vue`

Update values:
```vue
<StatCard value="NEW NUMBER" label="NEW LABEL" />
```

### Update Section Headers
Any section file - just change props:
```vue
<SectionHeader
  title="NEW TITLE"
  description="NEW DESCRIPTION"
/>
```

---

## 🎯 Benefits

1. **Single Source of Truth**: Update styling in one component file
2. **Consistency**: All sections use the same design patterns
3. **Easy Maintenance**: Change content by editing props, not markup
4. **Type Safety**: Props are typed for better IDE support
5. **Accessibility**: ARIA labels and reduced motion support built-in

---

## 🔧 Component Styling

All components support:
- Responsive design (mobile-first)
- Dark mode compatibility (via design tokens)
- Reduced motion preferences
- Hover states with smooth transitions
- Scroll animations (see ANIMATIONS_GUIDE.md)

To modify global card styling, edit:
- **IconFeatureCard.vue** - Feature/step cards
- **Section.vue** - Section layouts and backgrounds
- **design-tokens.ts** - Colors and spacing
- **animations.css** - Animation effects

## 🎬 Animations

The site includes a complete animation system! See [ANIMATIONS_GUIDE.md](ANIMATIONS_GUIDE.md) for:
- Scroll-triggered entrance animations
- Hover effects (lift, grow, tilt, glow)
- Stagger animations for lists
- Continuous animations (float, pulse, shimmer)
- Accessibility support (reduced motion)

**Quick Example:**
```vue
<script setup>
  useScrollAnimation();
</script>

<template>
  <div data-animate="fade-up">
    <SectionHeader title="Animated!" />
  </div>

  <div data-animate-stagger>
    <Card class="hover-lift" />
    <Card class="hover-lift" />
  </div>
</template>
```
