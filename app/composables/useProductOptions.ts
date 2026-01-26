/**
 * Product Options Composable
 * Dynamically creates product options from Shopify variants
 * Handles custom values for size and quantity
 */

import type { ShopifyProduct, ShopifyVariant } from "~/composables/useShopify";

export type ProductOptionType = "standard" | "custom";

export interface ProductOption {
  name: string;
  type: ProductOptionType;
  values: string[];
  hasCustom: boolean;
  isRow?: boolean;
}

export interface SelectedOptions {
  [optionName: string]: string;
}

export interface ParsedVariant {
  size: string | undefined;
  material: string | undefined;
  quantity: string | undefined;
  variant: ShopifyVariant;
}

export const useProductOptions = (product: ShopifyProduct) => {
  const { getProductVariantOptions, findVariant } = useShopifyVariants();

  /**
   * Extract product options from Shopify variants
   * Automatically detects custom options (Size, Quantity)
   * Determines if option should be displayed as rows based on text length
   */
  const productOptions = computed<ProductOption[]>(() => {
    const { options } = getProductVariantOptions(product);

    return options.map((option) => {
      const normalizedName = option.name.toLowerCase();
      const isCustomOption = normalizedName === "size" || normalizedName === "quantity";

      // Check if "Custom" is one of the values
      const hasCustomValue = option.values.some((value) => value.toLowerCase() === "custom");

      // Check if any value is longer than 15 characters (indicating it should be a row)
      const hasLongValues = option.values.some((value) => value.length > 10);

      return {
        name: option.name,
        type: isCustomOption && hasCustomValue ? "custom" : "standard",
        values: option.values,
        hasCustom: hasCustomValue,
        isRow: hasLongValues,
      };
    });
  });

  /**
   * Parse variants using the split pattern (size / material / quantity)
   * This is a fallback if selectedOptions is not available
   */
  const parseVariantTitle = (variantTitle: string): Record<string, string> => {
    const parts = variantTitle.split(" / ").map((part) => part.trim());

    // Default pattern: size / material / quantity
    const parsed: Record<string, string> = {};

    if (parts.length >= 1) parsed.Size = parts[0];
    if (parts.length >= 2) parsed.Material = parts[1];
    if (parts.length >= 3) parsed.Quantity = parts[2];

    return parsed;
  };

  /**
   * Get all parsed variants with their options
   */
  const parsedVariants = computed<ParsedVariant[]>(() => {
    return product.variants.edges.map(({ node: variant }) => {
      // Prefer selectedOptions if available, fallback to parsing title
      let options: Record<string, string> = {};

      if (variant.selectedOptions && variant.selectedOptions.length > 0) {
        variant.selectedOptions.forEach(({ name, value }) => {
          options[name] = value;
        });
      } else {
        options = parseVariantTitle(variant.title);
      }

      return {
        size: options.Size,
        material: options.Material,
        quantity: options.Quantity,
        variant,
      };
    });
  });

  /**
   * Normalize custom value for Shopify
   * If user enters a custom value, we need to ensure it matches Shopify's format
   *
   * @param optionName - The option name (e.g., "Size", "Quantity")
   * @param value - The value (e.g., "Custom", "5\"", "100")
   * @param customValue - The actual custom value entered by user
   */
  const normalizeCustomValue = (
    optionName: string,
    value: string,
    customValue?: string,
  ): string => {
    // If the value is "Custom" and we have a custom value, use it
    if (value.toLowerCase() === "custom" && customValue) {
      const normalizedName = optionName.toLowerCase();

      // For size, add inch symbol if it's a number without unit
      if (normalizedName === "size") {
        const num = parseFloat(customValue);
        if (!isNaN(num) && !customValue.includes('"') && !customValue.includes("inch")) {
          return `${customValue}"`;
        }
      }

      // For quantity, ensure it's a valid number
      if (normalizedName === "quantity") {
        const num = parseInt(customValue, 10);
        if (!isNaN(num)) {
          return num.toString();
        }
      }

      return customValue;
    }

    return value;
  };

  /**
   * Build selected options object for finding variant
   * Handles custom values properly
   *
   * @param selections - Object with option names and their values
   * @param customValues - Object with custom values for options marked as "Custom"
   */
  const buildSelectedOptions = (
    selections: SelectedOptions,
    customValues?: Record<string, string>,
  ): SelectedOptions => {
    const normalized: SelectedOptions = {};

    Object.entries(selections).forEach(([optionName, value]) => {
      const customValue = customValues?.[optionName];
      normalized[optionName] = normalizeCustomValue(optionName, value, customValue);
    });

    return normalized;
  };

  /**
   * Find variant based on selected options with custom value support
   *
   * @param selections - Selected option values
   * @param customValues - Custom values for options marked as "Custom"
   */
  const findVariantByOptions = (
    selections: SelectedOptions,
    customValues?: Record<string, string>,
  ): ShopifyVariant | null => {
    const normalizedOptions = buildSelectedOptions(selections, customValues);
    return findVariant(product, normalizedOptions);
  };

  /**
   * Get variant ID from selected options
   * Returns the Shopify variant ID needed for cart operations
   *
   * @param selections - Selected option values
   * @param customValues - Custom values for options marked as "Custom"
   */
  const getVariantId = (
    selections: SelectedOptions,
    customValues?: Record<string, string>,
  ): string | null => {
    const variant = findVariantByOptions(selections, customValues);
    return variant?.id || null;
  };

  /**
   * Get complete variant info including ID
   * Returns both the variant object and its ID for convenience
   *
   * @param selections - Selected option values
   * @param customValues - Custom values for options marked as "Custom"
   */
  const getVariantInfo = (
    selections: SelectedOptions,
    customValues?: Record<string, string>,
  ): { variant: ShopifyVariant; id: string } | null => {
    const variant = findVariantByOptions(selections, customValues);
    if (!variant) return null;

    return {
      variant,
      id: variant.id,
    };
  };

  /**
   * Check if an option requires custom input
   */
  const isCustomOption = (optionName: string): boolean => {
    const option = productOptions.value.find(
      (opt) => opt.name.toLowerCase() === optionName.toLowerCase(),
    );
    return option?.type === "custom" || false;
  };

  /**
   * Get placeholder text for custom input
   */
  const getCustomPlaceholder = (optionName: string): string => {
    const normalizedName = optionName.toLowerCase();

    if (normalizedName === "size") {
      return "Enter size (e.g., 5.5)";
    }

    if (normalizedName === "quantity") {
      return "Enter quantity (e.g., 150)";
    }

    return `Enter custom ${optionName.toLowerCase()}`;
  };

  /**
   * Validate custom value
   */
  const validateCustomValue = (
    optionName: string,
    value: string,
  ): { valid: boolean; error?: string } => {
    if (!value || value.trim() === "") {
      return { valid: false, error: "Please enter a value" };
    }

    const normalizedName = optionName.toLowerCase();

    if (normalizedName === "size") {
      const num = parseFloat(value);
      if (isNaN(num) || num <= 0) {
        return { valid: false, error: "Please enter a valid size number" };
      }
      if (num > 100) {
        return { valid: false, error: "Size seems too large. Please verify." };
      }
    }

    if (normalizedName === "quantity") {
      const num = parseInt(value, 10);
      if (isNaN(num) || num <= 0) {
        return { valid: false, error: "Please enter a valid quantity" };
      }
      if (num < 20) {
        return { valid: false, error: "Minimum quantity is 20" };
      }
    }

    return { valid: true };
  };

  /**
   * Get unique values for a specific option
   */
  const getOptionValues = (optionName: string): string[] => {
    const option = productOptions.value.find(
      (opt) => opt.name.toLowerCase() === optionName.toLowerCase(),
    );
    return option?.values || [];
  };

  /**
   * Check if a specific value is the "Custom" option
   */
  const isCustomValue = (value: string): boolean => {
    return value.toLowerCase() === "custom";
  };

  return {
    // Computed properties
    productOptions,
    parsedVariants,

    // Methods
    parseVariantTitle,
    normalizeCustomValue,
    buildSelectedOptions,
    findVariantByOptions,
    getVariantId,
    getVariantInfo,
    isCustomOption,
    getCustomPlaceholder,
    validateCustomValue,
    getOptionValues,
    isCustomValue,
  };
};
