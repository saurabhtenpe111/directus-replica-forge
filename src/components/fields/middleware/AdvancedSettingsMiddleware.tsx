
import React, { useState, useContext, createContext, useEffect } from 'react';
import { updateField } from '@/services/CollectionService';
import { FieldSettingsContext } from './FieldSettingsMiddleware';

// Context type definition
interface AdvancedSettingsContextValue {
  settings: any;
  updateSettings: (newSettings: any) => void;
  saveToDatabase: (settingsToSave: any) => Promise<any>;
  isSaving: boolean;
}

// Create context with default values
const AdvancedSettingsContext = createContext<AdvancedSettingsContextValue>({
  settings: {},
  updateSettings: () => {},
  saveToDatabase: async () => ({}),
  isSaving: false
});

// Hook for components to use
export const useAdvancedSettings = () => useContext(AdvancedSettingsContext);

interface AdvancedSettingsMiddlewareProps {
  children: React.ReactNode | ((props: AdvancedSettingsContextValue) => React.ReactNode);
}

export function AdvancedSettingsMiddleware({ children }: AdvancedSettingsMiddlewareProps) {
  // Get field data from parent middleware
  const { fieldId, collectionId, fieldData, updateFieldData } = useContext(FieldSettingsContext);
  
  // Extract advanced settings from field data
  const [settings, setSettings] = useState<any>(
    fieldData?.advanced_settings || fieldData?.advanced || {}
  );
  
  // Loading state
  const [isSaving, setIsSaving] = useState(false);
  
  // Update settings when field data changes
  useEffect(() => {
    const newSettings = fieldData?.advanced_settings || fieldData?.advanced || {};
    setSettings(newSettings);
  }, [fieldData]);

  // Update settings locally
  const updateSettings = (newSettings: any) => {
    console.log('[AdvancedSettingsMiddleware] Updating settings:', newSettings);
    setSettings(newSettings);
    
    // Update parent middleware if it exists
    if (updateFieldData) {
      updateFieldData({
        advanced_settings: newSettings,
        advanced: newSettings // For backward compatibility
      });
    }
  };

  // Save settings to database
  const saveToDatabase = async (settingsToSave: any = settings) => {
    if (!fieldId || !collectionId) {
      console.error('[AdvancedSettingsMiddleware] Cannot save to database - missing fieldId or collectionId');
      return null;
    }
    
    setIsSaving(true);
    
    try {
      console.log('[AdvancedSettingsMiddleware] Saving to database:', settingsToSave);
      
      const result = await updateField(collectionId, fieldId, {
        advanced_settings: settingsToSave,
        advanced: settingsToSave // For backward compatibility
      }, {
        columnToUpdate: 'advanced_settings',
        mergeStrategy: 'replace'
      });
      
      setIsSaving(false);
      return result;
    } catch (error) {
      console.error('[AdvancedSettingsMiddleware] Error saving settings:', error);
      setIsSaving(false);
      throw error;
    }
  };

  // Context value
  const contextValue: AdvancedSettingsContextValue = {
    settings,
    updateSettings,
    saveToDatabase,
    isSaving
  };

  // Render children with context
  return (
    <AdvancedSettingsContext.Provider value={contextValue}>
      {typeof children === 'function' ? children(contextValue) : children}
    </AdvancedSettingsContext.Provider>
  );
}

export default AdvancedSettingsMiddleware;
