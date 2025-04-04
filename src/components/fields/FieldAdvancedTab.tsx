
import React from "react";
import { FieldAdvancedPanel } from "./FieldAdvancedPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FieldAppearancePanel } from "./appearance/FieldAppearancePanel";

interface FieldAdvancedTabProps {
  fieldType: string | null;
  fieldData?: any;
  onUpdate: (data: any) => void;
}

export function FieldAdvancedTab({ fieldType, fieldData, onUpdate }: FieldAdvancedTabProps) {
  const [activeTab, setActiveTab] = React.useState("advanced");

  // Handle saving advanced settings
  const handleSaveAdvancedSettings = (advancedSettings: any) => {
    // Merge with existing field data if needed
    const updatedData = {
      ...(fieldData || {}),
      advanced: advancedSettings
    };
    
    onUpdate(updatedData);
  };

  // Handle saving appearance settings
  const handleSaveAppearanceSettings = (appearanceSettings: any) => {
    // Merge with existing field data if needed
    const updatedData = {
      ...(fieldData || {}),
      appearance: appearanceSettings
    };
    
    onUpdate(updatedData);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="advanced" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-2 mb-6">
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="advanced">
          <FieldAdvancedPanel
            fieldType={fieldType}
            initialData={fieldData?.advanced}
            onSave={handleSaveAdvancedSettings}
          />
        </TabsContent>
        
        <TabsContent value="appearance">
          <FieldAppearancePanel
            fieldType={fieldType}
            initialData={fieldData?.appearance}
            onSave={handleSaveAppearanceSettings}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default FieldAdvancedTab;
