/**
 * Shopify Variant Options Utilities
 * Extract and work with variant options from Shopify products
 */

import type { ShopifyProduct, ShopifyVariant } from '~/composables/useShopify';

export interface VariantOption {
  name: string;
  values: string[];
}

export interface VariantOptionSet {
  options: VariantOption[];
  allVariants: ShopifyVariant[];
}

export const useShopifyVariants = () => {
  /**
   * Extract unique variant options from a single product
   * Returns an array of option names with their unique values
   *
   * Example: If a product has variants with Size (2", 3", 4") and Material (Glossy, Matte),
   * this returns:
   * [
   *   { name: "Size", values: ["2\"", "3\"", "4\""] },
   *   { name: "Material", values: ["Glossy", "Matte"] }
   * ]
   */
  const getProductVariantOptions = (product: ShopifyProduct): VariantOptionSet => {
    const optionsMap = new Map<string, Set<string>>();
    const allVariants: ShopifyVariant[] = [];

    // Extract all variants
    product.variants.edges.forEach(({ node: variant }) => {
      allVariants.push(variant);

      // Process each option in the variant
      variant.selectedOptions?.forEach(({ name, value }) => {
        if (!optionsMap.has(name)) {
          optionsMap.set(name, new Set());
        }
        optionsMap.get(name)!.add(value);
      });
    });

    // Convert map to array format
    const options: VariantOption[] = Array.from(optionsMap.entries()).map(([name, values]) => ({
      name,
      values: Array.from(values).sort((a, b) => {
        // Try to sort numerically if values are numbers
        const aNum = parseFloat(a);
        const bNum = parseFloat(b);
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return aNum - bNum;
        }
        // Otherwise sort alphabetically
        return a.localeCompare(b);
      }),
    }));

    return {
      options,
      allVariants,
    };
  };

  /**
   * Find a specific variant based on selected options
   *
   * @param product - The Shopify product
   * @param selectedOptions - Object with option names as keys and values as values
   *
   * Example:
   * findVariant(product, { "Size": "3\"", "Material": "Glossy" })
   */
  const findVariant = (
    product: ShopifyProduct,
    selectedOptions: Record<string, string>
  ): ShopifyVariant | null => {
    const variant = product.variants.edges.find(({ node: variant }) => {
      // Check if all selected options match this variant
      return Object.entries(selectedOptions).every(([optionName, optionValue]) => {
        return variant.selectedOptions?.some(
          opt => opt.name === optionName && opt.value === optionValue
        );
      });
    });

    return variant?.node || null;
  };

  /**
   * Get default variant (first available or first variant)
   */
  const getDefaultVariant = (product: ShopifyProduct): ShopifyVariant | null => {
    // Try to find first available variant
    const availableVariant = product.variants.edges.find(
      ({ node }) => node.availableForSale
    );

    if (availableVariant) {
      return availableVariant.node;
    }

    // Fallback to first variant
    return product.variants.edges[0]?.node || null;
  };

  /**
   * Get all possible option combinations
   * Useful for generating a variant matrix
   */
  const getOptionCombinations = (options: VariantOption[]): Record<string, string>[] => {
    if (options.length === 0) return [];
    if (options.length === 1) {
      return options[0].values.map(value => ({ [options[0].name]: value }));
    }

    // Recursive function to generate all combinations
    const combine = (remaining: VariantOption[], current: Record<string, string> = {}): Record<string, string>[] => {
      if (remaining.length === 0) {
        return [current];
      }

      const [first, ...rest] = remaining;
      const results: Record<string, string>[] = [];

      for (const value of first.values) {
        const newCurrent = { ...current, [first.name]: value };
        results.push(...combine(rest, newCurrent));
      }

      return results;
    };

    return combine(options);
  };

  /**
   * Check if specific options are available for a product
   */
  const isOptionCombinationAvailable = (
    product: ShopifyProduct,
    selectedOptions: Record<string, string>
  ): boolean => {
    const variant = findVariant(product, selectedOptions);
    return variant?.availableForSale || false;
  };

  /**
   * Get price for specific option combination
   */
  const getVariantPrice = (
    product: ShopifyProduct,
    selectedOptions: Record<string, string>
  ): { amount: string; currencyCode: string } | null => {
    const variant = findVariant(product, selectedOptions);
    return variant?.price || null;
  };

  return {
    getProductVariantOptions,
    findVariant,
    getDefaultVariant,
    getOptionCombinations,
    isOptionCombinationAvailable,
    getVariantPrice,
  };
};
