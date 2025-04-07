
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ArrowRight, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface FieldValidationPanelProps {
  initialData?: any;
  onSave?: (data: any) => void;
}

export function FieldValidationPanel({ initialData = {}, onSave }: FieldValidationPanelProps) {
  const [activeTab, setActiveTab] = React.useState('basic-validation');
  
  // Extract validation settings from initial data or use empty object
  const validationSettings = initialData?.validation || {};
  
  const [required, setRequired] = React.useState(initialData?.required || false);
  
  // Basic validation state
  const [minLengthEnabled, setMinLengthEnabled] = React.useState(validationSettings?.minLengthEnabled || false);
  const [minLength, setMinLength] = React.useState(validationSettings?.minLength || '');
  const [maxLengthEnabled, setMaxLengthEnabled] = React.useState(validationSettings?.maxLengthEnabled || false);
  const [maxLength, setMaxLength] = React.useState(validationSettings?.maxLength || '');
  
  // Pattern validation state
  const [patternEnabled, setPatternEnabled] = React.useState(validationSettings?.patternEnabled || false);
  const [pattern, setPattern] = React.useState(validationSettings?.pattern || '');
  const [patternMessage, setPatternMessage] = React.useState(validationSettings?.message || '');
  
  // Custom validation state
  const [customValidationEnabled, setCustomValidationEnabled] = React.useState(validationSettings?.customValidationEnabled || false);
  const [customValidation, setCustomValidation] = React.useState(validationSettings?.customValidation || '(value) => {\n  // Return true if valid, false if invalid\n  return true;\n}');
  const [customMessage, setCustomMessage] = React.useState(validationSettings?.customMessage || '');
  
  const [isSaving, setIsSaving] = React.useState(false);
  
  // Predefined validation patterns
  const validationPatterns = [
    {
      name: 'Email',
      pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
      description: 'Validates email addresses'
    },
    {
      name: 'URL',
      pattern: '^(https?:\\/\\/)?([\\da-z.-]+)\\.([a-z.]{2,6})([\\/\\w.-]*)*\\/?$',
      description: 'Validates URLs (with or without http/https)'
    },
    {
      name: 'Phone Number',
      pattern: '^[+]?[(]?[0-9]{3}[)]?[-\\s.]?[0-9]{3}[-\\s.]?[0-9]{4,6}$',
      description: 'Validates phone numbers in common formats'
    },
    {
      name: 'Zip/Postal Code',
      pattern: '^[0-9]{5}(?:-[0-9]{4})?$',
      description: 'US postal codes with optional 4-digit extension'
    },
    {
      name: 'Credit Card',
      pattern: '^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\\d{3})\\d{11})$',
      description: 'Validates common credit card formats'
    },
    {
      name: 'Date (YYYY-MM-DD)',
      pattern: '^\\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$',
      description: 'Validates ISO date format'
    }
  ];
  
  // Sample validation functions
  const validationFunctions = [
    {
      name: 'Range Check',
      function: '(value) => {\n  const num = parseFloat(value);\n  return !isNaN(num) && num >= 0 && num <= 100;\n}',
      description: 'Check if number is between 0 and 100'
    },
    {
      name: 'Password Strength',
      function: '(value) => {\n  return value.length >= 8 && \n    /[A-Z]/.test(value) && \n    /[a-z]/.test(value) && \n    /[0-9]/.test(value) && \n    /[^A-Za-z0-9]/.test(value);\n}',
      description: 'Strong password with multiple requirements'
    },
    {
      name: 'Word Count',
      function: '(value) => {\n  const words = value.trim().split(/\\s+/);\n  return words.length >= 5 && words.length <= 100;\n}',
      description: 'Check if text has between 5-100 words'
    },
    {
      name: 'Future Date',
      function: '(value) => {\n  const inputDate = new Date(value);\n  const today = new Date();\n  return inputDate > today;\n}',
      description: 'Check if date is in the future'
    }
  ];
  
  const handleSave = () => {
    setIsSaving(true);
    
    try {
      // Compile validation data
      const validationData = {
        // Basic validation
        minLengthEnabled,
        minLength: minLengthEnabled ? parseInt(minLength.toString(), 10) : undefined,
        maxLengthEnabled,
        maxLength: maxLengthEnabled ? parseInt(maxLength.toString(), 10) : undefined,
        
        // Pattern validation
        patternEnabled,
        pattern: patternEnabled ? pattern : undefined,
        message: patternEnabled ? patternMessage : undefined,
        
        // Custom validation
        customValidationEnabled,
        customValidation: customValidationEnabled ? customValidation : undefined,
        customMessage: customValidationEnabled ? customMessage : undefined
      };
      
      // Prepare data for saving
      const dataToSave = {
        ...initialData,
        required,
        validation: validationData
      };
      
      if (onSave) {
        onSave(dataToSave);
      }
      
      toast({
        title: "Validation settings saved",
        description: "Your field validation settings have been updated",
      });
    } catch (error) {
      console.error("Failed to save validation settings:", error);
      toast({
        variant: "destructive",
        title: "Save failed",
        description: "There was an error saving your validation settings",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const applyValidationPattern = (pattern: string) => {
    setPattern(pattern);
    setPatternEnabled(true);
  };
  
  const applyValidationFunction = (func: string) => {
    setCustomValidation(func);
    setCustomValidationEnabled(true);
  };
  
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomValidation(e.target.value);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium">Field Validation</h2>
      <p className="text-gray-500">
        Configure validation rules to ensure data quality
      </p>
      
      <div className="flex items-center space-x-2 pb-2">
        <Switch 
          id="required-field"
          checked={required}
          onCheckedChange={setRequired}
        />
        <Label htmlFor="required-field">This field is required</Label>
      </div>
      
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic-validation">Basic Validation</TabsTrigger>
            <TabsTrigger value="pattern-validation">Pattern Validation</TabsTrigger>
            <TabsTrigger value="custom-validation">Custom Validation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic-validation">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="min-length"
                      checked={minLengthEnabled}
                      onCheckedChange={setMinLengthEnabled}
                    />
                    <Label htmlFor="min-length">Enforce minimum length</Label>
                  </div>
                  
                  {minLengthEnabled && (
                    <div className="pl-6 space-y-2">
                      <Label htmlFor="min-length-value">Minimum characters</Label>
                      <Input
                        id="min-length-value"
                        type="number"
                        min="1"
                        value={minLength}
                        onChange={(e) => setMinLength(e.target.value)}
                        placeholder="1"
                        className="max-w-xs"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2 mt-4">
                    <Switch 
                      id="max-length"
                      checked={maxLengthEnabled}
                      onCheckedChange={setMaxLengthEnabled}
                    />
                    <Label htmlFor="max-length">Enforce maximum length</Label>
                  </div>
                  
                  {maxLengthEnabled && (
                    <div className="pl-6 space-y-2">
                      <Label htmlFor="max-length-value">Maximum characters</Label>
                      <Input
                        id="max-length-value"
                        type="number"
                        min="1"
                        value={maxLength}
                        onChange={(e) => setMaxLength(e.target.value)}
                        placeholder="255"
                        className="max-w-xs"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="pattern-validation">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="pattern-enabled"
                      checked={patternEnabled}
                      onCheckedChange={setPatternEnabled}
                    />
                    <Label htmlFor="pattern-enabled">Enable pattern validation</Label>
                  </div>
                  
                  {patternEnabled && (
                    <div className="pl-6 space-y-4">
                      <div>
                        <Label htmlFor="regex-pattern">Regular expression pattern</Label>
                        <Input
                          id="regex-pattern"
                          value={pattern}
                          onChange={(e) => setPattern(e.target.value)}
                          placeholder="^[a-zA-Z0-9]+$"
                          className="font-mono mt-2"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Enter a regular expression to validate the input
                        </p>
                      </div>
                      
                      <div>
                        <Label htmlFor="pattern-message">Error message</Label>
                        <Input
                          id="pattern-message"
                          value={patternMessage}
                          onChange={(e) => setPatternMessage(e.target.value)}
                          placeholder="Please enter a valid value"
                          className="mt-2"
                        />
                      </div>
                      
                      <div className="mt-6">
                        <h4 className="text-sm font-medium mb-2">Common validation patterns</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {validationPatterns.map((item, index) => (
                            <div key={index} className="border rounded-md p-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h5 className="text-sm font-medium">{item.name}</h5>
                                  <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => applyValidationPattern(item.pattern)}
                                >
                                  <ArrowRight className="h-4 w-4" />
                                </Button>
                              </div>
                              <p className="text-xs font-mono mt-2 text-gray-600 truncate" title={item.pattern}>
                                {item.pattern}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="custom-validation">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="custom-validation-enabled"
                      checked={customValidationEnabled}
                      onCheckedChange={setCustomValidationEnabled}
                    />
                    <Label htmlFor="custom-validation-enabled">Enable custom validation</Label>
                  </div>
                  
                  {customValidationEnabled && (
                    <div className="pl-6 space-y-4">
                      <div>
                        <Label htmlFor="custom-validation-function">Validation function</Label>
                        <Textarea
                          id="custom-validation-function"
                          value={customValidation}
                          onChange={handleTextareaChange}
                          rows={6}
                          className="font-mono mt-2"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Write a function that takes a value and returns true (valid) or false (invalid)
                        </p>
                      </div>
                      
                      <div>
                        <Label htmlFor="custom-message">Error message</Label>
                        <Input
                          id="custom-message"
                          value={customMessage}
                          onChange={(e) => setCustomMessage(e.target.value)}
                          placeholder="Please enter a valid value"
                          className="mt-2"
                        />
                      </div>
                      
                      <div className="mt-6">
                        <h4 className="text-sm font-medium mb-2">Example validation functions</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {validationFunctions.map((item, index) => (
                            <div key={index} className="border rounded-md p-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h5 className="text-sm font-medium">{item.name}</h5>
                                  <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => applyValidationFunction(item.function)}
                                >
                                  <ArrowRight className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSaving ? (
            <>Saving...</>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Save Validation Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default FieldValidationPanel;
