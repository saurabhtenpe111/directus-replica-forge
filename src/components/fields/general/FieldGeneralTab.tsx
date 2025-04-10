
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';
import { FieldGeneralSettings } from './FieldGeneralSettings';
import { GeneralSettingsMiddleware } from '../middleware/GeneralSettingsMiddleware';
import { FieldSettingsMiddleware } from '../middleware/FieldSettingsMiddleware';

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

  return (
    <FieldSettingsMiddleware
      fieldType={fieldType}
      fieldId={fieldId}
      collectionId={collectionId}
      fieldData={fieldData}
      onUpdate={onUpdate}
    >
      <GeneralSettingsMiddleware>
        {({ settings, updateSettings, saveToDatabase, isSaving }) => (
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
                onClick={() => saveToDatabase(settings)}
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
        )}
      </GeneralSettingsMiddleware>
    </FieldSettingsMiddleware>
  );
}

export default FieldGeneralTab;
