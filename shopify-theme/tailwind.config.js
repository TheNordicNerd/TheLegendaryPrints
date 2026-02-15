/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./layout/**/*.liquid",
    "./sections/**/*.liquid",
    "./snippets/**/*.liquid",
    "./templates/**/*.liquid",
    "./templates/**/*.json",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['var(--font-heading)', 'Montserrat', 'sans-serif'],
        body: ['var(--font-body)', 'Inter', 'sans-serif'],
        accent: ['var(--font-accent)', 'Quirthy', 'cursive'],
      },
      colors: {
        // Brand colors
        magenta: 'var(--color-magenta)',
        yellow: 'var(--color-yellow)',
        cyan: 'var(--color-cyan)',
        black: 'var(--color-black)',
        white: 'var(--color-white)',

        // Primary & Secondary
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',

        // Neutral scale
        neutral: {
          50: 'var(--color-neutral-50)',
          100: 'var(--color-neutral-100)',
          200: 'var(--color-neutral-200)',
          300: 'var(--color-neutral-300)',
          400: 'var(--color-neutral-400)',
          500: 'var(--color-neutral-500)',
          600: 'var(--color-neutral-600)',
          700: 'var(--color-neutral-700)',
          800: 'var(--color-neutral-800)',
          900: 'var(--color-neutral-900)',
        },

        // Semantic colors
        success: 'var(--color-success)',
        error: 'var(--color-error)',
        warning: 'var(--color-warning)',

        // Surface colors
        surface: {
          base: 'var(--color-surface-base)',
          raised: 'var(--color-surface-raised)',
          overlay: 'var(--color-surface-overlay)',
          sunken: 'var(--color-surface-sunken)',
        },

        // Text colors
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
          disabled: 'var(--color-text-disabled)',
          inverse: 'var(--color-text-inverse)',
          link: 'var(--color-text-link)',
          'link-hover': 'var(--color-text-link-hover)',
        },

        // Border colors
        border: {
          subtle: 'var(--color-border-subtle)',
          default: 'var(--color-border-default)',
          emphasis: 'var(--color-border-emphasis)',
          focus: 'var(--color-border-focus)',
        },
      },
    },
  },
  plugins: [],
}
