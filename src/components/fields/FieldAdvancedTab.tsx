
import React, { useEffect, useState } from "react";
import { FieldAdvancedPanel } from "./FieldAdvancedPanel";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  FieldSettingsMiddleware 
} from "./middleware/FieldSettingsMiddleware";
import { 
  AdvancedSettingsMiddleware 
} from "./middleware/AdvancedSettingsMiddleware";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FieldAdvancedTabProps {
  fieldType: string | null;
  fieldId?: string;
  collectionId?: string;
  fieldData?: any;
  onUpdate: (data: any) => void;
}

export function FieldAdvancedTab({ 
  fieldType, 
  fieldId,
  collectionId,
  fieldData, 
  onUpdate 
}: FieldAdvancedTabProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("settings");

  useEffect(() => {
    console.log("[FieldAdvancedTab] Field data received:", fieldData);
  }, [fieldData]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <FieldSettingsMiddleware
      fieldType={fieldType}
      fieldId={fieldId}
      collectionId={collectionId}
      fieldData={fieldData}
      onUpdate={onUpdate}
    >
      <AdvancedSettingsMiddleware>
        {({ settings, updateSettings, saveToDatabase }) => (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="settings">Advanced Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="settings">
              <FieldAdvancedPanel
                fieldType={fieldType}
                initialData={settings}
                onSave={updateSettings}
                fieldId={fieldId}
                collectionId={collectionId}
                onSaveToDatabase={saveToDatabase}
              />
            </TabsContent>
          </Tabs>
        )}
      </AdvancedSettingsMiddleware>
    </FieldSettingsMiddleware>
  );
}

export default FieldAdvancedTab;
