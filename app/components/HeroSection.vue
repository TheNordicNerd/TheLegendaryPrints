<template>
  <Section
    inner-classes="text-center"
    overlay-darkness="dark"
    background-video="/hero.mp4"
    :video-speed="0.75"
  >
    <div class="w-full max-w-5xl mx-auto py-24 md:py-24 px-8 md:px-0 text-white">
      <div class="relative z-10">
        <h1 class="text-3xl sm:text-5xl md:text-5xl mb-8 md:mb-16 hero-title leading-loose">
          High-quality vinyl stickers, from small runs to large volumes.
        </h1>
        <p class="text-md font-medium text-neutral-50 max-w-2xl mx-auto mb-12 hero-subtitle">
          The Legendary Prints is a family-run print shop specializing in durable vinyl sticker
          printing for businesses, artists, schools, and growing brands. We handle everything from
          short runs to large bulk orders with the same focus on clean prints, consistent color, and
          dependable turnaround. Big or small, every order is printed with care by people who stand
          behind their work.
        </p>
        <div class="flex items-center flex-col md:flex-row justify-center gap-4 mb-12 hero-buttons">
          <NuxtLink to="/products">
            <Button
              variant="secondary"
              size="lg"
              rounded="lg"
              label="Order Now!"
              class="hover-grow"
            />
          </NuxtLink>
          <NuxtLink to="/products">
            <Button
              variant="ghost"
              size="lg"
              rounded="lg"
              label="Get a Quote"
              class="hover-grow text-white hover:bg-transparent hover:border-white border-2 border-transparent"
            />
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
