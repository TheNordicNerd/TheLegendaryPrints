<template>
  <div class="newsletter-signup">
    <h3 class="text-lg font-bold text-text-primary mb-2">Stay in the Loop</h3>
    <p class="text-sm text-text-secondary mb-4">
      Get exclusive deals, design tips, and new product updates.
    </p>

    <form @submit.prevent="handleSubmit" class="space-y-3">
      <div class="relative">
        <input
          v-model="email"
          type="email"
          placeholder="your@email.com"
          required
          :disabled="loading || success"
          class="w-full px-4 py-2.5 rounded-lg border-2 border-border-default focus:border-accent-500 focus:outline-none bg-surface-base text-text-primary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Email address"
        />
        <Icon
          v-if="success"
          name="i-lucide-check-circle"
          size="20"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-success-500"
          aria-hidden="true"
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="md"
        :full-width="true"
        rounded="lg"
        :disabled="loading || success"
        class="font-medium"
      >
        <span v-if="loading">Subscribing...</span>
        <span v-else-if="success">Subscribed! ✓</span>
        <span v-else>Subscribe</span>
      </Button>

      <p v-if="error" class="text-sm text-error-500" role="alert">
        {{ error }}
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
const email = ref('');
const loading = ref(false);
const success = ref(false);
const error = ref('');

const toast = useToast();

const handleSubmit = async () => {
  if (!email.value || !email.value.includes('@')) {
    error.value = 'Please enter a valid email address';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    await $fetch('/api/newsletter/subscribe', {
      method: 'POST',
      body: { email: email.value },
    });

    success.value = true;
    toast.success('Successfully subscribed to newsletter!');

    // Reset form after 3 seconds
    setTimeout(() => {
      email.value = '';
      success.value = false;
    }, 3000);
  } catch (err: any) {
    error.value = err.data?.message || 'Failed to subscribe. Please try again.';
    toast.error('Failed to subscribe to newsletter');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.newsletter-signup {
  max-width: 400px;
}

@media (prefers-reduced-motion: reduce) {
  input,
  button {
    transition-duration: 0.01ms !important;
  }
}
</style>
