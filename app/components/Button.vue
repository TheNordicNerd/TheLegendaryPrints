<template>
  <component
    :is="componentType"
    :to="isLink ? to : undefined"
    :href="isExternalLink ? to : undefined"
    :target="isExternalLink && openInNewTab ? '_blank' : undefined"
    :rel="isExternalLink && openInNewTab ? 'noopener noreferrer' : undefined"
    :type="!isLink && !isExternalLink ? type : undefined"
    :disabled="disabled"
    :class="buttonClasses"
    :style="customStyles"
    :aria-disabled="disabled ? 'true' : undefined"
    :aria-label="isIconOnly ? label || 'Icon button' : undefined"
    @click="handleClick"
  >
    <!-- Icon Only Mode -->
    <template v-if="isIconOnly">
      <Icon :name="icon!" :size="iconSize" />
    </template>

    <!-- Normal Button Mode -->
    <template v-else>
      <!-- Icon Left -->
      <span v-if="iconLeft" class="button-icon-left duration-300 group-hover:-translate-x-2">
        <Icon :name="iconLeft" :size="leftIconSize" />
      </span>

      <!-- Default Slot (Button Text) -->
      <span class="button-text">
        <slot>{{ label }}</slot>
      </span>

      <!-- Icon Right (with arrow animation) -->
      <span
        v-if="iconRight || showArrow"
        class="button-icon-right duration-300 group-hover:translate-x-2"
      >
        <Icon :name="iconRight" :size="rightIconSize" />
      </span>
    </template>
  </component>
</template>

