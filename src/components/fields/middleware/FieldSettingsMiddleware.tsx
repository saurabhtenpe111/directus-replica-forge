
import React, { createContext, useState, useEffect, useContext } from 'react';

// Define the context type
interface FieldSettingsContextType {
  fieldType: string | null;
  fieldId: string | undefined;
  collectionId: string | undefined;
  fieldData: any;
  updateFieldData: (data: any) => void;
}

// Create the context with default values
export const FieldSettingsContext = createContext<FieldSettingsContextType>({
  fieldType: null,
  fieldId: undefined,
  collectionId: undefined,
  fieldData: null,
  updateFieldData: () => {}
});

// Define the props for the middleware component
interface FieldSettingsMiddlewareProps {
  fieldType: string | null;
  fieldId?: string;
  collectionId?: string;
  fieldData?: any;
  onUpdate: (data: any) => void;
  children: React.ReactNode;
}

// Hook to use the context
export const useFieldSettings = () => useContext(FieldSettingsContext);

// Debug hook for field settings
export const useFieldSettingsDebug = () => {
  const context = useContext(FieldSettingsContext);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[FieldSettings] Context:', {
        fieldId: context.fieldId,
        collectionId: context.collectionId,
        fieldType: context.fieldType,
        fieldData: context.fieldData
      });
    }
  }, [context.fieldData, context.fieldId, context.collectionId, context.fieldType]);

  return null;
};

// The middleware component
export function FieldSettingsMiddleware({
  fieldType,
  fieldId,
  collectionId,
  fieldData,
  onUpdate,
  children
}: FieldSettingsMiddlewareProps) {
  // Local state to track field data
  const [localFieldData, setLocalFieldData] = useState(fieldData || {});

  // Update local field data when the prop changes
  useEffect(() => {
    if (fieldData) {
      setLocalFieldData(fieldData);
    }
  }, [fieldData]);

  // Function to update field data and notify the parent component
  const updateFieldData = (newData: any) => {
    // Merge with existing data
    const updatedData = { ...localFieldData, ...newData };
    
    // Update local state
    setLocalFieldData(updatedData);
    
    // Notify parent component
    onUpdate(updatedData);
    
    console.log('[FieldSettingsMiddleware] Field data updated:', updatedData);
  };

  // Create the context value
  const contextValue: FieldSettingsContextType = {
    fieldType,
    fieldId,
    collectionId,
    fieldData: localFieldData,
    updateFieldData
  };

  // Provider component
  return (
    <FieldSettingsContext.Provider value={contextValue}>
      {children}
    </FieldSettingsContext.Provider>
  );
}

export default FieldSettingsMiddleware;
