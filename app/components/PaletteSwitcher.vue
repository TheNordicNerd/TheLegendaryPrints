<template>
  <div class="relative palette-switcher-container">
    <!-- Palette Toggle Button -->
    <Button
      variant="ghost"
      size="sm"
      rounded="lg"
      icon="i-lucide-palette"
      icon-size="20"
      label="Change palette"
      @click="toggleDropdown"
    />

    <!-- Dropdown Menu -->
    <Transition name="dropdown">
      <div
        v-show="isOpen"
        class="absolute right-0 top-full mt-2 w-72 bg-surface-raised rounded-lg shadow-xl border border-border-subtle overflow-hidden z-50"
        @click.stop
      >
        <!-- Header -->
        <div class="px-4 py-3 bg-surface-sunken border-b border-border-subtle">
          <h3 class="text-sm font-semibold text-text-primary">Color Palette</h3>
          <p class="text-xs text-text-tertiary mt-1">Choose your preferred color scheme</p>
        </div>

        <!-- Palette Options -->
        <div class="p-2 space-y-2 max-h-[400px] overflow-y-auto">
          <button
            v-for="palette in palettes"
            :key="palette.id"
            @click="selectPalette(palette.id)"
            class="w-full text-left p-3 rounded-md transition-all hover:bg-surface-sunken"
            :class="{
              'bg-primary-50 border-2 border-primary-500': currentPalette === palette.id,
              'border-2 border-transparent': currentPalette !== palette.id,
            }"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="font-medium text-sm text-text-primary">{{ palette.name }}</span>
              <Icon
                v-if="currentPalette === palette.id"
                name="i-lucide-check-circle"
                size="20"
                class="text-primary-500"
              />
            </div>

            <!-- Color Swatches -->
            <div class="flex gap-1.5">
              <div
                v-for="(color, index) in palette.colors"
                :key="index"
                class="w-8 h-8 rounded border border-border-default shadow-sm"
                :style="{ backgroundColor: color.hex }"
                :title="color.name"
              />
            </div>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
  const palettes = [
    {
      id: "classic",
      name: "Classic Print Shop",
      colors: [
        { name: "Charcoal Black", hex: "#1E1E1E" },
        { name: "Soft White", hex: "#FAFAF8" },
        { name: "Warm Paper Tan", hex: "#D6CBB8" },
        { name: "Steel Gray", hex: "#6B6E70" },
      ],
    },
    {
      id: "modern",
      name: "Modern Local Business",
      colors: [
        { name: "Graphite", hex: "#242424" },
        { name: "Cool Off-White", hex: "#f9f9f9" },
        { name: "Dusty Blue", hex: "#5F7D8C" },
        { name: "Concrete Gray", hex: "#B7B9BC" },
      ],
    },
    {
      id: "ink",
      name: "Ink & Paper",
      colors: [
        { name: "Ink Black", hex: "#1A1A1A" },
        { name: "Paper White", hex: "#FEFEFE" },
        { name: "Oxide Red", hex: "#8C3B2F" },
        { name: "Warm Gray", hex: "#8A8A86" },
      ],
    },
  ];

  const currentPalette = ref("classic");
  const isOpen = ref(false);

  const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
  };

  const selectPalette = (paletteId: string) => {
    currentPalette.value = paletteId;
    isOpen.value = false; // Close dropdown after selection

    // Update the data-palette attribute on the document root
    if (import.meta.client) {
      document.documentElement.setAttribute("data-palette", paletteId);
      // Store preference in localStorage
      localStorage.setItem("color-palette", paletteId);
    }
  };

  // Close dropdown when clicking outside
  if (import.meta.client) {
    onMounted(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!target.closest(".palette-switcher-container")) {
          isOpen.value = false;
        }
      };

      document.addEventListener("click", handleClickOutside);
      onUnmounted(() => {
        document.removeEventListener("click", handleClickOutside);
      });
    });
  }

  // Initialize palette from localStorage on mount
  onMounted(() => {
    if (import.meta.client) {
      const saved = localStorage.getItem("color-palette");
      if (saved && palettes.some((p) => p.id === saved)) {
        currentPalette.value = saved;
        document.documentElement.setAttribute("data-palette", saved);
      } else {
        selectPalette("classic");
      }
    }
  });
</script>

<style scoped>
  /* Dropdown transition */
  .dropdown-enter-active,
  .dropdown-leave-active {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .dropdown-enter-from,
  .dropdown-leave-to {
    opacity: 0;
    transform: translateY(-8px);
  }

  .dropdown-enter-to,
  .dropdown-leave-from {
    opacity: 1;
    transform: translateY(0);
  }
</style>
