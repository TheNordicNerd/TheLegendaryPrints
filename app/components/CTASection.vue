<template>
  <Section
    inner-classes="p-4 py-20 md:py-28"
    outer-classes="bg-gradient-to-br from-accent-700 via-accent-600 to-accent-800"
  >
    <div class="max-w-4xl mx-auto text-center">
      <div data-animate="zoom-in">
        <SectionHeader
          title="Ready to Bring Your Ideas to Life?"
          description="Join thousands of satisfied customers and create stunning custom stickers today. Fast delivery, premium quality, and 100% satisfaction guaranteed."
          title-size="lg"
          title-color="text-white"
          description-color="text-white/90"
        />
      </div>

      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12" data-animate="fade-up">
        <Button
          variant="secondary"
          size="lg"
          rounded="lg"
          to="/products"
          icon-right="i-lucide-arrow-right"
          class="min-w-[200px] hover-grow"
        >
          Browse Products
        </Button>
        <Button
          variant="ghost"
          size="lg"
          rounded="lg"
          to="/contact"
          icon-left="i-lucide-mail"
          class="min-w-[200px] text-white border-white hover:bg-white/10 hover-grow"
        >
          Get in Touch
        </Button>
      </div>

      <!-- Trust Indicators -->
      <div class="flex flex-wrap items-center justify-center gap-8 text-white/80" data-animate-stagger>
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
