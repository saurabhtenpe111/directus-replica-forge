
import React, { useState, useCallback } from 'react';
import { useFieldSettings } from '@/contexts/FieldSettingsContext';
import { toast } from '@/hooks/use-toast';
import { updateField } from '@/services/CollectionService';
import { AdvancedSettings } from '@/utils/fieldSettingsHelpers';

export function AdvancedSettingsMiddleware({ 
  children 
}: { 
  children: (props: {
    settings: AdvancedSettings;
    updateSettings: (settings: AdvancedSettings) => void;
    saveToDatabase: (settings: AdvancedSettings) => Promise<void>;
    isSaving: boolean;
  }) => React.ReactNode
}) {
  const { 
    fieldId, 
    collectionId,
    advanced, 
    updateAdvanced,
    saveToDatabase: contextSaveToDatabase
  } = useFieldSettings();
  
  const [isSaving, setIsSaving] = useState(false);
  
  // Function to update advanced settings locally
  const updateSettings = useCallback((newSettings: AdvancedSettings) => {
    console.log('Updating advanced settings:', newSettings);
    updateAdvanced(newSettings);
  }, [updateAdvanced]);
  
  // Function to save advanced settings to the database
  const saveToDatabase = useCallback(async (settings: AdvancedSettings): Promise<void> => {
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
      console.log('Saving advanced settings to database:', settings);
      
      // Use the new updateField function with options
      await updateField(
        collectionId,
        fieldId, 
        { advanced_settings: settings },
        { columnToUpdate: 'advanced_settings', mergeStrategy: 'deep' }
      );
      
      // Also update our context state
      await updateAdvanced(settings);
      
      // Also use the context's saveToDatabase for additional effects if needed
      await contextSaveToDatabase('advanced', settings);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error saving advanced settings to database:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [fieldId, collectionId, updateAdvanced, contextSaveToDatabase]);
  
  return (
    <>
      {children({ 
        settings: advanced, 
        updateSettings, 
        saveToDatabase,
        isSaving
      })}
    </>
  );
}

export default AdvancedSettingsMiddleware;
