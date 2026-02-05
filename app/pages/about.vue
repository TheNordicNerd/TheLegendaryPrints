<template>
  <Section inner-classes="p-4 py-12">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl text-center py-24 lg:text-7xl text-text-primary">
        About {{ businessConfig.name }}
      </h1>
      <div class="prose prose-lg max-w-none">
        <p class="text-lg text-text-secondary mb-6">
          Professional prints. Personal service. We help small businesses, independent brands, and
          creators bring their designs to life with exceptional quality and fast turnaround times.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="h-full w-full p-8">
            <NuxtImg src="/LP Logo.png" class="my-0" />
          </div>

          <div class="">
            <h2 class="text-2xl font-bold text-text-primary mb-4">Our Story</h2>
            <p class="text-text-secondary mb-6">
              We understand that timing matters for launches, packaging, promotions, and restocks—where
              delays directly impact your revenue and brand perception. That's why we prioritize clients
              who value speed and reliability over the lowest possible price. We combine cutting-edge
              printing technology with expert craftsmanship and clear communication to deliver products
              that exceed expectations, when you need them.
            </p>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 class="text-2xl font-bold text-text-primary mt-8 mb-4">Why Choose Us</h2>
            <ul class="list-disc space-y-2 text-text-secondary mb-6">
              <li><strong>Fast turnaround:</strong> Most orders ship in 24-48 hours—not 3-5 days</li>
              <li><strong>Clear communication:</strong> Real people, responsive service throughout</li>
              <li><strong>Premium quality:</strong> Waterproof vinyl with vibrant, long-lasting colors</li>
              <li><strong>Free proof before print:</strong> See exactly what you're getting</li>
              <li><strong>Expert support:</strong> Professional design assistance when you need it</li>
              <li><strong>Reliability you can trust:</strong> We prioritize your timeline and success</li>
            </ul>
          </div>
          <div class="h-full w-full">
            <NuxtImg src="/LP Check List.png" class="my-0" />
          </div>
        </div>

        <h2 class="text-2xl font-bold text-text-primary mt-8 mb-4">Our Commitment</h2>
        <p class="text-text-secondary mb-6">
          Every sticker we produce represents our commitment to quality, speed, and personal service.
          We're not "more expensive"—we're faster, safer, and more responsive. When your timeline
          matters, we deliver. From die-cut precision to kiss-cut convenience, we ensure each order
          meets the highest standards and arrives when you need it.
        </p>
      </div>
    </div>
  </Section>
</template>

<script setup lang="ts">
  import businessConfig from "~/config/businessConfig";

  // SEO Meta Tags
  useSeoMeta({
    title: `About Us | Premium Custom Sticker Printing - ${businessConfig.name}`,
    description: `Trusted source for premium custom stickers. ${businessConfig.description}. Professional quality, fast delivery, free design support, and 100% satisfaction guarantee.`,
    ogTitle: `About ${businessConfig.name} - Custom Sticker Experts`,
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
          name: `About ${businessConfig.name}`,
          description: `Learn about ${businessConfig.name} - ${businessConfig.description}`,
          url: `${businessConfig.website}/about`,
          mainEntity: {
            "@type": "Organization",
            name: businessConfig.name,
            description: businessConfig.description,
            url: businessConfig.website,
          },
        }),
      },
    ],
  });
</script>

<style scoped></style>
