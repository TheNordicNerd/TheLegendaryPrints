<script setup lang="ts">
  import businessConfig from "~/config/businessConfig";

  // Initialize scroll animations for the entire page
  useScrollAnimation();

  // SEO Meta Tags - Optimized for custom sticker printing
  useSeoMeta({
    title: `Custom Stickers | Fast Premium Printing - ${businessConfig.name}`,
    description:
      "High-quality custom stickers & die-cut prints. Waterproof vinyl, fast delivery, free design support. Order premium stickers today!",
    ogTitle: `Custom Stickers That Make an Impact | ${businessConfig.name}`,
    ogDescription:
      "Transform your ideas into stunning custom stickers. Premium quality, waterproof vinyl, delivered in 3-5 days with free design support.",
    ogImage: "/og-image.jpg",
    twitterCard: "summary_large_image",
  });

  // Structured Data - Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: businessConfig.name,
    url: businessConfig.website,
    logo: `${businessConfig.website}/logo.png`,
    description: businessConfig.description,
    slogan: businessConfig.tagline,
    foundingDate: businessConfig.foundingYear,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: businessConfig.email,
      availableLanguage: "English",
    },
    sameAs: [
      businessConfig.social.instagram,
      businessConfig.social.facebook,
    ],
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Custom Vinyl Stickers",
    description:
      "High-quality custom stickers with vibrant colors, waterproof coating, and professional finish",
    brand: {
      "@type": "Brand",
      name: businessConfig.name,
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: "2.99",
      highPrice: "199.99",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "2847",
    },
  };

  useHead({
    script: [
      {
        type: "application/ld+json",
        innerHTML: JSON.stringify(organizationSchema),
      },
      {
        type: "application/ld+json",
        innerHTML: JSON.stringify(productSchema),
      },
    ],
  });
</script>

<template>
  <div>
    <HeroSection />
    <Marquee />
    <!-- <FeaturesSection /> -->
    <BestSellers />
    <ProcessSection />
    <ReviewsSection
      :per-page="20"
      :show-write-button="false"
      title="See what our customers have to say!"
      description="Real reviews from real customers"
    />
  </div>
</template>

<style scoped></style>
