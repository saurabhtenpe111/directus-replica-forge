
import { Collection, CollectionField } from '@/services/CollectionService';
import { ValidationSettings, AppearanceSettings, AdvancedSettings } from '@/utils/fieldSettingsHelpers';

/**
 * This adapter converts frontend models to the format expected by the Spring Boot backend API
 */

// Converts frontend collection data to backend API format
export const adaptCollectionToApi = (collection: Partial<Collection>): any => {
  return {
    id: collection.id,
    title: collection.title,
    apiId: collection.apiId,
    description: collection.description,
    status: collection.status || 'draft',
    icon: collection.icon,
    iconColor: collection.iconColor
  };
};

// Converts frontend field data to backend API format
export const adaptFieldToApi = (field: Partial<CollectionField>): any => {
  // Build the field object in the format expected by the Spring Boot backend
  return {
    id: field.id,
    name: field.name || 'New Field',
    apiId: field.apiId || field.name?.toLowerCase().replace(/\s+/g, '_') || 'new_field',
    type: field.type || 'text',
    collectionId: field.collection_id,
    description: field.description || null,
    required: field.required || false,
    sortOrder: field.sort_order || 0,
    
    // Convert the settings objects to match Spring Boot's expected format
    validationSettings: convertToSpringFormat(field.validation_settings || field.validation || {}),
    appearanceSettings: convertToSpringFormat(field.appearance_settings || field.appearance || {}),
    advancedSettings: convertToSpringFormat(field.advanced_settings || field.advanced || {}),
    uiOptionsSettings: convertToSpringFormat(field.ui_options_settings || field.ui_options || {}),
    generalSettings: convertToSpringFormat(field.general_settings || {})
  };
};

// Helper to convert JavaScript objects to Spring Boot friendly format
// Spring Boot expects camelCase properties rather than snake_case
export const convertToSpringFormat = (obj: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = {};
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // Convert snake_case to camelCase
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      
      const value = obj[key];
      
      // Recursively convert nested objects
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        result[camelKey] = convertToSpringFormat(value);
      } else if (Array.isArray(value)) {
        // Handle arrays - convert objects inside arrays
        result[camelKey] = value.map(item => 
          typeof item === 'object' && item !== null ? convertToSpringFormat(item) : item
        );
      } else {
        result[camelKey] = value;
      }
    }
  }
  
  return result;
};

/**
 * Adapters for transforming Spring Boot responses to frontend models
 */

export const adaptApiToCollection = (apiCollection: any): Collection => {
  return {
    id: apiCollection.id,
    title: apiCollection.title,
    apiId: apiCollection.apiId,
    description: apiCollection.description,
    status: apiCollection.status,
    fields: apiCollection.fields?.map(adaptApiToField) || [],
    createdAt: apiCollection.createdAt || apiCollection.created_at,
    updatedAt: apiCollection.updatedAt || apiCollection.updated_at,
    icon: apiCollection.icon || 'file',
    iconColor: apiCollection.iconColor || 'gray',
    items: apiCollection.itemCount || 0,
    lastUpdated: apiCollection.updatedAt || apiCollection.updated_at,
    created_at: apiCollection.createdAt || apiCollection.created_at,
    updated_at: apiCollection.updatedAt || apiCollection.updated_at
  };
};

export const adaptApiToField = (apiField: any): CollectionField => {
  // Convert Spring Boot camelCase to our frontend format which uses both camelCase and snake_case
  return {
    id: apiField.id,
    name: apiField.name,
    apiId: apiField.apiId,
    type: apiField.type,
    description: apiField.description,
    required: apiField.required || false,
    collection_id: apiField.collectionId,
    sort_order: apiField.sortOrder || 0,
    
    // Settings from dedicated columns - convert to our frontend format
    validation_settings: apiField.validationSettings || {},
    appearance_settings: apiField.appearanceSettings || {},
    advanced_settings: apiField.advancedSettings || {},
    ui_options_settings: apiField.uiOptionsSettings || {},
    general_settings: apiField.generalSettings || {},
    
    // Legacy references for backward compatibility
    validation: apiField.validationSettings || {},
    appearance: apiField.appearanceSettings || {},
    advanced: apiField.advancedSettings || {},
    ui_options: apiField.uiOptionsSettings || {},
    
    // Legacy settings object
    settings: apiField.settings || {}
  };
};

export const adaptApiToContentItem = (apiContentItem: any): any => {
  return {
    id: apiContentItem.id,
    collection_id: apiContentItem.collectionId,
    data: apiContentItem.data || {},
    status: apiContentItem.status,
    created_at: apiContentItem.createdAt,
    updated_at: apiContentItem.updatedAt,
    created_by: apiContentItem.createdBy,
    updated_by: apiContentItem.updatedBy
  };
};
