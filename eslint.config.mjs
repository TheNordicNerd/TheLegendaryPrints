// eslint.config.mjs
import path from "node:path";
import { fileURLToPath } from "node:url";
import globals from "globals";

// Nuxt’s flat config helper (installed via @nuxt/eslint)
import { createConfigForNuxt } from "@nuxt/eslint-config/flat";

// Optional: if you're using TypeScript (recommended)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * TheNordicBase ESLint (Nuxt 4)
 * - Flat config
 * - Works with Vue SFCs + TypeScript
 * - Plays nicely with Prettier (formatting handled by Prettier, not ESLint)
 *
 * Notes:
 * - If you want ESLint to also run Prettier, you can add eslint-plugin-prettier,
 *   but I recommend keeping them separate: ESLint = code quality, Prettier = formatting.
 */
export default createConfigForNuxt({
  // Enables type-aware linting when TS config exists
  // If you don’t have tsconfig yet, it’ll still work, just without type-aware rules.
  features: {
    typescript: true,
    tooling: true,
    stylistic: false, // Let Prettier handle styling/formatting
  },
})
  // Global ignores
  .append({
    ignores: [
      "**/.nuxt/**",
      "**/.output/**",
      "**/dist/**",
      "**/coverage/**",
      "**/node_modules/**",
      "**/.vercel/**",
      "**/.netlify/**",
      "**/build/**",
      "**/public/**",
      "**/*.min.*",
      "**/CHANGELOG.md",
    ],
  })

  // Add globals for typical environments
  .append({
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2024,
      },
      parserOptions: {
        // Helps TS ESLint resolve tsconfig for type-aware linting
        tsconfigRootDir: __dirname,
      },
    },
  })

  // Project rules (opinionated but practical)
  .append({
    rules: {
      /**
       * ✅ Nuxt/Vue
       */
      // Vue 3 + Nuxt patterns
      "vue/multi-word-component-names": "off", // Nuxt pages/components often single-word
      "vue/no-v-html": "warn", // allow but discourage
      "vue/no-mutating-props": "error",
      "vue/no-side-effects-in-computed-properties": "error",
      "vue/require-default-prop": "off", // TS handles this better
      "vue/require-explicit-emits": "error",
      "vue/no-setup-props-destructure": "off", // acceptable in many setups

      /**
       * ✅ JS/TS Code Quality
       */
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-alert": "warn",

      // Prefer modern patterns
      "prefer-const": "error",
      "no-var": "error",

      // Prevent common footguns
      "no-duplicate-imports": "error",
      "no-useless-return": "error",
      "no-constant-binary-expression": "error",

      // Unused vars: allow underscore prefix to intentionally ignore
      "no-unused-vars": "off", // handled by TS rule if TS enabled
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // TS safety (sane defaults)
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", disallowTypeAnnotations: false },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/no-floating-promises": "off", // can be noisy; enable later per-project

      /**
       * ✅ Imports
       */
      // Nuxt handles lots of auto-imports; keep import rules light
      "import/no-unresolved": "off",
      "import/named": "off",
      "import/default": "off",
      "import/namespace": "off",

      /**
       * ✅ Formatting
       * Prettier does formatting. These prevent ESLint from fighting it.
       */
      "comma-dangle": "off",
      "max-len": "off",
      "quotes": "off",
      "semi": "off",
    },
  });
