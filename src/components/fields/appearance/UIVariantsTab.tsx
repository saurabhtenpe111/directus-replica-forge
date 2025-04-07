
import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { validateUIVariant } from "@/utils/inputAdapters";
import { toast } from "@/hooks/use-toast";

interface UIVariantsTabProps {
  settings: any;
  onUpdate: (settings: any) => void;
}

export function UIVariantsTab({ settings, onUpdate }: UIVariantsTabProps) {
  const variants = [
    {
      id: 'standard',
      name: 'Standard',
      description: 'Classic input with full border',
      preview: (
        <div className="border rounded-md p-2 w-full">
          <span className="text-sm">Sample text</span>
        </div>
      )
    },
    {
      id: 'material',
      name: 'Material',
      description: 'Modern with floating label',
      preview: (
        <div className="relative border-b-2 p-2 w-full">
          <div className="absolute -top-2 left-0 text-xs text-blue-500">Email</div>
          <span className="text-sm">user@example.com</span>
        </div>
      )
    },
    {
      id: 'pill',
      name: 'Pill',
      description: 'Rounded with soft appearance',
      preview: (
        <div className="border rounded-full p-2 px-4 w-full">
          <span className="text-sm">Sample text</span>
        </div>
      )
    },
    {
      id: 'borderless',
      name: 'Borderless',
      description: 'Clean with background only',
      preview: (
        <div className="bg-gray-100 rounded-md p-2 w-full">
          <span className="text-sm">Sample text</span>
        </div>
      )
    },
    {
      id: 'underlined',
      name: 'Underlined',
      description: 'Minimal with bottom border',
      preview: (
        <div className="border-b p-2 w-full">
          <span className="text-sm">Sample text</span>
        </div>
      )
    }
  ];

  // Ensure we have a valid UI variant or default to 'standard'
  const currentVariant = validateUIVariant(settings.uiVariant);
  
  // Log current variant for debugging
  useEffect(() => {
    console.log(`Current UI variant in UIVariantsTab: ${currentVariant}`);
  }, [currentVariant]);

  const handleVariantChange = (value: string) => {
    const validVariant = validateUIVariant(value);
    console.log('UI Variant selected:', validVariant);
    
    // Update the UI variant in settings
    const updatedSettings = {
      ...settings,
      uiVariant: validVariant
    };
    
    // Call the onUpdate callback with the updated settings
    onUpdate(updatedSettings);
    
    // Log the updated settings for debugging
    console.log('Updated settings:', updatedSettings);
    
    // Show toast notification
    toast({
      title: "UI variant updated",
      description: `Changed UI variant to ${validVariant}`,
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">UI Variants</h3>
      <p className="text-sm text-gray-500">
        Select a predefined style for your input field
      </p>

      <RadioGroup
        value={currentVariant}
        onValueChange={handleVariantChange}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2"
      >
        {variants.map((variant) => (
          <div key={variant.id} className="relative">
            <RadioGroupItem
              value={variant.id}
              id={`ui-variant-${variant.id}`}
              className="sr-only"
            />
            <Label
              htmlFor={`ui-variant-${variant.id}`}
              className={cn(
                "cursor-pointer flex flex-col h-full border rounded-md p-4 hover:border-primary transition-colors",
                currentVariant === variant.id && "border-2 border-primary"
              )}
            >
              <span className="font-medium mb-2">{variant.name}</span>
              <div className="mb-2">
                {variant.preview}
              </div>
              <span className="text-xs text-gray-500">{variant.description}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
