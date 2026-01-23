# Button Component - Color Customization Examples

The Button component now supports fully dynamic colors! You can either use the predefined variants OR create completely custom colored buttons.

## Predefined Variants (Quick Start)

```vue
<!-- Primary (brand color gradient) -->
<Button variant="primary">Primary Button</Button>

<!-- Secondary (gray gradient) -->
<Button variant="secondary">Secondary Button</Button>

<!-- Outline (transparent with brand border) -->
<Button variant="outline">Outline Button</Button>

<!-- Ghost (minimal transparent) -->
<Button variant="ghost">Ghost Button</Button>

<!-- Danger (red gradient) -->
<Button variant="danger">Delete Account</Button>
```

## Custom Solid Colors

```vue
<!-- White button with blue background -->
<Button
  text-color="white"
  bg-color="#3b82f6"
  bg-hover-color="#2563eb"
  shadow-color="rgba(59, 130, 246, 0.5)"
  shadow-hover-color="rgba(37, 99, 235, 0.6)"
>
  Custom Blue Button
</Button>

<!-- Black text on white background -->
<Button
  text-color="#000000"
  bg-color="#ffffff"
  bg-hover-color="#f3f4f6"
  shadow-color="rgba(0, 0, 0, 0.1)"
>
  White Button
</Button>

<!-- Emerald button -->
<Button
  text-color="white"
  bg-color="#10b981"
  bg-hover-color="#059669"
  shadow-color="rgba(16, 185, 129, 0.5)"
>
  Emerald Button
</Button>
```

## Custom Gradients

```vue
<!-- Pink to purple gradient -->
<Button
  text-color="white"
  :use-gradient="true"
  gradient-from="#ec4899"
  gradient-to="#8b5cf6"
  gradient-hover-from="#db2777"
  gradient-hover-to="#7c3aed"
  shadow-color="rgba(236, 72, 153, 0.5)"
>
  Pink to Purple
</Button>

<!-- Orange to red gradient -->
<Button
  text-color="white"
  :use-gradient="true"
  gradient-from="#f97316"
  gradient-to="#ef4444"
  gradient-hover-from="#ea580c"
  gradient-hover-to="#dc2626"
>
  Sunset Gradient
</Button>

<!-- Cyan to blue gradient -->
<Button
  text-color="white"
  :use-gradient="true"
  gradient-from="#06b6d4"
  gradient-to="#3b82f6"
  gradient-hover-from="#0891b2"
  gradient-hover-to="#2563eb"
>
  Ocean Gradient
</Button>
```

## Custom Outline Buttons

```vue
<!-- Green outline -->
<Button
  text-color="#10b981"
  bg-color="transparent"
  bg-hover-color="#10b981"
  border-color="#10b981"
  border-hover-color="#059669"
>
  Green Outline
</Button>

<!-- Purple outline that fills on hover -->
<Button
  text-color="#8b5cf6"
  bg-color="transparent"
  bg-hover-color="#8b5cf6"
  border-color="#8b5cf6"
>
  Purple Outline
</Button>

<!-- Yellow outline with custom hover -->
<Button
  text-color="#f59e0b"
  bg-color="transparent"
  bg-hover-color="#fef3c7"
  border-color="#f59e0b"
  border-hover-color="#d97706"
>
  Yellow Outline
</Button>
```

## Using Tailwind Colors (via CSS variables)

If you're using Tailwind, you can reference your theme colors:

```vue
<!-- Using Tailwind color variables -->
<Button
  text-color="rgb(var(--color-white))"
  bg-color="rgb(var(--color-blue-500))"
  bg-hover-color="rgb(var(--color-blue-600))"
>
  Tailwind Blue
</Button>
```

## All Available Color Props

| Prop | Type | Description |
|------|------|-------------|
| `variant` | `"primary" \| "secondary" \| "outline" \| "ghost" \| "danger" \| "custom"` | Predefined style variant |
| `text-color` | `string` | Text color (any CSS color) |
| `bg-color` | `string` | Background color |
| `bg-hover-color` | `string` | Background color on hover |
| `border-color` | `string` | Border color (also sets border width to 2px) |
| `border-hover-color` | `string` | Border color on hover |
| `shadow-color` | `string` | Shadow color (rgba recommended) |
| `shadow-hover-color` | `string` | Shadow color on hover |
| `use-gradient` | `boolean` | Enable gradient background |
| `gradient-from` | `string` | Gradient start color |
| `gradient-to` | `string` | Gradient end color |
| `gradient-hover-from` | `string` | Hover gradient start color |
| `gradient-hover-to` | `string` | Hover gradient end color |

## Pro Tips

1. **Automatic variant override**: If you provide any custom color prop, it automatically overrides the variant
2. **Hover fallbacks**: If you don't provide hover colors, it uses the base colors
3. **Mix and match**: You can combine different color props (e.g., custom bg + custom border)
4. **Use rgba for shadows**: For best results with shadows, use `rgba()` values with transparency
5. **All CSS color formats work**: hex (#fff), rgb(), rgba(), hsl(), color names, etc.

## Dynamic Colors from Data

```vue
<script setup>
const buttonColor = ref('#3b82f6')
const buttonHoverColor = ref('#2563eb')
</script>

<template>
  <Button
    text-color="white"
    :bg-color="buttonColor"
    :bg-hover-color="buttonHoverColor"
  >
    Dynamic Color Button
  </Button>
</template>
```

## Complete Example

```vue
<!-- A fully customized button with all animations intact -->
<Button
  text-color="white"
  :use-gradient="true"
  gradient-from="#f97316"
  gradient-to="#ef4444"
  gradient-hover-from="#ea580c"
  gradient-hover-to="#dc2626"
  shadow-color="rgba(249, 115, 22, 0.5)"
  shadow-hover-color="rgba(234, 88, 12, 0.6)"
  size="lg"
  rounded="lg"
  icon-right="i-lucide-arrow-right"
  right-icon-size="18"
>
  Get Started Today
</Button>
```

All buttons retain the same animations:
- Shimmer effect on hover
- Scale up + translate up on hover
- Scale down on click
- Smooth transitions
- Icon animations
