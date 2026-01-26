<template>
  <div class="overflow-x-auto">
    <table class="min-w-full border-collapse border border-border-default">
      <thead>
        <tr class="bg-neutral-100">
          <th class="border border-border-default px-4 py-2 text-left text-text-primary">Quantity</th>
          <th
            v-for="size in sizes"
            :key="size"
            class="border border-border-default px-4 py-2 text-center text-text-primary"
          >
            {{ size }}"
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="tier in tiers" :key="tier.minQuantity">
          <td class="border border-border-default px-4 py-2 font-semibold text-text-primary">
            {{ tier.label }}
            <span v-if="tier.discountPercent > 0" class="text-success-600 text-sm ml-2">
              ({{ tier.discountPercent }}% off)
            </span>
          </td>
          <td
            v-for="size in sizes"
            :key="size"
            class="border border-border-default px-4 py-2 text-center text-text-primary"
          >
            {{ formatPrice(calculatePrice(size, tier.minQuantity)) }}
          </td>
        </tr>
      </tbody>
    </table>
    <p class="text-sm text-text-tertiary mt-2">
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
