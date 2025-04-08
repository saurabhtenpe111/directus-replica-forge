import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { normalizeAppearanceSettings, validateUIVariant } from '@/utils/inputAdapters';
import { toast } from '@/hooks/use-toast';

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
  validation?: ValidationSettings;
  appearance?: AppearanceSettings;
  advanced?: Record<string, any>;
  ui_options?: Record<string, any>;
  helpText?: string;
  sort_order?: number;
  collection_id?: string;
}

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

const mapSupabaseField = (field: Database['public']['Tables']['fields']['Row']): CollectionField => {
  const settings = field.settings as Record<string, any> || {};

  // Debug logging for field mapping
  console.log(`Mapping field ${field.name} from database:`, {
    fieldId: field.id,
    fieldName: field.name,
    fieldType: field.type,
    settings
  });

  // Log appearance settings specifically
  if (settings.appearance) {
    console.log(`Appearance settings for field ${field.name}:`, JSON.stringify(settings.appearance, null, 2));
  }
  
  // Ensure appearance settings are properly normalized
  if (settings.appearance) {
    settings.appearance = normalizeAppearanceSettings(settings.appearance);
  }

  return {
    id: field.id,
    name: field.name,
    apiId: field.api_id,
    type: field.type,
    description: field.description || undefined,
    required: field.required || false,
    settings: settings,
    sort_order: field.sort_order || 0,
    collection_id: field.collection_id || undefined,
  };
};

// Enhanced deep merge function with better handling of arrays and null values
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

// Helper to check if value is an object
const isObject = (item: any): boolean => {
  return (item && typeof item === 'object' && !Array.isArray(item));
};

// Enable debug mode for development
const DEBUG_ENABLED = true;

