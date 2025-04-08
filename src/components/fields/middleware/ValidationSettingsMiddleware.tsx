
import React, { useState, useCallback } from 'react';
import { useFieldSettings } from '@/contexts/FieldSettingsContext';
import { toast } from '@/hooks/use-toast';
import { updateField } from '@/services/CollectionService';
import { ValidationSettings } from '@/utils/fieldSettingsHelpers';

export function ValidationSettingsMiddleware({ 
  children 
}: { 
  children: (props: {
    settings: ValidationSettings;
    updateSettings: (settings: ValidationSettings) => void;
    saveToDatabase: (settings: ValidationSettings) => Promise<void>;
    isSaving: boolean;
  }) => React.ReactNode
}) {
  const { 
    fieldId, 
    collectionId,
    validation, 
    updateValidation,
    saveToDatabase: contextSaveToDatabase
  } = useFieldSettings();
  
  const [isSaving, setIsSaving] = useState(false);
  
  // Function to update validation settings locally
  const updateSettings = useCallback((newSettings: ValidationSettings) => {
    console.log('Updating validation settings:', newSettings);
    updateValidation(newSettings);
  }, [updateValidation]);
  
  // Function to save validation settings to the database
  const saveToDatabase = useCallback(async (settings: ValidationSettings): Promise<void> => {
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
      console.log('Saving validation settings to database:', settings);
      
      // Use the new updateField function with options
      await updateField(
        collectionId,
        fieldId, 
        { validation_settings: settings },
        { columnToUpdate: 'validation_settings', mergeStrategy: 'deep' }
      );
      
      // Also update our context state
      await updateValidation(settings);
      
      // Also use the context's saveToDatabase for additional effects if needed
      await contextSaveToDatabase('validation', settings);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error saving validation settings to database:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [fieldId, collectionId, updateValidation, contextSaveToDatabase]);
  
  return (
    <>
      {children({ 
        settings: validation, 
        updateSettings, 
        saveToDatabase,
        isSaving
      })}
    </>
  );
}

export default ValidationSettingsMiddleware;
