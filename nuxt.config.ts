import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/tailwind.css"],
  modules: [
    "@nuxt/a11y",
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxtjs/seo",
    "@vueuse/nuxt",
    "@pinia/nuxt",
    "@nuxt/content",
  ],
  runtimeConfig: {
    githubToken: process.env.GITHUB_TOKEN,
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3000",
      siteName: "The Nordic Base",
      siteDescription: "Premium Nuxt 4 Boilerplate setup.",
      ogImage: "/og.png",
      githubOwner: "nordicnerd",
      currentRepo: process.env.GITHUB_REPO || "client-project",
      currentProject: parseInt(process.env.GITHUB_PROJECT_NUMBER || "1"),
    },
  },
  content: {
    experimental: { nativeSqlite: true },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
