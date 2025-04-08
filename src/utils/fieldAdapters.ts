
import { 
  getNormalizedFieldSettings, 
  prepareFieldForPreview,
  standardizeFieldForDatabase
} from './fieldSettingsHelpers';

export function adaptCollectionFormData(values: any): any {
  const adaptedFields = values.fields.map((field: any) => {
    // Use our helper to standardize the field structure for database
    return standardizeFieldForDatabase(field);
  });

  return {
    name: values.name,
    api_id: values.apiId,
    description: values.description,
    status: values.status,
    fields: adaptedFields,
  };
}

export function adaptNumberFieldSettings(settings: any): any {
  // Use helper functions for cleaner and more standardized access
  const adaptedSettings: any = {};

  // Only include settings that are defined
  Object.entries(settings).forEach(([key, value]) => {
    if (value !== undefined) {
      adaptedSettings[key] = value;
    }
  });

  return adaptedSettings;
}

export function adaptFieldsForPreview(fields: any[]): any[] {
  console.log('[fieldAdapters] Raw fields data received for preview:', 
    JSON.stringify(fields, null, 2));

  return fields.map(field => {
    // Use our helper to prepare the field for preview
    return prepareFieldForPreview(field);
  });
}
