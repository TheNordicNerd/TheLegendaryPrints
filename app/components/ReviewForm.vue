<template>
  <div class="bg-surface-raised rounded-2xl p-6 shadow-sm">
    <h3 class="text-2xl font-bold text-text-primary mb-6">Write a Review</h3>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Rating -->
      <div>
        <label class="block text-sm font-semibold text-text-primary mb-2">
          Rating <span class="text-error-500">*</span>
        </label>
        <div class="flex gap-2">
          <button
            v-for="star in 5"
            :key="star"
            type="button"
            @click="form.rating = star"
            @mouseenter="hoverRating = star"
            @mouseleave="hoverRating = 0"
            class="transition-all duration-200"
          >
            <Icon
              name="i-lucide-star"
              size="32"
              :class="
                star <= (hoverRating || form.rating) ? 'text-yellow' : 'text-border-default'
              "
            />
          </button>
        </div>
        <p v-if="errors.rating" class="text-error-500 text-sm mt-1">{{ errors.rating }}</p>
      </div>

      <!-- Name -->
      <div>
        <label for="name" class="block text-sm font-semibold text-text-primary mb-2">
          Name <span class="text-error-500">*</span>
        </label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          placeholder="Your name"
          class="w-full px-4 py-2 rounded-lg border border-border-default bg-surface-base text-text-primary focus:outline-none focus:ring-2 focus:ring-magenta"
          :class="{ 'border-error-500': errors.name }"
        />
        <p v-if="errors.name" class="text-error-500 text-sm mt-1">{{ errors.name }}</p>
      </div>

      <!-- Email -->
      <div>
        <label for="email" class="block text-sm font-semibold text-text-primary mb-2">
          Email <span class="text-error-500">*</span>
        </label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          placeholder="your.email@example.com"
          class="w-full px-4 py-2 rounded-lg border border-border-default bg-surface-base text-text-primary focus:outline-none focus:ring-2 focus:ring-magenta"
          :class="{ 'border-error-500': errors.email }"
        />
        <p v-if="errors.email" class="text-error-500 text-sm mt-1">{{ errors.email }}</p>
      </div>

      <!-- Review Title -->
      <div>
        <label for="title" class="block text-sm font-semibold text-text-primary mb-2">
          Review Title (Optional)
        </label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          placeholder="Summarize your experience"
          class="w-full px-4 py-2 rounded-lg border border-border-default bg-surface-base text-text-primary focus:outline-none focus:ring-2 focus:ring-magenta"
        />
      </div>

      <!-- Review Body -->
      <div>
        <label for="body" class="block text-sm font-semibold text-text-primary mb-2">
          Review <span class="text-error-500">*</span>
        </label>
        <textarea
          id="body"
          v-model="form.body"
          rows="4"
          placeholder="Tell us about your experience with this product"
          class="w-full px-4 py-2 rounded-lg border border-border-default bg-surface-base text-text-primary focus:outline-none focus:ring-2 focus:ring-magenta resize-none"
          :class="{ 'border-error-500': errors.body }"
        ></textarea>
        <p v-if="errors.body" class="text-error-500 text-sm mt-1">{{ errors.body }}</p>
      </div>

      <!-- Submit Button -->
      <div class="flex gap-4">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          :full-width="true"
          rounded="lg"
          :disabled="submitting"
          icon-right="i-lucide-send"
        >
          {{ submitting ? "Submitting..." : "Submit Review" }}
        </Button>
      </div>

      <!-- Success Message -->
      <div
        v-if="successMessage"
        class="bg-success-50 border border-success-500 text-success-900 px-4 py-3 rounded-lg"
        role="alert"
      >
        <div class="flex items-center gap-3">
          <Icon name="i-lucide-check-circle" size="20" />
          <span>{{ successMessage }}</span>
        </div>
      </div>

      <!-- Error Message -->
      <div
        v-if="errorMessage"
        class="bg-error-50 border border-error-500 text-error-900 px-4 py-3 rounded-lg"
        role="alert"
      >
        <div class="flex items-center gap-3">
          <Icon name="i-lucide-alert-circle" size="20" />
          <span>{{ errorMessage }}</span>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
  import type { SubmitReviewData } from "~/composables/useJudgeMe";

  interface Props {
    productHandle?: string;
    productId?: string;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<{
    reviewSubmitted: [];
  }>();

  const { submitReview } = useJudgeMe();

  const form = reactive<{
    rating: number;
    name: string;
    email: string;
    title: string;
    body: string;
  }>({
    rating: 0,
    name: "",
    email: "",
    title: "",
    body: "",
  });

  const hoverRating = ref(0);
  const errors = reactive<Record<string, string>>({});
  const submitting = ref(false);
  const successMessage = ref("");
  const errorMessage = ref("");

  const validateForm = () => {
    // Clear previous errors
    Object.keys(errors).forEach((key) => delete errors[key]);

    let isValid = true;

    if (!form.rating) {
      errors.rating = "Please select a rating";
      isValid = false;
    }

    if (!form.name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    }

    if (!form.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!form.body.trim()) {
      errors.body = "Review text is required";
      isValid = false;
    } else if (form.body.trim().length < 10) {
      errors.body = "Review must be at least 10 characters long";
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async () => {
    // Clear messages
    successMessage.value = "";
    errorMessage.value = "";

    // Validate form
    if (!validateForm()) {
      return;
    }

    submitting.value = true;

    try {
      const reviewData: SubmitReviewData = {
        rating: form.rating,
        name: form.name.trim(),
        email: form.email.trim(),
        body: form.body.trim(),
        productHandle: props.productHandle,
        productId: props.productId,
      };

      if (form.title.trim()) {
        reviewData.title = form.title.trim();
      }

      const response = await submitReview(reviewData);

      if (response.success) {
        successMessage.value =
          response.message || "Review submitted successfully! It will appear after moderation.";

        // Reset form
        form.rating = 0;
        form.name = "";
        form.email = "";
        form.title = "";
        form.body = "";

        // Emit event to parent
        emit("reviewSubmitted");

        // Scroll to success message
        setTimeout(() => {
          const successEl = document.querySelector('[role="alert"]');
          if (successEl) {
            successEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
        }, 100);
      }
    } catch (error: any) {
      errorMessage.value = error.message || "Failed to submit review. Please try again.";
    } finally {
      submitting.value = false;
    }
  };
</script>

<style scoped></style>
