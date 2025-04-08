
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useFieldSettings } from './FieldSettingsMiddleware';

// Define the context type
interface AdvancedSettingsContextType {
  settings: any;
  updateSettings: (data: any) => void;
  saveToDatabase: (data?: any) => Promise<any>;
  isSaving: boolean;
}

// Create the context with default values
export const AdvancedSettingsContext = createContext<AdvancedSettingsContextType>({
  settings: {},
  updateSettings: () => {},
  saveToDatabase: async () => ({}),
  isSaving: false
});

// Define the props for the middleware component
interface AdvancedSettingsMiddlewareProps {
  children: React.ReactNode | ((props: AdvancedSettingsContextType) => React.ReactNode);
}

// The middleware component
export function AdvancedSettingsMiddleware({
  children
}: AdvancedSettingsMiddlewareProps) {
  const { fieldId, collectionId, fieldData, updateFieldData } = useFieldSettings();
  const [settings, setSettings] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Extract advanced settings from field data
  useEffect(() => {
    if (fieldData) {
      const advancedSettings = fieldData.advanced_settings || fieldData.advanced || {};
      setSettings(advancedSettings);
      console.log('[AdvancedSettingsMiddleware] Initial settings:', advancedSettings);
    }
  }, [fieldData]);

  // Function to update advanced settings
  const updateSettings = (newData: any) => {
    const updatedSettings = { ...settings, ...newData };
    setSettings(updatedSettings);
    console.log('[AdvancedSettingsMiddleware] Updated settings:', updatedSettings);
  };

  // Function to save settings to database
  const saveToDatabase = async (dataToSave?: any) => {
    setIsSaving(true);
    try {
      const dataToUpdate = {
        advanced_settings: dataToSave || settings
      };
      
      // Update field data in parent context
      updateFieldData(dataToUpdate);
      console.log('[AdvancedSettingsMiddleware] Saved to database:', dataToUpdate);
      
      return dataToUpdate;
    } catch (error) {
      console.error('[AdvancedSettingsMiddleware] Error saving to database:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  // Create the context value
  const contextValue: AdvancedSettingsContextType = {
    settings,
    updateSettings,
    saveToDatabase,
    isSaving
  };

  // Provider component
  return (
    <AdvancedSettingsContext.Provider value={contextValue}>
      {typeof children === 'function' ? children(contextValue) : children}
    </AdvancedSettingsContext.Provider>
  );
}

// Hook to use the context
export const useAdvancedSettings = () => useContext(AdvancedSettingsContext);

export default AdvancedSettingsMiddleware;
