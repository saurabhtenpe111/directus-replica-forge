
import React from 'react';
import { CollectionField } from '@/services/CollectionService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

export interface CollectionPreviewFormProps {
  fields: CollectionField[];
  name: string;
}

export function CollectionPreviewForm({ fields, name }: CollectionPreviewFormProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{name} Form</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fields.length > 0 ? (
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
          </div>

          {fields.length > 0 && (
            <div className="mt-6">
              <Button className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Save {name}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default CollectionPreviewForm;
