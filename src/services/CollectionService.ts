
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { normalizeAppearanceSettings, validateUIVariant } from '@/utils/inputAdapters';
import { toast } from '@/hooks/use-toast';
import { 
  AdvancedSettings,
  ValidationSettings as HelperValidationSettings,
  AppearanceSettings as HelperAppearanceSettings
} from '@/utils/fieldSettingsHelpers';
import { Json } from '@/integrations/supabase/types';

export interface ValidationSettings extends HelperValidationSettings {
  required?: boolean;
  // Add other validation properties
}

export interface AppearanceSettings extends HelperAppearanceSettings {
  // Include any additional properties not in the helper interface
  [key: string]: any;
}

export interface Collection {
  id: string;
  title: string;
  apiId: string;
  description?: string;
  status: string;
  fields?: any[];
  createdAt: string;
  updatedAt: string;
  icon?: string;
  iconColor?: string;
  items?: number;
  lastUpdated?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CollectionFormData {
  name: string;
  apiId: string;
  description?: string;
  status?: string;
  settings?: any;
}

export interface CollectionField {
  id: string;
  name: string;
  type: string;
  api_id?: string;
  apiId?: string; // For compatibility with code that uses apiId
  description?: string;
  required?: boolean; 
  validation?: ValidationSettings;
  appearance?: AppearanceSettings;
  advanced?: AdvancedSettings;
  ui_options?: any;
  general?: any;
  settings?: any;
  validation_settings?: ValidationSettings;
  appearance_settings?: AppearanceSettings;
  advanced_settings?: AdvancedSettings;
  ui_options_settings?: any;
  general_settings?: any;
  sort_order?: number;
  collection_id?: string;
}

// Define our own field row type based on fields in our Database type
export interface ExtendedFieldRow {
  id: string;
  name: string;
  type: string;
  api_id: string;
  description: string | null;
  required: boolean;
  collection_id: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
  settings: Json;
  // Extended properties
  validation_settings?: ValidationSettings;
  appearance_settings?: AppearanceSettings;
  advanced_settings?: AdvancedSettings;
  ui_options_settings?: Record<string, any>;
  general_settings?: Record<string, any>;
}

// Define a new interface for specifying which columns to update
export interface FieldUpdateOptions {
  columnToUpdate?: 'validation_settings' | 'appearance_settings' | 'advanced_settings' | 'ui_options_settings' | 'general_settings' | 'all';
  mergeStrategy?: 'deep' | 'shallow' | 'replace';
}

const mapSupabaseCollection = (collection: any): Collection => {
  return {
    id: collection.id,
    title: collection.title,
    apiId: collection.api_id,
    description: collection.description || undefined,
    status: collection.status,
    createdAt: collection.created_at,
    updatedAt: collection.updated_at,
    icon: collection.icon || 'file',
    iconColor: collection.icon_color || 'gray',
    items: 0,
    lastUpdated: collection.updated_at,
    created_at: collection.created_at,
    updated_at: collection.updated_at
  };
};

const mapSupabaseField = (field: ExtendedFieldRow): CollectionField => {
  console.log(`Mapping field ${field.name} from database:`, {
    fieldId: field.id,
    fieldName: field.name,
    fieldType: field.type
  });

  const validationSettings = field.validation_settings || {};
  const appearanceSettings = field.appearance_settings || {};
  const advancedSettings = field.advanced_settings || {};
  const uiOptionsSettings = field.ui_options_settings || {};
  const generalSettings = field.general_settings || {};

  if (appearanceSettings) {
    console.log(`Appearance settings for field ${field.name}:`, JSON.stringify(appearanceSettings, null, 2));
  }
  
  const normalizedAppearance = normalizeAppearanceSettings(appearanceSettings);

  return {
    id: field.id,
    name: field.name,
    type: field.type,
    api_id: field.api_id,
    apiId: field.api_id, // Add apiId for compatibility
    description: field.description || undefined,
    required: field.required || false,
    validation_settings: validationSettings,
    appearance_settings: normalizedAppearance,
    advanced_settings: advancedSettings,
    ui_options_settings: uiOptionsSettings,
    general_settings: generalSettings,
    sort_order: field.sort_order || 0,
    collection_id: field.collection_id || undefined,
    validation: validationSettings,
    appearance: normalizedAppearance,
    advanced: advancedSettings,
    ui_options: uiOptionsSettings,
    general: generalSettings,
  };
};

const deepMerge = (target: any, source: any): any => {
  if (!isObject(target) || !isObject(source)) {
    return source;
  }
  
  const output = { ...target };
  
  Object.keys(source).forEach(key => {
    if (isObject(source[key])) {
      if (!(key in target)) {
        output[key] = source[key];
      } else {
        output[key] = deepMerge(target[key], source[key]);
      }
    } else if (Array.isArray(source[key])) {
      output[key] = [...source[key]];
    } else {
      output[key] = source[key];
    }
  });
  
  return output;
};

const logObjectDiff = (before: any, after: any, path = '') => {
  if (!isObject(before) || !isObject(after)) {
    if (before !== after) {
      console.log(`[DIFF] ${path}: ${JSON.stringify(before)} -> ${JSON.stringify(after)}`);
    }
    return;
  }
  
  Object.keys(before).forEach(key => {
    const currentPath = path ? `${path}.${key}` : key;
    
    if (!(key in after)) {
      console.log(`[DIFF] ${currentPath}: ${JSON.stringify(before[key])} -> REMOVED`);
    } else if (isObject(before[key]) && isObject(after[key])) {
      logObjectDiff(before[key], after[key], currentPath);
    } else if (Array.isArray(before[key]) && Array.isArray(after[key])) {
      if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
        console.log(`[DIFF] ${currentPath} (array): Changed`);
        console.log(`  Before: ${JSON.stringify(before[key], null, 2)}`);
        console.log(`  After: ${JSON.stringify(after[key], null, 2)}`);
      }
    } else if (before[key] !== after[key]) {
      console.log(`[DIFF] ${currentPath}: ${JSON.stringify(before[key])} -> ${JSON.stringify(after[key])}`);
    }
  });
  
