<template>
  <div class="font-pairing-switcher relative">
    <Button
      variant="ghost"
      size="sm"
      rounded="lg"
      icon="i-lucide-type"
      icon-size="20"
      label="Change fonts"
      @click="isOpen = !isOpen"
    />

    <Transition name="slide-fade">
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 bg-surface-raised border-2 border-border-default rounded-lg shadow-xl p-4 w-80 z-50"
      >
        <h3 class="text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
          <Icon name="i-lucide-type" size="20" />
          Font Pairings
        </h3>

        <div class="space-y-3">
          <!-- Pair 1: Friendly & Approachable -->
          <button
            @click="selectPairing('pair1')"
            class="w-full text-left p-4 rounded-lg border-2 transition-all"
            :class="
              currentPairing === 'pair1'
                ? 'border-accent-700 bg-accent-50'
                : 'border-border-default hover:border-accent-500 bg-surface-base'
            "
          >
            <div class="font-pair-1-heading text-lg font-bold text-text-primary mb-1">
              Friendly & Approachable
            </div>
            <div class="font-pair-1-body text-sm text-text-secondary">
              Comfortaa + Lora — Classic warmth with professional readability
            </div>
          </button>

          <!-- Pair 2: Warm & Clean -->
          <button
            @click="selectPairing('pair2')"
            class="w-full text-left p-4 rounded-lg border-2 transition-all"
            :class="
              currentPairing === 'pair2'
                ? 'border-accent-700 bg-accent-50'
                : 'border-border-default hover:border-accent-500 bg-surface-base'
            "
          >
            <div class="font-pair-2-heading text-lg font-bold text-text-primary mb-1">
              Warm & Clean
            </div>
            <div class="font-pair-2-body text-sm text-text-secondary">
              Clash Display + Inter — Community craft feel with modern crispness
            </div>
          </button>

          <!-- Pair 3: Trustworthy & Down-to-Earth -->
          <button
            @click="selectPairing('pair3')"
            class="w-full text-left p-4 rounded-lg border-2 transition-all"
            :class="
              currentPairing === 'pair3'
                ? 'border-accent-700 bg-accent-50'
                : 'border-border-default hover:border-accent-500 bg-surface-base'
            "
          >
            <div class="font-pair-3-heading text-lg font-bold text-text-primary mb-1">
              Trustworthy & Down-to-Earth
            </div>
            <div class="font-pair-3-body text-sm text-text-secondary">
              Martel Sans + Source Serif Pro — Professional craft with story
            </div>
          </button>
        </div>

        <div class="mt-4 pt-3 border-t border-border-subtle text-xs text-text-tertiary">
          Click a pairing to preview across the site
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
  const isOpen = ref(false);
  const currentPairing = ref<"pair1" | "pair2" | "pair3">("pair1");

  const selectPairing = (pairing: "pair1" | "pair2" | "pair3") => {
    currentPairing.value = pairing;

    // Apply font pairing to document root
    const root = document.documentElement;
    root.setAttribute("data-font-pairing", pairing);

    // Store preference
    localStorage.setItem("fontPairing", pairing);

    // Close dropdown
    isOpen.value = false;
  };

  // Load saved preference on mount
  onMounted(() => {
    const saved = localStorage.getItem("fontPairing") as "pair1" | "pair2" | "pair3" | null;
    if (saved) {
      currentPairing.value = saved;
      document.documentElement.setAttribute("data-font-pairing", saved);
    }
  });
</script>

<style scoped>
  /* Pair 1 Preview Fonts */
  .font-pair-1-heading {
    font-family: "Comfortaa", cursive;
  }

  .font-pair-1-body {
    font-family: "Lora", serif;
  }

  /* Pair 2 Preview Fonts */
  .font-pair-2-heading {
    font-family: "Clash Display", sans-serif;
  }

  .font-pair-2-body {
    font-family: "Inter", sans-serif;
  }

  /* Pair 3 Preview Fonts */
  .font-pair-3-heading {
    font-family: "Martel Sans", sans-serif;
  }

  .font-pair-3-body {
    font-family: "Source Serif Pro", serif;
  }

  /* Transitions */
  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition: all 0.2s ease;
  }

  .slide-fade-enter-from {
    opacity: 0;
    transform: translateY(-10px);
  }

  .slide-fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }
</style>
