import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FieldValidationPanel } from './FieldValidationPanel';
import { FieldAppearancePanel } from './FieldAppearancePanel';
import { FieldAdvancedPanel } from './FieldAdvancedPanel';
import { InputTextField } from './inputs/InputTextField';
import { NumberInputField } from './inputs/NumberInputField';

const getFieldSchema = (fieldType: string | null) => {
  const baseSchema = {
    name: z.string().min(2, { message: "Field name must be at least 2 characters" }),
    description: z.string().optional(),
    helpText: z.string().optional(),
    required: z.boolean().default(false),
    ui_options: z.object({
      placeholder: z.string().optional(),
      help_text: z.string().optional(),
      display_mode: z.string().optional(),
      showCharCount: z.boolean().optional(),
      width: z.number().optional(),
      hidden_in_forms: z.boolean().optional(),
    }).optional().default({}),
  };

  switch (fieldType) {
    case 'text':
      return z.object({
        ...baseSchema,
        defaultValue: z.string().optional(),
        keyFilter: z.enum(['none', 'letters', 'numbers', 'alphanumeric']).optional(),
      });
    case 'number':
      return z.object({
        ...baseSchema,
        defaultValue: z.number().optional(),
        min: z.number().optional(),
        max: z.number().optional(),
      });
    default:
      return z.object(baseSchema);
  }
};

interface FieldConfigPanelProps {
  fieldType: string | null;
  fieldData?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
  onUpdateAdvanced: (data: any) => void;
}

export function FieldConfigPanel({ 
  fieldType, 
  fieldData, 
  onSave, 
  onCancel, 
  onUpdateAdvanced 
}: FieldConfigPanelProps) {
  const [activeTab, setActiveTab] = useState('general');
  const [validationSettings, setValidationSettings] = useState({});
  const [appearanceSettings, setAppearanceSettings] = useState({
    floatLabel: false,
    filled: false,
    showButtons: false,
    buttonLayout: "horizontal" as "horizontal" | "vertical",
    prefix: '',
    suffix: ''
  });
  const [advancedSettings, setAdvancedSettings] = useState({
    showButtons: false,
    buttonLayout: "horizontal" as "horizontal" | "vertical",
    prefix: '',
    suffix: ''
  });
  
  useEffect(() => {
    if (fieldData) {
      setValidationSettings(fieldData.validation || {});
      setAppearanceSettings({
        ...appearanceSettings,
        ...(fieldData.appearance || {})
      });
      setAdvancedSettings({
        ...advancedSettings,
        ...(fieldData.advanced || {})
      });
    }
  }, [fieldData]);
  
  const fieldSchema = getFieldSchema(fieldType);
  
  const form = useForm({
    resolver: zodResolver(fieldSchema),
    defaultValues: fieldData || {
      name: '',
      description: '',
      helpText: '',
      required: false,
      defaultValue: fieldType === 'number' ? 0 : '',
      ui_options: {
        placeholder: '',
        help_text: '',
        display_mode: 'default',
        showCharCount: false,
        width: 100,
        hidden_in_forms: false
      }
    }
  });

  const handleSubmit = (values: any) => {
    const combinedData = {
      ...values,
      validation: validationSettings,
      appearance: appearanceSettings,
      advanced: advancedSettings,
    };
    
    onSave(combinedData);
  };

  const handleUpdateValidation = (data: any) => {
    setValidationSettings(data);
  };

  const handleUpdateAppearance = (data: any) => {
    setAppearanceSettings(data);
  };

  const handleUpdateAdvanced = (data: any) => {
    setAdvancedSettings(data);
    onUpdateAdvanced(data);
  };

  const renderFieldPreview = () => {
    switch (fieldType) {
      case 'text':
        return (
          <div className="mt-4 p-4 border rounded-md">
            <h3 className="text-sm font-medium mb-2">Field Preview:</h3>
            <InputTextField
              id="preview-field"
              label={form.watch('name') || "Field Label"}
              placeholder={form.watch('ui_options.placeholder') || "Enter text..."}
              helpText={form.watch('helpText')}
              keyFilter={form.watch('keyFilter') || "none"}
              floatLabel={appearanceSettings.floatLabel}
              filled={appearanceSettings.filled}
            />
          </div>
        );
      case 'number':
        return (
          <div className="mt-4 p-4 border rounded-md">
            <h3 className="text-sm font-medium mb-2">Field Preview:</h3>
            <NumberInputField
              id="preview-number"
              value={0}
              onChange={() => {}}
              label={form.watch('name') || "Number Field"}
              min={form.watch('min')}
              max={form.watch('max')}
              placeholder={form.watch('ui_options.placeholder') || "Enter a number"}
              floatLabel={appearanceSettings.floatLabel}
              filled={appearanceSettings.filled}
              showButtons={advancedSettings.showButtons}
              buttonLayout={advancedSettings.buttonLayout || "horizontal"}
              prefix={advancedSettings.prefix}
              suffix={advancedSettings.suffix}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="validation">Validation</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field Name <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Enter field name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter field description" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="helpText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Help Text</FormLabel>
                    <FormControl>
                      <Input placeholder="Additional help text" {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide additional context or guidance for this field
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="required"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Required Field</FormLabel>
                      <FormDescription>
                        Make this field mandatory for content creation
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
              
              {renderFieldPreview()}
            </div>
          </TabsContent>
          
          <TabsContent value="validation">
            <FieldValidationPanel 
              fieldType={fieldType}
              initialData={fieldData?.validation}
              onUpdate={handleUpdateValidation}
            />
          </TabsContent>
          
          <TabsContent value="appearance">
            <FieldAppearancePanel 
              form={form} 
              fieldType={fieldType}
              initialData={fieldData?.appearance}
              onUpdate={handleUpdateAppearance}
            />
          </TabsContent>
          
          <TabsContent value="advanced">
            <FieldAdvancedPanel 
              fieldType={fieldType}
              initialData={fieldData?.advanced}
              onSave={handleUpdateAdvanced}
            />
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-4 mt-6">
          <button 
            type="button" 
            onClick={onCancel} 
            className="px-4 py-2 text-sm border rounded"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Field
          </button>
        </div>
      </form>
    </Form>
  );
}

export default FieldConfigPanel;
