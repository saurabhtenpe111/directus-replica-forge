import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CollectionService, CollectionField } from '@/services/CollectionService';
import { FieldConfigPanel } from '@/components/fields/FieldConfigPanel';
import { MainLayout } from '@/components/layout/MainLayout';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { FieldTypeSelector } from '@/components/fields/FieldTypeSelector';
import { CollectionPreviewForm } from '@/components/collection-preview/CollectionPreviewForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { FieldList } from '@/components/fields/FieldList';
import {
  FileJson,
  Settings2,
  View,
  ArrowLeft,
  Eye,
  Save,
  Plus,
  Trash2,
  FileType,
  X
} from 'lucide-react';
import { FieldAppearancePanel } from '@/components/fields/appearance/FieldAppearancePanel';
import { FieldValidationPanel } from '@/components/fields/validation/FieldValidationPanel';
import { FieldAdvancedPanel } from '@/components/fields/FieldAdvancedPanel';
import { FieldLayoutPanel } from '@/components/fields/FieldLayoutPanel';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { JSONEditorField } from '@/components/fields/inputs/JSONEditorField';
import { ComponentSelector } from '@/components/fields/ComponentSelector';
import { 
  ValidationSettings as ValidationSettingsType,
  AppearanceSettings,
  AdvancedSettings,
  UIOptions
} from '@/utils/fieldSettingsHelpers';
import { FieldSettingsManager } from '@/components/fields/FieldSettingsManager';

// Define the Field type that will be used in this component
interface Field extends CollectionField {
  required: boolean; // Make sure required is non-optional
}

// Define FieldType interface separately from FieldTypeGroup
export interface FieldType {
  id: string;
  name: string;
  description: string;
  group?: string;
}

// Define the structure for grouping field types
export interface FieldTypeGroup {
  [key: string]: FieldType[];
}

