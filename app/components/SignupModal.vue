<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isVisible"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
        @click="handleClose"
      >
        <Transition
          enter-active-class="transition-transform duration-300"
          leave-active-class="transition-transform duration-300"
          enter-from-class="scale-95 opacity-0"
          leave-to-class="scale-95 opacity-0"
        >
          <div
            v-if="isVisible"
            class="relative max-w-md w-full bg-surface-raised rounded-2xl shadow-2xl p-8"
            @click.stop
          >
            <!-- Close Button -->
            <button
              @click="handleClose"
              class="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Close modal"
            >
              <Icon name="i-lucide-x" size="24" />
            </button>

            <!-- Content -->
            <div class="text-center">
              <!-- Icon/Logo -->
              <div class="mb-6">
                <div
                  class="w-20 h-20 mx-auto bg-neutral-800 rounded-full flex items-center justify-center"
                >
                  <Icon name="i-lucide-percent" size="40" class="text-white" />
                </div>
              </div>

              <!-- Title -->
              <h2 class="text-3xl font-bold text-text-primary mb-4">
                Get 20% Off Your First Order!
              </h2>

              <!-- Description -->
              <p class="text-text-secondary mb-6">
                Subscribe to our newsletter and receive an exclusive 20% discount code for your first
                purchase.
              </p>

              <!-- Form -->
              <form @submit.prevent="handleSubmit" class="space-y-4">
                <div class="flex flex-col gap-3">
                  <input
                    v-model="firstName"
                    type="text"
                    placeholder="First name"
                    class="w-full px-4 py-3 rounded-lg border-2 border-border-default focus:border-magenta focus:outline-none bg-surface-base text-text-primary transition-colors duration-200"
                    aria-label="First name"
                  />
                  <input
                    v-model="lastName"
                    type="text"
                    placeholder="Last name"
                    class="w-full px-4 py-3 rounded-lg border-2 border-border-default focus:border-magenta focus:outline-none bg-surface-base text-text-primary transition-colors duration-200"
                    aria-label="Last name"
                  />
                  <input
                    v-model="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    class="w-full px-4 py-3 rounded-lg border-2 border-border-default focus:border-magenta focus:outline-none bg-surface-base text-text-primary transition-colors duration-200"
                    aria-label="Email address"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  rounded="lg"
                  :disabled="isSubscribing"
                  class="w-full"
                >
                  {{ isSubscribing ? "Subscribing..." : "Claim My Discount" }}
                </Button>
              </form>

              <!-- Error/Success Message -->
              <p
                v-if="message"
                class="mt-4 text-sm"
                :class="success ? 'text-success-500' : 'text-error-500'"
              >
                {{ message }}
              </p>

              <!-- No Thanks Link -->
              <button
                @click="handleClose"
                class="mt-4 text-sm text-text-tertiary hover:text-text-secondary transition-colors"
              >
                No thanks, I'll pay full price
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
  const isVisible = ref(false);
  const email = ref("");
  const firstName = ref("");
  const lastName = ref("");
  const isSubscribing = ref(false);
  const message = ref("");
  const success = ref(false);

  const toast = useToast();

  // Check if user has already seen the modal
  const hasSeenModal = ref(false);

  const handleSubmit = async () => {
    if (!email.value || !email.value.includes("@")) {
      success.value = false;
      message.value = "Please enter a valid email address";
      return;
    }

    isSubscribing.value = true;
    message.value = "";

    try {
      await $fetch("/api/newsletter/subscribe", {
        method: "POST",
        body: {
          email: email.value,
          firstName: firstName.value,
          lastName: lastName.value,
        },
      });

      success.value = true;
      message.value = "Success! Check your email for your 20% discount code.";
      toast.success("Welcome! Your discount code is on its way!");

      // Close modal after 2 seconds
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error: any) {
      success.value = false;
      message.value = error.data?.message || "Something went wrong. Please try again.";
      toast.error("Failed to subscribe");
    } finally {
      isSubscribing.value = false;
    }
  };

  const handleClose = () => {
    isVisible.value = false;
    // Store in localStorage so modal doesn't show again this session
    if (typeof window !== "undefined") {
      localStorage.setItem("signupModalSeen", "true");
    }
  };

  onMounted(() => {
    // Check if user has seen the modal before
    if (typeof window !== "undefined") {
      hasSeenModal.value = localStorage.getItem("signupModalSeen") === "true";
    }

    // Show modal after 1 second if not seen before
    if (!hasSeenModal.value) {
      setTimeout(() => {
        isVisible.value = true;
      }, 1000);
    }
  });
</script>

<style scoped>
  /* Ensure modal appears above everything */
  [data-teleport] {
    position: relative;
    z-index: 9999;
  }
</style>
