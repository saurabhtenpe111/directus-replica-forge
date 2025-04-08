
import React from 'react';
import { CollectionField } from '@/services/CollectionService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

export interface CollectionPreviewFormProps {
  fields: CollectionField[];
  name: string;
  collectionId?: string;
  isLoading?: boolean;
  error?: Error | null;
  onPreviewSave?: (formData: Record<string, any>) => void;
}

export function CollectionPreviewForm({ 
  fields, 
  name, 
  collectionId,
  isLoading,
  error,
  onPreviewSave 
}: CollectionPreviewFormProps) {
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onPreviewSave) {
      // In a real implementation, we would gather form values here
      const formData = { id: collectionId, name: "Sample data" };
      onPreviewSave(formData);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{name} Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading fields...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                <p>Error: {error.message}</p>
              </div>
            ) : fields.length > 0 ? (
              fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <label className="text-sm font-medium">{field.name}</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder={`Enter ${field.name}...`}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No fields defined yet.</p>
              </div>
            )}

            {fields.length > 0 && onPreviewSave && (
              <div className="mt-6">
                <Button type="submit" className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Save {name}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default CollectionPreviewForm;
