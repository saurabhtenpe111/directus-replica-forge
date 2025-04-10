
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
  const { fieldData, fieldType, fieldId, collectionId, updateGeneralSettings } = useFieldSettings();
  const [settings, setSettings] = useState<GeneralSettings>({});
  const [isSaving, setIsSaving] = useState(false);

  // Initialize settings from field data
  useEffect(() => {
    if (fieldData) {
      // Get general settings from field data
      const generalSettings = fieldData.general_settings || 
                           fieldData.settings?.general || 
                           {};
      
      setSettings(generalSettings);
    }
  }, [fieldData]);

  // Handle settings updates
  const handleUpdateSettings = useCallback((newSettings: GeneralSettings) => {
    setSettings(newSettings);
    if (updateGeneralSettings) {
      updateGeneralSettings(newSettings);
    }
  }, [updateGeneralSettings]);

  // Save settings to database
  const saveToDatabase = useCallback(async (settingsToSave: GeneralSettings) => {
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
      await updateField(collectionId, fieldId, {
        general_settings: settingsToSave
      });
      
      toast({
        title: "Settings saved",
        description: "General settings have been updated"
      });
    } catch (error) {
      console.error("Error saving general settings:", error);
      toast({
        title: "Error saving settings",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  }, [fieldId, collectionId]);

  return (
    <>
      {children({
        settings,
        updateSettings: handleUpdateSettings,
        saveToDatabase,
        isSaving
      })}
    </>
  );
}

export default GeneralSettingsMiddleware;
