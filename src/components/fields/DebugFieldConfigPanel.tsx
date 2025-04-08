
import React, { useState } from 'react';
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
  const [isSaving, setIsSaving] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

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
    
    // Deep inspection of the validation settings
    if (updatedFieldConfig.validation) {
      console.log(`Debug - Validation settings:`, JSON.stringify(updatedFieldConfig.validation, null, 2));
    }
    
    // Perform a deep inspection of the complete data before saving
    console.log(`Debug - Saving field data:`, JSON.stringify(updatedFieldConfig, null, 2));
    
    // Attempt to save to database
    try {
      let response;
      
      if (fieldData?.id) {
        // Update existing field
        console.log(`Updating field ${fieldData.id} in collection ${collectionId} with data:`, updatedFieldConfig);
        response = await updateField(collectionId, fieldData.id, updatedFieldConfig);
      } else {
        // Create new field
        console.log(`Creating new field in collection ${collectionId} with data:`, updatedFieldConfig);
        response = await createField(collectionId, updatedFieldConfig);
      }
      
      setApiResponse(response);
      
      // Inspect the response for debugging
      console.log(`Debug - API response:`, JSON.stringify(response, null, 2));
      
      // Specifically log validation settings in the response
      if (response?.settings?.validation) {
        console.log(`Debug - Validation settings in response:`, JSON.stringify(response.settings.validation, null, 2));
      } else {
        console.log(`Debug - No validation settings in response`);
      }
      
      toast({
        title: fieldData?.id ? "Field updated" : "Field created",
        description: `Field was successfully ${fieldData?.id ? "updated" : "created"} in the database`,
      });
      
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
                      toast({
                        title: "Logged to console",
                        description: "Current field configuration has been logged to the console",
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
      </Tabs>
    </div>
  );
}

export default DebugFieldConfigPanel;