const fieldTypes: FieldTypeGroup = {
  'Text & Numbers': [
    { id: 'text', name: 'Input', description: 'Single line text field' },
    { id: 'textarea', name: 'Textarea', description: 'Multi-line text field' },
    { id: 'number', name: 'Number', description: 'Numeric field with validation and formatting' },
    { id: 'password', name: 'Password', description: 'Secure password input with toggle' },
    { id: 'mask', name: 'Input Mask', description: 'Input with formatting mask' },
    { id: 'otp', name: 'Input OTP', description: 'One-time password input' },
    { id: 'autocomplete', name: 'Autocomplete Input', description: 'Input with suggestions' },
    { id: 'blockeditor', name: 'Block Editor', description: 'Rich text block editor' },
    { id: 'code', name: 'Code', description: 'Code snippet with syntax highlighting' },
    { id: 'wysiwyg', name: 'WYSIWYG', description: 'What you see is what you get editor' },
    { id: 'markdown', name: 'Markdown', description: 'Markdown text editor' },
    { id: 'tags', name: 'Tags', description: 'Input for multiple tags or keywords' },
    { id: 'list', name: 'List', description: 'Ordered or unordered list' },
    { id: 'slug', name: 'Slug', description: 'URL-friendly version of a name' },
    { id: 'seo', name: 'SEO Interface', description: 'Search engine optimization fields' },
    { id: 'translation', name: 'Translation', description: 'Multilingual content editor' },
  ],
  'Selection': [
    { id: 'select', name: 'Dropdown', description: 'Single selection dropdown' },
    { id: 'multiselect', name: 'Dropdown (Multiple)', description: 'Multiple selection dropdown' },
    { id: 'toggle', name: 'Toggle', description: 'On/Off toggle switch' },
    { id: 'boolean', name: 'Boolean', description: 'True/False toggle field' },
    { id: 'checkbox', name: 'Checkboxes', description: 'Multiple checkbox options' },
    { id: 'tristatecheck', name: 'Tri-State Checkbox', description: 'Checkbox with three states' },
    { id: 'multistatecheck', name: 'Multi-State Checkbox', description: 'Checkbox with multiple states' },
    { id: 'radio', name: 'Radio Buttons', description: 'Single selection radio options' },
    { id: 'selectbutton', name: 'Select Button', description: 'Button-style option selector' },
    { id: 'treeselect', name: 'Checkboxes (Tree)', description: 'Hierarchical checkbox selection' },
    { id: 'listbox', name: 'List Box', description: 'Scrollable selection list' },
    { id: 'mention', name: 'Mention Box', description: 'Text input with @mentions' },
    { id: 'date', name: 'Date/Calendar', description: 'Advanced date and time picker' },
    { id: 'color', name: 'Color', description: 'Color picker field' },
    { id: 'colorpicker', name: 'Color Picker', description: 'Advanced color selection tool' },
    { id: 'icon', name: 'Icon', description: 'Icon selection from a library' },
    { id: 'radioCards', name: 'Radio Cards', description: 'Visual card-based radio selection' },
    { id: 'checkboxCards', name: 'Checkbox Cards', description: 'Visual card-based checkbox selection' },
  ],
  'Relational': [
    { id: 'relation', name: 'Relation', description: 'Relationship to another collection' },
    { id: 'file', name: 'File', description: 'Single file upload field' },
    { id: 'image', name: 'Image', description: 'Image upload and preview' },
    { id: 'files', name: 'Files', description: 'Multiple file uploads' },
    { id: 'media', name: 'Media', description: 'Image, video, or document upload' },
    { id: 'manyToMany', name: 'Many to Many', description: 'Many-to-many relationship' },
    { id: 'oneToMany', name: 'One to Many', description: 'One-to-many relationship' },
    { id: 'manyToOne', name: 'Many to One', description: 'Many-to-one relationship' },
    { id: 'treeView', name: 'Tree View', description: 'Hierarchical tree relationship view' },
    { id: 'translations', name: 'Translations', description: 'Multi-language content fields' },
    { id: 'builder', name: 'Builder (M2A)', description: 'Advanced modular content builder' },
    { id: 'collectionItem', name: 'Collection Item Dropdown', description: 'Select items from another collection' },
  ],
  'Advanced': [
    { id: 'json', name: 'JSON', description: 'Structured JSON data field' },
    { id: 'map', name: 'Map', description: 'Geographic map selection' },
    { id: 'repeater', name: 'Repeater', description: 'Repeatable group of fields' },
    { id: 'inlineRepeater', name: 'Inline Repeater', description: 'Inline repeatable fields' },
    { id: 'rating', name: 'Rating', description: 'Star-based rating selector' },
    { id: 'slider', name: 'Slider', description: 'Range slider input' },
    { id: 'hash', name: 'Hash', description: 'Secure hash field with encryption' },
  ],
  'Presentation': [
    { id: 'divider', name: 'Divider', description: 'Visual separator between fields' },
    { id: 'buttonLinks', name: 'Button Links', description: 'Clickable button links' },
    { id: 'notice', name: 'Notice', description: 'Information or warning message' },
    { id: 'modal', name: 'Modal', description: 'Dialog popup trigger' },
    { id: 'builderButton', name: 'Builder (M2A) Button Group', description: 'Button group for builder interface' },
    { id: 'superHeader', name: 'Super Header', description: 'Prominent section header' },
  ],
  'Groups': [
    { id: 'accordion', name: 'Accordion', description: 'Collapsible content sections' },
    { id: 'detailGroup', name: 'Detail Group', description: 'Grouped details with labels' },
    { id: 'rawGroup', name: 'Raw Group', description: 'Custom group without styling' },
    { id: 'modal', name: 'Modal', description: 'Popup dialog content group' },
    { id: 'tabGroup', name: 'Tab Group', description: 'Content organized in tabs' },
  ],
};

// Flatten field types for easier access
const flatFieldTypes: FieldType[] = Object.entries(fieldTypes).flatMap(([category, types]) =>
  types.map(type => ({ ...type, group: category }))
);

