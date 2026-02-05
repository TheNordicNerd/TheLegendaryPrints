/**
 * Custom Design Options Configuration
 *
 * This file contains all available options for custom sticker designs
 */

export interface CustomDesignOption {
  name: string;
  label: string;
  values: string[];
  defaultValue?: string;
  allowCustom?: boolean;
  customLabel?: string;
  description?: string;
}

export const customDesignOptions: CustomDesignOption[] = [
  {
    name: "Material",
    label: "Material",
    values: ["White Vinyl", "Holographic", "Clear"],
    defaultValue: "White Vinyl",
    description: "Choose the material type for your stickers",
  },
  {
    name: "Shape",
    label: "Shape",
    values: ["Round", "Square", "Die Cut", "Kiss Cut"],
    defaultValue: "Die Cut",
    description: "Select the shape or cutting style",
  },
  {
    name: "Size",
    label: "Size",
    values: ["2 Inches", "3 Inches", "4 Inches", "5 Inches", "6 Inches", "7 Inches"],
    defaultValue: "2 Inches",
    allowCustom: true,
    customLabel: "Custom size (inches)",
    description: "Choose the size of your stickers in inches",
  },
  {
    name: "Quantity",
    label: "Quantity",
    values: ["1 Sticker", "100 Stickers", "500 Stickers", "1000 Stickers"],
    defaultValue: "1 Sticker",
    allowCustom: true,
    customLabel: "Custom quantity",
    description: "Select how many stickers you need",
  },
  {
    name: "Laminate",
    label: "Laminate",
    values: ["Glossy", "Matte"],
    defaultValue: "Glossy",
    description: "Choose the finish protection for your stickers",
  },
];

/**
 * Get option by name
 */
export const getOptionByName = (name: string): CustomDesignOption | undefined => {
  return customDesignOptions.find((option) => option.name === name);
};

/**
 * Get default selections
 */
export const getDefaultSelections = (): Record<string, string> => {
  return customDesignOptions.reduce(
    (acc, option) => {
      acc[option.name] = option.defaultValue || option.values[0];
      return acc;
    },
    {} as Record<string, string>,
  );
};

/**
 * Validate a selection
 */
export const isValidSelection = (optionName: string, value: string): boolean => {
  const option = getOptionByName(optionName);
  if (!option) return false;

  // Check if value is in the list of values
  if (option.values.includes(value)) return true;

  // If "Custom" is allowed and value is "Custom", it's valid
  if (option.allowCustom && value === "Custom") return true;

  return false;
};

/**
 * Format custom value based on option type
 */
export const formatCustomValue = (optionName: string, value: string): string => {
  const option = getOptionByName(optionName);
  if (!option) return value;

  switch (optionName) {
    case "Size":
      // Ensure size has inch symbol
      const sizeNum = parseFloat(value);
      return isNaN(sizeNum) ? value : `${sizeNum}"`;

    case "Quantity":
      // Ensure quantity is a number
      const qty = parseInt(value, 10);
      return isNaN(qty) ? value : qty.toString();

    default:
      return value;
  }
};

/**
 * Format display value for UI (converts Shopify format to user-friendly format)
 * E.g., "3 Inches" -> "3\"", "100 Stickers" -> "100"
 */
export const formatDisplayValue = (optionName: string, value: string): string => {
  if (value === "Custom") return "Custom";

  switch (optionName) {
    case "Size":
      // Convert "3 Inches" to "3\""
      const inches = value.replace(/ Inches?/i, "");
      const sizeNum = parseFloat(inches);
      return isNaN(sizeNum) ? value : `${sizeNum}"`;

    case "Quantity":
      // Convert "100 Stickers" to "100"
      const quantity = value.replace(/ Stickers?/i, "");
      const qtyNum = parseInt(quantity, 10);
      return isNaN(qtyNum) ? value : qtyNum.toLocaleString();

    default:
      return value;
  }
};
