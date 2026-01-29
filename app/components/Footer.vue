<template>
  <footer class="relative bg-surface-base px-4">
    <!-- Newsletter Section -->
    <div class="relative pt-12 z-50 sm:pt-28 md:pt-32 pb-12">
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-surface-raised shadow-lg py-8 rounded-lg border border-border-subtle"
      >
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-3xl sm:text-4xl font-bold text-text-primary mb-6">
            Subscribe to Our Newsletter
          </h2>
          <p class="text-text-secondary mb-8">
            Stay updated with our latest products and exclusive offers
          </p>
          <form
            @submit.prevent="handleSubscribe"
            class="flex flex-col gap-3 max-w-xl mx-auto"
          >
            <div class="flex flex-col sm:flex-row gap-3">
              <input
                v-model="firstName"
                type="text"
                placeholder="First name"
                class="flex-1 px-6 py-3.5 rounded-lg border-2 border-border-default focus:border-accent-500 focus:outline-none bg-surface-base text-text-primary transition-colors duration-200"
                aria-label="First name"
              />
              <input
                v-model="lastName"
                type="text"
                placeholder="Last name"
                class="flex-1 px-6 py-3.5 rounded-lg border-2 border-border-default focus:border-accent-500 focus:outline-none bg-surface-base text-text-primary transition-colors duration-200"
                aria-label="Last name"
              />
            </div>
            <div class="flex flex-col sm:flex-row gap-3">
              <input
                v-model="email"
                type="email"
                placeholder="Enter your email"
                required
                class="flex-1 px-6 py-3.5 rounded-lg border-2 border-border-default focus:border-accent-500 focus:outline-none bg-surface-base text-text-primary transition-colors duration-200"
                aria-label="Email address"
              />
              <Button
                type="submit"
                variant="primary"
                size="md"
                rounded="lg"
                :disabled="isSubscribing"
                class="sm:w-auto"
              >
                {{ isSubscribing ? "Subscribing..." : "Subscribe Now" }}
              </Button>
            </div>
          </form>
          <p
            v-if="subscribeMessage"
            class="mt-4 text-sm"
            :class="subscribeSuccess ? 'text-success-500' : 'text-error-500'"
          >
            {{ subscribeMessage }}
          </p>
        </div>
      </div>
    </div>

    <!-- Main Footer Content -->
    <div class="bg-surface-base py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Links and Social -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <!-- Company -->
          <div>
            <h3 class="text-sm font-bold text-text-primary uppercase tracking-wide mb-4">
              Company
            </h3>
            <ul class="space-y-3">
              <li>
                <NuxtLink
                  to="/about"
                  class="text-text-secondary hover:text-accent-700 transition-colors duration-200"
                >
                  About Us
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/contact"
                  class="text-text-secondary hover:text-accent-700 transition-colors duration-200"
                >
                  Contact
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Shop -->
          <div>
            <h3 class="text-sm font-bold text-text-primary uppercase tracking-wide mb-4">Shop</h3>
            <ul class="space-y-3">
              <li>
                <NuxtLink
                  to="/products"
                  class="text-text-secondary hover:text-accent-700 transition-colors duration-200"
                >
                  All Products
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/products?category=die-cut"
                  class="text-text-secondary hover:text-accent-700 transition-colors duration-200"
                >
                  Die Cut Stickers
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/products?category=kiss-cut"
                  class="text-text-secondary hover:text-accent-700 transition-colors duration-200"
                >
                  Kiss Cut Stickers
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/cart"
                  class="text-text-secondary hover:text-accent-700 transition-colors duration-200"
                >
                  Shopping Cart
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Connect -->
          <div>
            <h3 class="text-sm font-bold text-text-primary uppercase tracking-wide mb-4">
              Connect
            </h3>
            <ul class="space-y-3">
              <li>
                <a
                  href="mailto:hello@thelegendaryprints.com"
                  class="text-text-secondary hover:text-accent-700 transition-colors duration-200"
                >
                  Email Us
                </a>
              </li>
              <li>
                <a
                  href="tel:+15551234567"
                  class="text-text-secondary hover:text-accent-700 transition-colors duration-200"
                >
                  (407) 476-4413
                </a>
              </li>
              <li>
                <a
                  href="https://maps.google.com/?q=40+N+Charles+Richard+Beall+Blvd,+DeBary,+FL+32713"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-text-secondary hover:text-accent-700 transition-colors duration-200 block"
                >
                  <span class="block">40 N Charles Richard Beall Blvd</span>
                  <span class="block">DeBary, FL 32713</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Social Media -->
        <div class="flex justify-center gap-6 mb-12">
          <a
            href="https://facebook.com/thelegendaryprints"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            class="text-text-secondary hover:text-accent-700 transition-colors duration-200"
          >
            <Icon name="i-lucide-facebook" size="24" />
          </a>
          <a
            href="https://instagram.com/thelegendaryprints"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            class="text-text-secondary hover:text-accent-700 transition-colors duration-200"
          >
            <Icon name="i-lucide-instagram" size="24" />
          </a>
        </div>

        <!-- Bottom Bar -->
        <div class="pt-8 border-t border-border-subtle">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <!-- Copyright -->
            <div class="flex flex-col items-center md:items-start gap-1">
              <p class="text-xs text-text-secondary text-center md:text-left">
                © {{ currentYear }} The Legendary Prints. All rights reserved.
              </p>
              <a
                href="https://thenordicnerd.com"
                target="_blank"
                rel="noopener noreferrer"
                class="text-[10px] text-text-tertiary hover:text-accent-700 transition-colors duration-200 text-center md:text-left"
              >
                Forged by The Nordic Nerd
              </a>
            </div>

            <!-- Legal Links -->
            <div class="flex items-center gap-6 text-sm text-text-secondary">
              <span>Terms & Privacy Coming Soon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
  const email = ref("");
  const firstName = ref("");
  const lastName = ref("");
  const isSubscribing = ref(false);
  const subscribeMessage = ref("");
  const subscribeSuccess = ref(false);

  const currentYear = new Date().getFullYear();

  const toast = useToast();

  const handleSubscribe = async () => {
    if (!email.value || !email.value.includes('@')) {
      subscribeSuccess.value = false;
      subscribeMessage.value = "Please enter a valid email address";
      return;
    }

    isSubscribing.value = true;
    subscribeMessage.value = "";

    try {
      await $fetch('/api/newsletter/subscribe', {
        method: 'POST',
        body: {
          email: email.value,
          firstName: firstName.value,
          lastName: lastName.value,
        },
      });

      subscribeSuccess.value = true;
      subscribeMessage.value = "Successfully subscribed! Check your email for confirmation.";
      toast.success('Welcome to The Legendary Prints newsletter!');
      email.value = "";
      firstName.value = "";
      lastName.value = "";

      // Clear message after 5 seconds
      setTimeout(() => {
        subscribeMessage.value = "";
      }, 5000);
    } catch (error: any) {
      subscribeSuccess.value = false;
      subscribeMessage.value = error.data?.message || "Something went wrong. Please try again.";
      toast.error('Failed to subscribe to newsletter');
    } finally {
      isSubscribing.value = false;
    }
  };
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
