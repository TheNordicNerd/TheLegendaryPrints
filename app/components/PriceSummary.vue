<template>
  <div
    class="price-summary bg-surface-raised p-6 rounded-lg border-2 border-accent-700 shadow-lg"
    role="region"
    aria-labelledby="price-estimate-heading"
  >
    <div class="flex items-center justify-between mb-4">
      <h3 id="price-estimate-heading" class="text-xl font-bold text-text-primary">
        Price Estimate
      </h3>
      <Icon
        name="i-lucide-badge-dollar-sign"
        size="24"
        class="text-accent-700"
        aria-hidden="true"
      />
    </div>
    <div class="space-y-2 text-text-secondary mb-4">
      <div v-for="option in options" :key="option.name" class="flex justify-between">
        <p>{{ option.name }}:</p>
        <p class="font-medium text-text-primary">
          {{ getDisplayValue(option.name) }}
        </p>
      </div>
    </div>
    <div class="pt-4 border-t-2 border-border-default">
      <div class="flex items-baseline justify-between">
        <p class="text-lg font-bold text-text-primary">Total:</p>
        <div class="text-right">
          <div class="text-3xl font-black text-accent-700">{{ price }}</div>
          <div class="text-xs text-text-secondary">+ shipping</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface ProductOption {
    name: string;
    type: 'standard' | 'custom';
    values: string[];
    hasCustom: boolean;
  }

  interface Props {
    options: ProductOption[];
    selections: Record<string, string>;
    customValues: Record<string, string>;
    price: string;
  }

  const props = defineProps<Props>();

  // Get display value for summary
  const getDisplayValue = (optionName: string): string => {
    const value = props.selections[optionName];
    if (value === 'Custom' && props.customValues[optionName]) {
      return props.customValues[optionName];
    }
    return value || 'Not selected';
  };
</script>
