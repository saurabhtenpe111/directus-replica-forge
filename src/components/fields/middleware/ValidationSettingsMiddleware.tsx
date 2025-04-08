
import React from 'react';
import { useFieldSettings } from '@/contexts/FieldSettingsContext';
import { ValidationSettings } from '@/utils/fieldSettingsHelpers';

interface ValidationSettingsMiddlewareProps {
  children: (props: {
    settings: ValidationSettings;
    updateSettings: (settings: ValidationSettings) => Promise<void>;
    saveToDatabase: (settings: ValidationSettings) => Promise<void>;
    isSaving: boolean;
  }) => React.ReactNode;
}

/**
 * Middleware component for validation settings
 * Provides validation settings and update methods to children
 */
export function ValidationSettingsMiddleware({
  children
}: ValidationSettingsMiddlewareProps) {
  const { validation, updateValidation, saveToDatabase, isSaving } = useFieldSettings();
  
  // Create a specialized save function for validation settings
  const saveValidationToDatabase = async (settings: ValidationSettings) => {
    return saveToDatabase('validation', settings);
  };
  
  return (
    <>
      {children({
        settings: validation,
        updateSettings: updateValidation,
        saveToDatabase: saveValidationToDatabase,
        isSaving
      })}
    </>
  );
}
