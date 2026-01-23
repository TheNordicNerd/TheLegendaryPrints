// design-tokens.ts
// Nordic Nerd Brand Design System
// 60/30/10 Color Rule: Neutral (60%), Primary (30%), Accent (10%)

export const designTokens = {
  // ==========================================
  // 60% - PRIMARY (Neutral Scale)
  // Usage: Backgrounds, text, borders
  // ==========================================
  colors: {
    neutral: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#e5e5e5",
      300: "#d4d4d4",
      400: "#a3a3a3",
      500: "#737373",
      600: "#525252",
      700: "#404040",
      800: "#262626",
      900: "#171717",
    },

    // ==========================================
    // 30% - SECONDARY (Brand Blue)
    // Usage: Brand identity, links, interactive
    // ==========================================
    primary: {
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6", // Main brand color
      600: "#2563eb",
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a",
    },

    // ==========================================
    // 10% - ACCENT (Action Color)
    // Usage: CTAs, buttons, highlights
    // ==========================================
    accent: {
      50: "#ecfeff",
      100: "#cffafe",
      200: "#a5f3fc",
      300: "#67e8f9",
      400: "#22d3ee",
      500: "#06b6d4", // Main accent color
      600: "#0891b2",
      700: "#0e7490",
      800: "#155e75",
      900: "#164e63",
    },

    // ==========================================
    // SEMANTIC COLORS
    // ==========================================
    success: {
      50: "#f0fdf4",
      100: "#dcfce7",
      200: "#bbf7d0",
      300: "#86efac",
      400: "#4ade80",
      500: "#22c55e",
      600: "#16a34a",
      700: "#15803d",
      800: "#166534",
      900: "#14532d",
    },
    error: {
      50: "#fef2f2",
      100: "#fee2e2",
      200: "#fecaca",
      300: "#fca5a5",
      400: "#f87171",
      500: "#ef4444",
      600: "#dc2626",
      700: "#b91c1c",
      800: "#991b1b",
      900: "#7f1d1d",
    },
    warning: {
      50: "#fffbeb",
      100: "#fef3c7",
      200: "#fde68a",
      300: "#fcd34d",
      400: "#fbbf24",
      500: "#f59e0b",
      600: "#d97706",
      700: "#b45309",
      800: "#92400e",
      900: "#78350f",
    },
    info: {
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6",
      600: "#2563eb",
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a",
    },

    // Surface colors
    surface: {
      base: "#ffffff",
      raised: "#fafafa",
      overlay: "#ffffff",
      sunken: "#f5f5f5",
    },

    // Text colors
    text: {
      primary: "#171717",
      secondary: "#525252",
      tertiary: "#737373",
      disabled: "#a3a3a3",
      inverse: "#ffffff",
      link: "#2563eb",
      linkHover: "#1d4ed8",
    },

    // Border colors
    border: {
      subtle: "#e5e5e5",
      default: "#d4d4d4",
      emphasis: "#a3a3a3",
      focus: "#3b82f6",
    },

    // Shadow colors
    shadow: {
      sm: "rgba(0, 0, 0, 0.05)",
      md: "rgba(0, 0, 0, 0.1)",
      lg: "rgba(0, 0, 0, 0.15)",
      xl: "rgba(0, 0, 0, 0.2)",
    },
  },

  // Typography
  typography: {
    fontFamily: {
      sans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: '"JetBrains Mono", "Fira Code", Consolas, monospace',
    },
    fontSize: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem", // 36px
      "5xl": "3rem", // 48px
      "6xl": "3.75rem", // 60px
    },
    fontWeight: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
    lineHeight: {
      tight: "1.25",
      normal: "1.5",
      relaxed: "1.75",
    },
  },

  // Spacing
  spacing: {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    "2xl": "3rem", // 48px
    "3xl": "4rem", // 64px
  },

  // Border radius
  borderRadius: {
    none: "0",
    sm: "0.25rem", // 4px
    md: "0.5rem", // 8px
    lg: "0.75rem", // 12px
    xl: "1rem", // 16px
    full: "9999px",
  },

  // Shadows
  boxShadow: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  },

  // Animation
  animation: {
    duration: {
      fast: "150ms",
      base: "300ms",
      slow: "500ms",
    },
    easing: {
      default: "cubic-bezier(0.4, 0, 0.2, 1)",
      in: "cubic-bezier(0.4, 0, 1, 1)",
      out: "cubic-bezier(0, 0, 0.2, 1)",
      inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },

  // Breakpoints (matches Tailwind defaults)
  breakpoints: {
    xs: "0px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
} as const;

// Type exports for TypeScript
export type ColorScale = typeof designTokens.colors.neutral;
export type SemanticColor = keyof typeof designTokens.colors;
export type FontSize = keyof typeof designTokens.typography.fontSize;

// Helper function to get color by path
export function getColor(path: string): string {
  const parts = path.split(".");
  let value: any = designTokens.colors;

  for (const part of parts) {
    value = value[part];
    if (!value) return "";
  }

  return value as string;
}

// Usage examples:
// getColor('primary.500')    → '#3b82f6'
// getColor('accent.500')     → '#06b6d4'
// getColor('neutral.800')    → '#262626'
