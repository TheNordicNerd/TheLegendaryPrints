<script setup lang="ts">
  // SEO Meta Tags - Optimized for custom sticker printing
  useSeoMeta({
    title: "Custom Sticker Printing | Fast, Premium Quality | The Legendary Prints",
    description:
      "High-quality custom stickers and die-cut prints. Waterproof, weatherproof vinyl stickers delivered fast. Free design support. Order your custom stickers today!",
    ogTitle: "The Legendary Prints - Custom Stickers That Make an Impact",
    ogDescription:
      "Transform your ideas into stunning custom stickers and prints. Premium quality, delivered in 3-5 days.",
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
  <div class="min-h-screen bg-background-base">
    <HeroSection
      headline="Custom Stickers & Prints Made Easy"
      subheadline="Professional-grade vinyl stickers and die-cut prints delivered in 3-5 days. Waterproof, weatherproof, and built to last. Perfect for businesses, events, and personal projects."
      cta-text="Shop Stickers Now"
      cta-link="/products"
      background-image="https://images.unsplash.com/photo-1633533452206-8ab246b00e30?q=80&w=3131&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      :overlay-opacity="70"
      text-align="center"
      min-height="700px"
    />
  </div>
</template>

<style scoped></style>
