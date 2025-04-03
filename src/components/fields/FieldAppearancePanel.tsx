
import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  FormItem, 
  FormLabel, 
  FormControl,
  FormDescription
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Fix this interface to include initialData
export interface FieldAppearancePanelProps {
  form: UseFormReturn<any, any, undefined>;
  fieldType: string | null;
  initialData?: any;
  onUpdate: (data: any) => void;
}

export function FieldAppearancePanel({ 
  form, 
  fieldType, 
  initialData = {},
  onUpdate 
}: FieldAppearancePanelProps) {
  const [activeTab, setActiveTab] = useState('display');
  const [textAlign, setTextAlign] = useState(initialData?.textAlign || 'left');
  const [labelPosition, setLabelPosition] = useState(initialData?.labelPosition || 'top');
  const [labelWidth, setLabelWidth] = useState(initialData?.labelWidth || 30);
  const [floatLabel, setFloatLabel] = useState(initialData?.floatLabel || false);
  const [filled, setFilled] = useState(initialData?.filled || false);
  const [showBorder, setShowBorder] = useState(initialData?.showBorder !== false);
  const [showBackground, setShowBackground] = useState(initialData?.showBackground || false);
  const [roundedCorners, setRoundedCorners] = useState(initialData?.roundedCorners || 'medium');
  const [fieldSize, setFieldSize] = useState(initialData?.fieldSize || 'medium');
  const [labelSize, setLabelSize] = useState(initialData?.labelSize || 'medium');
  const [previewStyle, setPreviewStyle] = useState<React.CSSProperties>({});
  const [previewLabelStyle, setPreviewLabelStyle] = useState<React.CSSProperties>({});
  const [previewInputStyle, setPreviewInputStyle] = useState<React.CSSProperties>({});

  // Update settings when any option changes
  const updateSettings = () => {
    const settings = {
      textAlign,
      labelPosition,
      labelWidth,
      floatLabel,
      filled,
      showBorder,
      showBackground,
      roundedCorners,
      fieldSize,
      labelSize
    };
    
    onUpdate(settings);
    updatePreviewStyles(settings);
  };
  
  // Update preview styles based on settings
  const updatePreviewStyles = (settings: any) => {
    // Label styles
    const labelStyle: React.CSSProperties = {
      fontSize: settings.labelSize === 'small' ? '0.875rem' : 
               settings.labelSize === 'medium' ? '1rem' : '1.125rem',
      marginBottom: settings.labelPosition === 'top' ? '0.5rem' : '0',
      width: settings.labelPosition === 'left' ? `${settings.labelWidth}%` : 'auto',
      textAlign: settings.textAlign as 'left' | 'center' | 'right'
    };
    
    // Input styles
    const inputStyle: React.CSSProperties = {
      backgroundColor: settings.filled ? '#f1f5f9' : 'transparent',
      border: settings.showBorder ? '1px solid #cbd5e1' : 'none',
      borderRadius: settings.roundedCorners === 'none' ? '0' : 
                   settings.roundedCorners === 'small' ? '0.25rem' : 
                   settings.roundedCorners === 'medium' ? '0.375rem' : '0.5rem',
      padding: settings.fieldSize === 'small' ? '0.375rem 0.5rem' : 
              settings.fieldSize === 'medium' ? '0.5rem 0.75rem' : '0.75rem 1rem',
      fontSize: settings.fieldSize === 'small' ? '0.875rem' : 
               settings.fieldSize === 'medium' ? '1rem' : '1.125rem',
      width: settings.labelPosition === 'left' ? `${100 - settings.labelWidth}%` : '100%',
    };
    
    // Container style
    const containerStyle: React.CSSProperties = {
      display: settings.labelPosition === 'left' ? 'flex' : 'block',
      alignItems: settings.labelPosition === 'left' ? 'center' : 'flex-start',
    };
    
    setPreviewLabelStyle(labelStyle);
    setPreviewInputStyle(inputStyle);
    setPreviewStyle(containerStyle);
  };
  
  // Effect to update preview on initial load
  React.useEffect(() => {
    updateSettings();
  }, []);
  
  // Handle changes to any setting
  const handleSettingChange = (setting: string, value: any) => {
    switch (setting) {
      case 'textAlign':
        setTextAlign(value);
        break;
      case 'labelPosition':
        setLabelPosition(value);
        break;
      case 'labelWidth':
        setLabelWidth(value);
        break;
      case 'floatLabel':
        setFloatLabel(value);
        break;
      case 'filled':
        setFilled(value);
        break;
      case 'showBorder':
        setShowBorder(value);
        break;
      case 'showBackground':
        setShowBackground(value);
        break;
      case 'roundedCorners':
        setRoundedCorners(value);
        break;
      case 'fieldSize':
        setFieldSize(value);
        break;
      case 'labelSize':
        setLabelSize(value);
        break;
      default:
        break;
    }
    
    // Update parent after state changes
    setTimeout(() => {
      updateSettings();
    }, 0);
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="display">Display</TabsTrigger>
          <TabsTrigger value="spacing">Spacing</TabsTrigger>
          <TabsTrigger value="extras">Extras</TabsTrigger>
        </TabsList>
        
        <TabsContent value="display" className="space-y-4">
          <FormItem>
            <FormLabel>Text Alignment</FormLabel>
            <FormControl>
              <div className="flex border rounded-md p-1 gap-1">
                <button
                  type="button"
                  onClick={() => handleSettingChange('textAlign', 'left')}
                  className={cn(
                    "flex-1 py-2 text-center text-sm font-medium rounded-sm",
                    textAlign === 'left' ? "bg-blue-100 text-blue-800" : "hover:bg-gray-100"
                  )}
                >
                  Left
                </button>
                <button
                  type="button"
                  onClick={() => handleSettingChange('textAlign', 'center')}
                  className={cn(
                    "flex-1 py-2 text-center text-sm font-medium rounded-sm",
                    textAlign === 'center' ? "bg-blue-100 text-blue-800" : "hover:bg-gray-100"
                  )}
                >
                  Center
                </button>
                <button
                  type="button"
                  onClick={() => handleSettingChange('textAlign', 'right')}
                  className={cn(
                    "flex-1 py-2 text-center text-sm font-medium rounded-sm",
                    textAlign === 'right' ? "bg-blue-100 text-blue-800" : "hover:bg-gray-100"
                  )}
                >
                  Right
                </button>
              </div>
            </FormControl>
          </FormItem>
          
          <FormItem>
            <FormLabel>Label Position</FormLabel>
            <FormControl>
              <Select
                value={labelPosition}
                onValueChange={(value) => handleSettingChange('labelPosition', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select label position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top">Top</SelectItem>
                  <SelectItem value="left">Left</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
          
          {labelPosition === 'left' && (
            <FormItem>
              <FormLabel>Label Width (%)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="10"
                  max="50"
                  value={labelWidth}
                  onChange={(e) => handleSettingChange('labelWidth', parseInt(e.target.value))}
                  className="w-full"
                />
              </FormControl>
              <FormDescription>
                Percentage of container width for the label
              </FormDescription>
            </FormItem>
          )}
          
          <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-3 shadow-sm">
            <div>
              <FormLabel>Float Label</FormLabel>
              <FormDescription>
                Label floats inside input when focused
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={floatLabel}
                onCheckedChange={(checked) => handleSettingChange('floatLabel', checked)}
              />
            </FormControl>
          </FormItem>
          
          <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-3 shadow-sm">
            <div>
              <FormLabel>Filled Style</FormLabel>
              <FormDescription>
                Use filled style for input fields
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={filled}
                onCheckedChange={(checked) => handleSettingChange('filled', checked)}
              />
            </FormControl>
          </FormItem>
        </TabsContent>
        
        <TabsContent value="spacing" className="space-y-4">
          <FormItem>
            <FormLabel>Field Size</FormLabel>
            <FormControl>
              <Select
                value={fieldSize}
                onValueChange={(value) => handleSettingChange('fieldSize', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select field size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
          
          <FormItem>
            <FormLabel>Label Size</FormLabel>
            <FormControl>
              <Select
                value={labelSize}
                onValueChange={(value) => handleSettingChange('labelSize', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select label size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
          
          <FormItem>
            <FormLabel>Corner Rounding</FormLabel>
            <FormControl>
              <Select
                value={roundedCorners}
                onValueChange={(value) => handleSettingChange('roundedCorners', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select corner style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
          
          <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-3 shadow-sm">
            <div>
              <FormLabel>Show Border</FormLabel>
              <FormDescription>
                Display border around input fields
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={showBorder}
                onCheckedChange={(checked) => handleSettingChange('showBorder', checked)}
              />
            </FormControl>
          </FormItem>
          
          <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-3 shadow-sm">
            <div>
              <FormLabel>Show Background</FormLabel>
              <FormDescription>
                Display background for input fields
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={showBackground}
                onCheckedChange={(checked) => handleSettingChange('showBackground', checked)}
              />
            </FormControl>
          </FormItem>
        </TabsContent>
        
        <TabsContent value="extras" className="space-y-4">
          {fieldType === 'text' && (
            <>
              <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-3 shadow-sm">
                <div>
                  <FormLabel>Show Character Count</FormLabel>
                  <FormDescription>
                    Display remaining character count
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={form.watch('ui_options.showCharCount') || false}
                    onCheckedChange={(checked) => {
                      form.setValue('ui_options.showCharCount', checked);
                    }}
                  />
                </FormControl>
              </FormItem>
            </>
          )}
          
          {fieldType === 'textarea' && (
            <>
              <FormItem>
                <FormLabel>Textarea Rows</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="2"
                    max="20"
                    value={form.watch('ui_options.rows') || 3}
                    onChange={(e) => {
                      form.setValue('ui_options.rows', parseInt(e.target.value));
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Number of visible rows in the textarea
                </FormDescription>
              </FormItem>
              
              <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-3 shadow-sm">
                <div>
                  <FormLabel>Auto Resize</FormLabel>
                  <FormDescription>
                    Automatically resize based on content
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={form.watch('ui_options.autoResize') || false}
                    onCheckedChange={(checked) => {
                      form.setValue('ui_options.autoResize', checked);
                    }}
                  />
                </FormControl>
              </FormItem>
            </>
          )}
          
          <FormItem>
            <FormLabel>Custom CSS Class</FormLabel>
            <FormControl>
              <Input
                value={form.watch('ui_options.customClass') || ''}
                onChange={(e) => {
                  form.setValue('ui_options.customClass', e.target.value);
                }}
                placeholder="E.g., my-custom-input"
              />
            </FormControl>
            <FormDescription>
              Add custom CSS classes to the field
            </FormDescription>
          </FormItem>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 border rounded-lg p-4">
        <h3 className="text-sm font-medium mb-3">Preview</h3>
        <div style={previewStyle}>
          <label 
            className="block text-gray-700"
            style={previewLabelStyle}
          >
            Field Label
          </label>
          <input
            type="text"
            className="border px-3 py-2 w-full rounded"
            placeholder="Field placeholder"
            style={previewInputStyle}
          />
        </div>
      </div>
    </div>
  );
}

export default FieldAppearancePanel;
