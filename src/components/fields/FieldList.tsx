
import React from 'react';
import { CollectionField } from '@/services/CollectionService';

export interface FieldListProps {
  fields: CollectionField[];
  onEdit: (field: CollectionField) => void;
  onDelete: (field: CollectionField) => void;
  onReorder: (orderedFields: CollectionField[]) => Promise<void>;
}

export function FieldList({ fields, onEdit, onDelete, onReorder }: FieldListProps) {
  // Simple implementation - in a real app, you'd implement drag-and-drop reordering
  return (
    <div className="space-y-2">
      {fields.map((field) => (
        <div 
          key={field.id} 
          className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50"
        >
          <div>
            <p className="font-medium">{field.name}</p>
            <p className="text-sm text-gray-500">{field.type}</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => onEdit(field)}
              className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
            >
              Edit
            </button>
            <button 
              onClick={() => onDelete(field)}
              className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FieldList;
