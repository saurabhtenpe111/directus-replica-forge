
import { AppearanceSettings } from "@/services/CollectionService";

/**
 * Validates if the provided UI variant is one of the allowed values.
 * If not, it returns a default value of 'standard'.
 *
 * @param {string} uiVariant - The UI variant to validate.
 * @returns {"standard" | "material" | "pill" | "borderless" | "underlined"} - The validated UI variant or 'standard' if the provided value is invalid.
 */
export const validateUIVariant = (uiVariant: string | undefined): "standard" | "material" | "pill" | "borderless" | "underlined" => {
  const allowedVariants = ["standard", "material", "pill", "borderless", "underlined"] as const;
  
  if (uiVariant && allowedVariants.includes(uiVariant as any)) {
    return uiVariant as "standard" | "material" | "pill" | "borderless" | "underlined";
  }
  
  return "standard"; // Default value
};

/**
 * Normalizes appearance settings, ensuring that the uiVariant is always a valid value.
 *
 * @param {AppearanceSettings} settings - The appearance settings to normalize.
 * @returns {AppearanceSettings} - The normalized appearance settings.
 */
export const normalizeAppearanceSettings = (settings: AppearanceSettings | undefined): AppearanceSettings => {
  const safeSettings: AppearanceSettings = settings || {};
  
  // Validate and normalize uiVariant
  safeSettings.uiVariant = validateUIVariant(safeSettings.uiVariant);
  
  return safeSettings;
};

/**
 * Adapts a standard input change event for form processing
 */
export const adaptInputChangeEvent = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  const { name, value, type } = e.target;
  
  // Handle checkboxes separately
  if (type === 'checkbox') {
    return {
      name,
      value: (e.target as HTMLInputElement).checked
    };
  }
  
  // Handle other input types
  return {
    name,
    value
  };
};
