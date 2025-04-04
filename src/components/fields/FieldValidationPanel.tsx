
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { 
  FormItem, 
  FormLabel, 
  FormControl,
  FormDescription
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export interface FieldValidationPanelProps {
  fieldType: string | null;
  initialData?: any;
  onUpdate: (data: any) => void;
}

export function FieldValidationPanel({ fieldType, initialData = {}, onUpdate }: FieldValidationPanelProps) {
  const [validationType, setValidationType] = useState(initialData.type || 'none');
  const [minLength, setMinLength] = useState(initialData.minLength || 0);
  const [maxLength, setMaxLength] = useState(initialData.maxLength || 100);
  const [required, setRequired] = useState(initialData.required || false);
  const [pattern, setPattern] = useState(initialData.pattern || '');
  const [customMessage, setCustomMessage] = useState(initialData.customMessage || '');
  const [min, setMin] = useState(initialData.min || 0);
  const [max, setMax] = useState(initialData.max || 100);
  
  useEffect(() => {
    handleUpdateValidation();
  }, [validationType, minLength, maxLength, required, pattern, customMessage, min, max]);
  
  const handleUpdateValidation = () => {
    const validationData = {
      type: validationType,
      required,
      customMessage,
      ...(validationType !== 'none' && {
        ...(fieldType === 'text' && {
          minLength: parseInt(minLength as any),
          maxLength: parseInt(maxLength as any),
          pattern
        }),
        ...(fieldType === 'number' && {
          min: parseInt(min as any),
          max: parseInt(max as any)
        })
      })
    };
    
    onUpdate(validationData);
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Validation Rules</h3>
      <p className="text-sm text-gray-500">
        Configure validation rules for this field
      </p>
      
      <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-3 shadow-sm">
        <div>
          <FormLabel>Required Field</FormLabel>
          <FormDescription>
            User must provide a value for this field
          </FormDescription>
        </div>
        <FormControl>
          <Switch
            checked={required}
            onCheckedChange={setRequired}
          />
        </FormControl>
      </FormItem>
      
      <FormItem>
        <FormLabel>Validation Type</FormLabel>
        <Select
          value={validationType}
          onValueChange={setValidationType}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select validation type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {fieldType === 'text' && (
              <>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="url">URL</SelectItem>
                <SelectItem value="alphanumeric">Alphanumeric only</SelectItem>
                <SelectItem value="pattern">Custom Pattern (RegExp)</SelectItem>
              </>
            )}
            {fieldType === 'number' && (
              <>
                <SelectItem value="range">Range</SelectItem>
                <SelectItem value="positive">Positive only</SelectItem>
                <SelectItem value="integer">Integer only</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </FormItem>
      
      {validationType !== 'none' && fieldType === 'text' && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <FormItem>
              <FormLabel>Minimum Length</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  value={minLength}
                  onChange={(e) => setMinLength(parseInt(e.target.value))}
                />
              </FormControl>
            </FormItem>
            
            <FormItem>
              <FormLabel>Maximum Length</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="1" 
                  value={maxLength}
                  onChange={(e) => setMaxLength(parseInt(e.target.value))}
                />
              </FormControl>
            </FormItem>
          </div>
          
          {validationType === 'pattern' && (
            <FormItem>
              <FormLabel>Regular Expression Pattern</FormLabel>
              <FormControl>
                <Input 
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder="e.g. ^[a-zA-Z0-9]+$"
                />
              </FormControl>
              <FormDescription>
                Enter a valid JavaScript regular expression
              </FormDescription>
            </FormItem>
          )}
        </>
      )}
      
      {validationType !== 'none' && fieldType === 'number' && (
        <div className="grid grid-cols-2 gap-4">
          <FormItem>
            <FormLabel>Minimum Value</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                value={min}
                onChange={(e) => setMin(parseInt(e.target.value))}
              />
            </FormControl>
          </FormItem>
          
          <FormItem>
            <FormLabel>Maximum Value</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                value={max}
                onChange={(e) => setMax(parseInt(e.target.value))}
              />
            </FormControl>
          </FormItem>
        </div>
      )}
      
      {validationType !== 'none' && (
        <FormItem>
          <FormLabel>Custom Error Message</FormLabel>
          <FormControl>
            <Textarea 
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Enter a custom error message to display when validation fails"
            />
          </FormControl>
        </FormItem>
      )}
    </div>
  );
}

export default FieldValidationPanel;
