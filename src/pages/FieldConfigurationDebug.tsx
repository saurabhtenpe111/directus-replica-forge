
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CollectionService } from '@/services/CollectionService';
import { MainLayout } from '@/components/layout/MainLayout';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function FieldConfigurationDebug() {
  const { collectionId } = useParams<{ collectionId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [isTestingField, setIsTestingField] = useState(false);

  const addDebugLog = (message: string) => {
    setDebugLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
  };

  const { data: fields = [], isLoading, error } = useQuery({
    queryKey: ['fields', collectionId],
    queryFn: () => {
      addDebugLog(`Fetching fields for collection: ${collectionId}`);
      return CollectionService.getFieldsForCollection(collectionId!);
    },
    enabled: !!collectionId
  });

  const createFieldMutation = useMutation({
    mutationFn: (fieldData: any) => {
      addDebugLog(`Creating field with data: ${JSON.stringify(fieldData)}`);
      return CollectionService.createField(collectionId!, fieldData);
    },
    onSuccess: (data) => {
      addDebugLog(`Field created successfully: ${data.id}`);
      queryClient.invalidateQueries({ queryKey: ['fields', collectionId] });
      toast({
        title: "Field created",
        description: "Field was successfully created in the database",
      });
    },
    onError: (error: any) => {
      addDebugLog(`Error creating field: ${error.message}`);
      toast({
        title: "Error creating field",
        description: error.message || "There was an error creating the field",
        variant: "destructive",
      });
    }
  });

  const testFieldCreation = async () => {
    try {
      setIsTestingField(true);
      addDebugLog('Starting test field creation...');
      
      const testFieldData = {
        name: `Test Field ${Math.floor(Math.random() * 1000)}`,
        apiId: `test_field_${Date.now()}`,
        type: 'text',
        description: 'This is a test field created for debugging',
        required: false
      };
      
      addDebugLog(`Creating test field with data: ${JSON.stringify(testFieldData)}`);
      
      const result = await createFieldMutation.mutateAsync(testFieldData);
      
      addDebugLog(`Test field creation complete, result: ${JSON.stringify(result)}`);
    } catch (error: any) {
      addDebugLog(`Error in test field creation: ${error.message}`);
    } finally {
      setIsTestingField(false);
    }
  };

  if (!collectionId) {
    return <div>Missing collection ID parameter.</div>;
  }

  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Field Configuration Debug</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Debug Tools</CardTitle>
              <CardDescription>Tools to debug field creation</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={testFieldCreation} 
                disabled={isTestingField}
                className="mb-4"
              >
                {isTestingField ? 'Creating Test Field...' : 'Create Test Field'}
              </Button>

              <Separator className="my-4" />
              
              <div>
                <h3 className="text-lg font-medium mb-2">Current Fields</h3>
                {isLoading ? (
                  <p>Loading fields...</p>
                ) : error ? (
                  <p className="text-red-500">Error loading fields: {(error as any).message}</p>
                ) : (
                  <div>
                    <p className="mb-2">Found {fields.length} fields in collection</p>
                    <ul className="space-y-2 border rounded-md p-2 bg-gray-50">
                      {fields.map(field => (
                        <li key={field.id} className="p-2 border-b last:border-0">
                          <div><strong>{field.name}</strong> ({field.type})</div>
                          <div className="text-sm text-gray-500">
                            API ID: {field.apiId}, Required: {field.required ? 'Yes' : 'No'}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Debug Logs</CardTitle>
              <CardDescription>Operation logs for troubleshooting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 overflow-y-auto bg-gray-50 p-2 border rounded-md font-mono text-sm">
                {debugLogs.length === 0 ? (
                  <p className="text-gray-500">No logs yet. Perform actions to see logs.</p>
                ) : (
                  debugLogs.map((log, index) => (
                    <div key={index} className="py-1">
                      {log}
                    </div>
                  ))
                )}
              </div>
              <Button 
                variant="outline" 
                onClick={() => setDebugLogs([])} 
                className="mt-2"
                size="sm"
              >
                Clear Logs
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
