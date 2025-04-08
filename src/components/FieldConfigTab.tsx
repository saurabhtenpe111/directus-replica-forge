
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface FieldConfigTabProps {
  fieldType: string | null;
  fieldData?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export function FieldConfigTab({
  fieldType,
  fieldData,
  onSave,
  onCancel,
  isSaving = false
}: FieldConfigTabProps) {
  const [name, setName] = useState('');
  const [apiId, setApiId] = useState('');
  const [description, setDescription] = useState('');
  const [required, setRequired] = useState(false);
  const [placeholder, setPlaceholder] = useState('');

  useEffect(() => {
    if (fieldData) {
      setName(fieldData.name || '');
      setApiId(fieldData.apiId || '');
      setDescription(fieldData.description || '');
      setRequired(fieldData.required || false);
      setPlaceholder(fieldData.settings?.ui_options?.placeholder || '');
    } else if (fieldType) {
      // Generate a default field name based on type
      const typeLabel = fieldType.charAt(0).toUpperCase() + fieldType.slice(1);
      setName(`New ${typeLabel} Field`);
      setApiId(`new_${fieldType}_field`);
      setPlaceholder(`Enter ${typeLabel}...`);
    }
  }, [fieldData, fieldType]);

  // Auto-generate API ID based on name
  useEffect(() => {
    if (!fieldData && name) {
      const generatedApiId = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
      setApiId(generatedApiId);
    }
  }, [name, fieldData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Saving field with data:', {
      name,
      apiId,
      description,
      required,
      placeholder,
      type: fieldType
    });
    
    // Create field data object
    const fieldConfigData = {
      name,
      apiId,
      description,
      required,
      type: fieldType,
      ui_options: {
        placeholder
      }
    };
    
    onSave(fieldConfigData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Field Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter field name"
              required
            />
            <p className="text-sm text-gray-500">
              Display name for this field
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="apiId">API ID</Label>
            <Input 
              id="apiId" 
              value={apiId} 
              onChange={(e) => setApiId(e.target.value)}
              placeholder="Enter API ID"
              required
            />
            <p className="text-sm text-gray-500">
              Used in API requests and code
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter field description"
            rows={3}
          />
          <p className="text-sm text-gray-500">
            Optional description explaining the purpose of this field
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="placeholder">Placeholder Text</Label>
          <Input
            id="placeholder"
            value={placeholder}
            onChange={(e) => setPlaceholder(e.target.value)}
            placeholder="Enter placeholder text"
          />
          <p className="text-sm text-gray-500">
            Hint text displayed when field is empty
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="required"
            checked={required}
            onCheckedChange={setRequired}
          />
          <Label htmlFor="required">Required Field</Label>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={!name || !apiId || isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Field'
          )}
        </Button>
      </div>
    </form>
  );
}

export default FieldConfigTab;