// Component implementation
const FieldConfiguration: React.FC = () => {
  const { collectionId, fieldId } = useParams<{ collectionId: string, fieldId?: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [selectedFieldType, setSelectedFieldType] = useState<string | null>(null);
  const [fieldConfigOpen, setFieldConfigOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("fields");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [isJSONModalOpen, setIsJSONModalOpen] = useState<boolean>(false);
  const [jsonValue, setJsonValue] = useState<string>('{}');
  
  const { 
    data: fields = [], 
    isLoading,
    refetch: refetchFields
  } = useQuery({
    queryKey: ['collection-fields', collectionId],
    queryFn: () => CollectionService.getFieldsForCollection(collectionId!),
    enabled: !!collectionId,
  });
  
  const { data: collections = [] } = useQuery({
    queryKey: ['collections'],
    queryFn: CollectionService.fetchCollections,
  });
  
  const collection = collections.find(c => c.id === collectionId);
  
  const createFieldMutation = useMutation({
    mutationFn: (data: any) => CollectionService.createField(collectionId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection-fields', collectionId] });
      setFieldConfigOpen(false);
      setSelectedFieldType(null);
      toast({
        title: "Field created",
        description: "The field was successfully created",
      });
    },
  });
  
  const updateFieldMutation = useMutation({
    mutationFn: (data: any) => CollectionService.updateField(collectionId!, data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection-fields', collectionId] });
      setFieldConfigOpen(false);
      setSelectedField(null);
      toast({
        title: "Field updated",
        description: "The field was successfully updated",
      });
    },
  });
  
  const deleteFieldMutation = useMutation({
    mutationFn: (fieldId: string) => CollectionService.deleteField(collectionId!, fieldId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection-fields', collectionId] });
      setDeleteDialogOpen(false);
      setSelectedField(null);
      toast({
        title: "Field deleted",
        description: "The field was successfully deleted",
      });
    },
  });
  
  const handleFieldTypeSelect = (type: string) => {
    setSelectedFieldType(type);
    setFieldConfigOpen(true);
  };
  
  const handleFieldEdit = (field: Field) => {
    setSelectedField(field);
    setSelectedFieldType(field.type);
    setFieldConfigOpen(true);
  };
  
  const handleFieldSave = (fieldData: any) => {
    if (selectedField) {
      updateFieldMutation.mutate({
        ...selectedField,
        ...fieldData,
      });
    } else {
      createFieldMutation.mutate(fieldData);
    }
  };
  
  const handleJSONEditorOpen = () => {
    let currentJson = {};
    
    if (selectedField) {
      const combinedSettings = {
        ...selectedField,
        validation: selectedField.validation || selectedField.validation_settings || {},
        appearance: selectedField.appearance || selectedField.appearance_settings || {},
        advanced: selectedField.advanced || selectedField.advanced_settings || {},
        ui_options: selectedField.ui_options || selectedField.ui_options_settings || {},
      };
      
      currentJson = combinedSettings;
    }
    
    setJsonValue(JSON.stringify(currentJson, null, 2));
    setIsJSONModalOpen(true);
  };
  
  const handleJSONUpdate = () => {
    try {
      const parsedJson = JSON.parse(jsonValue);
      if (selectedField) {
        updateFieldMutation.mutate({
          ...selectedField,
          ...parsedJson
        });
      }
      setIsJSONModalOpen(false);
      toast({
        title: "JSON updated",
        description: "Field was updated with JSON data"
      });
    } catch (error: any) {
      toast({
        title: "Invalid JSON",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const handleCloseForm = () => {
    setFieldConfigOpen(false);
    setSelectedFieldType(null);
    setSelectedField(null);
  };
  
  const renderCollectionPreview = () => {
    return (
      <CollectionPreviewForm 
        fields={fields as CollectionField[]} 
        name={collection?.title || "Collection"}
        collectionId={collectionId}
      />
    );
  };

  const renderFieldTypeSelector = () => {
    return (
      <FieldTypeSelector 
        fieldTypes={fieldTypes}
        selectedType={selectedFieldType}
        onSelect={handleFieldTypeSelect}
      />
    );
  };

  const configTabs = selectedField ? [
    { id: "general", label: "General", icon: <FileJson className="h-4 w-4 mr-2" /> },
    { id: "validation", label: "Validation", icon: <FileType className="h-4 w-4 mr-2" /> },
    { id: "appearance", label: "Appearance", icon: <Eye className="h-4 w-4 mr-2" /> },
    { id: "advanced", label: "Advanced", icon: <Settings2 className="h-4 w-4 mr-2" /> },
  ] : [
    { id: "general", label: "General", icon: <FileJson className="h-4 w-4 mr-2" /> }
  ];

  if (fieldConfigOpen) {
    return (
      <MainLayout>
        <div className="p-4 md:p-6">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={handleCloseForm}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Fields
            </Button>
            
            <h1 className="text-2xl font-bold flex items-center">
              {selectedField ? `Edit ${selectedField.name}` : `Add New ${selectedFieldType} Field`}
              {selectedField && (
                <div className="ml-auto flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleJSONEditorOpen}
                  >
                    <FileJson className="h-4 w-4 mr-2" /> View JSON
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </Button>
                </div>
              )}
            </h1>
          </div>
          
          <FieldSettingsManager
            fieldType={selectedFieldType}
            fieldId={selectedField?.id}
            collectionId={collectionId}
            fieldData={selectedField}
            onUpdate={handleFieldSave}
          />
          
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will permanently delete the field "{selectedField?.name}" and cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => selectedField && deleteFieldMutation.mutate(selectedField.id)}
                  className="bg-red-500 text-white hover:bg-red-600"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <Dialog open={isJSONModalOpen} onOpenChange={setIsJSONModalOpen}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle>Edit Field JSON</DialogTitle>
                <DialogDescription>
                  Make changes directly to the field's JSON representation.
                </DialogDescription>
              </DialogHeader>
              <div className="flex-1 min-h-[400px] overflow-hidden">
                <JSONEditorField
                  value={jsonValue}
                  onChange={setJsonValue}
                  height="400px"
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsJSONModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleJSONUpdate}>
                  Update Field
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="p-4 md:p-6 max-w-full">
        <Breadcrumb className="mb-6">
          <BreadcrumbItem>
            <BreadcrumbLink href="/collections">Collections</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <span>{collection?.title || "Collection"}</span>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <span>Fields</span>
          </BreadcrumbItem>
        </Breadcrumb>
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">{collection?.title}: Fields</h1>
            <p className="text-gray-500 text-sm">Configure the schema for this collection</p>
          </div>
          
          <div className="flex mt-4 md:mt-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="fields" className="flex items-center">
                  <FileType className="h-4 w-4 mr-2" />
                  Fields
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center">
                  <View className="h-4 w-4 mr-2" />
                  Preview
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        <TabsContent value="fields" className={cn("mt-0", activeTab !== "fields" && "hidden")}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Field Configuration</CardTitle>
                    <CardDescription>
                      Configure fields for this collection
                    </CardDescription>
                  </div>
                  
                  <Button 
                    onClick={() => setFieldConfigOpen(true)} 
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={!selectedFieldType}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Field
                  </Button>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ) : fields.length > 0 ? (
                    <FieldList
                      fields={fields as Field[]}
                      onEdit={handleFieldEdit}
                      onDelete={(field) => {
                        setSelectedField(field as Field);
                        setDeleteDialogOpen(true);
                      }}
                      onReorder={async (orderedFields) => {
                        try {
                          await CollectionService.updateFieldOrder(
                            collectionId!,
                            orderedFields.map((f: any, i: number) => ({ id: f.id, sort_order: i }))
                          );
                          refetchFields();
                          toast({
                            title: "Field order updated",
                            description: "The fields have been reordered"
                          });
                        } catch (error) {
                          toast({
                            title: "Failed to reorder fields",
                            description: "There was an error updating the field order",
                            variant: "destructive"
                          });
                        }
                      }}
                    />
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">No fields defined yet. Select a field type to add your first field.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-4">
              <Card>
                <CardHeader>
                  <CardTitle>Field Types</CardTitle>
                  <CardDescription>
                    Select a field type to add
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {renderFieldTypeSelector()}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="preview" className={cn("mt-0", activeTab !== "preview" && "hidden")}>
          <Card>
            <CardHeader>
              <CardTitle>Collection Preview</CardTitle>
              <CardDescription>
                Preview how this collection will appear in the content editor
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderCollectionPreview()}
            </CardContent>
          </Card>
        </TabsContent>
      </div>
    </MainLayout>
  );
};

export default FieldConfiguration;
