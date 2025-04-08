
import React, { useState, useContext, createContext, useEffect } from 'react';
import { updateField } from '@/services/CollectionService';
import { FieldSettingsContext } from './FieldSettingsMiddleware';
import { normalizeAppearanceSettings } from '@/utils/inputAdapters';

// Context type definition
interface AppearanceSettingsContextValue {
  settings: any;
  updateSettings: (newSettings: any) => void;
  saveToDatabase: (settingsToSave: any) => Promise<any>;
  isSaving: boolean;
}

// Create context with default values
const AppearanceSettingsContext = createContext<AppearanceSettingsContextValue>({
  settings: {},
  updateSettings: () => {},
  saveToDatabase: async () => ({}),
  isSaving: false
});

// Hook for components to use
export const useAppearanceSettings = () => useContext(AppearanceSettingsContext);

interface AppearanceSettingsMiddlewareProps {
  children: React.ReactNode | ((props: AppearanceSettingsContextValue) => React.ReactNode);
}

export function AppearanceSettingsMiddleware({ children }: AppearanceSettingsMiddlewareProps) {
  // Get field data from parent middleware
  const { fieldId, collectionId, fieldData, updateFieldData } = useContext(FieldSettingsContext);
  
  // Extract appearance settings from field data and normalize them
  const normalizedSettings = normalizeAppearanceSettings(
    fieldData?.appearance_settings || fieldData?.appearance || {}
  );
  
  // Local state for settings
  const [settings, setSettings] = useState<any>(normalizedSettings);
  
  // Loading state
  const [isSaving, setIsSaving] = useState(false);
  
  // Update settings when field data changes
  useEffect(() => {
    const newSettings = normalizeAppearanceSettings(
      fieldData?.appearance_settings || fieldData?.appearance || {}
    );
    setSettings(newSettings);
  }, [fieldData]);

  // Update settings locally
  const updateSettings = (newSettings: any) => {
    console.log('[AppearanceSettingsMiddleware] Updating settings:', newSettings);
    const normalizedNewSettings = normalizeAppearanceSettings(newSettings);
    setSettings(normalizedNewSettings);
    
    // Update parent middleware if it exists
    if (updateFieldData) {
      updateFieldData({
        appearance_settings: normalizedNewSettings,
        appearance: normalizedNewSettings // For backward compatibility
      });
    }
  };

  // Save settings to database
  const saveToDatabase = async (settingsToSave: any = settings) => {
    if (!fieldId || !collectionId) {
      console.error('[AppearanceSettingsMiddleware] Cannot save to database - missing fieldId or collectionId');
      return null;
    }
    
    setIsSaving(true);
    
    try {
      console.log('[AppearanceSettingsMiddleware] Saving to database:', settingsToSave);
      
      const normalizedSettingsToSave = normalizeAppearanceSettings(settingsToSave);
      
      const result = await updateField(collectionId, fieldId, {
        appearance_settings: normalizedSettingsToSave,
        appearance: normalizedSettingsToSave // For backward compatibility
      }, {
        columnToUpdate: 'appearance_settings',
        mergeStrategy: 'replace'
      });
      
      setIsSaving(false);
      return result;
    } catch (error) {
      console.error('[AppearanceSettingsMiddleware] Error saving settings:', error);
      setIsSaving(false);
      throw error;
    }
  };

  // Context value
  const contextValue: AppearanceSettingsContextValue = {
    settings,
    updateSettings,
    saveToDatabase,
    isSaving
  };

  // Render children with context
  return (
    <AppearanceSettingsContext.Provider value={contextValue}>
      {typeof children === 'function' ? children(contextValue) : children}
    </AppearanceSettingsContext.Provider>
  );
}

export default AppearanceSettingsMiddleware;
