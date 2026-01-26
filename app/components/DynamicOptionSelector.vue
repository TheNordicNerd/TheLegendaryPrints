<template>
  <div class="option-section bg-surface-raised p-6 rounded-lg border border-border-subtle">
    <h3
      :id="`${option.name}-label`"
      class="text-xl font-bold mb-4 text-text-primary flex items-center gap-2"
    >
      <Icon :name="getOptionIcon(option.name)" size="20" aria-hidden="true" />
      {{ option.name }}
    </h3>

    <!-- Option Values Grid or Row Layout -->
    <div
      class="gap-3"
      :class="
        option.isRow
          ? 'flex flex-col'
          : 'grid ' +
            (option.values.length > 4 ? 'grid-cols-3 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-4')
      "
      role="group"
      :aria-labelledby="`${option.name}-label`"
    >
      <button
        v-for="value in option.values"
        :key="value"
        type="button"
        @click="handleSelect(value)"
        :aria-label="`Select ${value}`"
        :aria-pressed="selectedValue === value"
        :title="option.isRow ? undefined : value"
        class="option-button p-4 rounded-lg border-2 transition-all duration-200 font-bold text-lg"
        :class="[
          selectedValue === value
            ? 'border-accent-700 bg-accent-700 text-text-inverse shadow-md'
            : 'border-border-subtle hover:border-accent-300 text-text-primary hover:bg-surface-sunken',
          option.isRow ? 'text-left w-full ' : 'text-center overflow-hidden',
        ]"
      >
        <span :class="option.isRow ? 'block' : 'block truncate'">{{ value }}</span>
      </button>
    </div>

    <!-- Custom Input (if option has custom) -->
    <div
      v-if="option.hasCustom && selectedValue === 'custom'"
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
        class="w-full px-4 py-3 rounded-lg border-2 border-border-default focus:border-accent-500 focus:outline-none bg-surface-base text-text-primary transition-colors duration-200"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  interface ProductOption {
    name: string;
    type: "standard" | "custom";
    values: string[];
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
    outline: 2px solid var(--color-accent-700);
    outline-offset: 2px;
  }

  input:focus-visible {
    outline: 2px solid var(--color-accent-700);
    outline-offset: 2px;
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .option-button {
      transition-duration: 0.01ms !important;
    }
  }
</style>
