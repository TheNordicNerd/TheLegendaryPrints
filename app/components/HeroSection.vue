<template>
  <Section inner-classes="text-center md:text-left" outer-classes="bg-neutral-900">
    <div class="w-full max-w-7xl mx-auto py-24 md:py-24 px-8 md:px-0 text-white">
      <div class="relative z-10">
        <h1 class="text-3xl sm:text-5xl lg:text-7xl mb-4 hero-title leading-loose">
          Custom Printed Vinyl <br />
          Stickers and Labels
        </h1>
        <p class="text-xl md:text-2xl font-medium text-neutral-50 max-w-2xl mb-12 hero-subtitle">
          Professional prints. Personal service. <br />
          Most orders ship in 24-48 hours.
        </p>
        <div class="flex items-center flex-col md:flex-row justify-start gap-4 mb-12 hero-buttons">
          <NuxtLink to="/custom-design">
            <Button
              variant="primary"
              size="lg"
              rounded="lg"
              label="Design Custom Stickers"
              class="hover-grow"
            />
          </NuxtLink>
          <NuxtLink to="/products">
            <Button
              variant="secondary"
              size="lg"
              rounded="lg"
              label="All Products"
              class="hover-grow"
            />
          </NuxtLink>
        </div>
        <div class="hidden md:flex items-center justify-start gap-4 mx-auto w-full">
          <p class="text-tertiary text-sm font-accent hero-tagline">Fast turnaround</p>
          <Icon name="i-lucide-circle" size="8" />
          <p class="text-tertiary text-sm font-accent hero-tagline">Durable materials</p>
          <Icon name="i-lucide-circle" size="8" />
          <p class="text-tertiary text-sm font-accent hero-tagline">No cheap prints</p>
        </div>
      </div>
    </div>
  </Section>
</template>

<script setup lang="ts"></script>

<style scoped>
  /* Hero entrance animations */
  .hero-content > * {
    opacity: 0;
    animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  .hero-title {
    animation-delay: 0.2s;
  }

  .hero-subtitle {
    animation-delay: 0.4s;
  }

  .hero-buttons {
    animation-delay: 0.6s;
  }

  .hero-tagline {
    animation-delay: 0.8s;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .hero-content > * {
      animation: fadeInQuick 0.01ms forwards;
      animation-delay: 0s !important;
    }

    @keyframes fadeInQuick {
      to {
        opacity: 1;
        transform: none;
      }
    }
  }
</style>