// Debug function to log detailed information when enabled
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

      // Ensure we have a settings object
      const settings: Record<string, any> = { ...(fieldData.settings || {}) };

      // Move any properties that should be inside settings to the proper location
      if ('validation' in fieldData) {
        settings.validation = fieldData.validation;
        delete (restData as any).validation;
      }

      if ('appearance' in fieldData) {
        settings.appearance = fieldData.appearance;
        delete (restData as any).appearance;
      }

      if ('advanced' in fieldData) {
        settings.advanced = fieldData.advanced;
        delete (restData as any).advanced;
      }

      if ('helpText' in fieldData) {
        settings.helpText = fieldData.helpText;
        delete (restData as any).helpText;
      }

      if ('ui_options' in fieldData) {
        settings.ui_options = fieldData.ui_options;
        delete (restData as any).ui_options;
      }

      const field = {
        name: fieldData.name || 'New Field',
        api_id: apiId || fieldData.name?.toLowerCase().replace(/\s+/g, '_') || 'new_field',
        type: fieldData.type || 'text',
        collection_id: collectionId,
        description: fieldData.description || null,
        required: fieldData.required || false,
        settings: settings,
        sort_order: highestSortOrder, // Place the new field at the bottom
      };

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

      // Get current field data to properly merge with updates - CRITICAL STEP
      const { data: currentField, error: getCurrentError } = await supabase
        .from('fields')
        .select('*')  // Select all columns to get complete field data
        .eq('id', fieldId)
        .single();

      if (getCurrentError) {
        console.error('Error retrieving current field data:', getCurrentError);
        throw getCurrentError;
      }

      debugLog(`Current field data from database:`, JSON.stringify(currentField, null, 2));
      
      // Create a deep copy of the current settings to avoid reference issues
      const currentSettings = currentField?.settings ? JSON.parse(JSON.stringify(currentField.settings)) : {};
      
      debugLog('[updateField] Current settings from database:', JSON.stringify(currentSettings, null, 2));
      debugLog('[updateField] New field data to merge:', JSON.stringify(fieldData, null, 2));
      
      // Initialize settings to update with deep copy of current settings
      let settingsToUpdate: Record<string, any> = JSON.parse(JSON.stringify(currentSettings));
      
      // IMPROVED VALIDATION SETTINGS HANDLING
      if (fieldData.validation) {
        debugLog('[updateField] Found validation at root level:', JSON.stringify(fieldData.validation, null, 2));
        
        // Create validation object if it doesn't exist
        if (!settingsToUpdate.validation) {
          settingsToUpdate.validation = {};
        }
        
        // Deep merge validation settings
        settingsToUpdate.validation = deepMerge(settingsToUpdate.validation, fieldData.validation);
        
        debugLog('[updateField] Merged validation settings:', JSON.stringify(settingsToUpdate.validation, null, 2));
      }
      
      // Handle other direct properties in fieldData.settings
      if (fieldData.settings) {
        debugLog('[updateField] Merging settings object:', JSON.stringify(fieldData.settings, null, 2));
        
        // For each property in fieldData.settings, merge it with settingsToUpdate
        Object.keys(fieldData.settings).forEach(key => {
          // Skip undefined values
          if (fieldData.settings![key] === undefined) return;
          
          // Special handling for validation to ensure proper deep merging
          if (key === 'validation') {
            debugLog('[updateField] Found validation in settings:', JSON.stringify(fieldData.settings!.validation, null, 2));
            
            // Ensure validation object exists
            if (!settingsToUpdate.validation) {
              settingsToUpdate.validation = {};
            }
            
            // Deep merge validation settings
            settingsToUpdate.validation = deepMerge(settingsToUpdate.validation, fieldData.settings!.validation);
            debugLog('[updateField] Merged validation in settings:', JSON.stringify(settingsToUpdate.validation, null, 2));
          }
          // Deep merge or assign depending on if both are objects
          else if (isObject(fieldData.settings![key]) && isObject(settingsToUpdate[key])) {
            settingsToUpdate[key] = deepMerge(settingsToUpdate[key] || {}, fieldData.settings![key]);
          } else {
            settingsToUpdate[key] = fieldData.settings![key];
          }
        });
      }
      
      // Process UI options (from either location)
      if (fieldData.settings?.ui_options || fieldData.ui_options) {
        const newUiOptions = fieldData.settings?.ui_options || fieldData.ui_options || {};
        settingsToUpdate.ui_options = deepMerge(settingsToUpdate.ui_options || {}, newUiOptions);
        debugLog('[updateField] Merged UI options:', JSON.stringify(settingsToUpdate.ui_options, null, 2));
      }
      
      // Handle help text
      if (fieldData.settings?.helpText !== undefined || fieldData.helpText !== undefined) {
        settingsToUpdate.helpText = fieldData.settings?.helpText ?? fieldData.helpText;
      }
      
      // Handle appearance settings (from either location)
      if (fieldData.settings?.appearance || fieldData.appearance) {
        const newAppearance = fieldData.settings?.appearance || fieldData.appearance || {};
        
        debugLog('[updateField] Current appearance:', JSON.stringify(settingsToUpdate.appearance || {}, null, 2));
        debugLog('[updateField] New appearance to merge:', JSON.stringify(newAppearance, null, 2));
        
        // Deep merge appearance settings
        settingsToUpdate.appearance = deepMerge(settingsToUpdate.appearance || {}, newAppearance);
        
        // Ensure UI variant is properly set
        if (newAppearance.uiVariant) {
          settingsToUpdate.appearance.uiVariant = validateUIVariant(newAppearance.uiVariant);
        }
        
        debugLog('[updateField] Merged appearance result:', JSON.stringify(settingsToUpdate.appearance, null, 2));
      }
      
      // Handle advanced settings
      if (fieldData.settings?.advanced || fieldData.advanced) {
        const newAdvanced = fieldData.settings?.advanced || fieldData.advanced || {};
        settingsToUpdate.advanced = deepMerge(settingsToUpdate.advanced || {}, newAdvanced);
        debugLog('[updateField] Merged advanced settings:', JSON.stringify(settingsToUpdate.advanced, null, 2));
      }
      
      // Set the final updated settings
      updateData.settings = settingsToUpdate;
      
      // Log the final settings structure being saved
      debugLog('[updateField] Final settings structure being saved:', JSON.stringify(updateData.settings, null, 2));
      
      // Compare before and after for debugging
      const settingsDiff = {
        before: currentSettings,
        after: updateData.settings,
      };
      debugLog('[updateField] Settings difference:', JSON.stringify(settingsDiff, null, 2));

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
