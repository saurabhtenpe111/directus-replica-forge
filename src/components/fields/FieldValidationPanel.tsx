
import React, { useState } from "react";
import { 
  Input, 
  Textarea 
} from "@/components/ui/input";
import { 
  FormItem, 
  FormLabel, 
  FormControl,
  FormDescription
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { InputTextField } from "@/components/fields/inputs/InputTextField";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Info, Check, X, AlertTriangle } from "lucide-react";

interface RuleProps {
  title: string;
  description: string;
  children: React.ReactNode;
  enabled?: boolean;
  onToggle?: (value: boolean) => void;
}

interface FieldValidationPanelProps {
  fieldType: string | null;
  initialData?: any;
  onUpdate: (data: any) => void;
}

const ValidationRule = ({ title, description, children, enabled = false, onToggle }: RuleProps) => (
  <div className="space-y-2 border rounded-md p-4">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-base font-medium">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      {onToggle && (
        <Switch 
          checked={enabled} 
          onCheckedChange={onToggle} 
          aria-label={`Enable ${title}`}
        />
      )}
    </div>
    {enabled && <div className="pt-2">{children}</div>}
  </div>
);

export function FieldValidationPanel({ fieldType, initialData = {}, onUpdate }: FieldValidationPanelProps) {
  const [activeTab, setActiveTab] = useState("rules");
  const [validationRules, setValidationRules] = useState({
    required: initialData?.required || false,
    minLength: initialData?.minLength || false,
    maxLength: initialData?.maxLength || false,
    pattern: initialData?.pattern || false,
    noSpaces: initialData?.noSpaces || false,
    numericOnly: initialData?.numericOnly || false,
    conditionalValidation: initialData?.conditionalValidation || false,
    customValidation: initialData?.customValidation || false
  });
  
  // Test values for the demo field
  const [testValue, setTestValue] = useState("");
  const [testError, setTestError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState(initialData?.errorMessage || "This field is required");
  const [minLength, setMinLength] = useState(initialData?.minLengthValue || 5);
  const [maxLength, setMaxLength] = useState(initialData?.maxLengthValue || 50);
  const [pattern, setPattern] = useState(initialData?.patternValue || "");
  const [patternDesc, setPatternDesc] = useState(initialData?.patternDesc || "");
  const [customFunc, setCustomFunc] = useState(initialData?.customFunc || "");
  const [conditionalField, setConditionalField] = useState(initialData?.conditionalField || "");
  const [conditionalValue, setConditionalValue] = useState(initialData?.conditionalValue || "");
  const [conditionalRule, setConditionalRule] = useState(initialData?.conditionalRule || "equals");
  const [conditionalErrorMsg, setConditionalErrorMsg] = useState(initialData?.conditionalErrorMsg || "");
  const [numericErrorMsg, setNumericErrorMsg] = useState(initialData?.numericErrorMsg || "Only numbers are allowed");
  const [noSpacesErrorMsg, setNoSpacesErrorMsg] = useState(initialData?.noSpacesErrorMsg || "Spaces are not allowed");
  
  const handleToggleRule = (rule: keyof typeof validationRules) => {
    setValidationRules({
      ...validationRules,
      [rule]: !validationRules[rule]
    });
    
    // Update parent component with new values
    const updatedRules = {
      ...validationRules,
      [rule]: !validationRules[rule],
      errorMessage,
      minLengthValue: minLength,
      maxLengthValue: maxLength,
      patternValue: pattern,
      patternDesc,
      customFunc,
      conditionalField,
      conditionalValue,
      conditionalRule,
      conditionalErrorMsg,
      numericErrorMsg,
      noSpacesErrorMsg
    };
    
    onUpdate(updatedRules);
  };
  
  const handleInputChange = (field: string, value: any) => {
    switch (field) {
      case 'errorMessage':
        setErrorMessage(value);
        break;
      case 'minLength':
        setMinLength(value);
        break;
      case 'maxLength':
        setMaxLength(value);
        break;
      case 'pattern':
        setPattern(value);
        break;
      case 'patternDesc':
        setPatternDesc(value);
        break;
      case 'conditionalField':
        setConditionalField(value);
        break;
      case 'conditionalValue':
        setConditionalValue(value);
        break;
      case 'conditionalRule':
        setConditionalRule(value);
        break;
      case 'conditionalErrorMsg':
        setConditionalErrorMsg(value);
        break;
      case 'numericErrorMsg':
        setNumericErrorMsg(value);
        break;
      case 'noSpacesErrorMsg':
        setNoSpacesErrorMsg(value);
        break;
      default:
        break;
    }
    
    // Update parent component with new values
    const updatedRules = {
      ...validationRules,
      errorMessage: field === 'errorMessage' ? value : errorMessage,
      minLengthValue: field === 'minLength' ? value : minLength,
      maxLengthValue: field === 'maxLength' ? value : maxLength,
      patternValue: field === 'pattern' ? value : pattern,
      patternDesc: field === 'patternDesc' ? value : patternDesc,
      conditionalField: field === 'conditionalField' ? value : conditionalField,
      conditionalValue: field === 'conditionalValue' ? value : conditionalValue,
      conditionalRule: field === 'conditionalRule' ? value : conditionalRule,
      conditionalErrorMsg: field === 'conditionalErrorMsg' ? value : conditionalErrorMsg,
      numericErrorMsg: field === 'numericErrorMsg' ? value : numericErrorMsg,
      noSpacesErrorMsg: field === 'noSpacesErrorMsg' ? value : noSpacesErrorMsg
    };
    
    onUpdate(updatedRules);
  };
  
  const validateTestValue = () => {
    // Reset error
    setTestError(null);
    
    // Required validation
    if (validationRules.required && !testValue.trim()) {
      setTestError(errorMessage || "This field is required");
      return;
    }
    
    // No spaces validation
    if (validationRules.noSpaces && testValue.includes(' ')) {
      setTestError(noSpacesErrorMsg || "Spaces are not allowed");
      return;
    }
    
    // Numeric only validation
    if (validationRules.numericOnly && !/^\d+$/.test(testValue)) {
      setTestError(numericErrorMsg || "Only numbers are allowed");
      return;
    }
    
    // Min length validation
    if (validationRules.minLength && testValue.length < minLength) {
      setTestError(`Must be at least ${minLength} characters`);
      return;
    }
    
    // Max length validation
    if (validationRules.maxLength && testValue.length > maxLength) {
      setTestError(`Cannot exceed ${maxLength} characters`);
      return;
    }
    
    // Pattern validation
    if (validationRules.pattern && pattern) {
      try {
        const regex = new RegExp(pattern);
        if (!regex.test(testValue)) {
          setTestError(patternDesc || "Pattern doesn't match");
          return;
        }
      } catch (e) {
        setTestError("Invalid regex pattern");
        return;
      }
    }
    
    // Conditional validation (simplified for demo)
    if (validationRules.conditionalValidation && conditionalField && conditionalValue) {
      // In a real implementation, we would check the actual value of the referenced field
      // For this demo, we'll use a simplified approach
      const mockFieldValue = "USA"; // This would be dynamically retrieved
      
      let conditionMet = false;
      
      switch (conditionalRule) {
        case 'equals':
          conditionMet = mockFieldValue === conditionalValue;
          break;
        case 'notEquals':
          conditionMet = mockFieldValue !== conditionalValue;
          break;
        case 'contains':
          conditionMet = mockFieldValue.includes(conditionalValue);
          break;
        default:
          conditionMet = false;
      }
      
      if (conditionMet) {
        // For USA, validate 5-digit zip code
        if (conditionalField === 'country' && conditionalValue === 'USA') {
          if (!/^\d{5}$/.test(testValue)) {
            setTestError(conditionalErrorMsg || "USA zip codes must be 5 digits");
            return;
          }
        }
      }
    }
    
    // Custom validation (simplified demo)
    if (validationRules.customValidation) {
      try {
        // Safely evaluate simple validation expressions (for demo only)
        const result = testValue.length > 0 && testValue[0].toUpperCase() === testValue[0];
        if (!result) {
          setTestError("Custom validation failed: First letter should be uppercase");
          return;
        }
      } catch (e) {
        setTestError("Error in custom validation function");
        return;
      }
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Field Validation Rules</h2>
      <p className="text-gray-500">Configure validation rules for your field</p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="rules">Validation Rules</TabsTrigger>
          <TabsTrigger value="live">Live Testing</TabsTrigger>
          <TabsTrigger value="a11y">Accessibility</TabsTrigger>
        </TabsList>
        
        <TabsContent value="rules" className="space-y-4">
          <ValidationRule 
            title="Required Field" 
            description="Make this field mandatory for content creation"
            enabled={validationRules.required}
            onToggle={() => handleToggleRule('required')}
          >
            <Input 
              placeholder="Custom error message" 
              value={errorMessage}
              onChange={(e) => handleInputChange('errorMessage', e.target.value)}
            />
          </ValidationRule>
          
          <ValidationRule 
            title="No Spaces Allowed" 
            description="Prevent spaces in input fields (usernames, codes, etc.)"
            enabled={validationRules.noSpaces}
            onToggle={() => handleToggleRule('noSpaces')}
          >
            <Input 
              placeholder="Custom error message" 
              value={noSpacesErrorMsg}
              onChange={(e) => handleInputChange('noSpacesErrorMsg', e.target.value)}
            />
          </ValidationRule>
          
          <ValidationRule 
            title="Numeric Validation" 
            description="Allow only numbers for this field"
            enabled={validationRules.numericOnly}
            onToggle={() => handleToggleRule('numericOnly')}
          >
            <Input 
              placeholder="Custom error message" 
              value={numericErrorMsg}
              onChange={(e) => handleInputChange('numericErrorMsg', e.target.value)}
            />
          </ValidationRule>
          
          <ValidationRule 
            title="Minimum Length" 
            description="Set a minimum number of characters"
            enabled={validationRules.minLength}
            onToggle={() => handleToggleRule('minLength')}
          >
            <div className="flex items-center gap-2">
              <Input 
                type="number" 
                className="w-24" 
                min={1}
                value={minLength}
                onChange={(e) => handleInputChange('minLength', parseInt(e.target.value) || 1)}
              />
              <span className="text-sm text-gray-500">characters minimum</span>
            </div>
          </ValidationRule>
          
          <ValidationRule 
            title="Maximum Length" 
            description="Set a maximum number of characters"
            enabled={validationRules.maxLength}
            onToggle={() => handleToggleRule('maxLength')}
          >
            <div className="flex items-center gap-2">
              <Input 
                type="number" 
                className="w-24" 
                min={1}
                value={maxLength}
                onChange={(e) => handleInputChange('maxLength', parseInt(e.target.value) || 1)}
              />
              <span className="text-sm text-gray-500">characters maximum</span>
            </div>
          </ValidationRule>
          
          <ValidationRule 
            title="Pattern Matching" 
            description="Validate using a regular expression"
            enabled={validationRules.pattern}
            onToggle={() => handleToggleRule('pattern')}
          >
            <div className="space-y-2">
              <Input 
                placeholder="Regular expression pattern (e.g., ^[A-Za-z]+$)" 
                value={pattern}
                onChange={(e) => handleInputChange('pattern', e.target.value)}
              />
              <Input 
                placeholder="Pattern description (e.g., Only letters allowed)" 
                value={patternDesc}
                onChange={(e) => handleInputChange('patternDesc', e.target.value)}
              />
            </div>
          </ValidationRule>
          
          <ValidationRule 
            title="Conditional Validation" 
            description="Apply rules based on other field values"
            enabled={validationRules.conditionalValidation}
            onToggle={() => handleToggleRule('conditionalValidation')}
          >
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label>Field Name</Label>
                  <Input 
                    placeholder="e.g., country" 
                    value={conditionalField}
                    onChange={(e) => handleInputChange('conditionalField', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label>Condition</Label>
                  <Select 
                    value={conditionalRule} 
                    onValueChange={(value) => handleInputChange('conditionalRule', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equals">Equals</SelectItem>
                      <SelectItem value="notEquals">Not Equals</SelectItem>
                      <SelectItem value="contains">Contains</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Value</Label>
                  <Input 
                    placeholder="e.g., USA" 
                    value={conditionalValue}
                    onChange={(e) => handleInputChange('conditionalValue', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label>Error Message</Label>
                <Input 
                  placeholder="e.g., For USA, zip code must be 5 digits" 
                  value={conditionalErrorMsg}
                  onChange={(e) => handleInputChange('conditionalErrorMsg', e.target.value)}
                />
              </div>
              
              <Alert className="bg-blue-50 border-blue-100 text-xs">
                <Info className="h-4 w-4 text-blue-500" />
                <AlertDescription className="text-blue-700">
                  Example: If country is USA, validate that the zip code has 5 digits
                </AlertDescription>
              </Alert>
            </div>
          </ValidationRule>
          
          <ValidationRule 
            title="Custom Validation" 
            description="Create a custom validation rule"
            enabled={validationRules.customValidation}
            onToggle={() => handleToggleRule('customValidation')}
          >
            <div className="space-y-2">
              <p className="text-sm text-gray-500">For this demo, we'll check if the first character is uppercase</p>
              <Alert className="bg-amber-50 border-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <AlertDescription className="text-amber-800 text-xs">
                  Custom validation functions are limited in this demo. In a real implementation, 
                  you would be able to write custom logic.
                </AlertDescription>
              </Alert>
            </div>
          </ValidationRule>
        </TabsContent>
        
        <TabsContent value="live" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Live Validation Testing</CardTitle>
              <CardDescription>Test your validation rules in real-time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Active Rules:</h3>
                  <ul className="space-y-1 text-sm">
                    {validationRules.required && (
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-1" />
                        Required field
                      </li>
                    )}
                    {validationRules.noSpaces && (
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-1" />
                        No spaces allowed
                      </li>
                    )}
                    {validationRules.numericOnly && (
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-1" />
                        Numeric values only
                      </li>
                    )}
                    {validationRules.minLength && (
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-1" />
                        Minimum length: {minLength} characters
                      </li>
                    )}
                    {validationRules.maxLength && (
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-1" />
                        Maximum length: {maxLength} characters
                      </li>
                    )}
                    {validationRules.pattern && (
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-1" />
                        Pattern matching: {pattern}
                      </li>
                    )}
                    {validationRules.conditionalValidation && (
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-1" />
                        Conditional validation: {conditionalField} {conditionalRule} {conditionalValue}
                      </li>
                    )}
                    {validationRules.customValidation && (
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-1" />
                        Custom validation: First letter uppercase
                      </li>
                    )}
                    {!Object.values(validationRules).some(Boolean) && (
                      <li className="text-gray-500">No validation rules enabled</li>
                    )}
                  </ul>
                </div>
              
                <div className="space-y-2">
                  <InputTextField
                    id="test-field"
                    label="Test Field"
                    placeholder="Type to test validation rules"
                    value={testValue}
                    onChange={(e) => setTestValue(e.target.value)}
                    invalid={!!testError}
                    errorMessage={testError || ""}
                    aria-invalid={!!testError}
                    aria-describedby={testError ? "test-error" : undefined}
                    required={validationRules.required}
                  />
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={validateTestValue}
                      disabled={!Object.values(validationRules).some(Boolean)}
                    >
                      Validate
                    </Button>
                  </div>
                </div>
                
                {testError === null && testValue && (
                  <div className="flex items-center p-2 bg-green-50 text-green-800 rounded border border-green-200">
                    <Check className="h-4 w-4 mr-2" />
                    <span className="text-sm">Validation passed!</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="a11y" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Accessibility Settings</CardTitle>
              <CardDescription>Configure accessibility options for validation errors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>High Contrast Error States</FormLabel>
                    <FormDescription>
                      Use higher contrast colors for error states
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch defaultChecked />
                  </FormControl>
                </div>
                
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Screen Reader Announcements</FormLabel>
                    <FormDescription>
                      Automatically announce validation errors to screen readers
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch defaultChecked />
                  </FormControl>
                </div>
                
                <div className="space-y-2">
                  <FormLabel>Error Announcement Delay (ms)</FormLabel>
                  <Select defaultValue="500">
                    <SelectTrigger>
                      <SelectValue placeholder="Select delay" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Immediate</SelectItem>
                      <SelectItem value="500">500ms (Default)</SelectItem>
                      <SelectItem value="1000">1000ms</SelectItem>
                      <SelectItem value="2000">2000ms</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Time to wait before announcing validation errors
                  </FormDescription>
                </div>
                
                <Alert className="bg-blue-50 border-blue-100">
                  <Info className="h-4 w-4 text-blue-500" />
                  <AlertDescription className="text-blue-700 text-sm">
                    All validation errors include proper ARIA attributes for screen readers: 
                    <code className="bg-blue-100 px-1 mx-1 rounded text-xs">aria-invalid</code> and
                    <code className="bg-blue-100 px-1 mx-1 rounded text-xs">aria-describedby</code>
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default FieldValidationPanel;
