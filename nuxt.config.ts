export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/tailwind.css", "~/assets/css/palettes.css", "~/assets/css/fonts.css"],
  // Use static generation for Netlify with SSR fallback
  ssr: true,
  nitro: {
    preset: "netlify",
    prerender: {
      crawlLinks: false,
      routes: ["/", "/about", "/contact", "/products", "/cart"],
      failOnError: false,
      // Prerender product pages will be handled by the hook below
    },
  },
  modules: [
    "@nuxt/a11y",
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxtjs/seo",
    "@vueuse/nuxt",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@nuxt/content",
    "@nuxtjs/tailwindcss",
  ],
  tailwindcss: {
    cssPath: "~/assets/css/tailwind.css",
    configPath: "tailwind.config.ts",
    exposeConfig: false,
    viewer: false,
  },
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3000",
    name: "The Legendary Prints",
    titleSeparator: "|",
  },
  app: {
    head: {
      titleTemplate: "%s",
    },
  },
  fonts: {
    defaults: {
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
    },
  },
  image: {
    provider: "ipx",
    domains: ["cdn.shopify.com"],
    providers: {
      shopify: {
        baseURL: "https://cdn.shopify.com",
      },
    },
    presets: {
      default: {
        modifiers: {
          format: "webp",
          quality: 80,
        },
      },
    },
  },
  runtimeConfig: {
    githubToken: process.env.GITHUB_TOKEN,
    // Server-only env vars (not exposed to client)
    shopifyStoreDomain: process.env.SHOPIFY_STORE_DOMAIN,
    shopifyStorefrontAccessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    shopifyAdminAccessToken: process.env.SHOPIFY_ADMIN_ACCESS_TOKEN,
    // Cloudinary credentials (server-only)
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    // Judge.me private token (server-only, for creating reviews)
    judgeMePrivateToken: process.env.JUDGE_ME_PRIVATE_TOKEN || process.env.JUDGE_ME_TOKEN,
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3000",
      siteName: "The Legendary Prints",
      siteDescription:
        "Premium custom sticker printing and die-cut prints. High-quality, waterproof vinyl stickers with fast turnaround. Free design support.",
      ogImage: "/og-image.jpg",
      githubOwner: "nordicnerd",
      currentRepo: process.env.GITHUB_REPO || "client-project",
      currentProject: parseInt(process.env.GITHUB_PROJECT_NUMBER || "1"),
      // Public flags for debugging (not the actual credentials)
      hasShopifyConfig: !!(
        process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
      ),
      // Judge.me configuration
      judgeMeToken: process.env.JUDGE_ME_TOKEN,
      shopifyShop: process.env.SHOPIFY_STORE_DOMAIN,
    },
  },
  content: {
    experimental: { nativeSqlite: true },
  },
});
