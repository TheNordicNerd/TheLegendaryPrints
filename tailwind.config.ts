// tailwind.config.ts
import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
  darkMode: "class",
  content: [
    "./app/components/**/*.{js,vue,ts}",
    "./app/layouts/**/*.vue",
    "./app/pages/**/*.vue",
    "./app/plugins/**/*.{js,ts}",
    "./app.vue",
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-heading)", "Montserrat", "sans-serif"],
        body: ["var(--font-body)", "Inter", "sans-serif"],
        accent: ["var(--font-accent)", "Quirthy", "cursive"],
      },
      fontWeight: {
        // Montserrat weights
        bold: "700",
        extrabold: "800",
        // Inter weights
        regular: "400",
        medium: "500",
        semibold: "600",
      },
      colors: {
        // Brand colors (exact from brand guide)
        magenta: "var(--color-magenta)",
        yellow: "var(--color-yellow)",
        cyan: "var(--color-cyan)",
        black: "var(--color-black)",
        white: "var(--color-white)",

        // Primary = Magenta (main brand color)
        primary: "var(--color-primary)",

        // Secondary = Cyan (secondary brand color)
        secondary: "var(--color-secondary)",

        // Neutral scale (for backgrounds and text)
        neutral: {
          50: "var(--color-neutral-50)",
          100: "var(--color-neutral-100)",
          200: "var(--color-neutral-200)",
          300: "var(--color-neutral-300)",
          400: "var(--color-neutral-400)",
          500: "var(--color-neutral-500)",
          600: "var(--color-neutral-600)",
          700: "var(--color-neutral-700)",
          800: "var(--color-neutral-800)",
          900: "var(--color-neutral-900)",
        },

        // Semantic colors (single value, no shades)
        success: "var(--color-success)",
        error: "var(--color-error)",
        warning: "var(--color-warning)",

        // Surface colors
        surface: {
          base: "var(--color-surface-base)",
          raised: "var(--color-surface-raised)",
          overlay: "var(--color-surface-overlay)",
          sunken: "var(--color-surface-sunken)",
        },

        // Text colors
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          tertiary: "var(--color-text-tertiary)",
          disabled: "var(--color-text-disabled)",
          inverse: "var(--color-text-inverse)",
          link: "var(--color-text-link)",
          "link-hover": "var(--color-text-link-hover)",
        },

        // Border colors
        border: {
          subtle: "var(--color-border-subtle)",
          default: "var(--color-border-default)",
          emphasis: "var(--color-border-emphasis)",
          focus: "var(--color-border-focus)",
        },
      },

      // Box shadows using the color system
      boxShadow: {
        sm: "0 1px 2px 0 var(--color-shadow-sm)",
        DEFAULT: "0 1px 3px 0 var(--color-shadow-sm), 0 1px 2px -1px var(--color-shadow-sm)",
        md: "0 4px 6px -1px var(--color-shadow-md), 0 2px 4px -2px var(--color-shadow-md)",
        lg: "0 10px 15px -3px var(--color-shadow-lg), 0 4px 6px -4px var(--color-shadow-lg)",
        xl: "0 20px 25px -5px var(--color-shadow-xl), 0 8px 10px -6px var(--color-shadow-xl)",
      },
    },
  },
  plugins: [typography],
} satisfies Config;
