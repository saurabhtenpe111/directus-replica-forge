
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface NumberInputFieldProps {
  id: string;
  label?: string;
  value: number | null;
  onChange: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  helpText?: string;
  className?: string;
  "aria-label"?: string;
  showButtons?: boolean;
  buttonLayout?: "horizontal" | "vertical";
  prefix?: string;
  suffix?: string;
  locale?: string;
  currency?: string;
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
  // Add uiVariant prop
  uiVariant?: "standard" | "material" | "pill" | "borderless" | "underlined";
}

export function NumberInputField({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  placeholder = "",
  required = false,
  disabled = false,
  invalid = false,
  helpText,
  className,
  "aria-label": ariaLabel,
  showButtons = false,
  buttonLayout = "horizontal",
  prefix = "",
  suffix = "",
  locale,
  currency,
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
  colors = {},
  uiVariant = "standard"
}: NumberInputFieldProps) {
  const [hasFocus, setHasFocus] = useState(false);
  
  const handleIncrement = () => {
    if (disabled) return;
    const currentValue = value ?? 0;
    const newValue = max !== undefined ? Math.min(currentValue + step, max) : currentValue + step;
    onChange(newValue);
  };
  
  const handleDecrement = () => {
    if (disabled) return;
    const currentValue = value ?? 0;
    const newValue = min !== undefined ? Math.max(currentValue - step, min) : currentValue - step;
    onChange(newValue);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      onChange(null);
      return;
    }
    
    const newValue = parseFloat(e.target.value);
    if (isNaN(newValue)) return;
    
    let constrainedValue = newValue;
    if (min !== undefined) constrainedValue = Math.max(constrainedValue, min);
    if (max !== undefined) constrainedValue = Math.min(constrainedValue, max);
    
    onChange(constrainedValue);
  };
  
  // Format the displayed value based on locale and currency options
  const formatValue = () => {
    if (value === null || value === undefined) return "";
    
    if (currency && locale) {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency
      }).format(value);
    }
    
    if (locale) {
      return new Intl.NumberFormat(locale).format(value);
    }
    
    return value.toString();
  };
  
  const displayValue = formatValue();
  
  // Get input value for the actual input (without formatting)
  const inputValue = value !== null ? value.toString() : "";

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

  // Apply UI variant specific styles
  const variantClasses = uiVariant ? `ui-variant-${uiVariant}` : "";

  return (
    <div className={cn(className, "mb-4", invalid && "has-error")}>
      <div style={inputContainerStyle}>
        {label && (
          <Label 
            htmlFor={id}
            className={cn(
              labelPosition === "left" && "mr-3",
              "block"
            )}
            style={labelStyle}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
        )}
        
        <div className={cn("relative", variantClasses)}>
          {/* Button layout for vertical or horizontal arrangement */}
          {showButtons && buttonLayout === "horizontal" && (
            <div className="flex">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-r-none"
                onClick={handleDecrement}
                disabled={disabled || (min !== undefined && value !== null && value <= min)}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              
              <div className="relative flex-1">
                {prefix && (
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">
                    {prefix}
                  </span>
                )}
                <Input
                  type="number"
                  id={id}
                  value={inputValue}
                  onChange={handleChange}
                  placeholder={placeholder}
                  required={required}
                  disabled={disabled}
                  min={min}
                  max={max}
                  step={step}
                  className={cn(
                    "rounded-none",
                    prefix && "pl-6",
                    suffix && "pr-6",
                    invalid && "border-red-500",
                    customClass
                  )}
                  onFocus={() => setHasFocus(true)}
                  onBlur={() => setHasFocus(false)}
                  style={inputStyle}
                  aria-label={ariaLabel || label}
                />
                {suffix && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
                    {suffix}
                  </span>
                )}
              </div>
              
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-l-none"
                onClick={handleIncrement}
                disabled={disabled || (max !== undefined && value !== null && value >= max)}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          {/* Regular input display when not showing horizontal buttons */}
          {(!showButtons || buttonLayout === "vertical") && (
            <div className="relative">
              {prefix && (
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">
                  {prefix}
                </span>
              )}
              <Input
                type="number"
                id={id}
                value={inputValue}
                onChange={handleChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                min={min}
                max={max}
                step={step}
                className={cn(
                  prefix && "pl-6",
                  suffix && "pr-6",
                  showButtons && buttonLayout === "vertical" && "rounded-l-none",
                  invalid && "border-red-500",
                  customClass
                )}
                onFocus={() => setHasFocus(true)}
                onBlur={() => setHasFocus(false)}
                style={inputStyle}
                aria-label={ariaLabel || label}
              />
              {suffix && (
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
                  {suffix}
                </span>
              )}
            </div>
          )}
          
          {/* Vertical buttons layout */}
          {showButtons && buttonLayout === "vertical" && (
            <div className="inline-flex flex-col">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-5 w-9 rounded-b-none rounded-l-none border-b-0"
                onClick={handleIncrement}
                disabled={disabled || (max !== undefined && value !== null && value >= max)}
              >
                <ChevronUp className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-5 w-9 rounded-t-none rounded-l-none"
                onClick={handleDecrement}
                disabled={disabled || (min !== undefined && value !== null && value <= min)}
              >
                <ChevronDown className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {helpText && (
        <p className={cn("text-sm mt-1", invalid ? "text-red-500" : "text-gray-500")}>
          {helpText}
        </p>
      )}
      
      {currency && locale && (
        <p className="text-xs mt-1 text-gray-500">
          Formatted: {displayValue}
        </p>
      )}
    </div>
  );
}
