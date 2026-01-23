<template>
  <nav aria-label="Breadcrumb" class="breadcrumb-nav">
    <ol class="flex items-center gap-2 text-sm">
      <li v-for="(item, index) in breadcrumbs" :key="item.path" class="flex items-center gap-2">
        <!-- Home icon for first item -->
        <NuxtLink
          v-if="index === 0"
          :to="item.path"
          class="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors duration-200"
          :aria-current="index === breadcrumbs.length - 1 ? 'page' : undefined"
        >
          <Icon name="i-lucide-home" size="16" />
          <span class="font-medium">{{ item.name }}</span>
        </NuxtLink>

        <!-- Regular breadcrumb items -->
        <template v-else>
          <!-- Separator -->
          <Icon name="i-lucide-chevron-right" size="16" class="text-text-tertiary" />

          <!-- Last item (current page) - not clickable -->
          <span
            v-if="index === breadcrumbs.length - 1"
            class="font-semibold text-text-primary"
            aria-current="page"
          >
            {{ item.name }}
          </span>

          <!-- Intermediate items - clickable -->
          <NuxtLink
            v-else
            :to="item.path"
            class="font-medium text-text-secondary hover:text-accent transition-colors duration-200"
          >
            {{ item.name }}
          </NuxtLink>
        </template>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
  /**
   * Breadcrumb Component
   *
   * Displays navigation breadcrumbs showing the current page hierarchy.
   * Can accept manual items or auto-generate from the current route.
   *
   * @component
   */

  interface BreadcrumbItem {
    name: string;
    path: string;
  }

  interface Props {
    /** Manual breadcrumb items. If not provided, will auto-generate from route */
    items?: BreadcrumbItem[];
  }

  const props = defineProps<Props>();
  const route = useRoute();

  const breadcrumbs = computed<BreadcrumbItem[]>(() => {
    // If manual items provided, use those
    if (props.items && props.items.length > 0) {
      return props.items;
    }

    // Auto-generate from route
    const pathSegments = route.path.split("/").filter(Boolean);
    const items: BreadcrumbItem[] = [
      { name: "Home", path: "/" }, // Always include home
    ];

    let currentPath = "";
    for (const segment of pathSegments) {
      currentPath += `/${segment}`;

      // Format segment name (capitalize, replace hyphens with spaces)
      const name = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      items.push({
        name,
        path: currentPath,
      });
    }

    return items;
  });
</script>

<style scoped>
  .breadcrumb-nav {
    padding: 1rem 0;
  }

  /* Accessibility - Focus visible */
  a:focus-visible {
    outline: 2px solid var(--color-border-focus);
    outline-offset: 2px;
    border-radius: 0.25rem;
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    a {
      transition-duration: 0.01ms !important;
    }
  }
</style>
