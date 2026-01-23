<template>
  <Section inner-classes="p-4 py-12">
    <div class="max-w-7xl mx-auto">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-4xl lg:text-5xl mb-4 text-text-primary">Our Products</h1>
        <p class="text-lg text-text-secondary">
          Browse our complete collection of custom stickers and printing solutions
        </p>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Desktop Sidebar Filters -->
        <aside class="hidden lg:block w-64 flex-shrink-0" aria-label="Product filters">
          <div class="sticky top-24 space-y-6">
            <!-- Search -->
            <div class="filter-section">
              <h3 class="filter-heading">Search</h3>
              <div class="relative">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search products..."
                  class="w-full px-4 py-2.5 pl-10 rounded-lg border-2 border-border-default focus:border-accent-500 focus:outline-none bg-surface-base text-text-primary transition-colors duration-200"
                  aria-label="Search products"
                />
                <Icon
                  name="i-lucide-search"
                  size="18"
                  class="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
                  aria-hidden="true"
                />
              </div>
            </div>

            <!-- Category Filter -->
            <div class="filter-section">
              <h3 class="filter-heading">Category</h3>
              <div class="space-y-2">
                <button
                  v-for="category in categories"
                  :key="category.value"
                  @click="toggleCategory(category.value)"
                  class="filter-option w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200"
                  :class="
                    selectedCategories.includes(category.value)
                      ? 'bg-accent-700 text-text-inverse'
                      : 'bg-surface-raised hover:bg-surface-sunken text-text-primary'
                  "
                  :aria-pressed="selectedCategories.includes(category.value)"
                >
                  <span class="flex items-center gap-2">
                    <Icon :name="category.icon" size="18" aria-hidden="true" />
                    <span class="font-medium">{{ category.label }}</span>
                  </span>
                  <Icon
                    v-if="selectedCategories.includes(category.value)"
                    name="i-lucide-check"
                    size="18"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>

            <!-- Tags Filter -->
            <div class="filter-section">
              <h3 class="filter-heading">Tags</h3>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="tag in availableTags"
                  :key="tag"
                  @click="toggleTag(tag)"
                  class="filter-tag px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
                  :class="
                    selectedTags.includes(tag)
                      ? 'bg-accent-700 text-text-inverse'
                      : 'bg-surface-raised hover:bg-surface-sunken text-text-primary border border-border-subtle'
                  "
                  :aria-pressed="selectedTags.includes(tag)"
                >
                  {{ formatTag(tag) }}
                </button>
              </div>
            </div>

            <!-- Clear Filters -->
            <button
              v-if="hasActiveFilters"
              @click="clearFilters"
              class="w-full px-4 py-2.5 rounded-lg font-medium text-error-500 hover:bg-error-50 border border-error-500 transition-colors duration-200"
            >
              Clear All Filters
            </button>
          </div>
        </aside>

        <!-- Main Content -->
        <div class="flex-1 min-w-0">
          <!-- Mobile Filter Button & Sort -->
          <div class="lg:hidden flex items-center gap-3 mb-6">
            <!-- Mobile Filter Button -->
            <Button
              variant="outline"
              size="md"
              :full-width="false"
              rounded="lg"
              icon-left="i-lucide-filter"
              @click="showMobileFilters = true"
              class="flex-1"
            >
              Filters
              <span
                v-if="activeFilterCount > 0"
                class="ml-2 px-2 py-0.5 bg-accent-700 text-text-inverse text-xs font-bold rounded-full"
              >
                {{ activeFilterCount }}
              </span>
            </Button>

            <!-- Sort Dropdown -->
            <div class="relative flex-1">
              <button
                @click="showSortDropdown = !showSortDropdown"
                class="w-full px-4 py-2.5 rounded-lg border-2 border-border-default bg-surface-base text-text-primary font-medium flex items-center justify-between hover:border-accent-500 transition-colors duration-200"
                :aria-expanded="showSortDropdown"
                aria-label="Sort products"
              >
                <span class="flex items-center gap-2">
                  <Icon name="i-lucide-arrow-up-down" size="18" aria-hidden="true" />
                  Sort
                </span>
                <Icon
                  name="i-lucide-chevron-down"
                  size="18"
                  class="transition-transform duration-200"
                  :class="{ 'rotate-180': showSortDropdown }"
                  aria-hidden="true"
                />
              </button>
              <div
                v-show="showSortDropdown"
                class="absolute z-10 mt-2 w-full bg-surface-raised rounded-lg shadow-xl border border-border-subtle py-2"
              >
                <button
                  v-for="option in sortOptions"
                  :key="option.value"
                  @click="selectSort(option.value)"
                  class="w-full px-4 py-2.5 text-left hover:bg-surface-sunken transition-colors duration-200 flex items-center justify-between"
                  :class="
                    sortBy === option.value ? 'text-accent-700 font-medium' : 'text-text-primary'
                  "
                >
                  {{ option.label }}
                  <Icon
                    v-if="sortBy === option.value"
                    name="i-lucide-check"
                    size="18"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>

          <!-- Desktop Sort & Results Count -->
          <div class="hidden lg:flex items-center justify-between mb-6">
            <p class="text-text-secondary">
              Showing
              <span class="font-bold text-text-primary">{{ filteredProducts.length }}</span>
              of
              <span class="font-bold text-text-primary">{{ products.length }}</span>
              {{ filteredProducts.length === 1 ? "product" : "products" }}
            </p>
            <div class="relative">
              <button
                @click="showSortDropdown = !showSortDropdown"
                class="px-4 py-2 rounded-lg border-2 border-border-default bg-surface-base text-text-primary font-medium flex items-center gap-2 hover:border-accent-500 transition-colors duration-200"
                :aria-expanded="showSortDropdown"
                aria-label="Sort products"
              >
                <Icon name="i-lucide-arrow-up-down" size="18" aria-hidden="true" />
                Sort: {{ currentSortLabel }}
                <Icon
                  name="i-lucide-chevron-down"
                  size="16"
                  class="transition-transform duration-200"
                  :class="{ 'rotate-180': showSortDropdown }"
                  aria-hidden="true"
                />
              </button>
              <div
                v-show="showSortDropdown"
                class="absolute right-0 z-10 mt-2 w-56 bg-surface-raised rounded-lg shadow-xl border border-border-subtle py-2"
              >
                <button
                  v-for="option in sortOptions"
                  :key="option.value"
                  @click="selectSort(option.value)"
                  class="w-full px-4 py-2.5 text-left hover:bg-surface-sunken transition-colors duration-200 flex items-center justify-between"
                  :class="
                    sortBy === option.value ? 'text-accent-700 font-medium' : 'text-text-primary'
                  "
                >
                  {{ option.label }}
                  <Icon
                    v-if="sortBy === option.value"
                    name="i-lucide-check"
                    size="18"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>

          <!-- Products Grid -->
          <div
            v-if="filteredProducts.length > 0"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            role="list"
          >
            <ProductCard
              v-for="product in sortedProducts"
              :key="product.id"
              :product="product"
              variant="default"
              :show-tags="true"
              :max-tags="2"
              :show-featured-badge="false"
            />
          </div>

          <!-- Empty State -->
          <div
            v-else
            class="text-center py-16 bg-surface-raised rounded-lg border border-border-subtle"
          >
            <Icon name="i-lucide-search-x" size="64" class="text-text-tertiary mx-auto mb-4" />
            <h2 class="text-2xl font-bold text-text-primary mb-2">No products found</h2>
            <p class="text-text-secondary mb-6">Try adjusting your filters or search query</p>
            <Button variant="primary" size="md" rounded="lg" @click="clearFilters">
              Clear Filters
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Filter Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showMobileFilters"
          class="fixed inset-0 z-50 lg:hidden"
          @click.self="showMobileFilters = false"
        >
          <!-- Backdrop -->
          <div
            class="absolute inset-0 bg-black/50 backdrop-blur-sm"
            @click="showMobileFilters = false"
          ></div>

          <!-- Filter Panel -->
          <div
            class="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-surface-base shadow-2xl overflow-y-auto"
          >
            <!-- Header -->
            <div
              class="sticky top-0 z-10 bg-surface-base border-b border-border-subtle px-6 py-4 flex items-center justify-between"
            >
              <h2 class="text-xl font-bold text-text-primary">Filters</h2>
              <button
                @click="showMobileFilters = false"
                class="p-2 hover:bg-surface-sunken rounded-lg transition-colors duration-200"
                aria-label="Close filters"
              >
                <Icon name="i-lucide-x" size="24" class="text-text-primary" />
              </button>
            </div>

            <!-- Filter Content -->
            <div class="p-6 space-y-6">
              <!-- Search -->
              <div class="filter-section">
                <h3 class="filter-heading">Search</h3>
                <div class="relative">
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Search products..."
                    class="w-full px-4 py-2.5 pl-10 rounded-lg border-2 border-border-default focus:border-accent-500 focus:outline-none bg-surface-base text-text-primary transition-colors duration-200"
                    aria-label="Search products"
                  />
                  <Icon
                    name="i-lucide-search"
                    size="18"
                    class="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
                    aria-hidden="true"
                  />
                </div>
              </div>

              <!-- Category Filter -->
              <div class="filter-section">
                <h3 class="filter-heading">Category</h3>
                <div class="space-y-2">
                  <button
                    v-for="category in categories"
                    :key="category.value"
                    @click="toggleCategory(category.value)"
                    class="filter-option w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200"
                    :class="
                      selectedCategories.includes(category.value)
                        ? 'bg-accent-700 text-text-inverse'
                        : 'bg-surface-raised hover:bg-surface-sunken text-text-primary'
                    "
                    :aria-pressed="selectedCategories.includes(category.value)"
                  >
                    <span class="flex items-center gap-2">
                      <Icon :name="category.icon" size="18" aria-hidden="true" />
                      <span class="font-medium">{{ category.label }}</span>
                    </span>
                    <Icon
                      v-if="selectedCategories.includes(category.value)"
                      name="i-lucide-check"
                      size="18"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>

              <!-- Tags Filter -->
              <div class="filter-section">
                <h3 class="filter-heading">Tags</h3>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="tag in availableTags"
                    :key="tag"
                    @click="toggleTag(tag)"
                    class="filter-tag px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
                    :class="
                      selectedTags.includes(tag)
                        ? 'bg-accent-700 text-text-inverse'
                        : 'bg-surface-raised hover:bg-surface-sunken text-text-primary border border-border-subtle'
                    "
                    :aria-pressed="selectedTags.includes(tag)"
                  >
                    {{ formatTag(tag) }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div
              class="sticky bottom-0 bg-surface-base border-t border-border-subtle px-6 py-4 flex gap-3"
            >
              <Button
                v-if="hasActiveFilters"
                variant="outline"
                size="md"
                :full-width="true"
                rounded="lg"
                @click="clearFilters"
              >
                Clear All
              </Button>
              <Button
                variant="primary"
                size="md"
                :full-width="true"
                rounded="lg"
                @click="showMobileFilters = false"
              >
                Show {{ filteredProducts.length }} Products
              </Button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </Section>
</template>

<script setup lang="ts">
  import { products } from "~/data/products";

  // SEO Meta Tags
  useSeoMeta({
    title: "Custom Sticker Products | Browse All Styles - TLP",
    description:
      "Browse die-cut, kiss-cut, circle stickers & sheets. Premium waterproof vinyl with fast delivery. Find your perfect custom sticker today!",
    ogTitle: "Custom Sticker Products | Browse All Styles",
    ogDescription:
      "Explore die-cut, kiss-cut, and specialty stickers. Professional quality, waterproof vinyl, fast turnaround, competitive pricing.",
    ogImage: "/og-products.jpg",
    ogType: "website",
    twitterCard: "summary_large_image",
    twitterTitle: "Custom Stickers | All Products - TLP",
    twitterDescription:
      "Browse die-cut, kiss-cut, circles & sheets. Premium waterproof vinyl stickers with fast delivery and professional quality.",
  });

  // Structured Data - Product Catalog
  useHead({
    script: [
      {
        type: "application/ld+json",
        innerHTML: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Custom Sticker Products",
          description:
            "Browse our complete collection of custom stickers including die-cut, kiss-cut, circle stickers, and sticker sheets",
          url: "https://thelegendaryprints.com/products",
          mainEntity: {
            "@type": "ItemList",
            itemListElement: products.map((product, index) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "Product",
                name: product.name,
                description: product.description,
                image: product.thumbnailImg,
                url: `https://thelegendaryprints.com/products/${product.slug}`,
              },
            })),
          },
        }),
      },
    ],
  });

  // Filter state
  const searchQuery = ref("");
  const selectedCategories = ref<string[]>([]);
  const selectedTags = ref<string[]>([]);
  const sortBy = ref<string>("name-asc");
  const showMobileFilters = ref(false);
  const showSortDropdown = ref(false);

  // Categories configuration
  const categories = [
    { value: "die-cut", label: "Die Cut", icon: "i-lucide-sticker" },
    { value: "kiss-cut", label: "Kiss Cut", icon: "i-lucide-scissors" },
    { value: "shapes", label: "Shapes", icon: "i-lucide-circle" },
    { value: "sheets", label: "Sheets", icon: "i-lucide-palette" },
  ];

  // Sort options
  const sortOptions = [
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "featured", label: "Featured" },
  ];

  // Get all available tags from products
  const availableTags = computed(() => {
    const tags = new Set<string>();
    products.forEach((product) => {
      product.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  });

  // Filter products
  const filteredProducts = computed(() => {
    let filtered = products;

    // Search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.tags.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    // Category filter
    if (selectedCategories.value.length > 0) {
      filtered = filtered.filter((product) => selectedCategories.value.includes(product.category));
    }

    // Tags filter
    if (selectedTags.value.length > 0) {
      filtered = filtered.filter((product) =>
        selectedTags.value.some((tag) => product.tags.includes(tag)),
      );
    }

    return filtered;
  });

  // Sort products
  const sortedProducts = computed(() => {
    const sorted = [...filteredProducts.value];

    switch (sortBy.value) {
      case "name-asc":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case "featured":
        return sorted.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return a.name.localeCompare(b.name);
        });
      default:
        return sorted;
    }
  });

  // Current sort label
  const currentSortLabel = computed(() => {
    return sortOptions.find((opt) => opt.value === sortBy.value)?.label || "Name (A-Z)";
  });

  // Check if filters are active
  const hasActiveFilters = computed(() => {
    return (
      searchQuery.value !== "" ||
      selectedCategories.value.length > 0 ||
      selectedTags.value.length > 0
    );
  });

  // Active filter count for mobile badge
  const activeFilterCount = computed(() => {
    return selectedCategories.value.length + selectedTags.value.length;
  });

  // Filter actions
  const toggleCategory = (category: string) => {
    const index = selectedCategories.value.indexOf(category);
    if (index > -1) {
      selectedCategories.value.splice(index, 1);
    } else {
      selectedCategories.value.push(category);
    }
  };

  const toggleTag = (tag: string) => {
    const index = selectedTags.value.indexOf(tag);
    if (index > -1) {
      selectedTags.value.splice(index, 1);
    } else {
      selectedTags.value.push(tag);
    }
  };

  const clearFilters = () => {
    searchQuery.value = "";
    selectedCategories.value = [];
    selectedTags.value = [];
  };

  const selectSort = (value: string) => {
    sortBy.value = value;
    showSortDropdown.value = false;
  };

  // Format tag display (for filter buttons)
  const formatTag = (tag: string) => {
    return tag
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Close dropdowns on click outside
  if (import.meta.client) {
    onMounted(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!target.closest("[aria-expanded]")) {
          showSortDropdown.value = false;
        }
      };
      document.addEventListener("click", handleClickOutside);
      onUnmounted(() => {
        document.removeEventListener("click", handleClickOutside);
      });
    });
  }
</script>

<style scoped>
  .filter-section {
    @apply bg-surface-raised p-4 rounded-lg border border-border-subtle;
  }

  .filter-heading {
    @apply text-sm font-bold text-text-primary mb-3 uppercase tracking-wide;
  }

  .filter-option {
    @apply transition-all duration-200;
  }

  .filter-tag {
    @apply transition-all duration-200;
  }

  /* Modal transitions */
  .modal-enter-active,
  .modal-leave-active {
    transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;
  }

  .modal-enter-active .absolute:not(.inset-0),
  .modal-leave-active .absolute:not(.inset-0) {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .modal-enter-from .absolute:not(.inset-0),
  .modal-leave-to .absolute:not(.inset-0) {
    transform: translateX(100%);
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .filter-option,
    .filter-tag,
    .modal-enter-active,
    .modal-leave-active {
      transition-duration: 0.01ms !important;
    }
  }
</style>
