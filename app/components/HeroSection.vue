<template>
  <Section
    inner-classes="text-center"
    background-image="https://images.pexels.com/photos/30101191/pexels-photo-30101191.jpeg"
    overlay-darkness="medium"
  >
    <div class="bg-"></div>
    <div class="w-full max-w-5xl mx-auto py-24 md:py-48 px-8 md:px-0 text-white">
      <!-- Animated hero content -->
      <div class="hero-content">
        <h1 class="text-4xl md:text-6xl mb-8 hero-title">
          High-quality vinyl stickers, from small runs to large volumes.
        </h1>
        <p class="text-xl max-w-2xl mx-auto md:text-2xl mb-6 font-bold hero-subtitle">
          The Legendary Prints is a family-run print shop specializing in durable vinyl sticker
          printing for businesses, artists, schools, and growing brands. We handle everything from
          short runs to large bulk orders with the same focus on clean prints, consistent color, and
          dependable turnaround. Big or small, every order is printed with care by people who stand
          behind their work.
        </p>
        <div class="flex items-center flex-col md:flex-row justify-center gap-4 mb-12 hero-buttons">
          <NuxtLink to="/products">
            <Button
              variant="primary"
              size="lg"
              rounded="md"
              label="Professional prints"
              class="hover-grow"
            />
          </NuxtLink>
          <NuxtLink to="/products">
            <Button variant="secondary" size="lg" rounded="md" label="Quotes" class="hover-grow" />
          </NuxtLink>
        </div>
        <p class="text-tertiary text-xs hero-tagline">
          Fast turnaround • Durable materials • No cheap prints
        </p>
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