<script setup lang="ts">
  /**
   * Button Component
   *
   * A versatile button component with multiple variants, sizes, and animations
   * matching the hero section's CTA button style.
   *
   * Supports both predefined variants and fully custom colors.
   *
   * @component
   * @example
   * // Using variants
   * <Button variant="primary" size="lg" show-arrow>Get Started</Button>
   * <Button variant="outline" icon-left="i-lucide-star">Learn More</Button>
   * <Button variant="ghost" :disabled="true">Disabled</Button>
   *
   * @example
   * // Custom solid colors
   * <Button
   *   text-color="white"
   *   bg-color="#3b82f6"
   *   bg-hover-color="#2563eb"
   *   shadow-color="rgba(59, 130, 246, 0.5)"
   * >
   *   Custom Blue
   * </Button>
   *
   * @example
   * // Custom gradient
   * <Button
   *   text-color="white"
   *   :use-gradient="true"
   *   gradient-from="#ec4899"
   *   gradient-to="#8b5cf6"
   *   gradient-hover-from="#db2777"
   *   gradient-hover-to="#7c3aed"
   * >
   *   Custom Gradient
   * </Button>
   *
   * @example
   * // Custom outline
   * <Button
   *   text-color="#10b981"
   *   bg-color="transparent"
   *   border-color="#10b981"
   *   border-hover-color="#059669"
   *   bg-hover-color="#10b981"
   * >
   *   Custom Outline
   * </Button>
   */

  defineOptions({
    inheritAttrs: false,
  });

  interface Props {
    /** Button label text */
    label?: string;
    /** Visual style variant */
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "custom";
    /** Button size */
    size?: "sm" | "md" | "lg" | "xl";
    /** Link destination (makes it a NuxtLink or anchor) */
    to?: string;
    /** Button type for form submission */
    type?: "button" | "submit" | "reset";
    /** Disabled state */
    disabled?: boolean;
    /** Show animated arrow icon on the right */
    showArrow?: boolean;
    /** Icon for icon-only button */
    icon?: string;
    /** Icon size for icon-only button */
    iconSize?: string;
    /** Custom icon on the left (emoji or text) */
    iconLeft?: string;
    leftIconSize?: string;
    /** Custom icon on the right (emoji or text) */
    iconRight?: string;
    rightIconSize?: string;
    /** Full width button */
    fullWidth?: boolean;
    /** Rounded style */
    rounded?: "sm" | "md" | "lg" | "xl" | "full";
    /** Open external links in new tab */
    openInNewTab?: boolean;
    /** Custom text color (e.g., "white", "#ffffff", "rgb(255,255,255)") */
    textColor?: string;
    /** Custom background color */
    bgColor?: string;
    /** Custom hover background color */
    bgHoverColor?: string;
    /** Custom border color */
    borderColor?: string;
    /** Custom hover border color */
    borderHoverColor?: string;
    /** Custom shadow color */
    shadowColor?: string;
    /** Custom hover shadow color */
    shadowHoverColor?: string;
    /** Enable gradient background */
    useGradient?: boolean;
    /** Gradient start color (from) */
    gradientFrom?: string;
    /** Gradient end color (to) */
    gradientTo?: string;
    /** Hover gradient start color */
    gradientHoverFrom?: string;
    /** Hover gradient end color */
    gradientHoverTo?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    label: "",
    variant: "primary",
    size: "md",
    to: "",
    type: "button",
    disabled: false,
    showArrow: false,
    icon: "",
    iconSize: "20",
    iconLeft: "",
    leftIconSize: "16",
    iconRight: "",
    rightIconSize: "16",
    fullWidth: false,
    rounded: "xl",
    openInNewTab: true,
    textColor: "",
    bgColor: "",
    bgHoverColor: "",
    borderColor: "",
    borderHoverColor: "",
    shadowColor: "",
    shadowHoverColor: "",
    useGradient: false,
    gradientFrom: "",
    gradientTo: "",
    gradientHoverFrom: "",
    gradientHoverTo: "",
  });

  const emit = defineEmits<{
    click: [event: MouseEvent];
  }>();

  // Check if this is an icon-only button
  const isIconOnly = computed(() => {
    return !!props.icon;
  });

  // Determine component type (button, NuxtLink, or anchor)
  const componentType = computed(() => {
    if (!props.to) return "button";
    if (props.to.startsWith("http") || props.to.startsWith("//")) return "a";
    return resolveComponent("NuxtLink");
  });

  const isLink = computed(
    () => props.to && !props.to.startsWith("http") && !props.to.startsWith("//"),
  );
  const isExternalLink = computed(
    () => props.to && (props.to.startsWith("http") || props.to.startsWith("//")),
  );

  // Check if using custom colors
  const isCustom = computed(() => {
    return (
      props.variant === "custom" ||
      props.textColor ||
      props.bgColor ||
      props.borderColor ||
      props.useGradient
    );
  });

  // Variant classes (only used when not custom)
  const variantClasses = computed(() => {
    if (isCustom.value) return "";

    const variants = {
      primary:
        "text-text-inverse bg-primary-500 hover:bg-primary-600 shadow-lg shadow-primary-500/30 hover:shadow-primary-600/40",
      secondary:
        "text-text-inverse bg-neutral-700 hover:bg-neutral-800 shadow-lg shadow-neutral-500/20 hover:shadow-neutral-600/30",
      outline:
        "text-primary-500 border-2 border-primary-500 bg-transparent hover:bg-primary-500 hover:text-text-inverse shadow-lg hover:shadow-xl",
      ghost: "text-text-primary bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800",
      danger:
        "text-text-inverse bg-error-600 hover:bg-error-700 shadow-lg shadow-error-500/30 hover:shadow-error-600/40",
      custom: "",
    };
    return variants[props.variant];
  });

  // Custom inline styles
  const customStyles = computed(() => {
    if (!isCustom.value) return {};

    const styles: Record<string, string> = {};

    // Text color
    if (props.textColor) {
      styles.color = props.textColor;
    }

    // Background (gradient or solid)
    if (props.useGradient && props.gradientFrom && props.gradientTo) {
      styles.backgroundImage = `linear-gradient(to right, ${props.gradientFrom}, ${props.gradientTo})`;
      // CSS variables for hover states
      styles["--gradient-hover-from"] = props.gradientHoverFrom || props.gradientFrom;
      styles["--gradient-hover-to"] = props.gradientHoverTo || props.gradientTo;
    } else if (props.bgColor) {
      styles.backgroundColor = props.bgColor;
      styles["--bg-hover-color"] = props.bgHoverColor || props.bgColor;
    }

    // Border
    if (props.borderColor) {
      styles.borderColor = props.borderColor;
      styles.borderWidth = "2px";
      styles.borderStyle = "solid";
      styles["--border-hover-color"] = props.borderHoverColor || props.borderColor;
    }

    // Shadow
    if (props.shadowColor) {
      styles.boxShadow = `0 20px 25px -5px ${props.shadowColor}, 0 8px 10px -6px ${props.shadowColor}`;
      styles["--shadow-hover-color"] = props.shadowHoverColor || props.shadowColor;
    }

    return styles;
  });

  // Size classes
  const sizeClasses = computed(() => {
    // Icon-only button sizes (square)
    if (isIconOnly.value) {
      const iconSizes = {
        sm: "p-2",
        md: "p-2.5",
        lg: "p-3",
        xl: "p-4",
      };
      return iconSizes[props.size];
    }

    // Regular button sizes
    const sizes = {
      sm: "px-4 py-2 text-sm gap-1.5",
      md: "px-6 py-3 text-base gap-2",
      lg: "px-8 py-4 sm:px-10 sm:py-5 text-base sm:text-lg gap-2",
      xl: "px-10 py-5 sm:px-12 sm:py-6 text-lg sm:text-xl gap-2.5",
    };
    return sizes[props.size];
  });

  // Rounded classes
  const roundedClasses = computed(() => {
    return `rounded-${props.rounded}`;
  });

  // Get custom classes passed from parent
  const attrs = useAttrs();

  // Combined button classes
  const buttonClasses = computed(() => {
    const baseClasses = isCustom.value
      ? // Minimal base classes for custom variant
        "button group relative inline-flex items-center justify-center transition-all duration-300 transform focus:outline-none active:scale-95"
      : // Full base classes for preset variants
        "button group relative inline-flex items-center justify-center font-bold transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-primary-400/50 focus:ring-offset-2 focus:ring-offset-transparent active:scale-95";

    return [
      baseClasses,
      variantClasses.value,
      sizeClasses.value,
      roundedClasses.value,
      {
        "w-full": props.fullWidth,
        "hover:scale-105 hover:-translate-y-1": !props.disabled && !isCustom.value,
        "opacity-50 cursor-not-allowed pointer-events-none": props.disabled,
      },
      // Add custom classes from parent component
      attrs.class as string | undefined,
    ];
  });

  // Handle click event
  const handleClick = (event: MouseEvent) => {
    if (!props.disabled) {
      emit("click", event);
    }
  };
