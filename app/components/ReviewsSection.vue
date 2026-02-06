<template>
  <Section inner-classes="p-4 py-12" outer-classes="bg-surface-sunken" class="reviews-section">
    <div class="max-w-7xl mx-auto">
      <div
        class="flex flex-col gap-6 mb-8"
        :class="showWriteButton ? 'lg:flex-row lg:items-center lg:justify-between' : 'items-center'"
      >
        <div class="flex-1" :class="showWriteButton ? 'text-center lg:text-left' : 'text-center'">
          <h2 class="text-3xl lg:text-4xl font-bold text-text-primary mb-2">{{ props.title }}</h2>
          <p class="text-lg text-text-secondary">
            {{
              props.description ||
              (displayReviewCount > 0 ? `${displayReviewCount} reviews` : "No reviews yet")
            }}
          </p>
        </div>
        <div v-if="showWriteButton" class="flex-shrink-0 text-center lg:text-right">
          <Button
            @click="showForm = !showForm"
            variant="primary"
            size="lg"
            rounded="lg"
            :icon-left="showForm ? 'i-lucide-x' : 'i-lucide-pencil'"
          >
            {{ showForm ? "Cancel" : "Write a Review" }}
          </Button>
        </div>
      </div>

      <!-- Review Form -->
      <div v-if="showForm && showWriteButton" class="mb-8">
        <ReviewForm
          :product-handle="props.productHandle"
          :product-id="props.productId"
          @review-submitted="handleReviewSubmitted"
        />
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="space-y-6">
        <SkeletonLoader v-for="i in perPage" :key="i" type="review" />
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="bg-error-50 border border-error-500 text-error-900 px-6 py-4 rounded-lg"
        role="alert"
      >
        <div class="flex items-center gap-3">
          <Icon name="i-lucide-alert-circle" size="24" />
          <div>
            <strong class="font-bold">Error:</strong>
            <span class="block sm:inline ml-2">{{ error }}</span>
          </div>
        </div>
      </div>

      <!-- Average Rating -->
      <div v-else-if="displayReviewCount > 0" class="mb-8">
        <div class="flex items-center justify-center gap-4 mb-2">
          <div class="flex gap-1">
            <Icon
              v-for="(filled, index) in renderStars(Math.round(displayAverageRating))"
              :key="index"
              :name="
                filled ? 'i-material-symbols-family-star' : 'i-material-symbols-kid-star-outline'
              "
              size="24"
              :class="filled ? 'text-yellow' : 'text-border-default'"
            />
          </div>
          <span class="text-2xl font-bold text-text-primary">{{
            displayAverageRating.toFixed(1)
          }}</span>
        </div>
        <p class="font-accent text-3xl text-center text-text-secondary">
          Based on {{ displayReviewCount }} reviews
        </p>
      </div>

      <!-- Reviews Carousel -->
      <div v-if="reviews.length > 0" class="relative">
        <!-- Carousel Container -->
        <div class="overflow-hidden">
          <div
            class="flex transition-transform duration-500 ease-out"
            :style="{ transform: `translateX(-${carouselIndex * carouselItemWidth}%)` }"
          >
            <div
              v-for="review in reviews"
              :key="review.id"
              class="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-3"
            >
              <div class="bg-surface-raised rounded-xl shadow-sm flex flex-col min-h-[180px]">
                <!-- Image Header Banner -->
                <div
                  v-if="review.pictures && review.pictures.length > 0 && review.pictures[0]"
                  class="relative h-32 bg-neutral-100 rounded-t-xl flex items-center justify-center overflow-hidden"
                >
                  <NuxtImg
                    :src="review.pictures[0]!.urls.original"
                    :alt="`Review image from ${review.reviewer.name}`"
                    class="w-full object-cover rounded-lg shadow-md cursor-pointer hover:scale-105 transition-transform"
                    loading="lazy"
                    quality="90"
                    @click="openImageModal(review.pictures[0]!.urls.original)"
                  />
                </div>

                <!-- Review Content -->
                <div class="p-4 flex-1 flex flex-col">
                  <!-- Review Header -->
                  <div class="flex items-start justify-between mb-3">
                    <div>
                      <div class="flex items-center gap-2 mb-1">
                        <p class="font-bold text-text-primary text-sm">
                          {{ review.reviewer.name }}
                        </p>
                        <span
                          v-if="review.verified_buyer"
                          class="text-xs bg-success-100 text-success-900 px-2 py-0.5 rounded-full"
                        >
                          Verified
                        </span>
                      </div>
                      <p class="text-xs text-text-tertiary">
                        {{ formatDate(review.created_at) }}
                      </p>
                    </div>
                    <div class="flex gap-0.5">
                      <Icon
                        v-for="(filled, index) in renderStars(review.rating)"
                        :key="index"
                        :name="
                          filled
                            ? 'i-material-symbols-family-star'
                            : 'i-material-symbols-kid-star-outline'
                        "
                        size="14"
                        :class="filled ? 'text-yellow' : 'text-border-default'"
                      />
                    </div>
                  </div>

                  <!-- Review Title -->
                  <h3
                    v-if="review.title"
                    class="font-semibold text-text-primary mb-2 text-sm line-clamp-1"
                  >
                    {{ review.title }}
                  </h3>

                  <!-- Review Body -->
                  <div class="flex-1">
                    <p
                      class="text-text-secondary leading-relaxed text-sm"
                      :class="
                        expandedReviews[review.id]
                          ? ''
                          : review.body.length > 100
                            ? 'line-clamp-1'
                            : ''
                      "
                    >
                      {{ review.body }}
                    </p>
                    <button
                      v-if="review.body.length > 80"
                      @click="toggleReviewExpansion(review.id)"
                      class="text-cyan hover:text-accent-800 text-sm font-medium mt-1"
                    >
                      {{ expandedReviews[review.id] ? "Show Less" : "Show More" }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Arrows -->
        <div
          v-if="reviews.length > itemsPerView"
          class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10"
        >
          <Button
            @click="previousSlide"
            icon="i-lucide-chevron-left"
            icon-size="24"
            variant="ghost"
            rounded="full"
            class="!bg-surface-raised shadow-lg hover:!bg-neutral-700 hover:!text-white"
            aria-label="Previous reviews"
            :disabled="carouselIndex === 0"
          />
        </div>
        <div
          v-if="reviews.length > itemsPerView"
          class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10"
        >
          <Button
            @click="nextSlide"
            icon="i-lucide-chevron-right"
            icon-size="24"
            variant="ghost"
            rounded="full"
            class="!bg-surface-raised shadow-lg hover:!bg-neutral-700 hover:!text-white"
            aria-label="Next reviews"
            :disabled="carouselIndex >= maxIndex"
          />
        </div>

        <!-- Carousel Dots -->
        <div v-if="reviews.length > itemsPerView" class="flex justify-center gap-2 mt-6">
          <button
            v-for="(_, index) in maxIndex + 1"
            :key="index"
            @click="carouselIndex = index"
            class="w-2 h-2 rounded-full transition-all duration-300"
            :class="
              carouselIndex === index ? 'bg-magenta w-6' : 'bg-border-default hover:bg-neutral-400'
            "
            :aria-label="`Go to review ${index + 1}`"
          />
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading && displayReviewCount === 0" class="text-center py-12">
        <Icon name="i-lucide-message-square" size="64" class="text-text-tertiary mx-auto mb-4" />
        <h2 class="text-2xl font-bold text-text-primary mb-2">No Reviews Yet</h2>
        <p class="text-text-secondary">
          {{
            props.productHandle || props.productId
              ? "Be the first to review this product!"
              : "Be the first to review our products!"
          }}
        </p>
      </div>

      <!-- Image Modal -->
      <div
        v-if="selectedImage"
        class="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-75 p-4"
        @click="closeImageModal"
      >
        <div class="relative max-w-4xl max-h-[90vh]">
          <button
            @click="closeImageModal"
            class="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            aria-label="Close image"
          >
            <Icon name="i-lucide-x" size="32" />
          </button>
          <NuxtImg
            :src="selectedImage"
            alt="Review image full size"
            class="max-w-full max-h-[90vh] object-contain rounded-lg"
            @click.stop
          />
        </div>
      </div>

      <!-- Pagination -->
      <div
        v-if="pagination && pagination.totalPages > 1"
        class="flex justify-center items-center gap-4 mt-8"
      >
        <Button
          :disabled="pagination.currentPage === 1"
          @click="loadPage(pagination.currentPage - 1)"
          icon="i-lucide-chevron-left"
          variant="secondary"
          size="sm"
        >
          Previous
        </Button>
        <span class="text-text-secondary">
          Page {{ pagination.currentPage }} of {{ pagination.totalPages }}
        </span>
        <Button
          :disabled="pagination.currentPage === pagination.totalPages"
          @click="loadPage(pagination.currentPage + 1)"
          icon-right="i-lucide-chevron-right"
          variant="secondary"
          size="sm"
        >
          Next
        </Button>
      </div>
    </div>
  </Section>
</template>

<script setup lang="ts">
  import type { JudgeMeReview } from "~/composables/useJudgeMe";

  interface Props {
    productHandle?: string;
    productId?: string;
    perPage?: number;
    showWriteButton?: boolean;
    title?: string;
    description?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    perPage: 10,
    showWriteButton: true,
    title: "Customer Reviews",
    description: "",
  });

  const { fetchReviews, fetchAllReviews, formatDate, renderStars } = useJudgeMe();

  const reviews = ref<JudgeMeReview[]>([]);
  const averageRating = ref(0);
  const reviewCount = ref(0);
  const pagination = ref<any>(null);
  const loading = ref(true);
  const error = ref<string | null>(null);
  const currentPage = ref(1);
  const showForm = ref(false);
  const carouselIndex = ref(0);
  const expandedReviews = ref<Record<number, boolean>>({});
  const selectedImage = ref<string | null>(null);

  // Computed property for display count - uses actual array length if API returns 0
  const displayReviewCount = computed(() => {
    return reviewCount.value > 0 ? reviewCount.value : reviews.value.length;
  });

  // Computed property for display rating - calculates from reviews if API returns 0
  const displayAverageRating = computed(() => {
    if (averageRating.value > 0) {
      return averageRating.value;
    }

    // Calculate average from reviews array if API doesn't provide it
    if (reviews.value.length > 0) {
      const sum = reviews.value.reduce((acc, review) => acc + review.rating, 0);
      return sum / reviews.value.length;
    }

    return 0;
  });

  const loadReviews = async (page: number = 1) => {
    loading.value = true;
    error.value = null;

    try {
      // If no productHandle or productId, fetch all reviews
      const result =
        props.productHandle || props.productId
          ? await fetchReviews(props.productHandle, props.productId, page, props.perPage)
          : await fetchAllReviews(page, props.perPage);

      if (result) {
        reviews.value = result.reviews;
        averageRating.value = result.rating;
        reviewCount.value = result.reviewCount;
        pagination.value = result.pagination;
        currentPage.value = page;
      }
    } catch (err: any) {
      console.error("Error loading reviews:", err);
      error.value = err.message || "Failed to load reviews";
    } finally {
      loading.value = false;
    }
  };

  const loadPage = (page: number) => {
    loadReviews(page);

    // Scroll to top of reviews section smoothly
    if (import.meta.client) {
      const reviewsSection = document.querySelector(".reviews-section");
      if (reviewsSection) {
        reviewsSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleReviewSubmitted = () => {
    // Hide the form
    showForm.value = false;

    // Reload reviews to show the new one (if it's approved immediately)
    loadReviews(1);
  };

  const toggleReviewExpansion = (reviewId: number) => {
    expandedReviews.value[reviewId] = !expandedReviews.value[reviewId];
  };

  const openImageModal = (imageUrl: string) => {
    selectedImage.value = imageUrl;
  };

  const closeImageModal = () => {
    selectedImage.value = null;
  };

  // Carousel functionality
  const itemsPerView = computed(() => {
    if (typeof window === "undefined") return 1;
    const width = window.innerWidth;
    if (width >= 1024) return 3; // lg breakpoint
    if (width >= 640) return 2; // sm breakpoint (Tailwind default)
    return 1; // below sm
  });

  const carouselItemWidth = computed(() => {
    return 100 / itemsPerView.value;
  });

  const maxIndex = computed(() => {
    return Math.max(0, reviews.value.length - itemsPerView.value);
  });

  const nextSlide = () => {
    if (carouselIndex.value < maxIndex.value) {
      carouselIndex.value++;
    }
  };

  const previousSlide = () => {
    if (carouselIndex.value > 0) {
      carouselIndex.value--;
    }
  };

  // Reset carousel index when reviews change
  watch(reviews, () => {
    carouselIndex.value = 0;
  });

  // Update items per view on window resize
  if (typeof window !== "undefined") {
    window.addEventListener("resize", () => {
      // Reset to first slide on resize to avoid being out of bounds
      if (carouselIndex.value > maxIndex.value) {
        carouselIndex.value = maxIndex.value;
      }
    });
  }

  onMounted(() => {
    loadReviews();
  });
</script>

<style scoped>
  .line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
