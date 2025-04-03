
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, Sun, Moon, Palette, Code, EyeOff, Eye } from "lucide-react";
import { InputTextField } from "../fields/inputs/InputTextField";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

// Color palette for field styling
const colorOptions = [
  { name: "Neutral Gray", value: "#8E9196" },
  { name: "Primary Purple", value: "#9b87f5" },
  { name: "Secondary Purple", value: "#7E69AB" },
  { name: "Dark Purple", value: "#1A1F2C" },
  { name: "Light Purple", value: "#D6BCFA" },
  { name: "Soft Green", value: "#F2FCE2" },
  { name: "Soft Yellow", value: "#FEF7CD" },
  { name: "Soft Orange", value: "#FEC6A1" },
  { name: "Soft Purple", value: "#E5DEFF" },
  { name: "Soft Pink", value: "#FFDEE2" },
  { name: "Soft Peach", value: "#FDE1D3" },
  { name: "Soft Blue", value: "#D3E4FD" },
  { name: "Soft Gray", value: "#F1F0FB" },
  { name: "Vivid Purple", value: "#8B5CF6" },
  { name: "Ocean Blue", value: "#0EA5E9" },
  { name: "Bright Orange", value: "#F97316" },
];

interface FieldAppearancePanelProps {
  form: UseFormReturn<any>;
  fieldType: string | null;
}

