<template>
  <Section inner-classes="p-4 py-12 md:py-20" outer-classes="bg-surface-base">
    <div class="max-w-7xl mx-auto">
      <div data-animate="fade-up">
        <SectionHeader
          title="Why Choose The Legendary Prints?"
          description="Professional quality stickers with unbeatable service and lightning-fast delivery"
        />
      </div>

      <!-- Mobile: Carousel -->
      <div class="md:hidden relative px-10">
        <div class="overflow-hidden">
          <div
            class="flex transition-transform duration-300 ease-out mt-4"
            :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
          >
            <div
              v-for="(feature, index) in features"
              :key="index"
              class="w-full flex-shrink-0 px-4"
            >
              <IconFeatureCard
                :icon="feature.icon"
                :title="feature.title"
                :description="feature.description"
                variant="elevated"
              />
            </div>
          </div>
        </div>

        <!-- Navigation Arrows -->
        <div class="absolute left-0 top-1/2 -translate-y-1/2 z-10">
          <Button
            @click="previousSlide"
            icon="i-lucide-chevron-left"
            icon-size="24"
            variant="ghost"
            rounded="full"
            class="!bg-surface-raised shadow-lg hover:!bg-accent-700 hover:!text-white"
            aria-label="Previous slide"
          />
        </div>
        <div class="absolute right-0 top-1/2 -translate-y-1/2 z-10">
          <Button
            @click="nextSlide"
            icon="i-lucide-chevron-right"
            icon-size="24"
            variant="ghost"
            rounded="full"
            class="!bg-surface-raised shadow-lg hover:!bg-accent-700 hover:!text-white"
            aria-label="Next slide"
          />
        </div>

        <!-- Carousel Dots -->
        <div class="flex justify-center gap-2 mt-6">
          <button
            v-for="(_, index) in features"
            :key="index"
            @click="currentSlide = index"
            class="w-2 h-2 rounded-full transition-all duration-300"
            :class="
              currentSlide === index ? 'bg-accent-700 w-6' : 'bg-border-default hover:bg-accent-500'
            "
            :aria-label="`Go to slide ${index + 1}`"
          />
        </div>
      </div>

      <!-- Desktop: Grid -->
      <div class="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8" data-animate-stagger>
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

<script setup lang="ts">
  const currentSlide = ref(0);

  const features = [
    {
      icon: "i-lucide-badge-check",
      title: "Premium Quality",
      description:
        "Professional-grade printing with vibrant colors and waterproof vinyl that lasts for years",
    },
    {
      icon: "i-lucide-zap",
      title: "Fast Turnaround",
      description:
        "Lightning-fast 3-5 day delivery on all orders with free shipping on orders over $50",
    },
    {
      icon: "i-lucide-palette",
      title: "Design Support",
      description:
        "Expert design assistance at no extra cost. Our team helps bring your vision to life",
    },
    {
      icon: "i-lucide-shield-check",
      title: "100% Guarantee",
      description:
        "Not satisfied? We'll remake it or refund you. Your satisfaction is our priority",
    },
  ];

  const nextSlide = () => {
    currentSlide.value = (currentSlide.value + 1) % features.length;
  };

  const previousSlide = () => {
    currentSlide.value = (currentSlide.value - 1 + features.length) % features.length;
  };

  // Auto-advance carousel every 5 seconds
  let intervalId: NodeJS.Timeout | null = null;

  onMounted(() => {
    if (typeof window !== "undefined") {
      intervalId = setInterval(() => {
        nextSlide();
      }, 5000);
    }
  });

  onUnmounted(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  });
</script>

<style scoped></style>
