
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus, Minus } from "lucide-react";

export interface NumberInputFieldProps {
  id?: string;
  value: number | null | undefined;
  onChange: (value: number | null) => void;
  label?: string;
  placeholder?: string;
  helpText?: string;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  floatLabel?: boolean;
  filled?: boolean;
  showButtons?: boolean;
  buttonLayout?: "horizontal" | "vertical";
  prefix?: string;
  suffix?: string;
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
  locale?: string;
  currency?: string;
  invalid?: boolean;
  disabled?: boolean;
  "aria-label"?: string;
}

export const NumberInputField = ({
  id = `number-${Math.random().toString(36).substring(2, 9)}`,
  value,
  onChange,
  label,
  placeholder = "",
  helpText,
  min,
  max,
  step = 1,
  required = false,
  floatLabel = false,
  filled = false,
  showButtons = false,
  buttonLayout = "horizontal",
  prefix,
  suffix,
  textAlign = "left",
  labelPosition = "top",
  labelWidth = 30,
  showBorder = true,
  roundedCorners = "medium",
  fieldSize = "medium",
  labelSize = "medium",
  customClass = "",
  colors = {},
  locale,
  currency,
  invalid = false,
  disabled = false,
  "aria-label": ariaLabel
}: NumberInputFieldProps) => {
  const [hasFocus, setHasFocus] = useState(false);
  const [localValue, setLocalValue] = useState<string>(value !== null && value !== undefined ? value.toString() : "");

  // Update localValue when value prop changes
  useEffect(() => {
    setLocalValue(value !== null && value !== undefined ? value.toString() : "");
  }, [value]);

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

  const getBorderRadius = () => {
    switch (roundedCorners) {
      case "none": return "0";
      case "small": return "0.25rem";
      case "medium": return "0.375rem";
      case "large": return "0.5rem";
      default: return "0.375rem";
    }
  };

  const getPadding = () => {
    switch (fieldSize) {
      case "small": return "0.375rem 0.5rem";
      case "medium": return "0.5rem 0.75rem";
      case "large": return "0.75rem 1rem";
      default: return "0.5rem 0.75rem";
    }
  };

  // Define the inputStyle variable that was missing
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: getPadding(),
    borderRadius: getBorderRadius(),
    textAlign: textAlign,
    borderColor: invalid ? "#ef4444" : colors.border || "#e2e8f0",
    color: colors.text || "#1e293b",
    backgroundColor: filled ? (colors.background || "#f8fafc") : "#ffffff",
    borderWidth: showBorder ? "1px" : "0",
  };

  const formatValue = (value: number): string => {
    if (locale) {
      try {
        if (currency) {
          return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency
          }).format(value);
        }
        return new Intl.NumberFormat(locale).format(value);
      } catch (e) {
        console.warn(`Error formatting number with locale ${locale}:`, e);
        return value.toString();
      }
    }
    return value.toString();
  };

  const handleIncrement = () => {
    const currentValue = value !== null && value !== undefined ? value : 0;
    const newValue = currentValue + step;
    if (max === undefined || newValue <= max) {
      onChange(newValue);
      setLocalValue(newValue.toString());
    }
  };

  const handleDecrement = () => {
    const currentValue = value !== null && value !== undefined ? value : 0;
    const newValue = currentValue - step;
    if (min === undefined || newValue >= min) {
      onChange(newValue);
      setLocalValue(newValue.toString());
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (inputValue === "" || inputValue === "-") {
      setLocalValue(inputValue);
      onChange(null);
      return;
    }

    let cleanValue = inputValue;
    if (locale) {
      cleanValue = cleanValue.replace(/[^0-9.-]/g, '');
    }

    const numberValue = Number(cleanValue);

    if (!isNaN(numberValue)) {
      if ((min === undefined || numberValue >= min) &&
          (max === undefined || numberValue <= max)) {
        setLocalValue(inputValue);
        onChange(numberValue);
      } else if (min !== undefined && numberValue < min) {
        setLocalValue(min.toString());
        onChange(min);
      } else if (max !== undefined && numberValue > max) {
        setLocalValue(max.toString());
        onChange(max);
      }
    }
  };

  const handleBlur = () => {
    setHasFocus(false);

    if (localValue === "" || localValue === "-") {
      if (required) {
        const defaultValue = min !== undefined ? min : 0;
        setLocalValue(defaultValue.toString());
        onChange(defaultValue);
      } else {
        setLocalValue("");
        onChange(null);
      }
    }
  };

  return (
    <div className={cn("space-y-2", customClass)} style={inputContainerStyle}>
      {label && !floatLabel && (
        <Label
          htmlFor={id}
          style={labelStyle}
          className={required ? "after:content-['*'] after:ml-1 after:text-red-600" : ""}
        >
          {label}
        </Label>
      )}
      <div
        className={cn(
          "relative flex",
          showButtons && buttonLayout === "horizontal" && "items-center",
          showButtons && buttonLayout === "vertical" && "flex-col"
        )}
        style={{ width: labelPosition === "left" ? `${100 - labelWidth}%` : "100%" }}
      >
        {floatLabel && label && (
          <Label
            htmlFor={id}
            className={cn(
              "absolute transition-all duration-200 pointer-events-none z-10",
              (hasFocus || (value !== null && value !== undefined)) ? "-top-3 left-2 bg-white px-1 text-xs" : "top-1/2 left-3 -translate-y-1/2"
            )}
            style={{
              color: hasFocus ? (colors.focus || "#3b82f6") : (colors.label || "#64748b")
            }}
          >
            {label}
          </Label>
        )}

        {showButtons && buttonLayout === "horizontal" && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleDecrement}
            disabled={disabled || (min !== undefined && (value === null || value === undefined || value <= min))}
            className="h-8 w-8"
          >
            <Minus className="h-3 w-3" />
          </Button>
        )}

        <div className="relative flex-1">
          {prefix && (
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">
              {prefix}
            </span>
          )}
          <Input
            id={id}
            type="text"
            value={localValue}
            onChange={handleChange}
            onFocus={() => setHasFocus(true)}
            onBlur={handleBlur}
            placeholder={floatLabel && label ? "" : placeholder}
            disabled={disabled}
            aria-label={ariaLabel || label}
            required={required}
            style={{
              ...inputStyle,
              paddingLeft: prefix ? "2rem" : inputStyle.padding,
              paddingRight: suffix ? "2rem" : inputStyle.padding
            }}
            className={cn(
              "focus:ring-1 focus:ring-offset-0",
              hasFocus && "outline-none",
              invalid && "border-red-500 focus:ring-red-500",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          />
          {suffix && (
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
              {suffix}
            </span>
          )}
        </div>

        {showButtons && buttonLayout === "horizontal" && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleIncrement}
            disabled={disabled || (max !== undefined && (value !== null && value !== undefined && value >= max))}
            className="h-8 w-8"
          >
            <Plus className="h-3 w-3" />
          </Button>
        )}

        {showButtons && buttonLayout === "vertical" && (
          <div className="flex">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleDecrement}
              disabled={disabled || (min !== undefined && (value === null || value === undefined || value <= min))}
              className="h-8 w-8 rounded-r-none"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleIncrement}
              disabled={disabled || (max !== undefined && (value !== null && value !== undefined && value >= max))}
              className="h-8 w-8 rounded-l-none"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
      {helpText && (
        <p className={cn("text-sm", invalid ? "text-red-500" : "text-gray-500")}>{helpText}</p>
      )}
    </div>
  );
};

export default NumberInputField;
