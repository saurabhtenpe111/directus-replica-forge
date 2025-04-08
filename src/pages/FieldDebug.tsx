
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CollectionService } from '@/services/CollectionService';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { DebugFieldConfigPanel } from '@/components/fields/DebugFieldConfigPanel';

export default function FieldDebug() {
  const { collectionId } = useParams<{ collectionId: string }>();
  const queryClient = useQueryClient();
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [isAddingField, setIsAddingField] = useState(false);
  const [selectedFieldType, setSelectedFieldType] = useState<string | null>(null);
  const [operationLogs, setOperationLogs] = useState<string[]>([]);
  
  // Add a log entry
  const addLog = (message: string) => {
    setOperationLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
  };

  // Fetch fields for the collection
  const { data: fields = [], isLoading, error } = useQuery({
    queryKey: ['fields', collectionId],
    queryFn: async () => {
      addLog(`Fetching fields for collection: ${collectionId}`);
      const result = await CollectionService.getFieldsForCollection(collectionId!);
      addLog(`Fetched ${result.length} fields`);
      return result;
    },
    enabled: !!collectionId
  });

  const handleRefreshFields = () => {
    addLog('Manually refreshing fields from database');
    queryClient.invalidateQueries({ queryKey: ['fields', collectionId] });
  };

  const handleCreateTestField = () => {
    addLog('Starting test field creation');
    setIsAddingField(true);
    setSelectedFieldType('text');
  };

  const handleSelectField = (fieldId: string) => {
    setSelectedFieldId(fieldId);
    setIsAddingField(false);
    setSelectedFieldType(null);
    addLog(`Selected field: ${fieldId}`);
  };

  const handleSaveComplete = () => {
    addLog('Field saved, refreshing field list');
    setIsAddingField(false);
    setSelectedFieldId(null);
    setSelectedFieldType(null);
    queryClient.invalidateQueries({ queryKey: ['fields', collectionId] });
  };

  const getSelectedField = () => {
    if (!selectedFieldId) return null;
    return fields.find(field => field.id === selectedFieldId);
  };

  if (!collectionId) {
    return (
      <MainLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold">Missing Collection ID</h1>
          <p>Please specify a collection ID in the URL.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Field Debugging Tool</h1>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleRefreshFields}>
              Refresh Fields
            </Button>
            <Button onClick={handleCreateTestField}>
              Create Test Field
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Fields in Collection</CardTitle>
                <CardDescription>
                  Collection ID: <code className="bg-gray-100 px-2 py-0.5 rounded">{collectionId}</code>
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p>Loading fields...</p>
                ) : error ? (
                  <div className="p-3 bg-red-50 text-red-800 rounded-md">
                    Error loading fields: {(error as any).message}
                  </div>
                ) : fields.length === 0 ? (
                  <p className="text-gray-500">No fields found in this collection.</p>
                ) : (
                  <ul className="space-y-2">
                    {fields.map(field => (
                      <li 
                        key={field.id} 
                        className={`p-3 rounded-md cursor-pointer ${selectedFieldId === field.id ? 'bg-blue-50 border border-blue-200' : 'border hover:bg-gray-50'}`}
                        onClick={() => handleSelectField(field.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{field.name}</p>
                            <p className="text-sm text-gray-500">API ID: {field.apiId}</p>
                          </div>
                          <Badge variant="outline">{field.type}</Badge>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="col-span-1 md:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>
                  {isAddingField 
                    ? "Create New Field" 
                    : selectedFieldId 
                      ? "Edit Field" 
                      : "Select or Create a Field"}
                </CardTitle>
                <CardDescription>
                  {isAddingField 
                    ? `Creating a new ${selectedFieldType} field` 
                    : selectedFieldId 
                      ? `Editing field: ${getSelectedField()?.name}` 
                      : "Select a field from the list or create a new one"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isAddingField ? (
                  <DebugFieldConfigPanel
                    fieldType={selectedFieldType}
                    collectionId={collectionId}
                    onSaveComplete={handleSaveComplete}
                    onCancel={() => {
                      setIsAddingField(false);
                      addLog('Field creation cancelled');
                    }}
                  />
                ) : selectedFieldId ? (
                  <DebugFieldConfigPanel
                    fieldType={getSelectedField()?.type || null}
                    fieldData={getSelectedField()}
                    collectionId={collectionId}
                    onSaveComplete={handleSaveComplete}
                    onCancel={() => {
                      setSelectedFieldId(null);
                      addLog('Field editing cancelled');
                    }}
                  />
                ) : (
                  <div className="text-center p-6">
                    <p className="text-gray-500 mb-4">No field selected</p>
                    <Button onClick={handleCreateTestField}>
                      Create Test Field
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="col-span-1 md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Operation Logs</CardTitle>
                <CardDescription>Logs of operations performed during this debugging session</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-3 rounded-md h-60 overflow-y-auto font-mono text-sm">
                  {operationLogs.length === 0 ? (
                    <p className="text-gray-500">No operations logged yet.</p>
                  ) : (
                    operationLogs.map((log, index) => (
                      <div key={index} className="py-0.5">
                        {log}
                      </div>
                    ))
                  )}
                </div>
                <div className="mt-2 flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setOperationLogs([])}
                  >
                    Clear Logs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
