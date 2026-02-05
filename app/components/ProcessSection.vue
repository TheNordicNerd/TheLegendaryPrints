<template>
  <Section inner-classes="p-4 py-12 md:py-20" outer-classes="bg-surface-base">
    <div class="max-w-6xl mx-auto">
      <div data-animate="fade-up">
        <SectionHeader
          title="How It Works"
          description="Get your custom stickers in just 3 simple steps"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative" data-animate-stagger>
        <!-- Connector Lines (hidden on mobile) -->
        <div
          class="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-neutral-200"
          style="top: 3.5rem"
        ></div>

        <div class="relative flex flex-col items-center hover-lift">
          <IconFeatureCard
            :step-number="1"
            icon="i-lucide-upload"
            title="Upload Your Design"
            description="Choose your product and upload your artwork. We accept all major file formats"
          />
        </div>

        <div class="relative flex flex-col items-center hover-lift">
          <IconFeatureCard
            :step-number="2"
            icon="i-lucide-settings"
            title="Customize Options"
            description="Select size, quantity, and material. Get instant pricing and preview your order"
          />
        </div>

        <div class="relative flex flex-col items-center hover-lift">
          <IconFeatureCard
            :step-number="3"
            icon="i-lucide-truck"
            title="Receive & Enjoy"
            description="We print and ship within 3-5 days. Track your order every step of the way"
          />
        </div>
      </div>
    </div>
  </Section>
</template>

<script setup lang="ts"></script>

<style scoped></style>
