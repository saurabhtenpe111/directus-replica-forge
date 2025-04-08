
import React from 'react';
import { FieldSettingsMiddleware, useFieldSettingsDebug } from './middleware/FieldSettingsMiddleware';
import { ValidationSettingsMiddleware } from './middleware/ValidationSettingsMiddleware';
import { AppearanceSettingsMiddleware } from './middleware/AppearanceSettingsMiddleware';
import { AdvancedSettingsMiddleware } from './middleware/AdvancedSettingsMiddleware';
import { FieldValidationPanel } from './validation/FieldValidationPanel';
import { FieldAppearancePanel } from './appearance/FieldAppearancePanel';
import { FieldAdvancedPanel } from './FieldAdvancedPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';

interface FieldSettingsManagerProps {
  fieldType: string | null;
  fieldId?: string;
  collectionId?: string;
  fieldData?: any;
  onUpdate: (data: any) => void;
}

/**
 * Comprehensive component for managing all field settings
 * Uses middleware components for each settings section
 */
export function FieldSettingsManager({
  fieldType,
  fieldId,
  collectionId,
  fieldData,
  onUpdate
}: FieldSettingsManagerProps) {
  const [activeTab, setActiveTab] = React.useState('validation');
  
  return (
    <FieldSettingsMiddleware
      fieldType={fieldType}
      fieldId={fieldId}
      collectionId={collectionId}
      fieldData={fieldData}
      onUpdate={onUpdate}
    >
      {/* Debug component to log settings changes */}
      <FieldSettingsDebugger />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="validation">Validation</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="validation">
          <ValidationSettingsMiddleware>
            {({ settings, updateSettings, saveToDatabase, isSaving }) => (
              <div className="space-y-6">
                <FieldValidationPanel
                  fieldType={fieldType}
                  initialData={settings}
                  onUpdate={updateSettings}
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
                        Save Validation
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </ValidationSettingsMiddleware>
        </TabsContent>
        
        <TabsContent value="appearance">
          <AppearanceSettingsMiddleware>
            {({ settings, updateSettings, saveToDatabase, isSaving }) => (
              <div className="space-y-6">
                <FieldAppearancePanel
                  fieldType={fieldType}
                  fieldId={fieldId}
                  collectionId={collectionId}
                  initialData={settings}
                  onSave={updateSettings}
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
                        Save Appearance
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </AppearanceSettingsMiddleware>
        </TabsContent>
        
        <TabsContent value="advanced">
          <AdvancedSettingsMiddleware>
            {({ settings, updateSettings, saveToDatabase, isSaving }) => (
              <div className="space-y-6">
                <FieldAdvancedPanel
                  fieldType={fieldType}
                  fieldId={fieldId}
                  collectionId={collectionId}
                  initialData={settings}
                  onSave={updateSettings}
                  onSaveToDatabase={saveToDatabase}
                  isSaving={isSaving}
                  isSavingToDb={isSaving}
                />
              </div>
            )}
          </AdvancedSettingsMiddleware>
        </TabsContent>
      </Tabs>
    </FieldSettingsMiddleware>
  );
}

/**
 * Debug component that uses our debug hook
 */
function FieldSettingsDebugger() {
  useFieldSettingsDebug();
  return null;
}

export default FieldSettingsManager;
