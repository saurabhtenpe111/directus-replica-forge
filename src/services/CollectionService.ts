import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { normalizeAppearanceSettings, validateUIVariant } from '@/utils/inputAdapters';
import { toast } from '@/hooks/use-toast';
import { AdvancedSettings } from '@/utils/fieldSettingsHelpers';

export interface ValidationSettings {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  email?: boolean;
  url?: boolean;
  unique?: boolean;
  message?: string;
  maxTags?: number;
  [key: string]: any;
}

export interface AppearanceSettings {
  uiVariant?: "standard" | "material" | "pill" | "borderless" | "underlined";
  textAlign?: string;
  labelPosition?: string;
  labelWidth?: number;
  floatLabel?: boolean;
  filled?: boolean;
  showBorder?: boolean;
  showBackground?: boolean;
  roundedCorners?: string;
  fieldSize?: string;
  labelSize?: string;
  customClass?: string;
  customCss?: string;
  colors?: Record<string, string>;
  isDarkMode?: boolean;
  responsive?: {
    mobile?: Record<string, any>;
    tablet?: Record<string, any>;
    desktop?: Record<string, any>;
  };
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
  settings?: Record<string, any>;
}

export interface CollectionField {
  id: string;
  name: string;
  apiId: string;
  type: string;
  description?: string;
  required: boolean;
  settings?: {
    validation?: ValidationSettings;
    appearance?: AppearanceSettings;
    advanced?: Record<string, any>;
    ui_options?: Record<string, any>;
    helpText?: string;
    [key: string]: any;
  };
  validation_settings?: ValidationSettings;
  appearance_settings?: AppearanceSettings;
  advanced_settings?: Record<string, any>;
  ui_options_settings?: Record<string, any>;
  general_settings?: Record<string, any>;
  validation?: ValidationSettings;
  appearance?: AppearanceSettings;
  advanced?: Record<string, any>;
  ui_options?: Record<string, any>;
  helpText?: string;
  sort_order?: number;
  collection_id?: string;
}

type SupabaseFieldRow = Database['public']['Tables']['fields']['Row'] & {
  validation_settings?: ValidationSettings;
  appearance_settings?: AppearanceSettings;
  advanced_settings?: AdvancedSettings;
  ui_options_settings?: Record<string, any>;
  general_settings?: Record<string, any>;
};

