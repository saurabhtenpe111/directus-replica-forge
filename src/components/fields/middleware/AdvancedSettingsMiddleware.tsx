
import React from 'react';
import { useFieldSettings } from '@/contexts/FieldSettingsContext';
import { AdvancedSettings } from '@/utils/fieldSettingsHelpers';

interface AdvancedSettingsMiddlewareProps {
  children: (props: {
    settings: AdvancedSettings;
    updateSettings: (settings: AdvancedSettings) => Promise<void>;
    saveToDatabase: (settings: AdvancedSettings) => Promise<void>;
    isSaving: boolean;
  }) => React.ReactNode;
}

/**
 * Middleware component for advanced settings
 * Provides advanced settings and update methods to children
 */
export function AdvancedSettingsMiddleware({
  children
}: AdvancedSettingsMiddlewareProps) {
  const { advanced, updateAdvanced, saveToDatabase, isSaving } = useFieldSettings();
  
  // Create a specialized save function for advanced settings
  const saveAdvancedToDatabase = async (settings: AdvancedSettings) => {
    return saveToDatabase('advanced', settings);
  };
  
  return (
    <>
      {children({
        settings: advanced,
        updateSettings: updateAdvanced,
        saveToDatabase: saveAdvancedToDatabase,
        isSaving
      })}
    </>
  );
}
