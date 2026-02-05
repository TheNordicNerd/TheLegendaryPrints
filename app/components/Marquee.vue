<template>
  <div class="marquee-container bg-neutral-900 py-4 w-full overflow-hidden">
    <div class="marquee-track">
      <div class="marquee-content">
        <!-- Your content goes here (text, images, logos, etc.) -->
        <div v-for="(item, itemIdx) in marquee" :key="`item-${itemIdx}`" class="marquee-item">
          <Icon :name="item.icon" class="text-white" size="36" />
          <h2 class="text-neutral-50 text-lg font-medium whitespace-nowrap">{{ item.text }}</h2>
        </div>
      </div>
      <div class="marquee-content">
        <!-- Duplicate content to ensure a seamless loop -->
        <div v-for="(item, itemIdx) in marquee" :key="`item-${itemIdx}`" class="marquee-item">
          <Icon :name="item.icon" class="text-white" size="36" />
          <h2 class="text-neutral-50 text-lg font-medium whitespace-nowrap">{{ item.text }}</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const marquee = [
    {
      text: "Free Shipping",
      icon: "i-lucide-truck",
    },
    {
      text: "100% Satisfaction Guarantee",
      icon: "i-lucide-badge-check",
    },
    {
      text: "Premium Quality",
      icon: "i-lucide-award",
    },
    {
      text: "Fast Turnaround",
      icon: "i-lucide-zap",
    },
    {
      text: "Custom Designs",
      icon: "i-lucide-palette",
    },
  ];
</script>

<style scoped>
  /* Container styles to hide overflow */
  .marquee-container {
    overflow: hidden;
    /* Adjust height and width as needed */
    width: 100%;
    padding: 1rem 0;
  }

  /* Track styles to hold the duplicated content side-by-side */
  .marquee-track {
    display: flex;
    width: max-content; /* Ensures the content takes only the space it needs */
    animation: scrolling 30s linear infinite; /* Apply the animation */
  }

  /* Content wrapper styles */
  .marquee-content {
    display: flex;
    gap: 4rem; /* Add space between items */
    /* Ensures items don't shrink */
    flex-shrink: 0;
    padding-left: 4rem;
  }

  /* Individual item styles (optional) */
  .marquee-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem 2rem;
  }

  /* Keyframes for the animation */
  @keyframes scrolling {
    from {
      transform: translateX(0);
    }
    to {
      /* Translate the entire track by half its width, including any gaps */
      transform: translateX(-50%);
    }
  }

  /* Optional: Pause animation on hover */
  .marquee-container:hover .marquee-track {
    animation-play-state: paused;
  }
</style>
