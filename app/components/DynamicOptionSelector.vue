<template>
  <div class="option-section bg-surface-raised p-6 rounded-lg border border-border-subtle">
    <h3
      :id="`${option.name}-label`"
      class="text-xl font-bold mb-4 text-text-primary flex items-center gap-2"
    >
      <Icon :name="getOptionIcon(option.name)" size="20" aria-hidden="true" />
      {{ option.name }}
    </h3>

    <!-- Option Values - Small Button Group -->
    <div class="flex flex-wrap gap-2" role="group" :aria-labelledby="`${option.name}-label`">
      <button
        v-for="(value, index) in option.values"
        :key="getValueKey(value, index)"
        type="button"
        @click="handleSelect(getValue(value))"
        :aria-label="`Select ${getDisplayLabel(value)}`"
        :aria-pressed="selectedValue === getValue(value)"
        class="option-button px-4 py-2 rounded-lg border-2 transition-all duration-200 font-medium text-sm flex items-center gap-2"
        :class="[
          selectedValue === getValue(value)
            ? 'border-magenta bg-magenta text-text-inverse shadow-md'
            : 'border-border-default hover:border-neutral-400 text-text-primary hover:bg-surface-sunken',
        ]"
      >
        <Icon v-if="getValueIcon(value)" :name="getValueIcon(value)!" size="18" />
        {{ getDisplayLabel(value) }}
      </button>
    </div>

    <!-- Custom Input (if option has custom) -->
    <div
      v-if="option.hasCustom && selectedValue?.toLowerCase() === 'custom'"
      class="mt-4 pt-4 border-t border-border-subtle"
    >
      <label
        :for="`custom-${option.name}-input`"
        class="block text-sm font-medium text-text-secondary mb-2"
      >
        Enter custom {{ option.name.toLowerCase() }}
      </label>
      <input
        :id="`custom-${option.name}-input`"
        :value="customValue"
        @input="handleCustomInput"
        type="text"
        :placeholder="getCustomPlaceholder(option.name)"
        class="w-full px-4 py-3 rounded-lg border-2 border-border-default focus:border-magenta focus:outline-none bg-surface-base text-text-primary transition-colors duration-200"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { formatDisplayValue } from "~/config/customDesignOptions";

  interface ProductOptionValue {
    label: string;
    value: string;
    icon?: string;
  }

  interface ProductOption {
    name: string;
    type: "standard" | "custom";
    values: (string | ProductOptionValue)[];
    hasCustom: boolean;
    isRow?: boolean;
  }

  interface Props {
    option: ProductOption;
    selectedValue?: string;
    customValue?: string;
  }

  interface Emits {
    (e: "update:selectedValue", value: string): void;
    (e: "update:customValue", value: string): void;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<Emits>();

  // Helper to get value from string or object
  const getValue = (value: string | any): string => {
    return typeof value === "string" ? value : value.value;
  };

  // Helper to get display label
  const getDisplayLabel = (value: string | any): string => {
    if (typeof value === "string") {
      return formatDisplayValue(props.option.name, value);
    }
    return value.label;
  };

  // Helper to get icon
  const getValueIcon = (value: string | any): string | undefined => {
    return typeof value === "string" ? undefined : value.icon;
  };

  // Helper for unique keys
  const getValueKey = (value: string | any, index: number): string => {
    const baseValue = typeof value === "string" ? value : value.value;
    return `${baseValue}-${index}`;
  };

  // Format value for display (legacy function, kept for compatibility)
  const getDisplayValue = (value: string): string => {
    return formatDisplayValue(props.option.name, value);
  };

  const handleSelect = (value: string) => {
    emit("update:selectedValue", value);

    // If not selecting "Custom", clear custom value
    if (value !== "Custom" && props.customValue) {
      emit("update:customValue", "");
    }
  };

  const handleCustomInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit("update:customValue", target.value);
  };

  // Get icon for option type
  const getOptionIcon = (optionName: string): string => {
    const normalized = optionName.toLowerCase();
    if (normalized.includes("size")) return "i-lucide-ruler";
    if (normalized.includes("material") || normalized.includes("finish")) return "i-lucide-layers";
    if (normalized.includes("quantity") || normalized.includes("qty")) return "i-lucide-package";
    if (normalized.includes("color") || normalized.includes("colour")) return "i-lucide-palette";
    return "i-lucide-settings";
  };

  // Get placeholder for custom input
  const getCustomPlaceholder = (optionName: string): string => {
    const normalized = optionName.toLowerCase();
    if (normalized.includes("size")) return 'e.g., 3.5"';
    if (normalized.includes("quantity") || normalized.includes("qty")) return "e.g., 150";
    return `Enter ${optionName.toLowerCase()}`;
  };
</script>

<style scoped>
  .option-button {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .option-button:focus-visible {
    outline: 2px solid var(--color-magenta);
    outline-offset: 2px;
  }

  input:focus-visible {
    outline: 2px solid var(--color-magenta);
    outline-offset: 2px;
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .option-button {
      transition-duration: 0.01ms !important;
    }
  }
</style>
