
import React, { useState, useEffect } from 'react';
import { ValidationSettings } from '@/services/CollectionService';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Check, AlertCircle } from 'lucide-react';
import { FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { adaptInputChangeEvent } from '@/utils/inputAdapters';

interface FieldValidationPanelProps {
  fieldType: string | null;
  initialData: ValidationSettings;
  onUpdate: (data: ValidationSettings) => void;
}

export function FieldValidationPanel({
  fieldType,
  initialData,
  onUpdate
}: FieldValidationPanelProps) {
  const [settings, setSettings] = useState<ValidationSettings>(initialData || {});
  const [activeTab, setActiveTab] = useState('rules');

  // Add state for enabling/disabling validation types
  const [minLengthEnabled, setMinLengthEnabled] = useState(initialData?.minLengthEnabled || false);
  const [maxLengthEnabled, setMaxLengthEnabled] = useState(initialData?.maxLengthEnabled || false);
  const [patternEnabled, setPatternEnabled] = useState(initialData?.patternEnabled || false);
  const [customValidationEnabled, setCustomValidationEnabled] = useState(initialData?.customValidationEnabled || false);
  const [customValidation, setCustomValidation] = useState(initialData?.customValidation || '(value) => { return value.length > 0; }');

  // Live Testing state
  const [testValue, setTestValue] = useState('');
  const [validationResult, setValidationResult] = useState<'valid' | 'invalid' | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    const updatedSettings = initialData || {};
    setSettings(updatedSettings);
    setMinLengthEnabled(updatedSettings.minLengthEnabled || false);
    setMaxLengthEnabled(updatedSettings.maxLengthEnabled || false);
    setPatternEnabled(updatedSettings.patternEnabled || false);
    setCustomValidationEnabled(updatedSettings.customValidationEnabled || false);
    setCustomValidation(updatedSettings.customValidation || '(value) => { return value.length > 0; }');
  }, [initialData, fieldType]);

  const updateSetting = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onUpdate(newSettings);
  };

  const handleRequiredChange = (checked: boolean) => {
    updateSetting('required', checked);
  };

  const handleMinLengthEnabledChange = (checked: boolean) => {
    setMinLengthEnabled(checked);
    updateSetting('minLengthEnabled', checked);
  };

  const handleMaxLengthEnabledChange = (checked: boolean) => {
    setMaxLengthEnabled(checked);
    updateSetting('maxLengthEnabled', checked);
  };

  const handlePatternEnabledChange = (checked: boolean) => {
    setPatternEnabled(checked);
    updateSetting('patternEnabled', checked);
  };

  const renderTextValidation = () => (
    <>
      {/* Minimum Length Validation */}
      <div className="border-b py-4">
        <div className="flex flex-row items-center justify-between mb-2">
          <div>
            <h3 className="text-base font-medium">Minimum Length</h3>
            <p className="text-sm text-gray-500">Set a minimum number of characters</p>
          </div>
          <Switch
            checked={minLengthEnabled}
            onCheckedChange={handleMinLengthEnabledChange}
          />
        </div>

        {minLengthEnabled && (
          <div className="mt-2">
            <Input
              type="number"
              min={0}
              value={settings.minLength || ''}
              onChange={(e) => updateSetting('minLength', parseInt(e.target.value) || 0)}
              placeholder="0"
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Maximum Length Validation */}
      <div className="border-b py-4">
        <div className="flex flex-row items-center justify-between mb-2">
          <div>
            <h3 className="text-base font-medium">Maximum Length</h3>
            <p className="text-sm text-gray-500">Set a maximum number of characters</p>
          </div>
          <Switch
            checked={maxLengthEnabled}
            onCheckedChange={handleMaxLengthEnabledChange}
          />
        </div>

        {maxLengthEnabled && (
          <div className="mt-2">
            <Input
              type="number"
              min={1}
              value={settings.maxLength || ''}
              onChange={(e) => updateSetting('maxLength', parseInt(e.target.value) || 100)}
              placeholder="100"
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Pattern Matching Validation */}
      <div className="border-b py-4">
        <div className="flex flex-row items-center justify-between mb-2">
          <div>
            <h3 className="text-base font-medium">Pattern Matching</h3>
            <p className="text-sm text-gray-500">Validate using a regular expression</p>
          </div>
          <Switch
            checked={patternEnabled}
            onCheckedChange={handlePatternEnabledChange}
          />
        </div>

        {patternEnabled && (
          <div className="mt-2">
            <Input
              placeholder="e.g. ^[a-zA-Z0-9]+$"
              value={settings.pattern || ''}
              onChange={adaptInputChangeEvent((value) => updateSetting('pattern', value))}
              className="w-full"
            />
          </div>
        )}
      </div>
    </>
  );

  const renderNumberValidation = () => (
    <div className="grid grid-cols-2 gap-4">
      <FormItem>
        <FormLabel>Min Value</FormLabel>
        <FormControl>
          <Input
            type="number"
            value={settings.min ?? ''}
            onChange={(e) => updateSetting('min', e.target.value ? parseFloat(e.target.value) : null)}
          />
        </FormControl>
        <FormDescription>
          Minimum allowed value
        </FormDescription>
      </FormItem>

      <FormItem>
        <FormLabel>Max Value</FormLabel>
        <FormControl>
          <Input
            type="number"
            value={settings.max ?? ''}
            onChange={(e) => updateSetting('max', e.target.value ? parseFloat(e.target.value) : null)}
          />
        </FormControl>
        <FormDescription>
          Maximum allowed value
        </FormDescription>
      </FormItem>
    </div>
  );

  const renderEmailValidation = () => (
    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
      <div className="space-y-0.5">
        <FormLabel>Email Validation</FormLabel>
        <FormDescription>
          Validate that input is a valid email address
        </FormDescription>
      </div>
      <FormControl>
        <Switch
          checked={settings.email === true}
          onCheckedChange={(checked) => updateSetting('email', checked)}
        />
      </FormControl>
    </FormItem>
  );

  const renderUrlValidation = () => (
    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
      <div className="space-y-0.5">
        <FormLabel>URL Validation</FormLabel>
        <FormDescription>
          Validate that input is a valid URL
        </FormDescription>
      </div>
      <FormControl>
        <Switch
          checked={settings.url === true}
          onCheckedChange={(checked) => updateSetting('url', checked)}
        />
      </FormControl>
    </FormItem>
  );

  const renderUniqueValidation = () => (
    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
      <div className="space-y-0.5">
        <FormLabel>Unique Value</FormLabel>
        <FormDescription>
          Field value must be unique across all entries
        </FormDescription>
      </div>
      <FormControl>
        <Switch
          checked={settings.unique === true}
          onCheckedChange={(checked) => updateSetting('unique', checked)}
        />
      </FormControl>
    </FormItem>
  );

  const renderCustomErrorMessage = () => (
    <div className="py-4">
      <div className="mb-2">
        <h3 className="text-base font-medium">Custom Error Message</h3>
        <p className="text-sm text-gray-500">Message to display when validation fails</p>
      </div>
      <Textarea
        placeholder="Enter a custom error message to display when validation fails"
        value={settings.message || ''}
        onChange={adaptInputChangeEvent((value) => updateSetting('message', value))}
        className="w-full resize-y"
      />
    </div>
  );

  const renderFieldTypeValidation = () => {
    // Show all validation options for all field types
    if (!fieldType) {
      return (
        <div className="py-4 text-center text-gray-500">
          <p>Please select a field to configure validation.</p>
        </div>
      );
    }

    // Render field-specific validation options first, then common validation options
    return (
      <>
        {/* Field-specific validation options */}
        {fieldType === 'email' && renderEmailValidation()}
        {fieldType === 'url' && renderUrlValidation()}
        {fieldType === 'number' && renderNumberValidation()}
        {fieldType === 'tags' && (
          <FormItem>
            <FormLabel>Max Tags</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={0}
                value={settings.maxTags || ''}
                onChange={(e) => updateSetting('maxTags', parseInt(e.target.value) || null)}
              />
            </FormControl>
            <FormDescription>
              Maximum number of tags allowed
            </FormDescription>
          </FormItem>
        )}

        {/* Common validation options for all field types */}
        {renderTextValidation()}
      </>
    );
  };

  const handleCustomValidationEnabledChange = (checked: boolean) => {
    setCustomValidationEnabled(checked);
    updateSetting('customValidationEnabled', checked);
  };

  const handleCustomValidationChange = (value: string) => {
    setCustomValidation(value);
    updateSetting('customValidation', value);
  };

  const testValidation = () => {
    const errors: string[] = [];
    let isValid = true;

    // Test required
    if (settings.required && !testValue.trim()) {
      errors.push("This field is required");
      isValid = false;
    }

    // Test min length
    if (minLengthEnabled && settings.minLength && testValue.length < settings.minLength) {
      errors.push(`Value must be at least ${settings.minLength} characters`);
      isValid = false;
    }

    // Test max length
    if (maxLengthEnabled && settings.maxLength && testValue.length > settings.maxLength) {
      errors.push(`Value cannot exceed ${settings.maxLength} characters`);
      isValid = false;
    }

    // Test pattern
    if (patternEnabled && settings.pattern && !new RegExp(settings.pattern).test(testValue)) {
      errors.push(settings.message || `Value must match pattern: ${settings.pattern}`);
      isValid = false;
    }

    // Test custom validation
    if (customValidationEnabled && customValidation) {
      try {
        // Execute custom validation code safely
        const validateFn = new Function('value', `return (${customValidation})(value)`);
        const customResult = validateFn(testValue);

        if (customResult !== true) {
          errors.push(settings.message || "Failed custom validation");
          isValid = false;
        }
      } catch (error) {
        errors.push(`Error in custom validation: ${error}`);
        isValid = false;
      }
    }

    setValidationResult(isValid ? 'valid' : 'invalid');
    setValidationErrors(errors);
  };

  const renderValidationStatus = () => {
    if (validationResult === null) {
      return null;
    }

    if (validationResult === 'valid') {
      return (
        <Alert className="bg-green-50 border-green-200 mt-4">
          <Check className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-700">Validation Passed</AlertTitle>
          <AlertDescription className="text-green-600">
            The input value passes all validation rules.
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <Alert className="bg-red-50 border-red-200 mt-4">
        <AlertCircle className="h-4 w-4 text-red-500" />
        <AlertTitle className="text-red-700">Validation Failed</AlertTitle>
        <AlertDescription className="text-red-600">
          <ul className="list-disc pl-5 mt-2">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>
    );
  };

  const renderCustomValidation = () => (
    <div className="border-b py-4">
      <div className="flex flex-row items-center justify-between mb-2">
        <div>
          <h3 className="text-base font-medium">Custom Validation</h3>
          <p className="text-sm text-gray-500">Create a custom validation rule</p>
        </div>
        <Switch
          checked={customValidationEnabled}
          onCheckedChange={handleCustomValidationEnabledChange}
        />
      </div>

      {customValidationEnabled && (
        <div className="mt-2">
          <Textarea
            value={customValidation}
            onChange={(e) => handleCustomValidationChange(e.target.value)}
            placeholder="(value) => { return value.length > 0; }"
            className="w-full h-24"
          />
          <p className="text-xs text-gray-500 mt-1">
            Use JavaScript to define a validation function that returns true if valid or false if invalid
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Field Validation Rules</h3>
        <p className="text-sm text-gray-500">Configure validation rules for your field</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100">
          <TabsTrigger value="rules" className="data-[state=active]:bg-white">Validation Rules</TabsTrigger>
          <TabsTrigger value="testing" className="data-[state=active]:bg-white">Live Testing</TabsTrigger>
          <TabsTrigger value="accessibility" className="data-[state=active]:bg-white">Accessibility</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="border-b py-4">
                <div className="flex flex-row items-center justify-between mb-2">
                  <div>
                    <h3 className="text-base font-medium">Required Field</h3>
                    <p className="text-sm text-gray-500">Make this field mandatory for content creation</p>
                  </div>
                  <Switch
                    checked={settings.required === true}
                    onCheckedChange={handleRequiredChange}
                  />
                </div>
              </div>

              {renderUniqueValidation()}
              {renderFieldTypeValidation()}
              {renderCustomValidation()}
              {renderCustomErrorMessage()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing" className="space-y-4">
          <Card className="border rounded-md">
            <CardContent className="p-4 space-y-4">
              <h3 className="text-base font-medium">Test your validation rules</h3>
              <p className="text-sm text-gray-500">Enter test data to see if it passes your validation rules</p>

              <div className="space-y-4">
                <FormItem>
                  <FormLabel>Test Value</FormLabel>
                  <FormControl>
                    <Input
                      value={testValue}
                      onChange={(e) => setTestValue(e.target.value)}
                      placeholder="Enter a value to test"
                    />
                  </FormControl>
                </FormItem>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Current Validation Rules:</h4>
                  <ul className="text-sm text-gray-500 list-disc pl-5 space-y-1">
                    {settings.required && (
                      <li>Required field</li>
                    )}
                    {minLengthEnabled && settings.minLength && (
                      <li>Minimum length: {settings.minLength} characters</li>
                    )}
                    {maxLengthEnabled && settings.maxLength && (
                      <li>Maximum length: {settings.maxLength} characters</li>
                    )}
                    {patternEnabled && settings.pattern && (
                      <li>Pattern: {settings.pattern}</li>
                    )}
                    {customValidationEnabled && customValidation && (
                      <li>Custom validation: (custom function)</li>
                    )}
                    {!settings.required && !minLengthEnabled && !maxLengthEnabled && !patternEnabled && !customValidationEnabled && (
                      <li>No validation rules configured</li>
                    )}
                  </ul>
                </div>

                <Button
                  onClick={testValidation}
                  className="w-full"
                  variant="secondary"
                >
                  Test Validation
                </Button>

                {renderValidationStatus()}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accessibility" className="space-y-4">
          <Card className="border rounded-md">
            <CardContent className="p-4">
              <h3 className="text-base font-medium mb-4">Accessibility Settings</h3>
              <p className="text-sm text-gray-500 mb-4">Configure accessibility attributes for this field</p>

              <div className="space-y-4">
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>ARIA Required</FormLabel>
                    <FormDescription>
                      Add aria-required attribute
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={settings.ariaRequired === true}
                      onCheckedChange={(checked) => updateSetting('ariaRequired', checked)}
                    />
                  </FormControl>
                </FormItem>

                <FormItem>
                  <FormLabel>ARIA Label</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Accessible label for screen readers"
                      value={settings.ariaLabel || ''}
                      onChange={adaptInputChangeEvent((value) => updateSetting('ariaLabel', value))}
                    />
                  </FormControl>
                </FormItem>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default FieldValidationPanel;
