<template>
  <div class="group w-full bg-yellow duration-300 text-neutral py-3 px-4 hover-grow">
    <NuxtLink to="/products" class="p-0 m-0 flex w-full">
      <div class="max-w-7xl mx-auto text-center">
        <p class="text-sm md:text-base font-accent duration-300">
          <Icon
            name="i-lucide-truck"
            size="18"
            class="duration-300 group-hover:animate-bounce inline-block mr-2 align-text-bottom"
          />
          Free shipping on orders over $100
        </p>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
