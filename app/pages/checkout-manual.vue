<template>
  <Section inner-classes="p-4 py-12">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-4xl lg:text-5xl mb-4 text-text-primary">Complete Your Order</h1>
      <p class="text-text-secondary mb-8">
        We'll review your custom order and send you a secure payment link within 24 hours.
      </p>

      <!-- Order Summary -->
      <div class="bg-surface-raised p-6 rounded-lg border border-border-subtle mb-6">
        <h2 class="text-2xl font-bold mb-4 text-text-primary">Order Summary</h2>
        <div
          v-for="item in items"
          :key="item.id"
          class="flex justify-between items-start py-3 border-b border-border-subtle last:border-b-0"
        >
          <div class="flex-1">
            <p class="font-medium text-text-primary">{{ item.productName }}</p>
            <p class="text-sm text-text-secondary">Size: {{ item.customSize || item.size }}"</p>
            <p class="text-sm text-text-secondary">
              Quantity: {{ (item.customQuantity || item.quantity).toLocaleString() }}
            </p>
            <p class="text-sm text-text-secondary capitalize">Material: {{ item.material }}</p>
          </div>
          <div class="text-right">
            <p class="font-bold text-accent-700">${{ item.totalPrice.toFixed(2) }}</p>
          </div>
        </div>
        <div class="pt-4 mt-4 border-t-2 border-border-default">
          <div class="flex justify-between items-center">
            <span class="text-lg font-bold text-text-primary">Total:</span>
            <span class="text-2xl font-black text-accent-700">{{ formattedTotalPrice }}</span>
          </div>
        </div>
      </div>

      <!-- Customer Information Form -->
      <form
        @submit.prevent="handleSubmit"
        class="bg-surface-raised p-6 rounded-lg border border-border-subtle"
      >
        <h2 class="text-2xl font-bold mb-4 text-text-primary">Your Information</h2>

        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-text-secondary mb-2">
              Full Name *
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="w-full px-4 py-3 rounded-lg border-2 border-border-default focus:border-accent-500 focus:outline-none bg-surface-base text-text-primary"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-text-secondary mb-2">
              Email Address *
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-3 rounded-lg border-2 border-border-default focus:border-accent-500 focus:outline-none bg-surface-base text-text-primary"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-text-secondary mb-2">
              Phone Number
            </label>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              class="w-full px-4 py-3 rounded-lg border-2 border-border-default focus:border-accent-500 focus:outline-none bg-surface-base text-text-primary"
              placeholder="(555) 123-4567"
            />
          </div>

          <div>
            <label for="notes" class="block text-sm font-medium text-text-secondary mb-2">
              Order Notes (Optional)
            </label>
            <textarea
              id="notes"
              v-model="form.notes"
              rows="3"
              class="w-full px-4 py-3 rounded-lg border-2 border-border-default focus:border-accent-500 focus:outline-none bg-surface-base text-text-primary"
              placeholder="Any special instructions..."
            ></textarea>
          </div>
        </div>

        <div class="mt-6 p-4 bg-surface-sunken rounded-lg border border-border-subtle">
          <p class="text-sm text-text-secondary">
            <Icon name="i-lucide-info" class="inline mr-2" />
            After submitting, we'll review your order and email you a secure payment link within 24
            hours.
          </p>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          :full-width="true"
          rounded="lg"
          :disabled="isSubmitting"
          icon-right="i-lucide-send"
          class="mt-6"
        >
          {{ isSubmitting ? "Submitting..." : "Submit Order" }}
        </Button>
      </form>
    </div>
  </Section>
</template>

<script setup lang="ts">
  const cart = useUnifiedCart();
  const { items, formattedTotalPrice } = cart;
  const router = useRouter();
  const toast = useToast();

  const form = ref({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  const isSubmitting = ref(false);

  const handleSubmit = async () => {
    isSubmitting.value = true;

    try {
      const response = await $fetch("/api/orders/submit", {
        method: "POST",
        body: {
          customerName: form.value.name,
          customerEmail: form.value.email,
          customerPhone: form.value.phone,
          notes: form.value.notes,
          items: items.value.map((item) => ({
            productName: item.productName,
            variantId: item.id,
            size: item.customSize || item.size,
            quantity: item.customQuantity || item.quantity,
            material: item.material,
            pricePerUnit: item.pricePerUnit,
            totalPrice: item.totalPrice,
            uploadedImage: item.uploadedImage,
            uploadedFileName: item.uploadedFileName,
          })),
          subtotal: formattedTotalPrice.value,
        },
      });

      // Clear cart
      await cart.clearCart();

      // Show success message
      toast.success("Order submitted successfully! Check your email for payment instructions.");

      // Redirect to confirmation page
      router.push("/order-confirmation");
    } catch (error: any) {
      toast.error("Failed to submit order. Please try again.");
      console.error("Order submission error:", error);
    } finally {
      isSubmitting.value = false;
    }
  };

  // SEO
  useSeoMeta({
    title: "Checkout | Complete Your Order",
    robots: "noindex, nofollow",
  });
</script>