  Object.keys(after).forEach(key => {
    if (!(key in before)) {
      const currentPath = path ? `${path}.${key}` : key;
      console.log(`[DIFF] ${currentPath}: NEW -> ${JSON.stringify(after[key])}`);
    }
  });
};

const isObject = (item: any): boolean => {
  return (item && typeof item === 'object' && !Array.isArray(item));
};

const DEBUG_ENABLED = true;

const debugLog = (message: string, data?: any) => {
  if (DEBUG_ENABLED) {
    console.log(`[CollectionService] ${message}`, data ? data : '');
  }
};

export const CollectionService = {
  getFieldsForCollection: async (collectionId: string): Promise<CollectionField[]> => {
    debugLog(`Fetching fields for collection: ${collectionId}`);
    try {
      const { data: fields, error } = await supabase
        .from('fields')
        .select('*')
        .eq('collection_id', collectionId)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching fields:', error);
        throw error;
      }

      // Cast the fields as ExtendedFieldRow before mapping
      return (fields as unknown as ExtendedFieldRow[]).map(mapSupabaseField);
    } catch (error) {
      console.error('Failed to fetch fields:', error);
      return [];
    }
  },

  createField: async (collectionId: string, fieldData: Partial<CollectionField>): Promise<CollectionField> => {
    try {
      debugLog(`Creating new field in collection ${collectionId}:`, fieldData);
      
      const { data: existingFields, error: countError } = await supabase
        .from('fields')
        .select('sort_order')
        .eq('collection_id', collectionId)
        .order('sort_order', { ascending: false })
        .limit(1);

      if (countError) {
        console.error('Error getting existing fields:', countError);
      }

      const highestSortOrder = existingFields && existingFields.length > 0
        ? (existingFields[0].sort_order || 0) + 1
        : 0;

      debugLog(`Highest sort order is: ${highestSortOrder}`);

      const field: any = {
        name: fieldData.name || 'New Field',
        api_id: fieldData.api_id || fieldData.name?.toLowerCase().replace(/\s+/g, '_') || 'new_field',
        type: fieldData.type || 'text',
        collection_id: collectionId,
        description: fieldData.description || null,
        required: fieldData.required || false,
        sort_order: highestSortOrder,
        validation_settings: {},
        appearance_settings: {},
        advanced_settings: {},
        ui_options_settings: {},
        general_settings: {},
      };
      
      if (fieldData.validation_settings || (fieldData as any).validation) {
        field.validation_settings = fieldData.validation_settings || (fieldData as any).validation || {};
      }
      
      if (fieldData.appearance_settings || (fieldData as any).appearance) {
        field.appearance_settings = normalizeAppearanceSettings(fieldData.appearance_settings || (fieldData as any).appearance || {});
      }
      
      if (fieldData.advanced_settings || (fieldData as any).advanced) {
        field.advanced_settings = fieldData.advanced_settings || (fieldData as any).advanced || {};
      }
      
      if (fieldData.ui_options_settings || (fieldData as any).ui_options) {
        field.ui_options_settings = fieldData.ui_options_settings || (fieldData as any).ui_options || {};
      }
      
      if (fieldData.general_settings) {
        field.general_settings = fieldData.general_settings;
      }
      
      debugLog('Inserting field into database:', field);

      const { data, error } = await supabase
        .from('fields')
        .insert([field])
        .select()
        .single();

      if (error) {
        console.error('Error creating field:', error);
        toast({
          title: "Error creating field",
          description: `Database error: ${error.message}`,
          variant: "destructive"
        });
        throw error;
      }

      debugLog('Field created successfully:', data);
      
      toast({
        title: "Field created",
        description: `The field "${field.name}" was successfully created`,
      });
      
      return mapSupabaseField(data);
    } catch (error: any) {
      console.error('Failed to create field:', error);
      toast({
        title: "Field creation failed",
        description: error.message || "An unknown error occurred",
        variant: "destructive"
      });
      throw error;
    }
  },

  updateField: async (
    collectionId: string, 
    fieldId: string, 
    fieldData: Partial<CollectionField>,
    options: FieldUpdateOptions = { columnToUpdate: 'all', mergeStrategy: 'deep' }
  ): Promise<CollectionField> => {
    try {
      debugLog(`Updating field ${fieldId} in collection ${collectionId}:`, fieldData);
      debugLog(`Update options: ${JSON.stringify(options)}`);
      
      const { data: currentFieldData, error: getCurrentError } = await supabase
        .from('fields')
        .select('*')
        .eq('id', fieldId)
        .single();

      if (getCurrentError) {
        console.error('Error retrieving current field data:', getCurrentError);
        throw getCurrentError;
      }

      const currentField = currentFieldData as ExtendedFieldRow;

      const extendedField = {
        ...currentField,
        validation_settings: currentField.validation_settings || {},
        appearance_settings: currentField.appearance_settings || {},
        advanced_settings: currentField.advanced_settings || {},
        ui_options_settings: currentField.ui_options_settings || {},
        general_settings: currentField.general_settings || {}
      } as ExtendedFieldRow;

      debugLog(`Current field data from database:`, JSON.stringify(extendedField, null, 2));
      
      const updateData: any = {};
      
      if (options.columnToUpdate === 'all') {
        if (fieldData.name) updateData.name = fieldData.name;
        if (fieldData.api_id) updateData.api_id = fieldData.api_id;
        if (fieldData.type) updateData.type = fieldData.type;
        if (fieldData.description !== undefined) updateData.description = fieldData.description;
        if (fieldData.required !== undefined) updateData.required = fieldData.required;
        if (fieldData.sort_order !== undefined) updateData.sort_order = fieldData.sort_order;
      }
      
      if (options.columnToUpdate === 'all' || options.columnToUpdate === 'validation_settings') {
        if (fieldData.validation_settings || (fieldData as any).validation) {
          const newValidation = fieldData.validation_settings || (fieldData as any).validation || {};
          
          if (options.mergeStrategy === 'deep' && extendedField.validation_settings) {
            updateData.validation_settings = deepMerge(extendedField.validation_settings, newValidation);
            
            console.log('Validation settings deep merge:');
            logObjectDiff(extendedField.validation_settings, updateData.validation_settings);
          } else {
            updateData.validation_settings = newValidation;
          }
          
          debugLog('[updateField] New validation settings:', JSON.stringify(updateData.validation_settings, null, 2));
        }
      }
      
      if (options.columnToUpdate === 'all' || options.columnToUpdate === 'appearance_settings') {
        if (fieldData.appearance_settings || (fieldData as any).appearance) {
          const newAppearance = fieldData.appearance_settings || (fieldData as any).appearance || {};
          
          const normalizedAppearance = normalizeAppearanceSettings(newAppearance);
          
          if (options.mergeStrategy === 'deep' && extendedField.appearance_settings) {
            updateData.appearance_settings = deepMerge(extendedField.appearance_settings, normalizedAppearance);
            
            console.log('Appearance settings deep merge:');
            logObjectDiff(extendedField.appearance_settings, updateData.appearance_settings);
          } else {
            updateData.appearance_settings = normalizedAppearance;
          }
          
          debugLog('[updateField] New appearance settings:', JSON.stringify(updateData.appearance_settings, null, 2));
        }
      }
      
      if (options.columnToUpdate === 'all' || options.columnToUpdate === 'advanced_settings') {
        if (fieldData.advanced_settings || (fieldData as any).advanced) {
          const newAdvanced = fieldData.advanced_settings || (fieldData as any).advanced || {};
          
          if (options.mergeStrategy === 'deep' && extendedField.advanced_settings) {
            updateData.advanced_settings = deepMerge(extendedField.advanced_settings, newAdvanced);
            
            console.log('Advanced settings deep merge:');
            logObjectDiff(extendedField.advanced_settings, updateData.advanced_settings);
          } else {
            updateData.advanced_settings = newAdvanced;
          }
          
          debugLog('[updateField] New advanced settings:', JSON.stringify(updateData.advanced_settings, null, 2));
        }
      }
      
      if (options.columnToUpdate === 'all' || options.columnToUpdate === 'ui_options_settings') {
        if (fieldData.ui_options_settings || (fieldData as any).ui_options) {
          const newUiOptions = fieldData.ui_options_settings || (fieldData as any).ui_options || {};
          
          if (options.mergeStrategy === 'deep' && extendedField.ui_options_settings) {
            updateData.ui_options_settings = deepMerge(extendedField.ui_options_settings, newUiOptions);
            
            console.log('UI options deep merge:');
            logObjectDiff(extendedField.ui_options_settings, updateData.ui_options_settings);
          } else {
            updateData.ui_options_settings = newUiOptions;
          }
          
          debugLog('[updateField] New UI options:', JSON.stringify(updateData.ui_options_settings, null, 2));
        }
      }
      
      if (options.columnToUpdate === 'all' || options.columnToUpdate === 'general_settings') {
        if (fieldData.general_settings) {
          if (options.mergeStrategy === 'deep' && extendedField.general_settings) {
            updateData.general_settings = deepMerge(extendedField.general_settings, fieldData.general_settings);
            
            console.log('General settings deep merge:');
            logObjectDiff(extendedField.general_settings, updateData.general_settings);
          } else {
            updateData.general_settings = fieldData.general_settings;
          }
          
          debugLog('[updateField] New general settings:', JSON.stringify(updateData.general_settings, null, 2));
        }
      }
      
      if (Object.keys(updateData).length === 0) {
        console.log('No fields to update, returning current field data.');
        return mapSupabaseField(currentField);
      }
      
      const { data, error } = await supabase
        .from('fields')
        .update(updateData)
        .eq('id', fieldId)
        .select()
        .single();

      if (error) {
        console.error('Error updating field:', error);
        toast({
          title: "Error updating field",
          description: `Database error: ${error.message}`,
          variant: "destructive"
        });
        throw error;
      }

      const mappedField = mapSupabaseField(data);
      
      debugLog('[updateField] Updated field after mapping:', JSON.stringify(mappedField, null, 2));
      
      toast({
        title: "Field updated",
        description: `The field "${mappedField.name}" was successfully updated`,
      });
      
      return mappedField;
    } catch (error: any) {
      console.error('Failed to update field:', error);
      toast({
        title: "Field update failed",
        description: error.message || "An unknown error occurred",
        variant: "destructive"
      });
      throw error;
    }
  },

  deleteField: async (collectionId: string, fieldId: string): Promise<{ success: boolean }> => {
    debugLog(`Deleting field ${fieldId} from collection ${collectionId}`);
    try {
      const { error } = await supabase
        .from('fields')
        .delete()
        .eq('id', fieldId);

      if (error) {
        console.error('Error deleting field:', error);
        toast({
          title: "Error deleting field",
          description: `Database error: ${error.message}`,
          variant: "destructive"
        });
        throw error;
      }

      toast({
        title: "Field deleted",
        description: "The field was successfully deleted",
      });

      return { success: true };
    } catch (error: any) {
      console.error('Failed to delete field:', error);
      toast({
        title: "Field deletion failed",
        description: error.message || "An unknown error occurred",
        variant: "destructive"
      });
      return { success: false };
    }
  },

  updateFieldOrder: async (collectionId: string, fieldOrders: { id: string, sort_order: number }[]): Promise<boolean> => {
    try {
      for (const field of fieldOrders) {
        const { error } = await supabase
          .from('fields')
          .update({ sort_order: field.sort_order })
          .eq('id', field.id)
          .eq('collection_id', collectionId);

        if (error) {
          console.error(`Error updating field order for ${field.id}:`, error);
          throw error;
        }
      }

      return true;
    } catch (error) {
      console.error('Failed to update field order:', error);
      return false;
    }
  },

  fetchCollections: async (): Promise<Collection[]> => {
    try {
      const { data: collections, error } = await supabase
        .from('collections')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching collections:', error);
        throw error;
      }

      const mappedCollections = collections.map(mapSupabaseCollection);

      for (const collection of mappedCollections) {
        try {
          const { count: fieldCount, error: fieldsError } = await supabase
            .from('fields')
            .select('*', { count: 'exact', head: true })
            .eq('collection_id', collection.id);

          if (!fieldsError) {
            collection.fields = new Array(fieldCount || 0);
          }

          const { count: itemCount, error: itemsError } = await supabase
            .from('content_items')
            .select('*', { count: 'exact', head: true })
            .eq('collection_id', collection.id);

          if (!itemsError) {
            collection.items = itemCount || 0;
          }
        } catch (countError) {
          console.error(`Error counting related data for collection ${collection.id}:`, countError);
        }
      }

      return mappedCollections;
    } catch (error) {
      console.error('Failed to fetch collections:', error);

      return [
        {
          id: 'col1',
          title: 'Blog Posts',
          apiId: 'blog_posts',
          description: 'Collection of blog posts',
          status: 'published',
          fields: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          icon: 'file-text',
          iconColor: 'blue',
          items: 5,
          lastUpdated: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'col2',
          title: 'Products',
          apiId: 'products',
          description: 'Collection of products',
          status: 'published',
          fields: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          icon: 'shopping-bag',
          iconColor: 'green',
          items: 12,
          lastUpdated: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
    }
  },

  createCollection: async (collectionData: CollectionFormData): Promise<Collection> => {
    try {
      const newCollection = {
        title: collectionData.name,
        api_id: collectionData.apiId,
        description: collectionData.description || null,
        status: collectionData.status || 'draft',
        icon: 'file',
        icon_color: 'gray',
      };

      const { data, error } = await supabase
        .from('collections')
        .insert([newCollection])
        .select()
        .single();

      if (error) {
        console.error('Error creating collection:', error);
        throw error;
      }

      return mapSupabaseCollection(data);
    } catch (error) {
      console.error('Failed to create collection:', error);

      return {
        id: `col-${Date.now()}`,
        title: collectionData.name,
        apiId: collectionData.apiId,
        description: collectionData.description,
        status: collectionData.status || 'draft',
        fields: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        icon: 'file',
        iconColor: 'gray',
        items: 0,
        lastUpdated: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
  },

  getContentItems: async (collectionId: string): Promise<any[]> => {
    try {
      const { data: contentItems, error } = await supabase
        .from('content_items')
        .select('*')
        .eq('collection_id', collectionId)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching content items:', error);
        throw error;
      }

      return contentItems;
    } catch (error) {
      console.error('Failed to fetch content items:', error);

      return [
        {
          id: `item-${Date.now()}-1`,
          collection_id: collectionId,
          data: { title: 'Test Item 1' },
          status: 'published',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: `item-${Date.now()}-2`,
          collection_id: collectionId,
          data: { title: 'Test Item 2' },
          status: 'draft',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
    }
  }
};

export const {
  getFieldsForCollection,
  createField,
  updateField,
  deleteField,
  updateFieldOrder,
  fetchCollections,
  createCollection,
  getContentItems
} = CollectionService;
