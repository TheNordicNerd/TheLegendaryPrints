<template>
  <Section inner-classes="p-4 py-12 md:py-20" outer-classes="bg-surface-base">
    <div class="max-w-7xl mx-auto">
      <div data-animate="fade-up">
        <SectionHeader
          title="Why Choose The Legendary Prints?"
          description="Professional quality stickers with unbeatable service and lightning-fast delivery"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" data-animate-stagger>
        <div class="hover-lift">
          <IconFeatureCard
            icon="i-lucide-badge-check"
            title="Premium Quality"
            description="Professional-grade printing with vibrant colors and waterproof vinyl that lasts for years"
            variant="elevated"
          />
        </div>

        <div class="hover-lift">
          <IconFeatureCard
            icon="i-lucide-zap"
            title="Fast Turnaround"
            description="Lightning-fast 3-5 day delivery on all orders with free shipping on orders over $50"
            variant="elevated"
          />
        </div>

        <div class="hover-lift">
          <IconFeatureCard
            icon="i-lucide-palette"
            title="Design Support"
            description="Expert design assistance at no extra cost. Our team helps bring your vision to life"
            variant="elevated"
          />
        </div>

        <div class="hover-lift">
          <IconFeatureCard
            icon="i-lucide-shield-check"
            title="100% Guarantee"
            description="Not satisfied? We'll remake it or refund you. Your satisfaction is our priority"
            variant="elevated"
          />
        </div>
      </div>
    </div>
  </Section>
</template>

<script setup lang="ts"></script>

<style scoped></style>
