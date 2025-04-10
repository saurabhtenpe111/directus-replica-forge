
import { cloneDeep } from 'lodash';
import { GeneralSettings } from './fieldSettingsHelpers';

/**
 * Get field-type specific general settings schema
 */
export const getFieldTypeGeneralSettingsSchema = (fieldType: string | null): Partial<GeneralSettings> => {
  if (!fieldType) return {};
  
  // Define base settings available for all field types
  const baseSettings: Partial<GeneralSettings> = {
    description: '',
    helpText: '',
    placeholder: ''
  };
  
  // Add field-type specific settings
  switch (fieldType) {
    case 'text':
    case 'email':
    case 'url':
    case 'password':
      return {
        ...baseSettings,
        defaultValue: '',
        keyFilter: 'none',
      };
      
    case 'number':
      return {
        ...baseSettings,
        defaultValue: 0,
        min: undefined,
        max: undefined,
        prefix: '',
        suffix: '',
      };
      
    case 'textarea':
    case 'markdown':
    case 'wysiwyg':
      return {
        ...baseSettings,
        defaultValue: '',
        rows: 5,
        minHeight: '100px',
      };
      
    case 'date':
    case 'datetime':
      return {
        ...baseSettings,
        defaultValue: '',
        fieldTypeConfig: {
          minDate: undefined,
          maxDate: undefined,
          disabledDays: [],
        }
      };
      
    case 'select':
    case 'radio':
    case 'checkbox':
      return {
        ...baseSettings,
        defaultValue: undefined,
        fieldTypeConfig: {
          options: [],
          allowMultiple: fieldType === 'checkbox',
        }
      };
      
    case 'tags':
    case 'autocomplete':
      return {
        ...baseSettings,
        defaultValue: [],
        maxTags: 10,
      };
      
    case 'otp':
      return {
        ...baseSettings,
        length: 6,
      };
      
    case 'file':
    case 'image':
      return {
        ...baseSettings,
        fieldTypeConfig: {
          maxSize: 10, // MB
          allowedTypes: fieldType === 'image' ? ['image/jpeg', 'image/png', 'image/gif'] : undefined,
        }
      };
      
    case 'slider':
      return {
        ...baseSettings,
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 50,
      };
      
    case 'toggle':
    case 'switch':
      return {
        ...baseSettings,
        defaultValue: false,
      };
      
    default:
      return baseSettings;
  }
};

/**
 * Generate general settings for a new field based on field type
 */
export const generateInitialGeneralSettings = (
  fieldType: string | null,
  fieldName: string,
  apiId: string
): GeneralSettings => {
  const typeSpecificSettings = getFieldTypeGeneralSettingsSchema(fieldType);
  
  return {
    ...typeSpecificSettings,
    description: `${fieldName} field`,
    helpText: '',
    placeholder: `Enter ${fieldName}...`,
  };
};

/**
 * Update general settings with new values
 */
export const updateGeneralSettings = (
  currentSettings: GeneralSettings | undefined,
  newSettings: Partial<GeneralSettings>
): GeneralSettings => {
  const baseSettings = currentSettings ? cloneDeep(currentSettings) : {};
  
  // Merge the settings
  return {
    ...baseSettings,
    ...newSettings
  };
};

/**
 * Validate general settings for a specific field type
 * Returns null if valid, or error message if invalid
 */
export const validateGeneralSettings = (
  settings: GeneralSettings,
  fieldType: string | null
): string | null => {
  if (!fieldType) return null;
  
  switch (fieldType) {
    case 'number':
      // Validate number field settings
      if (
        settings.min !== undefined && 
        settings.max !== undefined && 
        settings.min > settings.max
      ) {
        return 'Minimum value cannot be greater than maximum value';
      }
      break;
      
    case 'otp':
      // Validate OTP settings
      if (settings.length && (settings.length < 4 || settings.length > 8)) {
        return 'OTP length must be between 4 and 8 characters';
      }
      break;
      
    case 'tags':
      // Validate tags settings
      if (settings.maxTags && settings.maxTags < 1) {
        return 'Maximum number of tags must be at least 1';
      }
      break;
  }
  
  return null;
};

/**
 * Extract general settings from form data
 * Useful when creating or updating fields from UI forms
 */
export const extractGeneralSettingsFromFormData = (formData: any, fieldType: string | null): GeneralSettings => {
  const settings: GeneralSettings = {
    description: formData.description || '',
    helpText: formData.helpText || '',
  };
  
  // Add common properties if present
  if (formData.placeholder !== undefined) settings.placeholder = formData.placeholder;
  if (formData.defaultValue !== undefined) settings.defaultValue = formData.defaultValue;
  
  // Add field-specific properties based on field type
  switch (fieldType) {
    case 'text':
    case 'email':
    case 'url':
    case 'password':
      if (formData.keyFilter) settings.keyFilter = formData.keyFilter;
      break;
      
    case 'number':
      if (formData.min !== undefined) settings.min = formData.min;
      if (formData.max !== undefined) settings.max = formData.max;
      if (formData.prefix) settings.prefix = formData.prefix;
      if (formData.suffix) settings.suffix = formData.suffix;
      break;
      
    case 'textarea':
    case 'markdown':
    case 'wysiwyg':
      if (formData.rows) settings.rows = formData.rows;
      if (formData.minHeight) settings.minHeight = formData.minHeight;
      break;
      
    case 'tags':
    case 'autocomplete':
      if (formData.maxTags) settings.maxTags = formData.maxTags;
      break;
      
    case 'otp':
      if (formData.length) settings.length = formData.length;
      break;
  }
  
  // Add hidden in forms property if present
  if (formData.hidden_in_forms !== undefined) {
    settings.hidden_in_forms = formData.hidden_in_forms;
  }
  
  return settings;
};
