
import React, { useCallback, useEffect, useState } from 'react';
import { useFieldSettings } from '@/contexts/FieldSettingsContext';
import { GeneralSettings } from '@/utils/fieldSettingsHelpers';
import { toast } from '@/hooks/use-toast';
import { updateField } from '@/services/CollectionService';

interface GeneralSettingsProps {
  children: (props: {
    settings: GeneralSettings;
    updateSettings: (settings: GeneralSettings) => void;
    saveToDatabase: (settings: GeneralSettings) => Promise<void>;
    isSaving: boolean;
  }) => React.ReactNode;
}

export function GeneralSettingsMiddleware({ children }: GeneralSettingsProps) {
  const { 
    fieldData, 
    fieldType, 
    fieldId, 
    collectionId, 
    updateGeneralSettings,
    saveToDatabase
  } = useFieldSettings();
  
  const [settings, setSettings] = useState<GeneralSettings>({});
  const [isSaving, setIsSaving] = useState(false);

  // Initialize settings from field data
  useEffect(() => {
    if (fieldData) {
      // Get general settings from field data - check all possible locations
      const generalSettings = fieldData.general_settings || 
                           fieldData.general || 
                           fieldData.settings?.general || 
                           {};
      
      console.log('[GeneralSettingsMiddleware] Initializing with settings:', generalSettings);
      setSettings(generalSettings);
    }
  }, [fieldData]);

  // Handle settings updates
  const handleUpdateSettings = useCallback((newSettings: GeneralSettings) => {
    console.log('[GeneralSettingsMiddleware] Updating settings:', newSettings);
    
    // Ensure we have a keyFilter for text-type fields
    let updatedSettings = { ...newSettings };
    if (['text', 'email', 'url', 'password'].includes(fieldType || '')) {
      if (!updatedSettings.keyFilter) {
        updatedSettings.keyFilter = 'none';
      }
    }
    
    setSettings(updatedSettings);
    
    if (updateGeneralSettings) {
      updateGeneralSettings(updatedSettings)
        .then(() => {
          console.log('[GeneralSettingsMiddleware] Settings updated in context');
        })
        .catch(error => {
          console.error('[GeneralSettingsMiddleware] Error updating settings in context:', error);
        });
    }
  }, [updateGeneralSettings, fieldType]);

  // Save settings to database
  const handleSaveToDatabase = useCallback(async (settingsToSave: GeneralSettings) => {
    if (!fieldId || !collectionId) {
      toast({
        title: "Cannot save settings",
        description: "Missing field ID or collection ID",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    
    try {
      console.log('[GeneralSettingsMiddleware] Saving settings to database:', settingsToSave);
      
      // Ensure keyFilter is set for text fields
      let finalSettings = { ...settingsToSave };
      if (['text', 'email', 'url', 'password'].includes(fieldType || '')) {
        if (!finalSettings.keyFilter) {
          finalSettings.keyFilter = 'none';
        }
      }
      
      // Include field type in settings to help with conditional logic
      finalSettings.fieldType = fieldType || undefined;
      
      // Use the fieldSettings context saveToDatabase function if available
      if (saveToDatabase) {
        await saveToDatabase('general', finalSettings);
        console.log('[GeneralSettingsMiddleware] Settings saved using context method');
      } else {
        // Direct API call as fallback
        await updateField(collectionId, fieldId, {
          general_settings: finalSettings
        });
        console.log('[GeneralSettingsMiddleware] Settings saved using direct API call');
      }
      
      toast({
        title: "Settings saved",
        description: "General settings have been updated"
      });
    } catch (error) {
      console.error("[GeneralSettingsMiddleware] Error saving general settings:", error);
      toast({
        title: "Error saving settings",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  }, [fieldId, collectionId, saveToDatabase, fieldType]);

  return (
    <>
      {children({
        settings,
        updateSettings: handleUpdateSettings,
        saveToDatabase: handleSaveToDatabase,
        isSaving
      })}
    </>
  );
}

export default GeneralSettingsMiddleware;
