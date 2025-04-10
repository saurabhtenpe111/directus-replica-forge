
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GeneralSettings } from '@/utils/fieldSettingsHelpers';
import { 
  generateInitialGeneralSettings, 
  validateGeneralSettings 
} from '@/utils/generalSettingsHelpers';
import { Separator } from '@/components/ui/separator';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FieldGeneralSettingsProps {
  fieldType: string | null;
  initialData?: GeneralSettings;
  onUpdate: (data: GeneralSettings) => void;
  fieldName?: string;
  fieldApiId?: string;
}

export function FieldGeneralSettings({
  fieldType,
  initialData,
  onUpdate,
  fieldName = 'Field',
  fieldApiId = 'field',
}: FieldGeneralSettingsProps) {
  // Initialize settings based on field type if no initial data
  const [settings, setSettings] = useState<GeneralSettings>(() => {
    if (initialData) return initialData;
    return generateInitialGeneralSettings(fieldType, fieldName, fieldApiId);
  });
  
  // Validation state
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // Update settings when initialData changes
  useEffect(() => {
    if (initialData) {
      setSettings(initialData);
    }
  }, [initialData]);
  
  // Handle setting updates
  const updateSetting = <K extends keyof GeneralSettings>(
    key: K, 
    value: GeneralSettings[K]
  ) => {
    const updatedSettings = {
      ...settings,
      [key]: value
    };
    
    // Validate settings
    const error = validateGeneralSettings(updatedSettings, fieldType);
    setValidationError(error);
    
    // Update settings and notify parent
    setSettings(updatedSettings);
    if (!error) {
      onUpdate(updatedSettings);
    }
  };
  
  // Render field type-specific settings
  const renderFieldSpecificSettings = () => {
    switch (fieldType) {
      case 'text':
      case 'email':
      case 'url':
      case 'password':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="keyFilter">Key Filter</Label>
              <Select
                value={settings.keyFilter || 'none'}
                onValueChange={(value) => updateSetting('keyFilter', value as any)}
              >
                <SelectTrigger id="keyFilter">
                  <SelectValue placeholder="Select key filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="letters">Letters only</SelectItem>
                  <SelectItem value="numbers">Numbers only</SelectItem>
                  <SelectItem value="alphanumeric">Alphanumeric</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Restrict what characters can be entered
              </p>
            </div>
          </div>
        );
        
      case 'number':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min">Minimum Value</Label>
                <Input
                  id="min"
                  type="number"
                  value={settings.min ?? ''}
                  onChange={(e) => updateSetting('min', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="No minimum"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="max">Maximum Value</Label>
                <Input
                  id="max"
                  type="number"
                  value={settings.max ?? ''}
                  onChange={(e) => updateSetting('max', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="No maximum"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prefix">Prefix</Label>
                <Input 
                  id="prefix"
                  value={settings.prefix || ''}
                  onChange={(e) => updateSetting('prefix', e.target.value)}
                  placeholder="e.g. $"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="suffix">Suffix</Label>
                <Input 
                  id="suffix"
                  value={settings.suffix || ''}
                  onChange={(e) => updateSetting('suffix', e.target.value)}
                  placeholder="e.g. kg"
                />
              </div>
            </div>
          </div>
        );
        
      case 'textarea':
      case 'markdown':
      case 'wysiwyg':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rows">Rows</Label>
              <Input
                id="rows"
                type="number"
                min={2}
                value={settings.rows || 5}
                onChange={(e) => updateSetting('rows', Number(e.target.value))}
              />
              <p className="text-xs text-gray-500">
                Number of visible text rows
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="minHeight">Minimum Height</Label>
              <Input
                id="minHeight"
                value={settings.minHeight || '100px'}
                onChange={(e) => updateSetting('minHeight', e.target.value)}
                placeholder="100px"
              />
              <p className="text-xs text-gray-500">
                Minimum height for the editor (e.g., 100px, 10rem)
              </p>
            </div>
          </div>
        );
        
      case 'tags':
      case 'autocomplete':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="maxTags">Maximum Tags</Label>
              <Input
                id="maxTags"
                type="number"
                min={1}
                value={settings.maxTags || 10}
                onChange={(e) => updateSetting('maxTags', Number(e.target.value))}
              />
              <p className="text-xs text-gray-500">
                Maximum number of tags that can be added
              </p>
            </div>
          </div>
        );
        
      case 'otp':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="length">OTP Length</Label>
              <Input
                id="length"
                type="number"
                min={4}
                max={8}
                value={settings.length || 6}
                onChange={(e) => updateSetting('length', Number(e.target.value))}
              />
              <p className="text-xs text-gray-500">
                Number of characters in the OTP code (4-8)
              </p>
            </div>
          </div>
        );
        
      default:
        return (
          <p className="text-sm text-gray-500 py-2">
            No additional settings for this field type.
          </p>
        );
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          {/* Common settings for all field types */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input 
                id="description"
                value={settings.description || ''}
                onChange={(e) => updateSetting('description', e.target.value)}
                placeholder="Field description"
              />
              <p className="text-xs text-gray-500">
                Internal description for this field
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="helpText">Help Text</Label>
              <Textarea 
                id="helpText"
                value={settings.helpText || ''}
                onChange={(e) => updateSetting('helpText', e.target.value)}
                placeholder="Help text shown to users"
                rows={3}
              />
              <p className="text-xs text-gray-500">
                Helpful text displayed below the field for users
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="placeholder">Placeholder</Label>
              <Input 
                id="placeholder"
                value={settings.placeholder || ''}
                onChange={(e) => updateSetting('placeholder', e.target.value)}
                placeholder={`Enter ${fieldName}...`}
              />
              <p className="text-xs text-gray-500">
                Text shown when the field is empty
              </p>
            </div>
            
            <div className="flex flex-row items-center justify-between space-x-2 pt-2">
              <div>
                <Label htmlFor="hidden_in_forms" className="cursor-pointer">Hide in Forms</Label>
                <p className="text-xs text-gray-500">
                  If enabled, this field will be hidden in forms
                </p>
              </div>
              <Switch
                id="hidden_in_forms"
                checked={settings.hidden_in_forms || false}
                onCheckedChange={(checked) => updateSetting('hidden_in_forms', checked)}
              />
            </div>
          </div>
          
          {/* Show field-specific settings only if we have any */}
          {fieldType && (
            <>
              <Separator className="my-4" />
              <h3 className="text-sm font-medium mb-3">Field-Specific Settings</h3>
              {renderFieldSpecificSettings()}
            </>
          )}
          
          {/* Show validation errors */}
          {validationError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default FieldGeneralSettings;
