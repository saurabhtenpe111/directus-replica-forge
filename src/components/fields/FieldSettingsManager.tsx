
import React, { useState } from 'react';
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

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
  const [unsavedTabs, setUnsavedTabs] = useState<Record<string, boolean>>({
    validation: false,
    appearance: false,
    advanced: false
  });
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [pendingTabChange, setPendingTabChange] = useState<string | null>(null);
  
  // Function to mark a tab as having unsaved changes
  const markTabUnsaved = (tabName: string) => {
    setUnsavedTabs(prev => ({ ...prev, [tabName]: true }));
  };
  
  // Function to mark a tab as saved
  const markTabSaved = (tabName: string) => {
    setUnsavedTabs(prev => ({ ...prev, [tabName]: false }));
  };
  
  // Handle tab change with unsaved changes check
  const handleTabChange = (newTab: string) => {
    if (unsavedTabs[activeTab]) {
      setPendingTabChange(newTab);
      setShowUnsavedDialog(true);
    } else {
      setActiveTab(newTab);
    }
  };
  
  // Process tab change after user decision on unsaved changes
  const processTabChange = (save: boolean) => {
    setShowUnsavedDialog(false);
    
    if (save) {
      // Save logic will be handled by the middleware components
      // They will call markTabSaved when done
      // The tab change will happen after the save is complete
      // This is handled by the respective middleware components
    } else {
      // Discard changes and change tab
      if (pendingTabChange) {
        markTabSaved(activeTab); // Mark as saved since changes are discarded
        setActiveTab(pendingTabChange);
        setPendingTabChange(null);
      }
    }
  };

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
      
      {/* Unsaved changes dialog */}
      <AlertDialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes in the {activeTab} tab. Would you like to save before switching tabs?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingTabChange(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => processTabChange(false)} className="bg-destructive text-destructive-foreground">
              Discard Changes
            </AlertDialogAction>
            <AlertDialogAction onClick={() => processTabChange(true)} className="bg-primary">
              Save Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="validation" className="relative">
            Validation
            {unsavedTabs.validation && (
              <span className="absolute top-0 right-1 h-2 w-2 rounded-full bg-orange-500"></span>
            )}
          </TabsTrigger>
          <TabsTrigger value="appearance" className="relative">
            Appearance
            {unsavedTabs.appearance && (
              <span className="absolute top-0 right-1 h-2 w-2 rounded-full bg-orange-500"></span>
            )}
          </TabsTrigger>
          <TabsTrigger value="advanced" className="relative">
            Advanced
            {unsavedTabs.advanced && (
              <span className="absolute top-0 right-1 h-2 w-2 rounded-full bg-orange-500"></span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="validation">
          <ValidationSettingsMiddleware>
            {({ settings, updateSettings, saveToDatabase, isSaving }) => (
              <div className="space-y-6">
                <FieldValidationPanel
                  fieldType={fieldType}
                  initialData={settings}
                  onUpdate={(newSettings) => {
                    markTabUnsaved('validation');
                    updateSettings(newSettings);
                  }}
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    onClick={() => {
                      saveToDatabase(settings).then(() => {
                        markTabSaved('validation');
                        toast({
                          title: "Validation settings saved",
                          description: "Your validation settings have been saved successfully"
                        });
                        if (pendingTabChange) {
                          setActiveTab(pendingTabChange);
                          setPendingTabChange(null);
                        }
                      });
                    }}
                    disabled={isSaving || !unsavedTabs.validation}
                    variant={unsavedTabs.validation ? "default" : "outline"}
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
                  onSave={(newSettings) => {
                    markTabUnsaved('appearance');
                    updateSettings(newSettings);
                  }}
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    onClick={() => {
                      saveToDatabase(settings).then(() => {
                        markTabSaved('appearance');
                        toast({
                          title: "Appearance settings saved",
                          description: "Your appearance settings have been saved successfully"
                        });
                        if (pendingTabChange) {
                          setActiveTab(pendingTabChange);
                          setPendingTabChange(null);
                        }
                      });
                    }}
                    disabled={isSaving || !unsavedTabs.appearance}
                    variant={unsavedTabs.appearance ? "default" : "outline"}
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
                  onSave={(newSettings) => {
                    markTabUnsaved('advanced');
                    updateSettings(newSettings);
                  }}
                  onSaveToDatabase={() => {
                    saveToDatabase(settings).then(() => {
                      markTabSaved('advanced');
                      if (pendingTabChange) {
                        setActiveTab(pendingTabChange);
                        setPendingTabChange(null);
                      }
                    });
                  }}
                  isSaving={isSaving}
                  isSavingToDb={isSaving}
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    onClick={() => {
                      saveToDatabase(settings).then(() => {
                        markTabSaved('advanced');
                        toast({
                          title: "Advanced settings saved",
                          description: "Your advanced settings have been saved successfully"
                        });
                        if (pendingTabChange) {
                          setActiveTab(pendingTabChange);
                          setPendingTabChange(null);
                        }
                      });
                    }}
                    disabled={isSaving || !unsavedTabs.advanced}
                    variant={unsavedTabs.advanced ? "default" : "outline"}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Advanced
                      </>
                    )}
                  </Button>
                </div>
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