</script>

<style scoped>
  .button {
    position: relative;
    overflow: hidden;
    isolation: isolate;
  }

  /* Shimmer effect (same as hero CTA button) */
  .button::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      transparent 0%,
      rgba(255, 255, 255, 0.1) 50%,
      transparent 100%
    );
    transform: translateX(-100%);
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .button:hover::before {
    transform: translateX(100%);
  }

  /* Disabled state - remove all hover effects */
  .button:disabled::before,
  .button[aria-disabled="true"]::before,
  .button:disabled:hover::before,
  .button[aria-disabled="true"]:hover::before {
    display: none;
  }

  .button:disabled,
  .button[aria-disabled="true"] {
    pointer-events: none;
  }

  .button:disabled:hover,
  .button[aria-disabled="true"]:hover {
    transform: none !important;
    box-shadow: none !important;
  }

  .button:disabled .button-icon-left,
  .button:disabled .button-icon-right,
  .button[aria-disabled="true"] .button-icon-left,
  .button[aria-disabled="true"] .button-icon-right {
    transform: none !important;
  }

  .button:disabled:active,
  .button[aria-disabled="true"]:active {
    transform: none !important;
  }

  /* Icon animations */
  .button-icon-left,
  .button-icon-right {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .button-text {
    position: relative;
    z-index: 1;
  }

  /* Smooth transitions for all states */
  .button {
    transition:
      transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
      box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1),
      background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
      color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Accessibility - Reduced Motion */
  @media (prefers-reduced-motion: reduce) {
    .button {
      transition-duration: 0.01ms !important;
    }

    .button::before {
      display: none;
    }

    .button-icon-right svg {
      transition: none !important;
    }

    .button:hover {
      transform: none !important;
    }

    .button:active {
      transform: none !important;
    }
  }

  /* Focus visible for keyboard navigation */
  .button:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 4px;
  }

  /* Custom button hover states using CSS variables */
  .custom-button:hover {
    background-color: var(--bg-hover-color);
    background-image: linear-gradient(
      to right,
      var(--gradient-hover-from),
      var(--gradient-hover-to)
    );
    border-color: var(--border-hover-color);
    box-shadow:
      0 20px 25px -5px var(--shadow-hover-color),
      0 8px 10px -6px var(--shadow-hover-color);
  }
</style>
