import { AppearanceSettings } from "@/services/CollectionService";

/**
 * Validates if the provided UI variant is one of the allowed values.
 * If not, it returns a default value of 'standard'.
 *
 * @param {string} uiVariant - The UI variant to validate.
 * @returns {string} - The validated UI variant or 'standard' if the provided value is invalid.
 */
export const validateUIVariant = (uiVariant: string | undefined): string => {
  const allowedVariants = ["standard", "material", "pill", "borderless", "underlined"];
  
  if (uiVariant && allowedVariants.includes(uiVariant)) {
    return uiVariant;
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
