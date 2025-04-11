
import { Collection, CollectionField } from '@/services/CollectionService';
import { ValidationSettings, AppearanceSettings, AdvancedSettings } from '@/utils/fieldSettingsHelpers';

/**
 * This adapter converts frontend models to the format expected by the backend API
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
  // Extract the apiId property separately
  const { apiId, ...restData } = field;
  
  // Build the field object in the format expected by the backend
  const apiField: any = {
    name: field.name || 'New Field',
    apiId: apiId || field.name?.toLowerCase().replace(/\s+/g, '_') || 'new_field',
    type: field.type || 'text',
    collectionId: field.collection_id,
    description: field.description || null,
    required: field.required || false,
    sortOrder: field.sort_order || 0,
    
    // Settings from dedicated columns
    validationSettings: field.validation_settings || field.validation || {},
    appearanceSettings: field.appearance_settings || field.appearance || {},
    advancedSettings: field.advanced_settings || field.advanced || {},
    uiOptionsSettings: field.ui_options_settings || field.ui_options || {},
    generalSettings: field.general_settings || {},
    
    // Legacy settings object for backward compatibility
    settings: field.settings || {}
  };
  
  return apiField;
};

// Helper to adapt validation settings for API
export const adaptValidationSettings = (settings: ValidationSettings): any => {
  return {
    ...settings,
    // Any specific transformations can go here
  };
};

// Helper to adapt appearance settings for API
export const adaptAppearanceSettings = (settings: AppearanceSettings): any => {
  return {
    ...settings,
    // Any specific transformations can go here
  };
};

// Helper to adapt advanced settings for API
export const adaptAdvancedSettings = (settings: AdvancedSettings): any => {
  return {
    ...settings,
    // Any specific transformations can go here
  };
};

/**
 * Adapters for transforming backend responses to frontend models
 */

export const adaptApiToCollection = (apiCollection: any): Collection => {
  return {
    id: apiCollection.id,
    title: apiCollection.title,
    apiId: apiCollection.apiId,
    description: apiCollection.description,
    status: apiCollection.status,
    fields: apiCollection.fields || [],
    createdAt: apiCollection.createdAt,
    updatedAt: apiCollection.updatedAt,
    icon: apiCollection.icon || 'file',
    iconColor: apiCollection.iconColor || 'gray',
    items: apiCollection.itemCount || 0,
    lastUpdated: apiCollection.updatedAt,
    created_at: apiCollection.createdAt,
    updated_at: apiCollection.updatedAt
  };
};