const mapSupabaseCollection = (collection: Database['public']['Tables']['collections']['Row']): Collection => {
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

const mapSupabaseField = (field: SupabaseFieldRow): CollectionField => {
  const settings = field.settings as Record<string, any> || {};

  // Debug logging for field mapping
  console.log(`Mapping field ${field.name} from database:`, {
    fieldId: field.id,
    fieldName: field.name,
    fieldType: field.type,
    settings
  });

  // Extract settings from both the old and new structure
  const validationSettings = field.validation_settings as ValidationSettings || settings.validation || {};
  const appearanceSettings = field.appearance_settings as AppearanceSettings || settings.appearance || {};
  const advancedSettings = field.advanced_settings as AdvancedSettings || settings.advanced || {};
  const uiOptionsSettings = field.ui_options_settings as Record<string, any> || settings.ui_options || {};
  const generalSettings = field.general_settings as Record<string, any> || {};

  // Log appearance settings specifically
  if (appearanceSettings) {
    console.log(`Appearance settings for field ${field.name}:`, JSON.stringify(appearanceSettings, null, 2));
  }
  
  // Ensure appearance settings are properly normalized
  const normalizedAppearance = normalizeAppearanceSettings(appearanceSettings);

  return {
    id: field.id,
    name: field.name,
    apiId: field.api_id,
    type: field.type,
    description: field.description || undefined,
    required: field.required || false,
    settings: settings,
    validation_settings: validationSettings,
    appearance_settings: normalizedAppearance,
    advanced_settings: advancedSettings,
    ui_options_settings: uiOptionsSettings,
    general_settings: generalSettings,
    sort_order: field.sort_order || 0,
    collection_id: field.collection_id || undefined,
    
    // Legacy structure references for backward compatibility
    validation: validationSettings,
    appearance: normalizedAppearance,
    advanced: advancedSettings,
    ui_options: uiOptionsSettings,
  };
};

const deepMerge = (target: any, source: any): any => {
  // Return source if target is null/undefined or not an object
  if (target === null || target === undefined || typeof target !== 'object') {
    return source === undefined ? target : source;
  }
  
  // Return target if source is null/undefined
  if (source === null || source === undefined) {
    return target;
  }
  
  // Handle arrays: replace entire array unless explicitly stated to merge
  if (Array.isArray(target) && Array.isArray(source)) {
    return source; // Replace arrays by default
  }
  
  // Both are objects, create a new object for the result
  const output = { ...target };
  
  // Iterate through source properties
  Object.keys(source).forEach(key => {
    // Skip undefined values to prevent overwriting with undefined
    if (source[key] === undefined) {
      return;
    }
    
    // If property exists in target and both values are objects, merge recursively
    if (
      key in target && 
      source[key] !== null && 
      target[key] !== null && 
      typeof source[key] === 'object' && 
      typeof target[key] === 'object' &&
      !Array.isArray(source[key]) && 
      !Array.isArray(target[key])
    ) {
      output[key] = deepMerge(target[key], source[key]);
    } else {
      // Otherwise use source value (for primitive values, arrays, or when target doesn't have the property)
      output[key] = source[key];
    }
  });
  
  return output;
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

      debugLog(`Successfully fetched ${fields.length} fields`);
      return fields.map(mapSupabaseField);
    } catch (error) {
      console.error('Failed to fetch fields:', error);
      return [];
    }
  },

  createField: async (collectionId: string, fieldData: Partial<CollectionField>): Promise<CollectionField> => {
    try {
      debugLog(`Creating new field in collection ${collectionId}:`, fieldData);
      
      // First get the highest sort_order to add the new field at the bottom
      const { data: existingFields, error: countError } = await supabase
        .from('fields')
        .select('sort_order')
        .eq('collection_id', collectionId)
        .order('sort_order', { ascending: false })
        .limit(1);

      if (countError) {
        console.error('Error getting existing fields:', countError);
      }

      // Get the highest sort_order or use 0 if no fields exist
      const highestSortOrder = existingFields && existingFields.length > 0
        ? (existingFields[0].sort_order || 0) + 1
        : 0;

      debugLog(`Highest sort order is: ${highestSortOrder}`);

      const { apiId, ...restData } = fieldData;

      // Set up field data using the new columns structure
      const field: any = {
        name: fieldData.name || 'New Field',
        api_id: apiId || fieldData.name?.toLowerCase().replace(/\s+/g, '_') || 'new_field',
        type: fieldData.type || 'text',
        collection_id: collectionId,
        description: fieldData.description || null,
        required: fieldData.required || false,
        sort_order: highestSortOrder, // Place the new field at the bottom
      
        // Initialize empty objects for the new columns
        validation_settings: {},
        appearance_settings: {},
        advanced_settings: {},
        ui_options_settings: {},
        general_settings: {},
      };
      
      // Process validation settings
      if (fieldData.validation || fieldData.settings?.validation) {
        field.validation_settings = fieldData.validation || fieldData.settings?.validation || {};
      }
      
      // Process appearance settings
      if (fieldData.appearance || fieldData.settings?.appearance) {
        field.appearance_settings = normalizeAppearanceSettings(fieldData.appearance || fieldData.settings?.appearance || {});
      }
      
      // Process advanced settings
      if (fieldData.advanced || fieldData.settings?.advanced) {
        field.advanced_settings = fieldData.advanced || fieldData.settings?.advanced || {};
      }
      
      // Process UI options
      if (fieldData.ui_options || fieldData.settings?.ui_options) {
        field.ui_options_settings = fieldData.ui_options || fieldData.settings?.ui_options || {};
      }
      
      // Process general settings
      if (fieldData.general_settings) {
        field.general_settings = fieldData.general_settings;
      }
      
      // Maintain backward compatibility with settings
      const settings: Record<string, any> = {};
      
      if (field.validation_settings && Object.keys(field.validation_settings).length > 0) {
        settings.validation = field.validation_settings;
      }
      
      if (field.appearance_settings && Object.keys(field.appearance_settings).length > 0) {
        settings.appearance = field.appearance_settings;
      }
      
      if (field.advanced_settings && Object.keys(field.advanced_settings).length > 0) {
        settings.advanced = field.advanced_settings;
      }
      
      if (field.ui_options_settings && Object.keys(field.ui_options_settings).length > 0) {
        settings.ui_options = field.ui_options_settings;
      }
      
      // Only add settings if we have some data
      if (Object.keys(settings).length > 0 || fieldData.settings) {
        field.settings = { ...settings, ...(fieldData.settings || {}) };
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

  updateField: async (collectionId: string, fieldId: string, fieldData: Partial<CollectionField>): Promise<CollectionField> => {
    try {
      debugLog(`Updating field ${fieldId} in collection ${collectionId}:`, fieldData);
      debugLog(`Original field data:`, JSON.stringify(fieldData, null, 2));
      
      const updateData: any = {};

      // Map basic field properties
      if (fieldData.name) updateData.name = fieldData.name;
      if (fieldData.apiId) updateData.api_id = fieldData.apiId;
      if (fieldData.type) updateData.type = fieldData.type;
      if (fieldData.description !== undefined) updateData.description = fieldData.description;
      if (fieldData.required !== undefined) updateData.required = fieldData.required;
      if (fieldData.sort_order !== undefined) updateData.sort_order = fieldData.sort_order;

      // Get current field data to properly merge with updates
      const { data: currentField, error: getCurrentError } = await supabase
        .from('fields')
        .select('*')
        .eq('id', fieldId)
        .single();

      if (getCurrentError) {
        console.error('Error retrieving current field data:', getCurrentError);
        throw getCurrentError;
      }

      debugLog(`Current field data from database:`, JSON.stringify(currentField, null, 2));
      
      // New column-based approach
    
      // Handle validation settings
      if (fieldData.validation_settings || fieldData.validation || fieldData.settings?.validation) {
        const newValidation = fieldData.validation_settings || fieldData.validation || fieldData.settings?.validation || {};
        updateData.validation_settings = newValidation;
        debugLog('[updateField] New validation settings:', JSON.stringify(newValidation, null, 2));
      }
      
      // Handle appearance settings
      if (fieldData.appearance_settings || fieldData.appearance || fieldData.settings?.appearance) {
        const newAppearance = fieldData.appearance_settings || fieldData.appearance || fieldData.settings?.appearance || {};
        // Normalize appearance settings
        updateData.appearance_settings = normalizeAppearanceSettings(newAppearance);
        debugLog('[updateField] New appearance settings:', JSON.stringify(updateData.appearance_settings, null, 2));
      }
      
      // Handle advanced settings
      if (fieldData.advanced_settings || fieldData.advanced || fieldData.settings?.advanced) {
        const newAdvanced = fieldData.advanced_settings || fieldData.advanced || fieldData.settings?.advanced || {};
        updateData.advanced_settings = newAdvanced;
        debugLog('[updateField] New advanced settings:', JSON.stringify(newAdvanced, null, 2));
      }
      
      // Handle UI options
      if (fieldData.ui_options_settings || fieldData.ui_options || fieldData.settings?.ui_options) {
        const newUiOptions = fieldData.ui_options_settings || fieldData.ui_options || fieldData.settings?.ui_options || {};
        updateData.ui_options_settings = newUiOptions;
        debugLog('[updateField] New UI options:', JSON.stringify(newUiOptions, null, 2));
      }
      
      // Handle general settings
      if (fieldData.general_settings) {
        updateData.general_settings = fieldData.general_settings;
        debugLog('[updateField] New general settings:', JSON.stringify(fieldData.general_settings, null, 2));
      }
      
      // Legacy settings structure - keep it for backward compatibility
      if (fieldData.settings) {
        // Copy the existing settings object to avoid reference issues
        const currentSettings = currentField?.settings ? JSON.parse(JSON.stringify(currentField.settings)) : {};
        
        // Deep merge settings
        const mergedSettings = deepMerge(currentSettings, fieldData.settings);
        updateData.settings = mergedSettings;
        
        debugLog('[updateField] Merged legacy settings:', JSON.stringify(mergedSettings, null, 2));
      }
      
      // Update the field in the database
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

      // Map the database response to our field model
      const mappedField = mapSupabaseField(data);
      
      // Log the mapped field for debugging
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
      // Update each field's sort_order in sequence
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
