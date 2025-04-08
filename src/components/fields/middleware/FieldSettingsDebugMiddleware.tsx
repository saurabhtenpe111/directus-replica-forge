
import { useEffect } from 'react';
import { useContext } from 'react';
import { FieldSettingsContext } from './FieldSettingsMiddleware';

export function useFieldSettingsDebug() {
  const context = useContext(FieldSettingsContext);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[FieldSettingsDebug] Current settings context:', {
        fieldId: context.fieldId,
        collectionId: context.collectionId,
        fieldType: context.fieldType,
        fieldData: context.fieldData
      });
    }
  }, [context.fieldData, context.fieldId, context.collectionId, context.fieldType]);

  return null;
}

export default function FieldSettingsDebugger() {
  useFieldSettingsDebug();
  return null;
}
