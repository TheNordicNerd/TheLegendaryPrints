<template>
  <div class="flex items-start justify-between lg:inline">
    <div v-for="(links, index) in column" class="w-full lg:w-1/2">
      <div>
        <h3
          class="text-sm font-bold text-text-inverse uppercase tracking-wide mb-4"
          :class="index > 0 && 'lg:mt-8'"
        >
          {{ links.title }}
        </h3>
        <ul class="space-y-3">
          <li v-for="link in links.links" class="flex items-start gap-2">
            <Icon
              v-if="link.icon"
              :name="link.icon"
              size="20"
              class="text-text-disabled flex-shrink-0"
            />
            <NuxtLink
              :to="link.link"
              class="text-text-disabled hover:text-text-tertiary transition-colors duration-200"
            >
              {{ link.title }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface Link {
    title?: string;
    icon?: string;
    link: string;
  }
  interface FooterSection {
    title: string;
    links: Array<Link>;
  }

  defineProps<{ column: FooterSection[] }>();
</script>

<style scoped></style>
