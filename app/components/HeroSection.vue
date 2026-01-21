<script setup lang="ts">
  /**
   * HeroSection Component
   *
   * A reusable hero section component for displaying prominent page headers
   * with headline, subheadline, call-to-action, and background image.
   *
   * @component
   * @example
   * <HeroSection
   *   headline="Welcome to Our Site"
   *   subheadline="Discover amazing products"
   *   cta-text="Get Started"
   *   cta-link="/products"
   *   background-image="/images/hero-bg.jpg"
   * />
   */

  interface Props {
    /** Main headline text (H1) */
    headline: string;
    /** Supporting subheadline text */
    subheadline?: string;
    /** Call-to-action button text */
    ctaText?: string;
    /** Call-to-action button link */
    ctaLink?: string;
    /** Background image URL or path */
    backgroundImage?: string;
    /** Background overlay opacity (0-100) */
    overlayOpacity?: number;
    /** Text alignment: left, center, right */
    textAlign?: "left" | "center" | "right";
    /** Minimum height of hero section */
    minHeight?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    subheadline: "",
    ctaText: "",
    ctaLink: "#",
    backgroundImage: "",
    overlayOpacity: 50,
    textAlign: "center",
    minHeight: "100vh",
  });

  // Animation state - simple inline implementation for better testability
  const heroRef = ref<HTMLElement | null>(null);
  const isVisible = ref(true); // Start visible for immediate render

  // Set up intersection observer in client-side only
  if (import.meta.client) {
    onMounted(() => {
      if (!heroRef.value) return;

      isVisible.value = false; // Start hidden, will animate in

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              isVisible.value = true;
              observer.disconnect();
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: "0px 0px -50px 0px",
        },
      );

      observer.observe(heroRef.value);

      onUnmounted(() => {
        observer.disconnect();
      });
    });
  }

  // Compute overlay style
  const overlayStyle = computed(() => ({
    opacity: props.overlayOpacity / 100,
  }));

  // Compute background image style
  const backgroundStyle = computed(() => {
    if (!props.backgroundImage) return {};
    return {
      backgroundImage: `url(${props.backgroundImage})`,
    };
  });

  // Compute container alignment classes
  const alignmentClass = computed(() => {
    const alignments = {
      left: "text-left items-start",
      center: "text-center items-center",
      right: "text-right items-end",
    };
    return alignments[props.textAlign];
  });
</script>

<template>
  <section
    ref="heroRef"
    class="hero-section relative overflow-hidden"
    :style="{ minHeight: minHeight }"
    role="banner"
  >
    <!-- Background Image -->
    <div
      v-if="backgroundImage"
      class="hero-background absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
      :style="backgroundStyle"
      aria-hidden="true"
    />

    <!-- Gradient Overlay -->
    <div
      class="hero-overlay absolute inset-0 bg-gradient-to-br from-primary-900/80 via-neutral-900/70 to-primary-800/80"
      :style="overlayStyle"
      aria-hidden="true"
    />

    <!-- Content Container -->
    <div
      class="hero-content relative z-10 flex flex-col justify-center px-4 sm:px-6 lg:px-8"
      :class="[alignmentClass, isVisible ? 'hero-visible' : 'hero-hidden']"
      :style="{ minHeight: minHeight }"
    >
      <div class="hero-content-inner lg:text-left max-w-7xl mx-auto w-full py-12 sm:py-16 lg:py-20">
        <!-- Headline -->
        <h1
          class="hero-headline lg:w-1/2 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 sm:mb-8 tracking-tight drop-shadow-2xl"
        >
          {{ headline }}
        </h1>

        <!-- Subheadline -->
        <p
          v-if="subheadline"
          class="hero-subheadline text-lg sm:text-xl lg:text-2xl text-white/95 mb-8 sm:mb-10 lg:mb-12 max-w-3xl font-medium leading-relaxed drop-shadow-lg"
        >
          {{ subheadline }}
        </p>

        <!-- Call to Action -->
        <div v-if="ctaText" class="hero-cta">
          <NuxtLink
            :to="ctaLink"
            class="cta-button group relative inline-flex items-center justify-center gap-2 px-8 py-4 sm:px-10 sm:py-5 text-base sm:text-lg font-bold text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 rounded-xl shadow-2xl shadow-primary-900/50 hover:shadow-primary-800/60 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-primary-400/50 focus:ring-offset-2 focus:ring-offset-transparent active:scale-95"
          >
            <span>{{ ctaText }}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </NuxtLink>
        </div>

        <!-- Slot for additional content -->
        <slot />
      </div>
    </div>
  </section>
</template>

<style scoped>
  .hero-section {
    position: relative;
    isolation: isolate;
  }

  /* Background Image Animation */
  .hero-background {
    transform: scale(1);
    transition: transform 8s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .hero-section:hover .hero-background {
    transform: scale(1.1);
  }

  /* Overlay with smooth transition */
  .hero-overlay {
    transition: opacity 0.4s ease-in-out;
  }

  /* Content Fade-in Animation */
  .hero-content {
    transition:
      opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1),
      transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .hero-hidden {
    opacity: 0;
    transform: translateY(30px);
  }

  .hero-visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* Typography Enhancements */
  .hero-headline {
    line-height: 1.1;
    letter-spacing: -0.03em;
    text-wrap: balance;
    animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
  }

  .hero-subheadline {
    line-height: 1.6;
    text-wrap: balance;
    animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s both;
  }

  .hero-cta {
    animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.6s both;
  }

  /* CTA Button Enhancements */
  .cta-button {
    position: relative;
    overflow: hidden;
  }

  .cta-button::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      transparent 0%,
      rgba(255, 255, 255, 0.1) 50%,
      transparent 100%
    );
    transform: translateX(-100%);
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .cta-button:hover::before {
    transform: translateX(100%);
  }

  /* Animations */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Responsive adjustments */
  @media (max-width: 640px) {
    .hero-headline {
      line-height: 1.2;
      letter-spacing: -0.02em;
    }

    .hero-background {
      transform: scale(1.1); /* Start slightly zoomed on mobile for better composition */
    }

    .hero-section:hover .hero-background {
      transform: scale(1.15);
    }
  }

  @media (min-width: 1024px) {
    .hero-headline {
      line-height: 1.05;
    }
  }

  /* Accessibility - Reduced Motion */
  @media (prefers-reduced-motion: reduce) {
    .hero-background,
    .hero-content,
    .hero-headline,
    .hero-subheadline,
    .hero-cta,
    .cta-button {
      animation: none;
      transition-duration: 0.01ms !important;
    }

    .cta-button::before {
      display: none;
    }
  }
</style>
