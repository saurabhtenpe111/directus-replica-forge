
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { FieldConfigTab } from '@/components/FieldConfigTab';
import { FieldDebugger } from '@/components/fields/FieldDebugger';
import { createField, updateField } from '@/services/CollectionService';

interface DebugFieldConfigPanelProps {
  fieldType: string | null;
  fieldData?: any;
  collectionId: string;
  onSaveComplete: () => void;
  onCancel: () => void;
}

export function DebugFieldConfigPanel({
  fieldType,
  fieldData,
  collectionId,
  onSaveComplete,
  onCancel
}: DebugFieldConfigPanelProps) {
  const [activeTab, setActiveTab] = useState('config');
  const [fieldConfig, setFieldConfig] = useState<any>(fieldData || {});
  const [originalFieldConfig, setOriginalFieldConfig] = useState<any>(fieldData || {});
  const [isSaving, setIsSaving] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [diffLog, setDiffLog] = useState<string[]>([]);

  // When fieldData changes, update both current and original configs
  useEffect(() => {
    if (fieldData) {
      setFieldConfig(fieldData);
      setOriginalFieldConfig(JSON.parse(JSON.stringify(fieldData))); // Deep copy
    }
  }, [fieldData]);

  // Function to log differences between objects
  const logDifferences = (before: any, after: any, path = '') => {
    const differences: string[] = [];
    
    const compareObjects = (beforeObj: any, afterObj: any, currentPath = '') => {
      if (!beforeObj || !afterObj || typeof beforeObj !== 'object' || typeof afterObj !== 'object') {
        if (beforeObj !== afterObj) {
          differences.push(`${currentPath}: ${JSON.stringify(beforeObj)} -> ${JSON.stringify(afterObj)}`);
        }
        return;
      }
      
      // Check keys in before that might have changed or been removed
      Object.keys(beforeObj).forEach(key => {
        const keyPath = currentPath ? `${currentPath}.${key}` : key;
        
        if (!(key in afterObj)) {
          differences.push(`${keyPath}: ${JSON.stringify(beforeObj[key])} -> REMOVED`);
        } else if (
          typeof beforeObj[key] === 'object' && 
          beforeObj[key] !== null &&
          typeof afterObj[key] === 'object' &&
          afterObj[key] !== null
        ) {
          compareObjects(beforeObj[key], afterObj[key], keyPath);
        } else if (beforeObj[key] !== afterObj[key]) {
          differences.push(`${keyPath}: ${JSON.stringify(beforeObj[key])} -> ${JSON.stringify(afterObj[key])}`);
        }
      });
      
      // Check for new keys in after
      Object.keys(afterObj).forEach(key => {
        if (!(key in beforeObj)) {
          const keyPath = currentPath ? `${currentPath}.${key}` : key;
          differences.push(`${keyPath}: NEW -> ${JSON.stringify(afterObj[key])}`);
        }
      });
    };
    
    compareObjects(before, after, path);
    return differences;
  };

  const handleSave = async (data: any) => {
    setIsSaving(true);
    setError(null);
    setApiResponse(null);
    
    // Update local state with the new field data
    const updatedFieldConfig = {
      ...fieldConfig,
      ...data,
      type: fieldType || fieldData?.type
    };
    
    setFieldConfig(updatedFieldConfig);
    
    // Log the differences between original and new data
    const differences = logDifferences(originalFieldConfig, updatedFieldConfig);
    setDiffLog(differences);
    console.log("Changes detected:", differences);
    
    // Perform a deep inspection of the complete data before saving
    console.log(`Debug - Saving field data:`, JSON.stringify(updatedFieldConfig, null, 2));
    
    // Attempt to save to database
    try {
      let response;
      
      if (fieldData?.id) {
        // Update existing field
        console.log(`Updating field ${fieldData.id} in collection ${collectionId} with data:`, updatedFieldConfig);
        response = await updateField(
          collectionId, 
          fieldData.id, 
          updatedFieldConfig,
          { columnToUpdate: 'all', mergeStrategy: 'deep' }
        );
      } else {
        // Create new field
        console.log(`Creating new field in collection ${collectionId} with data:`, updatedFieldConfig);
        response = await createField(collectionId, updatedFieldConfig);
      }
      
      setApiResponse(response);
      
      // Inspect the response for debugging
      console.log(`Debug - API response:`, JSON.stringify(response, null, 2));
      
      toast({
        title: fieldData?.id ? "Field updated" : "Field created",
        description: `Field was successfully ${fieldData?.id ? "updated" : "created"} in the database`,
      });
      
      // Update the original field config with the new data
      setOriginalFieldConfig(JSON.parse(JSON.stringify(response)));
      
      onSaveComplete();
    } catch (err: any) {
      console.error("Error saving field:", err);
      setError(err.message || "An unknown error occurred");
      
      toast({
        title: "Error saving field",
        description: err.message || "There was an error saving the field to the database",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="config">Field Configuration</TabsTrigger>
          <TabsTrigger value="debug">Debug</TabsTrigger>
          <TabsTrigger value="changes">Changes Log</TabsTrigger>
        </TabsList>
        
        <TabsContent value="config">
          <Card>
            <CardContent className="pt-6">
              <FieldConfigTab
                fieldType={fieldType}
                fieldData={fieldData}
                onSave={handleSave}
                onCancel={onCancel}
                isSaving={isSaving}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="debug">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-medium mb-4">Field Debug Information</h2>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-800">
                  <strong>Error:</strong> {error}
                </div>
              )}
              
              <FieldDebugger 
                fieldData={fieldConfig} 
                apiResponse={apiResponse}
                isLoading={isSaving}
              />
              
              <div className="mt-4 space-y-2">
                <h3 className="font-medium">Debugging Actions</h3>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      console.log('Current field configuration:', fieldConfig);
                      console.log('Original field configuration:', originalFieldConfig);
                      const differences = logDifferences(originalFieldConfig, fieldConfig);
                      console.log('Differences:', differences);
                      setDiffLog(differences);
                      
                      toast({
                        title: "Logged to console",
                        description: "Field configurations and differences have been logged to the console",
                      });
                    }}
                  >
                    Log to Console
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="changes">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-medium mb-4">Changes Log</h2>
              
              {diffLog.length > 0 ? (
                <div className="space-y-2">
                  <div className="mb-2 p-2 bg-gray-50 border border-gray-200 rounded-md">
                    <h3 className="text-sm font-medium mb-2">Field Changes</h3>
                    <pre className="text-xs overflow-auto p-2 bg-gray-100 rounded">
                      {diffLog.map((diff, index) => (
                        <div key={index} className="py-1 border-b border-gray-200 last:border-0">
                          {diff}
                        </div>
                      ))}
                    </pre>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No changes detected yet.</p>
              )}
              
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const differences = logDifferences(originalFieldConfig, fieldConfig);
                    setDiffLog(differences);
                    toast({
                      title: "Changes refreshed",
                      description: "The changes log has been updated",
                    });
                  }}
                >
                  Refresh Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default DebugFieldConfigPanel;
