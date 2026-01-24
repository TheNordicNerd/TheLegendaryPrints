<template>
  <div class="overflow-x-auto">
    <table class="min-w-full border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-100">
          <th class="border border-gray-300 px-4 py-2 text-left">Quantity</th>
          <th
            v-for="size in sizes"
            :key="size"
            class="border border-gray-300 px-4 py-2 text-center"
          >
            {{ size }}"
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="tier in tiers" :key="tier.minQuantity">
          <td class="border border-gray-300 px-4 py-2 font-semibold">
            {{ tier.label }}
            <span v-if="tier.discountPercent > 0" class="text-green-600 text-sm ml-2">
              ({{ tier.discountPercent }}% off)
            </span>
          </td>
          <td
            v-for="size in sizes"
            :key="size"
            class="border border-gray-300 px-4 py-2 text-center"
          >
            {{ formatPrice(calculatePrice(size, tier.minQuantity)) }}
          </td>
        </tr>
      </tbody>
    </table>
    <p class="text-sm text-gray-600 mt-2">
      * Prices shown are per sticker. Minimum order: 20 stickers.
    </p>
  </div>
</template>

<script setup lang="ts">
const { calculatePricePerUnit, formatPrice, getAvailableSizes, getQuantityTiers } = usePricing();

const sizes = getAvailableSizes();
const tiers = getQuantityTiers();

const calculatePrice = (size: number, quantity: number) => {
  return calculatePricePerUnit(size, quantity);
};
</script>
