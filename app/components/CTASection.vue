<template>
  <Section
    inner-classes="p-4 pt-10 md:pt-28 md:pb-18"
    outer-classes="bg-gradient-to-b from-surface-base via-surface-raised to-surface-sunken"
  >
    <div class="max-w-4xl mx-auto text-center">
      <div data-animate="zoom-in">
        <SectionHeader
          title="Ready to Bring Your Ideas to Life?"
          description="Join thousands of satisfied customers and create stunning custom stickers today. Fast delivery, premium quality, and 100% satisfaction guaranteed."
          title-size="lg"
          description-color="text-secondary"
        />
      </div>

      <div
        class="flex flex-col sm:flex-row gap-4 justify-center items-center"
        data-animate="fade-up"
      >
        <Button
          variant="primary"
          size="lg"
          rounded="lg"
          to="/products"
          icon-right="i-lucide-arrow-right"
          class="hover-grow"
          show-lp-background
        >
          Browse Products
        </Button>
        <GhostButton icon-left="i-lucide-mail" top="-100px" label="Get in Touch"> </GhostButton>
      </div>

      <!-- Trust Indicators -->
      <div
        class="flex flex-wrap items-center justify-center gap-8 text-text-secondary"
        data-animate-stagger
      >
        <div class="hover-float">
          <TrustIndicator icon="i-lucide-shield-check" text="100% Guarantee" />
        </div>
        <div class="hover-float">
          <TrustIndicator icon="i-lucide-truck" text="Free Shipping $50+" />
        </div>
        <div class="hover-float">
          <TrustIndicator icon="i-lucide-headphones" text="24/7 Support" />
        </div>
        <div class="hover-float">
          <TrustIndicator icon="i-lucide-zap" text="3-5 Day Delivery" />
        </div>
      </div>
    </div>
  </Section>
</template>

<script setup lang="ts"></script>

<style scoped>
  .hover-float {
    transition: transform 0.3s ease;
  }
  .hover-float:hover {
    transform: translateY(-3px);
  }
</style>
