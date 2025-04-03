
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getFieldsForCollection } from '@/services/CollectionService';
import { InputTextField } from '@/components/fields/inputs/InputTextField';
import { NumberInputField } from '@/components/fields/inputs/NumberInputField';
import { DateCalendarField } from '@/components/fields/inputs/DateCalendarField';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function CollectionPreview() {
  const { collectionId } = useParams<{ collectionId: string }>();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [viewMode, setViewMode] = useState<'form' | 'json'>('form');
  
  const { data: fields = [], isLoading, error } = useQuery({
    queryKey: ['fields', collectionId],
    queryFn: () => getFieldsForCollection(collectionId!),
    enabled: !!collectionId
  });

  const handleChange = (fieldId: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  // Render the appropriate field component based on field type
  const renderField = (field: any) => {
    switch (field.type) {
      case 'text':
        return (
          <InputTextField
            key={field.id}
            id={field.id}
            label={field.name}
            placeholder={field.ui_options?.placeholder || `Enter ${field.name.toLowerCase()}`}
            helpText={field.helpText}
            required={field.required}
            value={formValues[field.id] || ''}
            onChange={(e) => handleChange(field.id, e.target.value)}
          />
        );
      case 'number':
        return (
          <NumberInputField
            key={field.id}
            id={field.id}
            label={field.name}
            value={formValues[field.id] || 0}
            onChange={(value) => handleChange(field.id, value)}
            min={field.min}
            max={field.max}
            required={field.required}
            showButtons={field.advanced?.showButtons}
            buttonLayout={field.advanced?.buttonLayout || "horizontal"}
            prefix={field.advanced?.prefix}
            suffix={field.advanced?.suffix}
          />
        );
      case 'textarea':
        return (
          <div key={field.id} className="space-y-2">
            <label htmlFor={field.id} className="block text-sm font-medium">
              {field.name}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Textarea
              id={field.id}
              placeholder={field.ui_options?.placeholder || `Enter ${field.name.toLowerCase()}`}
              value={formValues[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
            />
            {field.helpText && (
              <p className="text-xs text-gray-500">{field.helpText}</p>
            )}
          </div>
        );
      case 'select':
        return (
          <div key={field.id} className="space-y-2">
            <label htmlFor={field.id} className="block text-sm font-medium">
              {field.name}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Select
              value={formValues[field.id] || ''}
              onValueChange={(value) => handleChange(field.id, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={field.ui_options?.placeholder || `Select ${field.name.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
                <SelectItem value="option3">Option 3</SelectItem>
              </SelectContent>
            </Select>
            {field.helpText && (
              <p className="text-xs text-gray-500">{field.helpText}</p>
            )}
          </div>
        );
      case 'boolean':
        return (
          <div key={field.id} className="flex items-center justify-between p-4 border rounded-md">
            <div>
              <label htmlFor={field.id} className="block text-sm font-medium">
                {field.name}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {field.helpText && (
                <p className="text-xs text-gray-500">{field.helpText}</p>
              )}
            </div>
            <Switch
              id={field.id}
              checked={formValues[field.id] || false}
              onCheckedChange={(checked) => handleChange(field.id, checked)}
            />
          </div>
        );
      case 'date':
        return (
          <DateCalendarField
            key={field.id}
            id={field.id}
            label={field.name}
            value={formValues[field.id]}
            onChange={(date) => handleChange(field.id, date)}
            required={field.required}
            helpText={field.helpText}
          />
        );
      default:
        return (
          <InputTextField
            key={field.id}
            id={field.id}
            label={`${field.name} (${field.type})`}
            placeholder={`This field type (${field.type}) preview is not implemented yet`}
            disabled
          />
        );
    }
  };

  return (
    <MainLayout>
      <div className="p-6 md:p-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(`/collections/${collectionId}/fields`)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold mb-1">Collection Preview</h1>
              <p className="text-gray-500">
                Previewing the {collectionId} collection form
              </p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => navigate(`/collections/${collectionId}/fields`)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit Fields
          </Button>
        </div>

        <Tabs defaultValue="form" className="w-full mb-6">
          <TabsList>
            <TabsTrigger value="form">Form Preview</TabsTrigger>
            <TabsTrigger value="json">JSON Data</TabsTrigger>
          </TabsList>
          
          <TabsContent value="form">
            <Card>
              <CardHeader>
                <CardTitle>Collection Form Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="py-8 text-center">Loading fields...</div>
                ) : error ? (
                  <div className="py-8 text-center text-red-500">Error loading fields</div>
                ) : fields.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">
                    <p>No fields have been added to this collection yet.</p>
                    <Button 
                      className="mt-4" 
                      onClick={() => navigate(`/collections/${collectionId}/fields`)}
                    >
                      Add Fields
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {fields.map(renderField)}
                    
                    <div className="flex justify-end pt-4">
                      <Button>Submit Form</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="json">
            <Card>
              <CardHeader>
                <CardTitle>Form Data (JSON)</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-50 p-4 rounded-md overflow-auto max-h-96 text-sm">
                  {JSON.stringify({fields, values: formValues}, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
