import React, { createContext, useContext, useState, useCallback } from 'react';
import { 
  getNormalizedFieldSettings, 
  updateFieldSettings, 
  getValidationSettings, 
  getAppearanceSettings, 
  getAdvancedSettings,
  getUIOptions,
  createUpdatePayload,
  createColumnUpdatePayload,
  FieldSettings,
  ValidationSettings,
  AppearanceSettings, 
  AdvancedSettings,
  UIOptions
} from '@/utils/fieldSettingsHelpers';
import { toast } from '@/hooks/use-toast';
import { updateField } from '@/services/CollectionService';

interface FieldSettingsContextType {
  // Field data
  fieldData: any;
  fieldType: string | null;
  fieldId: string | undefined;
  collectionId: string | undefined;
  
  // State flags
  isLoading: boolean;
  isSaving: boolean;
  
  // Settings getters
  validation: ValidationSettings;
  appearance: AppearanceSettings;
  advanced: AdvancedSettings;
  uiOptions: UIOptions;
  
  // Actions
  updateFieldData: (data: any) => void;
  updateValidation: (settings: ValidationSettings) => Promise<void>;
  updateAppearance: (settings: AppearanceSettings) => Promise<void>;
  updateAdvanced: (settings: AdvancedSettings) => Promise<void>;
  updateUIOptions: (options: UIOptions) => Promise<void>;
  saveToDatabase: (section: keyof FieldSettings, settings: any) => Promise<void>;
}

const FieldSettingsContext = createContext<FieldSettingsContextType | undefined>(undefined);

