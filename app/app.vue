<template>
  <Html lang="en">
    <Head>
      <!-- Meta -->
      <Meta charset="utf-8" />
      <Meta name="viewport" content="width=device-width, initial-scale=1" />

      <!-- Primary SEO -->
      <Title>{{ siteName }}</Title>
      <Meta name="description" :content="siteDescription" />

      <!-- Theme / Branding -->
      <Meta name="theme-color" content="#0f172a" />

      <!-- Open Graph -->
      <Meta property="og:type" content="website" />
      <Meta property="og:title" :content="siteName" />
      <Meta property="og:description" :content="siteDescription" />
      <Meta property="og:url" :content="siteUrl" />
      <Meta property="og:image" :content="ogImage" />

      <!-- Twitter -->
      <Meta name="twitter:card" content="summary_large_image" />
      <Meta name="twitter:title" :content="siteName" />
      <Meta name="twitter:description" :content="siteDescription" />
      <Meta name="twitter:image" :content="ogImage" />

      <!-- Favicon -->
      <Link rel="icon" type="image/png" href="/favicon.png" />
    </Head>

    <Body class="bg-surface-base antialiased">
      <!-- App Layout -->
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </Body>
  </Html>
</template>

<script setup lang="ts">
  /**
   * Global app metadata
   * Safe defaults for all projects
   * Override per-page using useSeoMeta or definePageMeta
   */

  const runtimeConfig = useRuntimeConfig();

  const siteName = computed(() => runtimeConfig.public.siteName || "The Nordic Base");
  const siteDescription = computed(
    () =>
      runtimeConfig.public.siteDescription || "A modern Nuxt 4 starter built by The Nordic Nerd.",
  );
  const siteUrl = computed(() => runtimeConfig.public.siteUrl || "https://example.com");
  const ogImage = computed(() => runtimeConfig.public.ogImage || `${siteUrl.value}/og.png`);

  // Initialize color palette on app load
  if (import.meta.client) {
    const savedPalette = localStorage.getItem("color-palette") || "classic";
    document.documentElement.setAttribute("data-palette", savedPalette);
  }
</script>

<style>
  /* Keep app.vue styling minimal.
   Global styles should live in app/assets */
</style>
