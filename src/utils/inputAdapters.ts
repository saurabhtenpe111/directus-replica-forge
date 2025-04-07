
import React from 'react';

/**
 * Adapter to convert React.ChangeEvent to the expected string value for input components
 * @param setter - State setter function that accepts a string value
 * @returns A function that handles React.ChangeEvent and passes the value to the setter
 */
export function adaptInputChangeEvent(setter: (value: string) => void) {
  return (value: string | React.ChangeEvent<HTMLInputElement>) => {
    if (typeof value === 'string') {
      // If the value is already a string (from a component that processes the event)
      setter(value);
    } else {
      // If the value is a ChangeEvent (from a native input)
      setter(value.target.value);
    }
  };
}

/**
 * Ensures UI variant is properly formatted and valid
 * @param variant - The UI variant string to validate
 * @returns A valid UI variant string
 */
export function validateUIVariant(variant: string | undefined): string {
  const validVariants = ['standard', 'material', 'pill', 'borderless', 'underlined'];
  
  if (!variant || !validVariants.includes(variant.toLowerCase())) {
    console.log(`Invalid UI variant provided: ${variant}, defaulting to 'standard'`);
    return 'standard';
  }
  
  return variant.toLowerCase();
}
