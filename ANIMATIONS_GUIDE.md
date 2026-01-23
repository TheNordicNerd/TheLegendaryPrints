# Animation System Guide

Your site now has a complete animation system with scroll animations, hover effects, and smooth transitions!

## 🎨 Animation Types

### 1. Scroll Animations (Entrance Animations)

Elements animate in as you scroll down the page. Add `data-animate` attribute:

```vue
<!-- Fade Up (most common) -->
<div data-animate="fade-up">Content</div>

<!-- Fade Down -->
<div data-animate="fade-down">Content</div>

<!-- Fade Left -->
<div data-animate="fade-left">Content</div>

<!-- Fade Right -->
<div data-animate="fade-right">Content</div>

<!-- Zoom In -->
<div data-animate="zoom-in">Content</div>

<!-- Zoom Out -->
<div data-animate="zoom-out">Content</div>

<!-- Rotate In -->
<div data-animate="rotate-in">Content</div>

<!-- Bounce In (fun!) -->
<div data-animate="bounce-in">Content</div>

<!-- Slide with Blur -->
<div data-animate="slide-blur">Content</div>
```

### 2. Stagger Animations

Animate children one after another with delays:

```vue
<div data-animate-stagger>
  <div>Item 1</div> <!-- Appears first -->
  <div>Item 2</div> <!-- 0.1s delay -->
  <div>Item 3</div> <!-- 0.2s delay -->
  <div>Item 4</div> <!-- 0.3s delay -->
</div>
```

**Used in:**
- Feature cards (FeaturesSection)
- Process steps (ProcessSection)
- Stats (TestimonialsSection)
- Trust indicators (CTASection)

### 3. Hover Effects

Add these classes to make elements interactive:

```vue
<!-- Lift on hover (cards) -->
<div class="hover-lift">Card content</div>

<!-- Grow on hover (buttons, icons) -->
<button class="hover-grow">Click me</button>

<!-- Tilt 3D effect -->
<div class="hover-tilt">3D card</div>

<!-- Glow effect -->
<div class="hover-glow">Glowing element</div>
```

**Currently used:**
- `hover-lift` - Feature cards, process steps
- `hover-grow` - CTA buttons
- `hover-float` - Trust indicators

### 4. Continuous Animations

Always animating (use sparingly!):

```vue
<!-- Floating animation -->
<div class="animate-float">Floats up and down</div>

<!-- Subtle pulse -->
<div class="animate-pulse-subtle">Gentle pulse</div>

<!-- Shimmer effect (loading states) -->
<div class="animate-shimmer">Shimmering</div>

<!-- Spinning (loading) -->
<div class="animate-spin">Loading...</div>
```

**Currently used:**
- `animate-shimmer` - Process connector line

## 🎯 Where Animations Are Active

### Homepage Sections:

1. **FeaturesSection**
   - Header: `fade-up`
   - Cards: `stagger` + `hover-lift`

2. **ProcessSection**
   - Header: `fade-up`
   - Steps: `stagger` + `hover-lift`
   - Connector line: `animate-shimmer`
   - CTA button: `zoom-in` + `hover-grow`

3. **TestimonialsSection**
   - Stats: `stagger` + `zoom-in`

4. **CTASection**
   - Header: `zoom-in`
   - Buttons: `fade-up` + `hover-grow`
   - Trust badges: `stagger` + `hover-float`

5. **Button Component**
   - Icons slide on hover (built-in)
   - Arrow icons translate right on hover

## ⚙️ How It Works

1. **Composable**: `useScrollAnimation()`
   - Uses IntersectionObserver API
   - Detects when elements enter viewport
   - Adds `animate-in` class to trigger animations

2. **CSS File**: `animations.css`
   - All animation definitions
   - Accessible and reduces motion support
   - Imported in `tailwind.css`

3. **Usage in Components**:
```vue
<script setup>
  useScrollAnimation(); // Activates scroll animations
</script>

<template>
  <div data-animate="fade-up">
    <!-- Content -->
  </div>
</template>
```

## 🎬 Adding Animations to New Sections

### Step 1: Import the composable
```vue
<script setup lang="ts">
  useScrollAnimation();
</script>
```

### Step 2: Add animation attributes
```vue
<template>
  <!-- Header animation -->
  <div data-animate="fade-up">
    <SectionHeader title="My Section" />
  </div>

  <!-- Staggered content -->
  <div data-animate-stagger>
    <Card />
    <Card />
    <Card />
  </div>
</template>
```

### Step 3: Add hover effects
```vue
<div class="hover-lift">
  <Card />
</div>
```

## 🎨 Animation Best Practices

### ✅ DO:
- Use `fade-up` for headers and main content
- Use `stagger` for lists and grids
- Use `hover-lift` for cards
- Use `hover-grow` for buttons
- Keep animations subtle and fast

### ❌ DON'T:
- Don't overuse `bounce-in` or `rotate-in`
- Don't use continuous animations everywhere
- Don't mix too many animation types in one section
- Don't animate large blocks of text

## 🔧 Customizing Animations

### Speed
Edit in `animations.css`:
```css
[data-animate] {
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  /* Change 0.8s to adjust speed */
}
```

### Delay
Adjust stagger timing:
```css
[data-animate-stagger].animate-in > *:nth-child(1) {
  transition-delay: 0.1s; /* Adjust delays */
}
```

### Distance
Change how far elements travel:
```css
[data-animate="fade-up"] {
  transform: translateY(30px); /* Change 30px */
}
```

## ♿ Accessibility

**Reduced Motion Support**: All animations respect user preferences!

If a user has motion sensitivity, animations are disabled automatically via:
```css
@media (prefers-reduced-motion: reduce) {
  /* All animations become instant */
}
```

This is built into every animation in the system.

## 📱 Performance

- Uses CSS transforms (GPU accelerated)
- IntersectionObserver (better than scroll events)
- Animations only trigger once per element
- Reduced motion support for accessibility
- No JavaScript animation libraries needed

## 🎉 Fun Examples

### Playful Card
```vue
<div data-animate="bounce-in" class="hover-tilt hover-glow">
  <Card />
</div>
```

### Floating CTA
```vue
<div data-animate="zoom-in" class="animate-float hover-grow">
  <Button>Click me!</Button>
</div>
```

### Shimmer Loading
```vue
<div class="animate-shimmer bg-gray-200 h-20 rounded-lg">
  <!-- Loading skeleton -->
</div>
```

---

**Pro Tip**: Mix and match animations, but keep it tasteful. The goal is to delight users, not distract them!
