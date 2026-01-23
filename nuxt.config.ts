export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/tailwind.css"],
  // Use static generation for Netlify
  ssr: true,
  nitro: {
    preset: 'netlify',
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
  runtimeConfig: {
    githubToken: process.env.GITHUB_TOKEN,
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3000",
      siteName: "The Legendary Prints",
      siteDescription:
        "Premium custom sticker printing and die-cut prints. High-quality, waterproof vinyl stickers with fast turnaround. Free design support.",
      ogImage: "/og-image.jpg",
      githubOwner: "nordicnerd",
      currentRepo: process.env.GITHUB_REPO || "client-project",
      currentProject: parseInt(process.env.GITHUB_PROJECT_NUMBER || "1"),
      cartMode: process.env.NUXT_PUBLIC_CART_MODE || "mock",
    },
  },
  content: {
    experimental: { nativeSqlite: true },
  },
});
