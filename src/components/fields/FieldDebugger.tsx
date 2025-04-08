
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface FieldDebuggerProps {
  fieldData: any;
  apiResponse?: any;
  isLoading?: boolean;
}

export function FieldDebugger({ fieldData, apiResponse, isLoading = false }: FieldDebuggerProps) {
  const [showDiff, setShowDiff] = useState(false);
  const [showValidationDetails, setShowValidationDetails] = useState(false);
  
  const getObjectDifferences = (before: any, after: any) => {
    if (!before || !after) return {};
    
    const differences: any = {};
    
    // Get all keys from both objects
    const allKeys = [...new Set([...Object.keys(before), ...Object.keys(after)])];
    
    for (const key of allKeys) {
      // Deep comparison for nested objects
      if (
        typeof before[key] === 'object' && before[key] !== null &&
        typeof after[key] === 'object' && after[key] !== null &&
        !Array.isArray(before[key]) && !Array.isArray(after[key])
      ) {
        const nestedDiff = getObjectDifferences(before[key], after[key]);
        if (Object.keys(nestedDiff).length > 0) {
          differences[key] = nestedDiff;
        }
      } 
      // Simple comparison for non-objects or arrays
      else if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
        differences[key] = {
          before: before[key],
          after: after[key]
        };
      }
    }
    
    return differences;
  };
  
  const differences = apiResponse ? getObjectDifferences(fieldData, apiResponse) : {};
  const hasDifferences = Object.keys(differences).length > 0;

  // Extract validation data
  const originalValidation = fieldData?.validation || fieldData?.settings?.validation || {};
  const responseValidation = apiResponse?.validation || apiResponse?.settings?.validation || {};

  return (
    <Card className="my-4">
      <CardHeader>
        <CardTitle className="text-md">Field Debug Information</CardTitle>
        <CardDescription>Details about the field and API operations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-1">Field Data to be Sent</h3>
            <pre className="bg-gray-50 p-3 rounded-md text-xs overflow-auto max-h-40">
              {JSON.stringify(fieldData, null, 2)}
            </pre>
            
            <div className="mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowValidationDetails(!showValidationDetails)}
                className="mb-2"
              >
                {showValidationDetails ? 'Hide' : 'Show'} Validation Details
              </Button>
              
              {showValidationDetails && (
                <>
                  <h4 className="text-sm font-medium mb-1">Validation Settings</h4>
                  <pre className="bg-blue-50 p-3 rounded-md text-xs overflow-auto max-h-40">
                    {JSON.stringify(originalValidation, null, 2)}
                  </pre>
                  
                  <div className="mt-2">
                    <h4 className="text-sm font-medium mb-1">Validation Path in Data</h4>
                    <ul className="list-disc list-inside text-sm">
                      {fieldData?.validation ? <li>Direct: fieldData.validation</li> : null}
                      {fieldData?.settings?.validation ? <li>Nested: fieldData.settings.validation</li> : null}
                      {!fieldData?.validation && !fieldData?.settings?.validation ? <li>No validation data found</li> : null}
                    </ul>
                  </div>
                </>
              )}
            </div>
            
            {fieldData?.settings?.validation && (
              <div className="mt-2">
                <h4 className="text-sm font-medium mb-1">Settings.Validation</h4>
                <pre className="bg-green-50 p-3 rounded-md text-xs overflow-auto max-h-40">
                  {JSON.stringify(fieldData.settings.validation, null, 2)}
                </pre>
              </div>
            )}
          </div>

          <div>
            <h3 className="font-medium mb-1">API Response {isLoading && '(Loading...)'}</h3>
            <pre className="bg-gray-50 p-3 rounded-md text-xs overflow-auto max-h-40">
              {apiResponse 
                ? JSON.stringify(apiResponse, null, 2)
                : isLoading
                ? 'Waiting for response...'
                : 'No response yet'}
            </pre>
            
            {apiResponse?.settings?.validation && (
              <div className="mt-2">
                <h4 className="text-sm font-medium mb-1">Response Validation Settings</h4>
                <pre className="bg-purple-50 p-3 rounded-md text-xs overflow-auto max-h-40">
                  {JSON.stringify(apiResponse.settings.validation, null, 2)}
                </pre>
              </div>
            )}
            
            {hasDifferences && (
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowDiff(!showDiff)}
                  className="mb-2"
                >
                  {showDiff ? 'Hide' : 'Show'} Differences
                </Button>
                
                {showDiff && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Data Differences</h4>
                    <pre className="bg-yellow-50 p-3 rounded-md text-xs overflow-auto max-h-40">
                      {JSON.stringify(differences, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <h3 className="font-medium mb-1">Troubleshooting Tips</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Ensure all required field properties are provided</li>
              <li>Check that collection ID is valid and exists in the database</li>
              <li>Verify API ID is unique within the collection</li>
              <li>Ensure Supabase connection is working properly</li>
              <li>Check browser console for any JavaScript errors</li>
              <li>Make sure validation settings are in the correct format</li>
              <li>Verify that settings are being properly merged, not overwritten</li>
            </ul>
            
            <div className="mt-3">
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => {
                  const debugInfo = {
                    fieldData,
                    apiResponse,
                    differences: hasDifferences ? differences : 'No differences detected',
                    validationComparison: {
                      original: originalValidation,
                      response: responseValidation
                    }
                  };
                  console.log('Field Debug Information:', debugInfo);
                  toast({
                    title: "Debug info logged",
                    description: "Check browser console for detailed debug information",
                  });
                }}
              >
                Log Detailed Debug Info
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default FieldDebugger;