export const FieldSettingsProvider: React.FC<{
  children: React.ReactNode;
  initialFieldData?: any;
  fieldType: string | null;
  fieldId?: string;
  collectionId?: string;
  onFieldUpdate?: (data: any) => void;
}> = ({ 
  children, 
  initialFieldData,
  fieldType, 
  fieldId,
  collectionId,
  onFieldUpdate 
}) => {
  const [fieldData, setFieldData] = useState<any>(initialFieldData || {});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  // Extract settings using our helper functions
  const validation = getValidationSettings(fieldData);
  const appearance = getAppearanceSettings(fieldData);
  const advanced = getAdvancedSettings(fieldData);
  const uiOptions = getUIOptions(fieldData);
  
  // Update field data (used for receiving updates from parent components)
  const updateFieldData = useCallback((newFieldData: any) => {
    console.log('[FieldSettingsContext] Updating field data:', newFieldData);
    setFieldData(newFieldData);
  }, []);
  
  // Update validation settings locally
  const updateValidation = useCallback(async (settings: ValidationSettings): Promise<void> => {
    try {
      console.log('[FieldSettingsContext] Updating validation settings:', settings);
      
      // Update the field data with the new validation settings
      const updatedFieldData = {
        ...fieldData,
        validation_settings: settings,
        // For backward compatibility
        validation: settings
      };
      
      setFieldData(updatedFieldData);
      
      if (onFieldUpdate) {
        onFieldUpdate(updatedFieldData);
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error('[FieldSettingsContext] Error updating validation settings:', error);
      toast({
        title: "Error updating validation settings",
        description: "There was an error updating the validation settings.",
        variant: "destructive"
      });
      return Promise.reject(error);
    }
  }, [fieldData, onFieldUpdate]);
  
  // Update appearance settings locally
  const updateAppearance = useCallback(async (settings: AppearanceSettings): Promise<void> => {
    try {
      console.log('[FieldSettingsContext] Updating appearance settings:', settings);
      
      // Update the field data with the new appearance settings
      const updatedFieldData = {
        ...fieldData,
        appearance_settings: settings,
        // For backward compatibility
        appearance: settings
      };
      
      setFieldData(updatedFieldData);
      
      if (onFieldUpdate) {
        onFieldUpdate(updatedFieldData);
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error('[FieldSettingsContext] Error updating appearance settings:', error);
      toast({
        title: "Error updating appearance settings",
        description: "There was an error updating the appearance settings.",
        variant: "destructive"
      });
      return Promise.reject(error);
    }
  }, [fieldData, onFieldUpdate]);
  
  // Update advanced settings locally
  const updateAdvanced = useCallback(async (settings: AdvancedSettings): Promise<void> => {
    try {
      console.log('[FieldSettingsContext] Updating advanced settings:', settings);
      
      // Update the field data with the new advanced settings
      const updatedFieldData = {
        ...fieldData,
        advanced_settings: settings,
        // For backward compatibility
        advanced: settings
      };
      
      setFieldData(updatedFieldData);
      
      if (onFieldUpdate) {
        onFieldUpdate(updatedFieldData);
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error('[FieldSettingsContext] Error updating advanced settings:', error);
      toast({
        title: "Error updating advanced settings",
        description: "There was an error updating the advanced settings.",
        variant: "destructive"
      });
      return Promise.reject(error);
    }
  }, [fieldData, onFieldUpdate]);
  
  // Update UI options locally
  const updateUIOptions = useCallback(async (options: UIOptions): Promise<void> => {
    try {
      console.log('[FieldSettingsContext] Updating UI options:', options);
      
      // Update the field data with the new UI options
      const updatedFieldData = {
        ...fieldData,
        ui_options_settings: options,
        // For backward compatibility
        ui_options: options
      };
      
      setFieldData(updatedFieldData);
      
      if (onFieldUpdate) {
        onFieldUpdate(updatedFieldData);
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error('[FieldSettingsContext] Error updating UI options:', error);
      toast({
        title: "Error updating UI options",
        description: "There was an error updating the UI options.",
        variant: "destructive"
      });
      return Promise.reject(error);
    }
  }, [fieldData, onFieldUpdate]);
  
  // Save a specific section to the database using the new column structure
  const saveToDatabase = useCallback(async (
    section: keyof FieldSettings, 
    settings: any
  ): Promise<void> => {
    // Check if we have the required IDs to save to database
    if (!fieldId || !collectionId) {
      toast({
        title: "Missing field or collection ID",
        description: "Cannot save to database without field and collection IDs",
        variant: "destructive"
      });
      return Promise.reject(new Error("Missing field or collection ID"));
    }
    
    setIsSaving(true);
    
    try {
      console.log(`[FieldSettingsContext] Saving ${section} settings to database:`, settings);
      console.log('[FieldSettingsContext] Field ID:', fieldId);
      console.log('[FieldSettingsContext] Collection ID:', collectionId);
      
      // Create the field data object using our helper for the new columns
      const fieldUpdateData = createColumnUpdatePayload(section, settings);
      
      // Call the service to update the field in the database
      const updatedField = await updateField(collectionId, fieldId, fieldUpdateData);
      
      console.log('[FieldSettingsContext] Field updated in database:', updatedField);
      
      // Update local state with the response from the database
      if (updatedField) {
        // Extract the updated settings based on the section
        let updatedSettings;
        switch (section) {
          case 'validation':
            updatedSettings = updatedField.validation_settings || updatedField.validation || settings;
            break;
          case 'appearance':
            updatedSettings = updatedField.appearance_settings || updatedField.appearance || settings;
            break;
          case 'advanced':
            updatedSettings = updatedField.advanced_settings || updatedField.advanced || settings;
            break;
          case 'ui_options':
            updatedSettings = updatedField.ui_options_settings || updatedField.ui_options || settings;
            break;
          case 'general':
            updatedSettings = updatedField.general_settings || settings;
            break;
          default:
            updatedSettings = updatedField.settings?.[section] || settings;
        }
        
        // Update the field data with the new settings
        const updatedFieldData = {
          ...fieldData,
          [`${section}_settings`]: updatedSettings,
          // For backward compatibility
          [section]: updatedSettings
        };
        
        setFieldData(updatedFieldData);
        
        if (onFieldUpdate) {
          onFieldUpdate(updatedFieldData);
        }
      }
      
      toast({
        title: `${section} settings saved`,
        description: `Your field's ${section} settings have been saved to the database`
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error(`[FieldSettingsContext] Error saving ${section} settings to database:`, error);
      toast({
        title: `Error saving ${section} settings`,
        description: `There was a problem saving your ${section} settings to the database`,
        variant: "destructive"
      });
      return Promise.reject(error);
    } finally {
      setIsSaving(false);
    }
  }, [fieldData, fieldId, collectionId, onFieldUpdate]);
  
  const value = {
    fieldData,
    fieldType,
    fieldId,
    collectionId,
    isLoading,
    isSaving,
    validation,
    appearance,
    advanced,
    uiOptions,
    updateFieldData,
    updateValidation,
    updateAppearance,
    updateAdvanced,
    updateUIOptions,
    saveToDatabase,
  };

  return (
    <FieldSettingsContext.Provider value={value}>
      {children}
    </FieldSettingsContext.Provider>
  );
};

export const useFieldSettings = (): FieldSettingsContextType => {
  const context = useContext(FieldSettingsContext);
  
  if (context === undefined) {
    throw new Error('useFieldSettings must be used within a FieldSettingsProvider');
  }
  
  return context;
};
