<template>
  <Section inner-classes="p-4 py-12">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl text-center py-24 lg:text-7xl mb-8 text-text-primary">
        About The Legendary Prints
      </h1>

      <div class="prose prose-lg max-w-none">
        <p class="text-lg text-text-secondary mb-6">
          We are a premium custom sticker printing company dedicated to bringing your designs to
          life with exceptional quality and fast turnaround times.
        </p>

        <h2 class="text-2xl font-bold text-text-primary mt-8 mb-4">Our Story</h2>
        <p class="text-text-secondary mb-6">
          Founded with a passion for quality printing and customer satisfaction, The Legendary
          Prints has become a trusted name in custom sticker production. We combine cutting-edge
          printing technology with expert craftsmanship to deliver products that exceed
          expectations.
        </p>

        <h2 class="text-2xl font-bold text-text-primary mt-8 mb-4">Why Choose Us</h2>
        <ul class="list-disc list-inside space-y-2 text-text-secondary mb-6">
          <li>Premium vinyl materials that are waterproof and weatherproof</li>
          <li>Professional-grade printing with vibrant, long-lasting colors</li>
          <li>Fast turnaround with 3-5 day delivery</li>
          <li>Free design support from our expert team</li>
          <li>Competitive pricing with no hidden fees</li>
          <li>100% satisfaction guarantee</li>
        </ul>

        <h2 class="text-2xl font-bold text-text-primary mt-8 mb-4">Our Commitment</h2>
        <p class="text-text-secondary mb-6">
          Every sticker we produce represents our commitment to quality and customer satisfaction.
          From die-cut precision to kiss-cut convenience, we ensure each order meets the highest
          standards.
        </p>
      </div>
    </div>
  </Section>
</template>

<script setup lang="ts">
  // SEO Meta Tags
  useSeoMeta({
    title: "About Us | Premium Custom Sticker Printing - TLP",
    description:
      "Trusted source for premium custom stickers. Professional quality, fast 3-5 day delivery, free design support, and 100% satisfaction guarantee.",
    ogTitle: "About TLP - Custom Sticker Experts",
    ogDescription:
      "Premium custom stickers with professional quality, waterproof vinyl, fast delivery, and free design support from expert team.",
    ogType: "website",
    twitterCard: "summary_large_image",
  });

  // Structured Data - About Page
  useHead({
    script: [
      {
        type: "application/ld+json",
        innerHTML: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About The Legendary Prints",
          description:
            "Learn about The Legendary Prints - premium custom sticker printing company with professional quality and fast turnaround",
          url: "https://thelegendaryprints.com/about",
          mainEntity: {
            "@type": "Organization",
            name: "The Legendary Prints",
            description: "Premium custom sticker printing and die-cut prints with fast turnaround",
            url: "https://thelegendaryprints.com",
          },
        }),
      },
    ],
  });
</script>

<style scoped></style>
