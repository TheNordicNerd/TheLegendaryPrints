<script setup lang="ts">
  // Initialize scroll animations for the entire page
  useScrollAnimation();

  // SEO Meta Tags - Optimized for custom sticker printing
  useSeoMeta({
    title: "Custom Stickers | Fast Premium Printing - TLP",
    description:
      "High-quality custom stickers & die-cut prints. Waterproof vinyl, fast delivery, free design support. Order premium stickers today!",
    ogTitle: "Custom Stickers That Make an Impact | TLP",
    ogDescription:
      "Transform your ideas into stunning custom stickers. Premium quality, waterproof vinyl, delivered in 3-5 days with free design support.",
    ogImage: "/og-image.jpg",
    twitterCard: "summary_large_image",
  });

  // Structured Data - Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "The Legendary Prints",
    url: "https://thelegendaryprints.com",
    logo: "https://thelegendaryprints.com/logo.png",
    description: "Premium custom sticker printing and die-cut prints with fast turnaround",
    slogan: "Custom Stickers Made Easy",
    foundingDate: "2024",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: "hello@thelegendaryprints.com",
      availableLanguage: "English",
    },
    sameAs: [
      "https://instagram.com/thelegendaryprints",
      "https://facebook.com/thelegendaryprints",
      "https://twitter.com/legendaryprints",
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
      name: "The Legendary Prints",
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
    <FeaturesSection />
    <BestSellers />
    <ProcessSection />
    <TestimonialsSection />
    <CTASection />
  </div>
</template>

<style scoped></style>
