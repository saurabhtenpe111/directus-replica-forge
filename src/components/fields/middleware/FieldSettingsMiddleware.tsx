
import React, { useEffect } from 'react';
import { FieldSettingsProvider, useFieldSettings } from '@/contexts/FieldSettingsContext';

interface FieldSettingsMiddlewareProps {
  children: React.ReactNode;
  fieldType: string | null;
  fieldId?: string;
  collectionId?: string;
  fieldData?: any;
  onUpdate?: (data: any) => void;
}

/**
 * Middleware component that handles field settings state management 
 * and synchronization with the database.
 */
export function FieldSettingsMiddleware({
  children,
  fieldType,
  fieldId,
  collectionId,
  fieldData,
  onUpdate
}: FieldSettingsMiddlewareProps) {
  return (
    <FieldSettingsProvider
      initialFieldData={fieldData}
      fieldType={fieldType}
      fieldId={fieldId}
      collectionId={collectionId}
      onFieldUpdate={onUpdate}
    >
      {children}
    </FieldSettingsProvider>
  );
}

/**
 * Hook to log field settings changes for debugging
 */
export function useFieldSettingsDebug() {
  const settings = useFieldSettings();
  
  useEffect(() => {
    console.log('[FieldSettingsDebug] Current field data:', settings.fieldData);
    console.log('[FieldSettingsDebug] Validation settings:', settings.validation);
    console.log('[FieldSettingsDebug] Appearance settings:', settings.appearance);
    console.log('[FieldSettingsDebug] Advanced settings:', settings.advanced);
    console.log('[FieldSettingsDebug] UI options:', settings.uiOptions);
  }, [
    settings.fieldData, 
    settings.validation, 
    settings.appearance, 
    settings.advanced, 
    settings.uiOptions
  ]);
  
  return null;
}
