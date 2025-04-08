
import React from 'react';
import { useFieldSettings } from '@/contexts/FieldSettingsContext';
import { AppearanceSettings } from '@/utils/fieldSettingsHelpers';

interface AppearanceSettingsMiddlewareProps {
  children: (props: {
    settings: AppearanceSettings;
    updateSettings: (settings: AppearanceSettings) => Promise<void>;
    saveToDatabase: (settings: AppearanceSettings) => Promise<void>;
    isSaving: boolean;
  }) => React.ReactNode;
}

/**
 * Middleware component for appearance settings
 * Provides appearance settings and update methods to children
 */
export function AppearanceSettingsMiddleware({
  children
}: AppearanceSettingsMiddlewareProps) {
  const { appearance, updateAppearance, saveToDatabase, isSaving } = useFieldSettings();
  
  // Create a specialized save function for appearance settings
  const saveAppearanceToDatabase = async (settings: AppearanceSettings) => {
    return saveToDatabase('appearance', settings);
  };
  
  return (
    <>
      {children({
        settings: appearance,
        updateSettings: updateAppearance,
        saveToDatabase: saveAppearanceToDatabase,
        isSaving
      })}
    </>
  );
}
