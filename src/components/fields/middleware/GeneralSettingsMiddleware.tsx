
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
    setSettings(newSettings);
    
    if (updateGeneralSettings) {
      updateGeneralSettings(newSettings)
        .then(() => {
          console.log('[GeneralSettingsMiddleware] Settings updated in context');
        })
        .catch(error => {
          console.error('[GeneralSettingsMiddleware] Error updating settings in context:', error);
        });
    }
  }, [updateGeneralSettings]);

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
      
      // Use the fieldSettings context saveToDatabase function if available
      if (saveToDatabase) {
        await saveToDatabase('general', settingsToSave);
        console.log('[GeneralSettingsMiddleware] Settings saved using context method');
      } else {
        // Direct API call as fallback
        await updateField(collectionId, fieldId, {
          general_settings: settingsToSave
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
  }, [fieldId, collectionId, saveToDatabase]);

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
