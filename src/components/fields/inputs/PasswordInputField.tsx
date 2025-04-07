
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordInputFieldProps {
  id: string;
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  className?: string;
  // Add these additional props from InputTextField
  floatLabel?: boolean;
  filled?: boolean;
  textAlign?: "left" | "center" | "right";
  labelPosition?: "top" | "left";
  labelWidth?: number;
  showBorder?: boolean;
  roundedCorners?: "none" | "small" | "medium" | "large";
  fieldSize?: "small" | "medium" | "large";
  labelSize?: "small" | "medium" | "large";
  customClass?: string;
  colors?: {
    border?: string;
    text?: string;
    background?: string;
    focus?: string;
    label?: string;
  };
}

export function PasswordInputField({
  id,
  label,
  value = '',
  onChange,
  placeholder = '',
  required = false,
  helpText,
  className,
  floatLabel = false,
  filled = false,
  textAlign = "left",
  labelPosition = "top",
  labelWidth = 30,
  showBorder = true,
  roundedCorners = "medium",
  fieldSize = "medium",
  labelSize = "medium",
  customClass = "",
  colors = {}
}: PasswordInputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Generate dynamic styles based on props
  const inputContainerStyle: React.CSSProperties = {
    display: labelPosition === "left" ? "flex" : "block",
    alignItems: "center",
    position: "relative"
  };
  
  const labelStyle: React.CSSProperties = {
    width: labelPosition === "left" ? `${labelWidth}%` : "auto",
    fontSize: labelSize === "small" ? "0.875rem" : labelSize === "medium" ? "1rem" : "1.125rem",
    fontWeight: labelSize === "large" ? 600 : 500,
    color: colors.label || "#64748b",
    marginBottom: labelPosition === "top" ? "0.5rem" : "0"
  };
  
  // Get border radius based on roundedCorners prop
  const getBorderRadius = () => {
    switch (roundedCorners) {
      case "none": return "0";
      case "small": return "0.25rem";
      case "medium": return "0.375rem";
      case "large": return "0.5rem";
      default: return "0.375rem";
    }
  };
  
  // Get padding based on fieldSize prop
  const getPadding = () => {
    switch (fieldSize) {
      case "small": return "0.375rem 0.5rem";
      case "medium": return "0.5rem 0.75rem";
      case "large": return "0.75rem 1rem";
      default: return "0.5rem 0.75rem";
    }
  };
  
  const inputStyle: React.CSSProperties = {
    width: labelPosition === "left" ? `${100 - labelWidth}%` : "100%",
    backgroundColor: filled ? (colors.background || "#f1f5f9") : "transparent",
    border: showBorder ? `1px solid ${colors.border || "#e2e8f0"}` : "none",
    borderRadius: getBorderRadius(),
    padding: getPadding(),
    fontSize: fieldSize === "small" ? "0.875rem" : fieldSize === "medium" ? "1rem" : "1.125rem",
    textAlign: textAlign,
    color: colors.text || "#1e293b",
  };

  return (
    <div className={cn('relative space-y-1', className, customClass)} style={inputContainerStyle}>
      {label && labelPosition === "top" && !floatLabel && (
        <Label 
          htmlFor={id}
          style={labelStyle}
          className={required ? "after:content-['*'] after:ml-1 after:text-red-500" : ""}
        >
          {label}
        </Label>
      )}
      
      <div className="relative" style={labelPosition === "left" ? { width: `${100 - labelWidth}%` } : {}}>
        {label && labelPosition === "left" && (
          <Label 
            htmlFor={id}
            style={labelStyle}
            className={required ? "after:content-['*'] after:ml-1 after:text-red-500" : ""}
          >
            {label}
          </Label>
        )}
        
        {floatLabel && label && (
          <Label
            htmlFor={id}
            className={cn(
              "absolute transition-all duration-200 pointer-events-none",
              (hasFocus || value) ? "-top-3 left-2 bg-white px-1 text-xs" : `top-1/2 left-3 -translate-y-1/2`
            )}
            style={{
              color: hasFocus ? (colors.focus || "#3b82f6") : (colors.label || "#64748b"),
              zIndex: 10
            }}
          >
            {label}{required && <span className="text-red-500 ml-1">*</span>}
          </Label>
        )}

        <Input
          type={showPassword ? 'text' : 'password'}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={floatLabel && label ? "" : placeholder}
          required={required}
          className={cn(
            "pr-10",
            filled && "bg-gray-100",
            floatLabel && "pt-4"
          )}
          onFocus={() => setHasFocus(true)}
          onBlur={() => setHasFocus(false)}
          style={inputStyle}
          aria-describedby={helpText ? `${id}-description` : undefined}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-0 hover:bg-transparent"
          onClick={togglePasswordVisibility}
          tabIndex={-1}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
        </Button>
      </div>
      {helpText && (
        <p id={`${id}-description`} className="text-muted-foreground text-xs">
          {helpText}
        </p>
      )}
    </div>
  );
}

export default PasswordInputField;
