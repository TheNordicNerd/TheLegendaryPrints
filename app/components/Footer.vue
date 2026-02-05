<template>
  <footer class="relative bg-black px-4">
    <!-- Main Footer Content -->
    <div class="py-12 pt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Links and Social -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div class="hidden lg:inline">
            <NuxtImg src="/LP - Logo.png" class="w-48" />
          </div>
          <!-- Company -->
          <div>
            <FooterSection :column="columnOne" />
          </div>

          <!-- Shop -->
          <div>
            <FooterSection :column="columnTwo" />
          </div>
        </div>

        <!-- Social Media -->

        <!-- Bottom Bar -->
        <div class="pt-8 border-t border-border-subtle">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <!-- Copyright -->
            <div class="flex flex-col items-center md:items-start gap-1">
              <p class="text-xs text-text-disabled text-center md:text-left">
                © {{ currentYear }} {{ businessConfig.name }}. All rights reserved.
              </p>
              <a
                href="https://thenordicnerd.com"
                target="_blank"
                rel="noopener noreferrer"
                class="text-[10px] text-text-disabled hover:text-text-tertiary transition-colors duration-200 text-center md:text-left"
              >
                Forged by The Nordic Nerd
              </a>
            </div>

            <div class="flex justify-end gap-6">
              <a
                :href="businessConfig.social.facebook"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                class="text-text-disabled hover:text-text-tertiary transition-colors duration-200"
              >
                <Icon name="i-lucide-facebook" size="24" />
              </a>
              <a
                :href="businessConfig.social.instagram"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                class="text-text-disabled hover:text-text-tertiary transition-colors duration-200"
              >
                <Icon name="i-lucide-instagram" size="24" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
  import businessConfig from "~/config/businessConfig";

  const currentYear = new Date().getFullYear();
  interface Link {
    title: string;
    link: string;
  }
  interface FooterSection {
    title: string;
    links: Array<Link>;
  }
  const columnOne: Array<FooterSection> = [
    {
      title: "Company",
      links: [
        {
          title: "About Us",
          link: "/about",
        },
        {
          title: "Contact",
          link: "/contact",
        },
      ],
    },
    {
      title: "Legal",
      links: [
        {
          title: "Privacy Policy",
          link: "/privacy-policy",
        },
        {
          title: "Refund Policy",
          link: "/refund-policy",
        },
        {
          title: "Terms Of Service",
          link: "/terms-of-service",
        },
      ],
    },
  ];

  const columnTwo: Array<FooterSection> = [
    {
      title: "Shop",
      links: [
        {
          title: "All Products",
          link: "/products",
        },
        {
          title: "Best Sellers",
          link: "/collections/best-sellers",
        },
        {
          title: "Custom Stickers",
          link: "/collections/custom-stickers",
        },
      ],
    },
    {
      title: "Connect",
      links: [
        {
          title: "Email Us",
          link: `mailto:${businessConfig.email}`,
        },
        {
          title: businessConfig.phone,
          link: `tel:${businessConfig.phoneFormatted}`,
        },
        {
          title: businessConfig.address.full,
          link: businessConfig.googleMapsUrl,
        },
      ],
    },
  ];
</script>

<style scoped>
  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    a,
    button {
      transition-duration: 0.01ms !important;
    }
  }
</style>
