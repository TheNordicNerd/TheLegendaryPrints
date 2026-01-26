<template>
  <Section inner-classes="p-4 py-12">
    <div class="max-w-2xl mx-auto text-center">
      <div class="mb-6">
        <Icon
          name="i-lucide-check-circle"
          size="64"
          class="text-success-500 mx-auto mb-4"
        />
      </div>

      <h1 class="text-4xl lg:text-5xl mb-4 text-text-primary">Order Received!</h1>

      <p class="text-lg text-text-secondary mb-8">
        Thank you for your order. We've received your custom sticker order and will review it shortly.
      </p>

      <div class="bg-surface-raised p-6 rounded-lg border-2 border-accent-700 mb-8">
        <h2 class="text-2xl font-bold mb-4 text-text-primary">What's Next?</h2>
        <div class="text-left space-y-4">
          <div class="flex gap-4">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 rounded-full bg-accent-700 text-text-inverse flex items-center justify-center font-bold">
                1
              </div>
            </div>
            <div>
              <h3 class="font-bold text-text-primary mb-1">Order Review</h3>
              <p class="text-text-secondary text-sm">
                Our team will review your custom design and order details.
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 rounded-full bg-accent-700 text-text-inverse flex items-center justify-center font-bold">
                2
              </div>
            </div>
            <div>
              <h3 class="font-bold text-text-primary mb-1">Payment Link</h3>
              <p class="text-text-secondary text-sm">
                You'll receive a secure payment link via email within 24 hours.
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 rounded-full bg-accent-700 text-text-inverse flex items-center justify-center font-bold">
                3
              </div>
            </div>
            <div>
              <h3 class="font-bold text-text-primary mb-1">Production & Delivery</h3>
              <p class="text-text-secondary text-sm">
                After payment, we'll start production and ship within 3-5 business days.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          variant="primary"
          size="lg"
          rounded="lg"
          to="/products"
          icon-left="i-lucide-package"
        >
          Continue Shopping
        </Button>

        <Button
          variant="outline"
          size="lg"
          rounded="lg"
          to="/"
          icon-left="i-lucide-home"
        >
          Back to Home
        </Button>
      </div>

      <div class="mt-8 p-4 bg-surface-sunken rounded-lg border border-border-subtle">
        <p class="text-sm text-text-secondary">
          <Icon name="i-lucide-mail" class="inline mr-2" />
          Check your email for order confirmation and payment instructions.
        </p>
      </div>
    </div>
  </Section>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Order Confirmation | Thank You',
  robots: 'noindex, nofollow'
});
</script>
