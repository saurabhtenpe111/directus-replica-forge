
import React, { useState, useCallback } from 'react';
import { useFieldSettings } from '@/contexts/FieldSettingsContext';
import { toast } from '@/hooks/use-toast';
import { updateField } from '@/services/CollectionService';
import { AppearanceSettings } from '@/utils/fieldSettingsHelpers';
import { normalizeAppearanceSettings } from '@/utils/inputAdapters';

export function AppearanceSettingsMiddleware({ 
  children 
}: { 
  children: (props: {
    settings: AppearanceSettings;
    updateSettings: (settings: AppearanceSettings) => void;
    saveToDatabase: (settings: AppearanceSettings) => Promise<void>;
    isSaving: boolean;
  }) => React.ReactNode
}) {
  const { 
    fieldId, 
    collectionId,
    appearance, 
    updateAppearance,
    saveToDatabase: contextSaveToDatabase
  } = useFieldSettings();
  
  const [isSaving, setIsSaving] = useState(false);
  
  // Function to update appearance settings locally
  const updateSettings = useCallback((newSettings: AppearanceSettings) => {
    console.log('Updating appearance settings:', newSettings);
    // Normalize appearance settings before updating
    const normalizedSettings = normalizeAppearanceSettings(newSettings);
    updateAppearance(normalizedSettings);
  }, [updateAppearance]);
  
  // Function to save appearance settings to the database
  const saveToDatabase = useCallback(async (settings: AppearanceSettings): Promise<void> => {
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
      console.log('Saving appearance settings to database:', settings);
      
      // Normalize appearance settings before saving
      const normalizedSettings = normalizeAppearanceSettings(settings);
      
      // Use the new updateField function with options
      await updateField(
        collectionId,
        fieldId, 
        { appearance_settings: normalizedSettings },
        { columnToUpdate: 'appearance_settings', mergeStrategy: 'deep' }
      );
      
      // Also update our context state
      await updateAppearance(normalizedSettings);
      
      // Also use the context's saveToDatabase for additional effects if needed
      await contextSaveToDatabase('appearance', normalizedSettings);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error saving appearance settings to database:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [fieldId, collectionId, updateAppearance, contextSaveToDatabase]);
  
  return (
    <>
      {children({ 
        settings: appearance, 
        updateSettings, 
        saveToDatabase,
        isSaving
      })}
    </>
  );
}

export default AppearanceSettingsMiddleware;
