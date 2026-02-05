<template>
  <div class="marquee-container bg-neutral-900 w-full overflow-hidden">
    <div class="marquee-track border-t-2 border-neutral-800 py-4">
      <div class="marquee-content">
        <!-- Your content goes here (text, images, logos, etc.) -->
        <div v-for="(item, itemIdx) in marquee" :key="`item-${itemIdx}`" class="marquee-item">
          <Icon :name="item.icon" class="text-yellow" size="36" />
          <h2 class="text-neutral-50 text-2xl font-medium whitespace-nowrap">{{ item.text }}</h2>
        </div>
      </div>
      <div class="marquee-content">
        <!-- Duplicate content to ensure a seamless loop -->
        <div v-for="(item, itemIdx) in marquee" :key="`item-${itemIdx}`" class="marquee-item">
          <Icon :name="item.icon" class="text-yellow" size="36" />
          <h2 class="text-neutral-50 text-2xl font-medium whitespace-nowrap">{{ item.text }}</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const marquee = [
    {
      text: "Free Shipping",
      icon: "i-icon-park-twotone-transporter",
    },
    {
      text: "100% Satisfaction Guarantee",
      icon: "i-icon-park-twotone-badge-two",
    },
    {
      text: "Premium Quality",
      icon: "i-icon-park-twotone-five-star-badge",
    },
    {
      text: "Fast Turnaround",
      icon: "i-icon-park-twotone-flash-payment",
    },
    {
      text: "Custom Designs",
      icon: "i-icon-park-twotone-graphic-design",
    },
  ];
</script>

<style scoped>
  /* Container styles to hide overflow */
  .marquee-container {
    overflow: hidden;
    /* Adjust height and width as needed */
    width: 100%;
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
</style>
