/**
 * Validates that a UI variant is one of the allowed types
 * @param variant The variant to validate
 * @returns A validated variant string (defaulting to "standard" if invalid)
 */
export const validateUIVariant = (variant: any): "standard" | "material" | "pill" | "borderless" | "underlined" => {
  const validVariants = ["standard", "material", "pill", "borderless", "underlined"];
  
  if (typeof variant === 'string' && validVariants.includes(variant.toLowerCase())) {
    return variant.toLowerCase() as "standard" | "material" | "pill" | "borderless" | "underlined";
  }
  
  console.warn(`Invalid UI variant '${variant}' provided, defaulting to 'standard'`);
  return "standard";
}
