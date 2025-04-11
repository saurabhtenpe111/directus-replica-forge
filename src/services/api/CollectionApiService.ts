
import apiClient from './apiClient';
import { Collection, CollectionField, CollectionFormData } from '@/services/CollectionService';
import { toast } from '@/hooks/use-toast';
import { normalizeAppearanceSettings } from '@/utils/inputAdapters';

// Map backend response to our frontend model
const mapApiCollection = (collection: any): Collection => {
  return {
    id: collection.id,
    title: collection.title,
    apiId: collection.apiId,
    description: collection.description || undefined,
    status: collection.status,
    createdAt: collection.createdAt,
    updatedAt: collection.updatedAt,
    icon: collection.icon || 'file',
    iconColor: collection.iconColor || 'gray',
    items: collection.itemCount || 0,
    lastUpdated: collection.updatedAt,
    created_at: collection.createdAt,
    updated_at: collection.updatedAt,
  };
};

// Map backend field response to our frontend model
const mapApiField = (field: any): CollectionField => {
  // Extract settings from both the old and new structure
  const validationSettings = field.validationSettings || field.validation || {};
  const appearanceSettings = field.appearanceSettings || field.appearance || {};
  const advancedSettings = field.advancedSettings || field.advanced || {};
  const uiOptionsSettings = field.uiOptionsSettings || field.uiOptions || {};
  const generalSettings = field.generalSettings || {};
  
  // Ensure appearance settings are properly normalized
  const normalizedAppearance = normalizeAppearanceSettings(appearanceSettings);

  return {
    id: field.id,
    name: field.name,
    apiId: field.apiId,
    type: field.type,
    description: field.description || undefined,
    required: field.required || false,
    settings: field.settings || {},
    validation_settings: validationSettings,
    appearance_settings: normalizedAppearance,
    advanced_settings: advancedSettings,
    ui_options_settings: uiOptionsSettings,
    general_settings: generalSettings,
    sort_order: field.sortOrder || 0,
    collection_id: field.collectionId || undefined,
    
    // Legacy structure references for backward compatibility
    validation: validationSettings,
    appearance: normalizedAppearance,
    advanced: advancedSettings,
    ui_options: uiOptionsSettings,
  };
};

// Collection APIs
export const fetchCollections = async (): Promise<Collection[]> => {
  try {
    const { data } = await apiClient.get('/collections');
    return data.map(mapApiCollection);
  } catch (error) {
    console.error('Failed to fetch collections:', error);
    return [];
  }
};

export const createCollection = async (collectionData: CollectionFormData): Promise<Collection> => {
  try {
    const { data } = await apiClient.post('/collections', collectionData);
    
    toast({
      title: "Collection created",
      description: `${collectionData.name} has been created successfully.`,
    });
    
    return mapApiCollection(data);
  } catch (error) {
    console.error('Failed to create collection:', error);
    throw error;
  }
};

// Field APIs
export const getFieldsForCollection = async (collectionId: string): Promise<CollectionField[]> => {
  try {
    const { data } = await apiClient.get(`/collections/${collectionId}/fields`);
    return data.map(mapApiField);
  } catch (error) {
    console.error('Failed to fetch fields:', error);
    return [];
  }
};

export const createField = async (collectionId: string, fieldData: Partial<CollectionField>): Promise<CollectionField> => {
  try {
    const { data } = await apiClient.post(`/collections/${collectionId}/fields`, fieldData);
    
    toast({
      title: "Field created",
      description: `The field "${fieldData.name}" was successfully created`,
    });
    
    return mapApiField(data);
  } catch (error) {
    console.error('Failed to create field:', error);
    throw error;
  }
};

export const updateField = async (collectionId: string, fieldId: string, fieldData: Partial<CollectionField>): Promise<CollectionField> => {
  try {
    const { data } = await apiClient.put(`/collections/${collectionId}/fields/${fieldId}`, fieldData);
    
    toast({
      title: "Field updated",
      description: `The field was successfully updated`,
    });
    
    return mapApiField(data);
  } catch (error) {
    console.error('Failed to update field:', error);
    throw error;
  }
};

export const deleteField = async (collectionId: string, fieldId: string): Promise<{ success: boolean }> => {
  try {
    await apiClient.delete(`/collections/${collectionId}/fields/${fieldId}`);
    
    toast({
      title: "Field deleted",
      description: "The field was successfully deleted",
    });
    
    return { success: true };
  } catch (error) {
    console.error('Failed to delete field:', error);
    return { success: false };
  }
};

export const updateFieldOrder = async (collectionId: string, fieldOrders: { id: string, sort_order: number }[]): Promise<boolean> => {
  try {
    await apiClient.put(`/collections/${collectionId}/fields/order`, fieldOrders);
    return true;
  } catch (error) {
    console.error('Failed to update field order:', error);
    return false;
  }
};

// Content APIs
export const getContentItems = async (collectionId: string): Promise<any[]> => {
  try {
    const { data } = await apiClient.get(`/collections/${collectionId}/content`);
    return data;
  } catch (error) {
    console.error('Failed to fetch content items:', error);
    return [];
  }
};

export const CollectionApiService = {
  fetchCollections,
  createCollection,
  getFieldsForCollection,
  createField,
  updateField,
  deleteField,
  updateFieldOrder,
  getContentItems
};

export default CollectionApiService;