export function FieldAppearancePanel({ form, fieldType }: FieldAppearancePanelProps) {
  const [displayMode, setDisplayMode] = useState("default");
  const [activeTab, setActiveTab] = useState("variants");
  const [themeMode, setThemeMode] = useState("light");
  const [previewValue, setPreviewValue] = useState("Sample text");
  const [customCSS, setCustomCSS] = useState("");
  const [selectedColorScheme, setSelectedColorScheme] = useState("default");
  const [floatLabel, setFloatLabel] = useState(false);
  
  if (!fieldType) {
    return <p className="text-gray-500">Please select a field type first</p>;
  }

  // Preview component based on current settings
  const renderPreviewField = () => {
    const baseClasses = `w-full rounded-md border p-2 ${
      themeMode === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
    }`;
    
    // Apply custom color scheme
    let colorClasses = "";
    if (selectedColorScheme === "purple") {
      colorClasses = "border-purple-400 focus:border-purple-600 focus:ring-purple-600";
    } else if (selectedColorScheme === "blue") {
      colorClasses = "border-blue-400 focus:border-blue-600 focus:ring-blue-600";
    } else if (selectedColorScheme === "orange") {
      colorClasses = "border-orange-400 focus:border-orange-600 focus:ring-orange-600";
    }
    
    // Apply custom size variants
    let sizeClasses = "";
    if (displayMode === "compact") {
      sizeClasses = "text-sm py-1 px-2";
    } else if (displayMode === "expanded") {
      sizeClasses = "text-lg py-3 px-4";
    }
    
    // Apply float label styling
    let containerClasses = "relative";
    if (floatLabel) {
      containerClasses += " pt-6";
    }

    return (
      <div className={`p-6 rounded-lg ${themeMode === "dark" ? "bg-gray-900" : "bg-gray-100"}`}>
        <div className={containerClasses}>
          {floatLabel && (
            <Label
              className={`absolute left-3 -top-3 px-1 text-xs z-10 ${
                themeMode === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-700"
              }`}
            >
              Field Label
            </Label>
          )}
          
          {fieldType === "text" && (
            <Input
              className={`${baseClasses} ${colorClasses} ${sizeClasses}`}
              placeholder="Enter value..."
              value={previewValue}
              onChange={(e) => setPreviewValue(e.target.value)}
              style={{ ...(customCSS ? { cssText: customCSS } : {}) }}
            />
          )}
          
          {fieldType === "textarea" && (
            <Textarea
              className={`${baseClasses} ${colorClasses} ${sizeClasses}`}
              placeholder="Enter text here..."
              value={previewValue}
              onChange={(e) => setPreviewValue(e.target.value)}
              style={{ ...(customCSS ? { cssText: customCSS } : {}) }}
            />
          )}
          
          {(fieldType !== "text" && fieldType !== "textarea") && (
            <InputTextField
              label={floatLabel ? undefined : "Field Label"}
              floatLabel={floatLabel}
              placeholder="Sample field"
              value={previewValue}
              onChange={(e) => setPreviewValue(e.target.value)}
              className={`${colorClasses} ${sizeClasses}`}
              size={displayMode === "compact" ? "small" : displayMode === "expanded" ? "large" : "medium"}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="variants">UI Variants</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="custom">Custom CSS</TabsTrigger>
        </TabsList>
        
        <TabsContent value="variants">
          <div className="space-y-6">
            <div className="mb-6">
              <h3 className="text-base font-medium mb-3">Preview</h3>
              {renderPreviewField()}
            </div>
          
            <FormField
              control={form.control}
              name="ui_options.display_mode"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Field Size</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={value => {
                        field.onChange(value);
                        setDisplayMode(value);
                      }}
                      defaultValue={field.value || "default"}
                      className="grid grid-cols-3 gap-4"
                    >
                      <FormItem className="flex flex-col items-center space-y-2 rounded-md border p-4 cursor-pointer hover:bg-gray-50">
                        <FormControl>
                          <RadioGroupItem value="compact" className="sr-only" />
                        </FormControl>
                        <div className={`w-full text-center p-1 ${displayMode === "compact" ? "bg-blue-100 text-blue-800 font-medium" : "bg-gray-100"}`}>
                          Compact
                        </div>
                        <FormDescription className="text-center text-xs">
                          Smaller input size
                        </FormDescription>
                      </FormItem>
                      <FormItem className="flex flex-col items-center space-y-2 rounded-md border p-4 cursor-pointer hover:bg-gray-50">
                        <FormControl>
                          <RadioGroupItem value="default" className="sr-only" />
                        </FormControl>
                        <div className={`w-full text-center p-2 ${displayMode === "default" ? "bg-blue-100 text-blue-800 font-medium" : "bg-gray-100"}`}>
                          Default
                        </div>
                        <FormDescription className="text-center text-xs">
                          Standard input field
                        </FormDescription>
                      </FormItem>
                      <FormItem className="flex flex-col items-center space-y-2 rounded-md border p-4 cursor-pointer hover:bg-gray-50">
                        <FormControl>
                          <RadioGroupItem value="expanded" className="sr-only" />
                        </FormControl>
                        <div className={`w-full text-center p-3 ${displayMode === "expanded" ? "bg-blue-100 text-blue-800 font-medium" : "bg-gray-100"}`}>
                          Expanded
                        </div>
                        <FormDescription className="text-center text-xs">
                          Larger input size
                        </FormDescription>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Floating Label</FormLabel>
                <FormDescription>
                  Label floats above the field when focused or filled
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={floatLabel}
                  onCheckedChange={setFloatLabel}
                />
              </FormControl>
            </div>
            
            {fieldType === 'text' || fieldType === 'textarea' ? (
              <>
                <FormField
                  control={form.control}
                  name="ui_options.showCharCount"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Show Character Count</FormLabel>
                        <FormDescription>
                          Display the number of characters entered
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="ui_options.width"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel>Field Width</FormLabel>
                        <span className="text-sm text-gray-500">{field.value || 100}%</span>
                      </div>
                      <FormControl>
                        <Slider
                          value={[field.value || 100]}
                          min={25}
                          max={100}
                          step={25}
                          onValueChange={(value) => field.onChange(value[0])}
                          className="my-2"
                        />
                      </FormControl>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>25%</span>
                        <span>50%</span>
                        <span>75%</span>
                        <span>100%</span>
                      </div>
                    </FormItem>
                  )}
                />
              </>
            ) : null}
          </div>
        </TabsContent>
        
        <TabsContent value="colors">
          <div className="space-y-6">
            <div className="mb-6">
              <h3 className="text-base font-medium mb-3">Preview</h3>
              {renderPreviewField()}
            </div>
          
            <FormItem className="space-y-3">
              <FormLabel>Color Scheme</FormLabel>
              <div className="grid grid-cols-3 gap-3">
                <div 
                  className={`flex flex-col items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${selectedColorScheme === 'default' ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => setSelectedColorScheme('default')}
                >
                  <div className="h-8 w-8 rounded-full bg-gray-400 mb-2"></div>
                  <span className="text-sm">Default</span>
                </div>
                <div 
                  className={`flex flex-col items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${selectedColorScheme === 'purple' ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => setSelectedColorScheme('purple')}
                >
                  <div className="h-8 w-8 rounded-full bg-purple-500 mb-2"></div>
                  <span className="text-sm">Purple</span>
                </div>
                <div 
                  className={`flex flex-col items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${selectedColorScheme === 'blue' ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => setSelectedColorScheme('blue')}
                >
                  <div className="h-8 w-8 rounded-full bg-blue-500 mb-2"></div>
                  <span className="text-sm">Blue</span>
                </div>
                <div 
                  className={`flex flex-col items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${selectedColorScheme === 'orange' ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => setSelectedColorScheme('orange')}
                >
                  <div className="h-8 w-8 rounded-full bg-orange-500 mb-2"></div>
                  <span className="text-sm">Orange</span>
                </div>
              </div>
            </FormItem>
            
            <FormItem>
              <FormLabel>Color Palette</FormLabel>
              <div className="grid grid-cols-5 md:grid-cols-8 gap-2 mt-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    className="w-full aspect-square rounded-md border p-1 cursor-pointer hover:opacity-80"
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                    onClick={() => {
                      // In a full implementation, this would apply the color
                      setCustomCSS(`border-color: ${color.value}; color: ${color.value}; focus:border-color: ${color.value};`);
                    }}
                  />
                ))}
              </div>
              <FormDescription className="mt-2">
                Click a color to apply it to the field border
              </FormDescription>
            </FormItem>
          </div>
        </TabsContent>
        
        <TabsContent value="theme">
          <div className="space-y-6">
            <div className="mb-6">
              <h3 className="text-base font-medium mb-3">Preview</h3>
              {renderPreviewField()}
            </div>
          
            <FormItem>
              <FormLabel>Theme Mode</FormLabel>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <button
                  type="button"
                  onClick={() => setThemeMode("light")}
                  className={`flex items-center justify-center gap-2 p-3 rounded-md border ${
                    themeMode === "light" ? "border-blue-500 bg-blue-50 text-blue-700" : "hover:bg-gray-50"
                  }`}
                >
                  <Sun size={18} />
                  <span>Light Mode</span>
                </button>
                <button
                  type="button"
                  onClick={() => setThemeMode("dark")}
                  className={`flex items-center justify-center gap-2 p-3 rounded-md border ${
                    themeMode === "dark" ? "border-blue-500 bg-blue-50 text-blue-700" : "hover:bg-gray-50"
                  }`}
                >
                  <Moon size={18} />
                  <span>Dark Mode</span>
                </button>
              </div>
            </FormItem>
            
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div>
                <h3 className="text-sm font-medium">Input Value</h3>
                <p className="text-xs text-gray-500">Change the preview text</p>
              </div>
              <Input
                value={previewValue}
                onChange={(e) => setPreviewValue(e.target.value)}
                className="w-40"
                placeholder="Enter value"
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="custom">
          <div className="space-y-6">
            <div className="mb-6">
              <h3 className="text-base font-medium mb-3">Preview</h3>
              {renderPreviewField()}
            </div>
          
            <FormItem>
              <div className="flex items-center justify-between mb-2">
                <FormLabel>Custom CSS</FormLabel>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCustomCSS("")}
                    className="h-7 px-2 text-xs"
                  >
                    Reset
                  </Button>
                </div>
              </div>
              <Textarea
                value={customCSS}
                onChange={(e) => setCustomCSS(e.target.value)}
                placeholder="border-color: #9b87f5; background-color: #F8F8F8;"
                className="font-mono text-sm"
                rows={6}
              />
              <FormDescription className="mt-2 flex items-center gap-1">
                <Code size={14} />
                <span>Enter CSS properties to style the input field</span>
              </FormDescription>
            </FormItem>
            
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm font-medium flex items-center gap-1 mb-2">
                  <Palette size={14} />
                  <span>CSS Property Examples</span>
                </h3>
                <div className="text-xs space-y-1 font-mono text-gray-700">
                  <p><span className="text-purple-600">border-color</span>: #9b87f5;</p>
                  <p><span className="text-purple-600">background-color</span>: #F8F8F8;</p>
                  <p><span className="text-purple-600">color</span>: #333;</p>
                  <p><span className="text-purple-600">border-radius</span>: 8px;</p>
                  <p><span className="text-purple-600">box-shadow</span>: 0 2px 5px rgba(0,0,0,0.1);</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <FormField
        control={form.control}
        name="ui_options.hidden_in_forms"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel className="flex items-center gap-1">
                {field.value ? <EyeOff size={14} /> : <Eye size={14} />}
                <span>Hide in Forms</span>
              </FormLabel>
              <FormDescription>
                Field won't be visible when creating new content
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <div className="bg-blue-50 border border-blue-100 rounded-md p-4 flex gap-3">
        <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700">
          Additional appearance settings will be applied to all instances of this field.
          Theme settings will respect the global theme when in production.
        </p>
      </div>
    </div>
  );
}
