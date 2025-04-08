import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { UIVariantsTab } from "./UIVariantsTab";
import { ColorsTab } from "./ColorsTab";
import { ThemeTab } from "./ThemeTab";
import { CustomCSSTab } from "./CustomCSSTab";
import { FieldPreview } from "./FieldPreview";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { SaveIcon, Loader2 } from "lucide-react";
import { validateUIVariant, normalizeAppearanceSettings } from "@/utils/inputAdapters";
import { updateField } from "@/services/CollectionService";

interface FieldAppearancePanelProps {
  fieldType: string | null;
  fieldId?: string;
  collectionId?: string;
  initialData?: any;
  onSave: (data: any) => void;
}

export function FieldAppearancePanel({
  fieldType,
  fieldId,
  collectionId,
  initialData = {},
  onSave
}: FieldAppearancePanelProps) {
  const [activeSubtab, setActiveSubtab] = useState("uiVariants");
  const [previewState, setPreviewState] = useState<'default' | 'hover' | 'focus' | 'disabled' | 'error'>('default');
  const [isDarkMode, setIsDarkMode] = useState(initialData?.isDarkMode || false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingToDb, setIsSavingToDb] = useState(false);

  // Ensure we get a valid UI variant from initialData or use 'standard' as default
  const defaultUIVariant = validateUIVariant(initialData?.uiVariant);

  // State for appearance settings
  const [settings, setSettings] = useState(normalizeAppearanceSettings(initialData));

  console.log("Initial appearance data:", JSON.stringify(initialData, null, 2));
  console.log("Default UI variant set to:", defaultUIVariant);
  console.log("Normalized settings:", JSON.stringify(settings, null, 2));

  // Update settings when initialData changes
  useEffect(() => {
    if (initialData) {
      const normalizedSettings = normalizeAppearanceSettings(initialData);
      console.log("Normalized settings from initialData:", JSON.stringify(normalizedSettings, null, 2));
      console.log("UI Variant after normalization:", normalizedSettings.uiVariant);
      setSettings(normalizedSettings);
      
      if (initialData.isDarkMode !== undefined) {
        setIsDarkMode(initialData.isDarkMode);
      }
    }
  }, [initialData]);

  // Update settings and trigger save to parent immediately
  const updateSettings = (newSettings: Partial<typeof settings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    
    // Ensure UI variant is always valid
    if (newSettings.uiVariant) {
      updatedSettings.uiVariant = validateUIVariant(newSettings.uiVariant);
    }
    
    setSettings(updatedSettings);

    console.log("Updated appearance settings:", updatedSettings);
    // Ensure uiVariant is explicitly logged
    if (newSettings.uiVariant) {
      console.log("UI Variant updated to:", updatedSettings.uiVariant);
    }
    
    // Save immediately to ensure changes are persisted locally
    saveLocalSettings(updatedSettings);
  };

  // Save settings to parent component only (local state)
  const saveLocalSettings = (settingsToSave = settings) => {
    setIsSaving(true);

    try {
      // Ensure settings are properly normalized before saving
      const normalizedSettings = normalizeAppearanceSettings(settingsToSave);
      
      console.log("Saving appearance settings locally:", normalizedSettings);
      console.log("UI Variant being saved locally:", normalizedSettings.uiVariant);

      // Save settings to parent component
      onSave(normalizedSettings);

      toast({
        title: "Appearance settings saved locally",
        description: "Your changes have been saved to local state"
      });
    } catch (error) {
      console.error("Error saving appearance settings locally:", error);
      toast({
        title: "Error saving settings locally",
        description: "There was a problem saving your appearance settings to local state",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Save all settings to database
  const saveToDatabaseSettings = async () => {
    // Check if we have the required IDs to save to database
    if (!fieldId || !collectionId) {
      toast({
        title: "Missing field or collection ID",
        description: "Cannot save to database without field and collection IDs",
        variant: "destructive"
      });
      return;
    }

    setIsSavingToDb(true);

    try {
      // Normalize settings before saving
      const normalizedSettings = normalizeAppearanceSettings(settings);
      
      console.log("Saving appearance settings to database:", normalizedSettings);
      console.log("Field ID:", fieldId);
      console.log("Collection ID:", collectionId);

      // Prepare field update data
      const fieldData = {
        appearance_settings: normalizedSettings
      };

      // Call the updateField service function directly
      const updatedField = await updateField(collectionId, fieldId, fieldData);
      
      console.log("Field updated in database:", updatedField);

      toast({
        title: "Appearance settings saved to database",
        description: "Your changes have been saved successfully to the database"
      });

      // Update local state with the latest data from the database
      if (updatedField?.appearance_settings) {
        const dbSettings = normalizeAppearanceSettings(updatedField.appearance_settings);
        setSettings(dbSettings);
      }
    } catch (error) {
      console.error("Error saving appearance settings to database:", error);
      toast({
        title: "Error saving settings to database",
        description: "There was a problem saving your appearance settings to the database",
        variant: "destructive"
      });
    } finally {
      setIsSavingToDb(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeSubtab} onValueChange={setActiveSubtab}>
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="uiVariants">UI Variants</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="customCSS">Custom CSS</TabsTrigger>
        </TabsList>

        {activeSubtab !== "customCSS" && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Preview</h3>
              <FieldPreview
                fieldType={fieldType}
                settings={settings}
                previewState={previewState}
                isDarkMode={isDarkMode}
                onPreviewStateChange={setPreviewState}
                onDarkModeChange={(isDark) => {
                  setIsDarkMode(isDark);
                  updateSettings({ isDarkMode: isDark });
                }}
              />
            </CardContent>
          </Card>
        )}

        <TabsContent value="uiVariants">
          <UIVariantsTab
            settings={settings}
            onUpdate={updateSettings}
          />
        </TabsContent>

        <TabsContent value="colors">
          <ColorsTab
            settings={settings}
            onUpdate={updateSettings}
          />
        </TabsContent>

        <TabsContent value="theme">
          <ThemeTab
            settings={settings}
            onUpdate={updateSettings}
          />
        </TabsContent>

        <TabsContent value="customCSS">
          <CustomCSSTab
            settings={settings}
            onUpdate={updateSettings}
          />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button
          onClick={saveLocalSettings}
          disabled={isSaving}
          variant="outline"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Local Only"
          )}
        </Button>
        
        <Button
          onClick={saveToDatabaseSettings}
          disabled={isSavingToDb || !fieldId || !collectionId}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSavingToDb ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving to Database...
            </>
          ) : (
            <>
              <SaveIcon className="mr-2 h-4 w-4" />
              Save to Database
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default FieldAppearancePanel;
