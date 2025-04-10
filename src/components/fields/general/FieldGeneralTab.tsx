
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';
import { FieldGeneralSettings } from './FieldGeneralSettings';
import { GeneralSettingsMiddleware } from '../middleware/GeneralSettingsMiddleware';
import { FieldSettingsMiddleware } from '../middleware/FieldSettingsMiddleware';
import { toast } from '@/hooks/use-toast';

interface FieldGeneralTabProps {
  fieldType: string | null;
  fieldId?: string;
  collectionId?: string;
  fieldData?: any;
  fieldName?: string;
  fieldApiId?: string;
  onUpdate: (data: any) => void;
}

export function FieldGeneralTab({
  fieldType,
  fieldId,
  collectionId,
  fieldData,
  fieldName,
  fieldApiId,
  onUpdate
}: FieldGeneralTabProps) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("[FieldGeneralTab] Initialized with fieldData:", fieldData);
    console.log("[FieldGeneralTab] Field ID:", fieldId);
    console.log("[FieldGeneralTab] Collection ID:", collectionId);
  }, [fieldData, fieldId, collectionId]);

  return (
    <FieldSettingsMiddleware
      fieldType={fieldType}
      fieldId={fieldId}
      collectionId={collectionId}
      fieldData={fieldData}
      onUpdate={onUpdate}
    >
      <GeneralSettingsMiddleware>
        {({ settings, updateSettings, saveToDatabase, isSaving }) => {
          console.log("[FieldGeneralTab] Current settings:", settings);
          
          const handleSave = async () => {
            try {
              console.log("[FieldGeneralTab] Saving settings:", settings);
              await saveToDatabase(settings);
              console.log("[FieldGeneralTab] Settings saved successfully");
            } catch (error) {
              console.error("[FieldGeneralTab] Error saving settings:", error);
              toast({
                title: "Error saving settings",
                description: "An error occurred while saving the general settings",
                variant: "destructive"
              });
            }
          };
          
          return (
            <div className="space-y-6">
              <FieldGeneralSettings
                fieldType={fieldType}
                initialData={settings}
                onUpdate={updateSettings}
                fieldName={fieldName || fieldData?.name}
                fieldApiId={fieldApiId || fieldData?.apiId}
              />
              
              <div className="flex justify-end space-x-2">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save General Settings
                    </>
                  )}
                </Button>
              </div>
            </div>
          );
        }}
      </GeneralSettingsMiddleware>
    </FieldSettingsMiddleware>
  );
}

export default FieldGeneralTab;
