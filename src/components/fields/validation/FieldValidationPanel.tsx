
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription
} from "@/components/ui/form";
import { Check, X, AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';

export interface FieldValidationPanelProps {
  fieldType: string | null;
  initialData?: any;
  onUpdate: (data: any) => void;
}

export function FieldValidationPanel({ fieldType, initialData = {}, onUpdate }: FieldValidationPanelProps) {
  const [activeTab, setActiveTab] = useState('rules');
  const [required, setRequired] = useState(initialData?.required || false);
  const [minLengthEnabled, setMinLengthEnabled] = useState(initialData?.minLengthEnabled || false);
  const [maxLengthEnabled, setMaxLengthEnabled] = useState(initialData?.maxLengthEnabled || false);
  const [patternEnabled, setPatternEnabled] = useState(initialData?.patternEnabled || false);
  const [customValidationEnabled, setCustomValidationEnabled] = useState(initialData?.customValidationEnabled || false);
  const [minLength, setMinLength] = useState(initialData?.minLength || 0);
  const [maxLength, setMaxLength] = useState(initialData?.maxLength || 100);
  const [pattern, setPattern] = useState(initialData?.pattern || '');
  const [customMessage, setCustomMessage] = useState(initialData?.customMessage || '');
  const [customValidation, setCustomValidation] = useState(initialData?.customValidation || '');

  // Live Testing
  const [testValue, setTestValue] = useState('');
  const [validationResult, setValidationResult] = useState<'valid' | 'invalid' | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Accessibility
  const [ariaRequired, setAriaRequired] = useState(initialData?.ariaRequired || false);
  const [ariaDescribedBy, setAriaDescribedBy] = useState(initialData?.ariaDescribedBy || '');
  const [ariaLabel, setAriaLabel] = useState(initialData?.ariaLabel || '');
  const [ariaLabelledBy, setAriaLabelledBy] = useState(initialData?.ariaLabelledBy || '');
  const [ariaInvalid, setAriaInvalid] = useState(initialData?.ariaInvalid || false);
  const [autocomplete, setAutocomplete] = useState(initialData?.autocomplete || '');
  
  // Debug state to track changes
  const [lastUpdate, setLastUpdate] = useState<any>(null);

  useEffect(() => {
    console.log('[FieldValidationPanel] Initial data received:', initialData);
    
    if (initialData) {
      // Check both direct properties and nested validation properties
      const validation = initialData.validation || initialData;
      
      setRequired(validation.required || false);
      setMinLengthEnabled(validation.minLengthEnabled || false);
      setMaxLengthEnabled(validation.maxLengthEnabled || false);
      setPatternEnabled(validation.patternEnabled || false);
      setCustomValidationEnabled(validation.customValidationEnabled || false);
      setMinLength(validation.minLength || 0);
      setMaxLength(validation.maxLength || 100);
      setPattern(validation.pattern || '');
      setCustomMessage(validation.customMessage || '');
      setCustomValidation(validation.customValidation || '');
      setAriaRequired(validation.ariaRequired || false);
      setAriaDescribedBy(validation.ariaDescribedBy || '');
      setAriaLabel(validation.ariaLabel || '');
      setAriaLabelledBy(validation.ariaLabelledBy || '');
      setAriaInvalid(validation.ariaInvalid || false);
      setAutocomplete(validation.autocomplete || '');
    }
  }, [initialData]);

  const createValidationObject = () => {
    const validationData = {
      required,
      minLengthEnabled,
      maxLengthEnabled,
      patternEnabled,
      customValidationEnabled,
      minLength: parseInt(minLength as any),
      maxLength: parseInt(maxLength as any),
      pattern,
      customMessage,
      customValidation,
      ariaRequired,
      ariaDescribedBy,
      ariaLabel,
      ariaLabelledBy,
      ariaInvalid,
      autocomplete
    };
    
    return validationData;
  };

  // Debounced update function to reduce unnecessary updates
  useEffect(() => {
    const timer = setTimeout(() => {
      const validationData = createValidationObject();
      
      // Only update if data has actually changed
      if (JSON.stringify(lastUpdate) !== JSON.stringify(validationData)) {
        console.log('[FieldValidationPanel] Updating validation data:', validationData);
        onUpdate(validationData);
        setLastUpdate(validationData);
      }
    }, 300); // 300ms debounce
    
    return () => clearTimeout(timer);
  }, [
    required, minLengthEnabled, maxLengthEnabled, patternEnabled,
    customValidationEnabled, minLength, maxLength, pattern, customMessage, customValidation,
    ariaRequired, ariaDescribedBy, ariaLabel, ariaLabelledBy, ariaInvalid, autocomplete
  ]);

  const testValidation = () => {
    const errors: string[] = [];
    let isValid = true;

    // Test required
    if (required && !testValue.trim()) {
      errors.push("This field is required");
      isValid = false;
    }

    // Test min length
    if (minLengthEnabled && testValue.length < minLength) {
      errors.push(`Value must be at least ${minLength} characters`);
      isValid = false;
    }

    // Test max length
    if (maxLengthEnabled && testValue.length > maxLength) {
      errors.push(`Value cannot exceed ${maxLength} characters`);
      isValid = false;
    }

    // Test pattern
    if (patternEnabled && pattern && !new RegExp(pattern).test(testValue)) {
      errors.push(customMessage || `Value must match pattern: ${pattern}`);
      isValid = false;
    }

    // Test custom validation
    if (customValidationEnabled && customValidation) {
      try {
        // Execute custom validation code safely
        const validateFn = new Function('value', `return (${customValidation})(value)`);
        const customResult = validateFn(testValue);

        if (customResult !== true) {
          errors.push(customMessage || "Failed custom validation");
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

  const handleSaveToDatabase = () => {
    const validationData = createValidationObject();
    
    console.log('[FieldValidationPanel] Manually saving validation data to database:', validationData);
    
    // Call onUpdate with the validation data
    onUpdate(validationData);
    
    toast({
      title: "Validation settings saved",
      description: "Your validation settings have been updated",
    });
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

  const renderRulesTab = () => (
    <div className="space-y-4">
      <Card className="border rounded-md">
        <CardContent className="p-0">
          <div className="flex flex-row items-center justify-between space-x-2 p-4 border-b">
            <div>
              <h3 className="text-base font-medium">Required Field</h3>
              <p className="text-sm text-gray-500">
                Make this field mandatory for content creation
              </p>
            </div>
            <Switch
              checked={required}
              onCheckedChange={setRequired}
            />
          </div>

          {fieldType && (
            <>
              <div className="flex flex-row items-center justify-between space-x-2 p-4 border-b">
                <div>
                  <h3 className="text-base font-medium">Minimum Length</h3>
                  <p className="text-sm text-gray-500">
                    Set a minimum number of characters
                  </p>
                </div>
                <Switch
                  checked={minLengthEnabled}
                  onCheckedChange={setMinLengthEnabled}
                />
              </div>

              {minLengthEnabled && (
                <div className="px-4 py-3 border-b">
                  <Input
                    type="number"
                    min="0"
                    value={minLength}
                    onChange={(e) => setMinLength(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}

              <div className="flex flex-row items-center justify-between space-x-2 p-4 border-b">
                <div>
                  <h3 className="text-base font-medium">Maximum Length</h3>
                  <p className="text-sm text-gray-500">
                    Set a maximum number of characters
                  </p>
                </div>
                <Switch
                  checked={maxLengthEnabled}
                  onCheckedChange={setMaxLengthEnabled}
                />
              </div>

              {maxLengthEnabled && (
                <div className="px-4 py-3 border-b">
                  <Input
                    type="number"
                    min="1"
                    value={maxLength}
                    onChange={(e) => setMaxLength(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}

              <div className="flex flex-row items-center justify-between space-x-2 p-4 border-b">
                <div>
                  <h3 className="text-base font-medium">Pattern Matching</h3>
                  <p className="text-sm text-gray-500">
                    Validate using a regular expression
                  </p>
                </div>
                <Switch
                  checked={patternEnabled}
                  onCheckedChange={setPatternEnabled}
                />
              </div>

              {patternEnabled && (
                <div className="px-4 py-3 border-b space-y-3">
                  <Input
                    type="text"
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    placeholder="Regular expression pattern (e.g., ^[a-zA-Z0-9]+$)"
                    className="w-full"
                  />
                  <Input
                    type="text"
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Custom error message (optional)"
                    className="w-full"
                  />
                </div>
              )}

              <div className="flex flex-row items-center justify-between space-x-2 p-4 border-b">
                <div>
                  <h3 className="text-base font-medium">Custom Validation</h3>
                  <p className="text-sm text-gray-500">
                    Advanced validation with JavaScript
                  </p>
                </div>
                <Switch
                  checked={customValidationEnabled}
                  onCheckedChange={setCustomValidationEnabled}
                />
              </div>

              {customValidationEnabled && (
                <div className="px-4 py-3 border-b space-y-3">
                  <Textarea
                    value={customValidation}
                    onChange={(e) => setCustomValidation(e.target.value)}
                    placeholder="function(value) { return value.length > 5; }"
                    className="w-full font-mono text-sm"
                    rows={4}
                  />
                  <p className="text-xs text-gray-500">
                    Enter a JavaScript function that takes the value and returns true (valid) or false (invalid)
                  </p>
                  <Input
                    type="text"
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Custom error message (optional)"
                    className="w-full"
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderTestingTab = () => (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="test-value">Test Value</Label>
            <div className="flex space-x-2">
              <Input
                id="test-value"
                value={testValue}
                onChange={(e) => setTestValue(e.target.value)}
                className="flex-1"
                placeholder="Enter a value to test against your validation rules"
              />
              <Button onClick={testValidation}>Test</Button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Active Rules:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {required && <li>Required field</li>}
              {minLengthEnabled && <li>Minimum length: {minLength} characters</li>}
              {maxLengthEnabled && <li>Maximum length: {maxLength} characters</li>}
              {patternEnabled && pattern && <li>Pattern matching: {pattern}</li>}
              {customValidationEnabled && <li>Custom validation function</li>}
            </ul>
          </div>

          {renderValidationStatus()}
        </CardContent>
      </Card>
    </div>
  );

  const renderAccessibilityTab = () => (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-row items-center justify-between space-x-2">
            <div>
              <h3 className="text-base font-medium">ARIA Required</h3>
              <p className="text-sm text-gray-500">
                Add aria-required attribute
              </p>
            </div>
            <Switch
              checked={ariaRequired}
              onCheckedChange={setAriaRequired}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="aria-described-by">ARIA Described By</Label>
            <Input
              id="aria-described-by"
              value={ariaDescribedBy}
              onChange={(e) => setAriaDescribedBy(e.target.value)}
              placeholder="ID of the element that describes this field"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="aria-label">ARIA Label</Label>
            <Input
              id="aria-label"
              value={ariaLabel}
              onChange={(e) => setAriaLabel(e.target.value)}
              placeholder="Accessible label for this field"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="aria-labelled-by">ARIA Labelled By</Label>
            <Input
              id="aria-labelled-by"
              value={ariaLabelledBy}
              onChange={(e) => setAriaLabelledBy(e.target.value)}
              placeholder="ID of the element that labels this field"
            />
          </div>

          <div className="flex flex-row items-center justify-between space-x-2">
            <div>
              <h3 className="text-base font-medium">ARIA Invalid</h3>
              <p className="text-sm text-gray-500">
                Mark field as invalid by default
              </p>
            </div>
            <Switch
              checked={ariaInvalid}
              onCheckedChange={setAriaInvalid}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="autocomplete">Autocomplete</Label>
            <Input
              id="autocomplete"
              value={autocomplete}
              onChange={(e) => setAutocomplete(e.target.value)}
              placeholder="e.g., name, email, tel, etc."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium">Field Validation Rules</h2>
      <p className="text-gray-500">
        Configure validation rules for your field
      </p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100">
          <TabsTrigger value="rules" className="data-[state=active]:bg-white">Validation Rules</TabsTrigger>
          <TabsTrigger value="testing" className="data-[state=active]:bg-white">Live Testing</TabsTrigger>
          <TabsTrigger value="accessibility" className="data-[state=active]:bg-white">Accessibility</TabsTrigger>
        </TabsList>

        <TabsContent value="rules">
          {renderRulesTab()}
        </TabsContent>

        <TabsContent value="testing">
          {renderTestingTab()}
        </TabsContent>

        <TabsContent value="accessibility">
          {renderAccessibilityTab()}
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button 
          onClick={handleSaveToDatabase}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Save Validation Settings
        </Button>
      </div>
    </div>
  );
}

export default FieldValidationPanel;
