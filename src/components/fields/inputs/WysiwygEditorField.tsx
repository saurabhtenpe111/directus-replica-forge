
import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { BlockEditorField } from './BlockEditorField';
import { validateUIVariant } from '@/utils/inputAdapters';

interface WysiwygEditorFieldProps {
  id: string;
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  className?: string;
  minHeight?: string;
  // Appearance props
  uiVariant?: "standard" | "material" | "pill" | "borderless" | "underlined";
  colors?: Record<string, string>;
  errorMessage?: string;
  invalid?: boolean;
  // Validation state callbacks
  onValidationChange?: (isValid: boolean) => void;
}

export function WysiwygEditorField({
  id,
  label,
  value = '',
  onChange,
  placeholder = 'Enter content...',
  required = false,
  helpText,
  className,
  minHeight = '200px',
  uiVariant = 'standard',
  colors,
  errorMessage,
  invalid,
  onValidationChange
}: WysiwygEditorFieldProps) {
  // Local state to track validation
  const [isValid, setIsValid] = useState(!required || (value && value.trim().length > 0));
  
  // Validate UI variant
  const validUIVariant = validateUIVariant(uiVariant);

  // Add UI variant class
  const fieldClassName = cn(
    'space-y-2',
    className,
    `ui-variant-${validUIVariant}`,
    invalid && 'has-error'
  );

  // Generate custom style based on colors if provided
  const customStyle: React.CSSProperties = {};
  if (colors) {
    if (colors.border) customStyle.borderColor = colors.border;
    if (colors.text) customStyle.color = colors.text;
    if (colors.background) customStyle.backgroundColor = colors.background;
  }

  // Effect to validate content based on required flag
  useEffect(() => {
    // If required, check if there's content
    const currentIsValid = !required || (value && value.trim().length > 0);
    
    // Update local state only if changed
    if (isValid !== currentIsValid) {
      setIsValid(currentIsValid);
      
      // Notify parent component if callback provided
      if (onValidationChange) {
        onValidationChange(currentIsValid);
      }
    }
  }, [value, required, onValidationChange, isValid]);

  // Handle content change
  const handleContentChange = (newContent: string) => {
    onChange(newContent);
    
    // Immediate validation
    const contentIsValid = !required || (newContent && newContent.trim().length > 0);
    
    // Only update and notify if changed
    if (isValid !== contentIsValid) {
      setIsValid(contentIsValid);
      
      if (onValidationChange) {
        onValidationChange(contentIsValid);
      }
    }
  };

  return (
    <div 
      className={fieldClassName} 
      data-ui-variant={validUIVariant} 
      data-validation-state={isValid ? 'valid' : 'invalid'}
      style={customStyle}
    >
      <BlockEditorField
        id={id}
        label={label}
        value={value}
        onChange={handleContentChange}
        placeholder={placeholder}
        required={required}
        helpText={invalid && errorMessage ? errorMessage : helpText}
        minHeight={minHeight}
        className={cn(invalid && 'border-red-500 focus:border-red-500')}
      />
      {invalid && errorMessage && (
        <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
      )}
    </div>
  );
}

export default WysiwygEditorField;
