
import React, { useState, useContext, createContext, useEffect } from 'react';
import { updateField } from '@/services/CollectionService';
import { FieldSettingsContext } from './FieldSettingsMiddleware';

// Context type definition
interface ValidationSettingsContextValue {
  settings: any;
  updateSettings: (newSettings: any) => void;
  saveToDatabase: (settingsToSave: any) => Promise<any>;
  isSaving: boolean;
}

// Create context with default values
const ValidationSettingsContext = createContext<ValidationSettingsContextValue>({
  settings: {},
  updateSettings: () => {},
  saveToDatabase: async () => ({}),
  isSaving: false
});

// Hook for components to use
export const useValidationSettings = () => useContext(ValidationSettingsContext);

interface ValidationSettingsMiddlewareProps {
  children: React.ReactNode | ((props: ValidationSettingsContextValue) => React.ReactNode);
}

export function ValidationSettingsMiddleware({ children }: ValidationSettingsMiddlewareProps) {
  // Get field data from parent middleware
  const { fieldId, collectionId, fieldData, updateFieldData } = useContext(FieldSettingsContext);
  
  // Extract validation settings from field data
  const [settings, setSettings] = useState<any>(
    fieldData?.validation_settings || fieldData?.validation || {}
  );
  
  // Loading state
  const [isSaving, setIsSaving] = useState(false);
  
  // Update settings when field data changes
  useEffect(() => {
    const newSettings = fieldData?.validation_settings || fieldData?.validation || {};
    setSettings(newSettings);
  }, [fieldData]);

  // Update settings locally
  const updateSettings = (newSettings: any) => {
    console.log('[ValidationSettingsMiddleware] Updating settings:', newSettings);
    setSettings(newSettings);
    
    // Update parent middleware if it exists
    if (updateFieldData) {
      updateFieldData({
        validation_settings: newSettings,
        validation: newSettings // For backward compatibility
      });
    }
  };

  // Save settings to database
  const saveToDatabase = async (settingsToSave: any = settings) => {
    if (!fieldId || !collectionId) {
      console.error('[ValidationSettingsMiddleware] Cannot save to database - missing fieldId or collectionId');
      return null;
    }
    
    setIsSaving(true);
    
    try {
      console.log('[ValidationSettingsMiddleware] Saving to database:', settingsToSave);
      
      const result = await updateField(collectionId, fieldId, {
        validation_settings: settingsToSave,
        validation: settingsToSave // For backward compatibility
      }, {
        columnToUpdate: 'validation_settings',
        mergeStrategy: 'replace'
      });
      
      setIsSaving(false);
      return result;
    } catch (error) {
      console.error('[ValidationSettingsMiddleware] Error saving settings:', error);
      setIsSaving(false);
      throw error;
    }
  };

  // Context value
  const contextValue: ValidationSettingsContextValue = {
    settings,
    updateSettings,
    saveToDatabase,
    isSaving
  };

  // Render children with context
  return (
    <ValidationSettingsContext.Provider value={contextValue}>
      {typeof children === 'function' ? children(contextValue) : children}
    </ValidationSettingsContext.Provider>
  );
}

export default ValidationSettingsMiddleware;
