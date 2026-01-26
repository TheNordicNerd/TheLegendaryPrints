<template>
  <NuxtLink
    :to="to"
    v-slot="{ isActive }"
    :class="[
      isDropDownChild
        ? 'dropdown-item flex group items-center gap-3 text-neutral-800 px-4 py-3 text-sm font-medium hover:bg-accent-500/10 hover:text-accent-500 transition-colors duration-150'
        : 'nav-link flex group items-center gap-2 px-3 text-neutral-800 py-2 font-semibold hover:text-accent-500 transition-colors duration-200',
    ]"
    active-class="text-primary-400"
  >
    <Icon
      v-if="icon"
      :name="icon"
      size="18"
      class="group-hover:text-accent-500"
      :class="isActive && 'text-primary-400'"
    />
    {{ text }}
    <Icon
      v-if="isDropDown"
      name="i-lucide-chevron-down"
      size="16"
      class="transition-transform duration-200"
      :class="{ 'rotate-180': activeDropdown === text }"
    />
  </NuxtLink>
</template>

<script setup lang="ts">
  interface NavLinkProps {
    to: string;
    icon?: string;
    text: string;
    isDropDown?: boolean;
    isDropDownChild?: boolean;
    activeDropdown?: string | null;
  }
  const props = withDefaults(defineProps<NavLinkProps>(), {
    isDropDown: false,
    isDropDownChild: false,
    activeDropdown: null,
  });
</script>

<style scoped></style>
