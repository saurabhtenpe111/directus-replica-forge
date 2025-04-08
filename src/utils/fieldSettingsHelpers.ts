/**
 * Helper utilities for accessing and updating field settings consistently
 * across the application.
 */

import { cloneDeep, get, set, merge } from 'lodash';

/**
 * Types for standard field settings sections
 */
export interface FieldSettings {
  validation?: ValidationSettings;
  appearance?: AppearanceSettings;
  advanced?: AdvancedSettings;
  ui_options?: UIOptions;
  helpText?: string;
  general?: GeneralSettings;
}

export interface GeneralSettings {
  description?: string;
  helpText?: string;
  defaultValue?: string | number | boolean | any[];
  keyFilter?: 'none' | 'letters' | 'numbers' | 'alphanumeric';
  min?: number;
  max?: number;
  length?: number;
  maxTags?: number;
  prefix?: string;
  suffix?: string;
  rows?: number;
  minHeight?: string;
  hidden_in_forms?: boolean;
  [key: string]: any;
}

export interface ValidationSettings {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  message?: string;
  min?: number;
  max?: number;
  email?: boolean;
  url?: boolean;
  unique?: boolean;
  [key: string]: any;
}

export interface AppearanceSettings {
  uiVariant?: "standard" | "material" | "pill" | "borderless" | "underlined";
  theme?: string;
  colors?: {
    border?: string;
    text?: string;
    background?: string;
    focus?: string;
    label?: string;
    [key: string]: string | undefined;
  };
  customCSS?: string;
  isDarkMode?: boolean;
  textAlign?: "left" | "center" | "right";
  labelPosition?: "top" | "left" | "right";
  labelWidth?: number;
  floatLabel?: boolean;
  filled?: boolean;
  showBorder?: boolean;
  showBackground?: boolean;
  roundedCorners?: "none" | "small" | "medium" | "large" | "full";
  fieldSize?: "small" | "medium" | "large";
  labelSize?: "small" | "medium" | "large";
  customClass?: string;
  responsive?: {
    mobile?: Partial<AppearanceSettings>;
    tablet?: Partial<AppearanceSettings>;
    desktop?: Partial<AppearanceSettings>;
  };
  [key: string]: any;
}

export interface AdvancedSettings {
  showButtons?: boolean;
  buttonLayout?: string;
  prefix?: string;
  suffix?: string;
  currency?: string;
  locale?: string;
  mask?: string;
  customData?: Record<string, any>;
  accessibilityLabel?: string;
  dataBind?: {
    field?: string;
    collection?: string;
  };
  conditional?: {
    show?: boolean;
    when?: string;
    equals?: string;
  };
  [key: string]: any;
}

export interface UIOptions {
  width?: number;
  placeholder?: string;
  help_text?: string;
  display_mode?: string;
  showCharCount?: boolean;
  hidden_in_forms?: boolean;
  [key: string]: any;
}

/**
 * Enhanced field settings structure with dedicated columns
 */
export interface FieldSettingsColumns {
  general_settings?: GeneralSettings;
  validation_settings?: ValidationSettings;
  appearance_settings?: AppearanceSettings;
  advanced_settings?: AdvancedSettings;
  ui_options_settings?: UIOptions;
}

/**
 * Get standardized field settings from any potential source/structure
 * @param fieldData The field data which may contain settings in different formats
 * @returns Normalized field settings object
 */
export function getNormalizedFieldSettings(fieldData: any): FieldSettings {
  if (!fieldData) return {};
  
  const settings: FieldSettings = {};

  // Handle validation settings - prioritize _settings columns
  if (fieldData.validation_settings) {
    settings.validation = fieldData.validation_settings;
  } else if (fieldData.validation) {
    settings.validation = fieldData.validation;
  }

  // Handle appearance settings - prioritize _settings columns
  if (fieldData.appearance_settings) {
    settings.appearance = fieldData.appearance_settings;
  } else if (fieldData.appearance) {
    settings.appearance = fieldData.appearance;
  }

  // Handle advanced settings - prioritize _settings columns
  if (fieldData.advanced_settings) {
    settings.advanced = fieldData.advanced_settings;
  } else if (fieldData.advanced) {
    settings.advanced = fieldData.advanced;
  }

  // Handle UI options - prioritize _settings columns
  if (fieldData.ui_options_settings) {
    settings.ui_options = fieldData.ui_options_settings;
  } else if (fieldData.ui_options) {
    settings.ui_options = fieldData.ui_options;
  }

  // Handle help text - prioritize general_settings
  if (fieldData.general_settings?.helpText) {
    settings.helpText = fieldData.general_settings.helpText;
  } else if (fieldData.helpText) {
    settings.helpText = fieldData.helpText;
  }
  
  // Handle general settings - prioritize general_settings column
  if (fieldData.general_settings) {
    settings.general = fieldData.general_settings;
  } else if (fieldData.general) {
    settings.general = fieldData.general;
  }

  return settings;
}

/**
 * Helper function to extract settings from the new column structure
 * @param fieldData The field data object
 * @returns Normalized field settings object
 */
export const getSettingsFromColumns = (fieldData: any): FieldSettings => {
  return {
    validation: fieldData.validation_settings || fieldData.validation || {},
    appearance: fieldData.appearance_settings || fieldData.appearance || {},
    advanced: fieldData.advanced_settings || fieldData.advanced || {},
    ui_options: fieldData.ui_options_settings || fieldData.ui_options || {},
    general: fieldData.general_settings || fieldData.general || {},
    helpText: fieldData.general_settings?.helpText || fieldData.helpText || '',
  };
};

/**
 * Safely access a specific settings section
 * @param fieldData The field data object
 * @param section The settings section to access
 * @returns The settings section or empty object if not found
 */
export function getSettingsSection<T = any>(fieldData: any, section: keyof FieldSettings): T {
  const settings = getSettingsFromColumns(fieldData);
  return (settings[section] as T) || {} as T;
}

/**
 * Get general settings from field data
 * @param fieldData The field data object
 * @returns GeneralSettings object
 */
export const getGeneralSettings = (fieldData: any): GeneralSettings => {
  if (fieldData?.general_settings) {
    return fieldData.general_settings;
  } else if (fieldData?.general) {
    return fieldData.general;
  }
  
  // Construct general settings from top-level properties if not found in dedicated locations
  const general: GeneralSettings = {};
  if (fieldData?.description) general.description = fieldData.description;
  if (fieldData?.helpText) general.helpText = fieldData.helpText;
  
  return general;
};

/**
 * Get validation settings from field data
 * @param fieldData The field data object
 * @returns ValidationSettings object
 */
export const getValidationSettings = (fieldData: any): ValidationSettings => {
  if (fieldData?.validation_settings) {
    return fieldData.validation_settings;
  } else if (fieldData?.validation) {
    return fieldData.validation;
  }
  return {};
};

/**
 * Get appearance settings from field data
 * @param fieldData The field data object
 * @returns AppearanceSettings object
 */
export const getAppearanceSettings = (fieldData: any): AppearanceSettings => {
  if (fieldData?.appearance_settings) {
    return fieldData.appearance_settings;
  } else if (fieldData?.appearance) {
    return fieldData.appearance;
  }
  return {};
};

/**
 * Get advanced settings from field data
 * @param fieldData The field data object
 * @returns AdvancedSettings object
 */
export const getAdvancedSettings = (fieldData: any): AdvancedSettings => {
  if (fieldData?.advanced_settings) {
    return fieldData.advanced_settings;
  } else if (fieldData?.advanced) {
    return fieldData.advanced;
  }
  return {};
};

/**
 * Get UI options from field data
 * @param fieldData The field data object
 * @returns UIOptions object
 */
export const getUIOptions = (fieldData: any): UIOptions => {
  if (fieldData?.ui_options_settings) {
    return fieldData.ui_options_settings;
  } else if (fieldData?.ui_options) {
    return fieldData.ui_options;
  }
  return {};
};

/**
 * Updates a field with new settings, using the dedicated columns
 * @param originalField The original field object
 * @param section The settings section to update
 * @param newSettings The new settings to merge
 * @returns A new field object with updated settings
 */
export function updateFieldSettings(
  originalField: any,
  section: keyof FieldSettings,
  newSettings: any
): any {
  // Deep clone to avoid mutations
  const updatedField = cloneDeep(originalField || {});
  
  // Update the appropriate column based on the section
  switch (section) {
    case 'validation':
      updatedField.validation_settings = merge({}, updatedField.validation_settings || {}, newSettings);
      updatedField.validation = updatedField.validation_settings; // Keep in sync
      break;
    case 'appearance':
      updatedField.appearance_settings = merge({}, updatedField.appearance_settings || {}, newSettings);
      updatedField.appearance = updatedField.appearance_settings; // Keep in sync
      break;
    case 'advanced':
      updatedField.advanced_settings = merge({}, updatedField.advanced_settings || {}, newSettings);
      updatedField.advanced = updatedField.advanced_settings; // Keep in sync
      break;
    case 'ui_options':
      updatedField.ui_options_settings = merge({}, updatedField.ui_options_settings || {}, newSettings);
      updatedField.ui_options = updatedField.ui_options_settings; // Keep in sync
      break;
    case 'general':
      updatedField.general_settings = merge({}, updatedField.general_settings || {}, newSettings);
      updatedField.general = updatedField.general_settings; // Keep in sync
      break;
    case 'helpText':
      if (!updatedField.general_settings) updatedField.general_settings = {};
      updatedField.general_settings.helpText = newSettings;
      break;
    default:
      // Fallback for any other fields
      if (!updatedField[section]) {
        updatedField[section] = {};
      }
      updatedField[section] = merge({}, updatedField[section], newSettings);
  }
  
  return updatedField;
}

/**
 * Creates an update payload for the database using the new column structure
 * @param section The settings section being updated
 * @param settings The new settings for that section
 * @returns A properly structured update payload
 */
export const createColumnUpdatePayload = (
  section: keyof FieldSettings,
  settings: any
): Partial<FieldSettingsColumns> => {
  // Map the section to the appropriate column
  switch (section) {
    case 'validation':
      return { validation_settings: settings };
    case 'appearance':
      return { appearance_settings: settings };
    case 'advanced':
      return { advanced_settings: settings };
    case 'ui_options':
      return { ui_options_settings: settings };
    case 'general':
      return { general_settings: settings };
    case 'helpText':
      // HelpText gets stored in general_settings
      return { general_settings: { helpText: settings } };
    default:
      // For any other fields, create an empty object
      return {};
  }
};

/**
 * Standardizes the field structure for database operations using the new column structure
 * @param fieldData The field data from the form
 * @returns A standardized field structure for database operation
 */
export function standardizeFieldForDatabase(fieldData: any): any {
  // Start with essential properties
  const standardizedField: any = {
    name: fieldData.name,
    type: fieldData.type,
    required: !!fieldData.required,
  };

  // Add API ID if present
  if (fieldData.apiId || fieldData.api_id) {
    standardizedField.api_id = fieldData.apiId || fieldData.api_id;
  }

  // Add description if present
  if (fieldData.description) {
    standardizedField.description = fieldData.description;
  }

  // Prepare the columns for the new structure
  const general_settings: Record<string, any> = {
    helpText: fieldData.helpText,
    description: fieldData.description
  };
  
  // Add field-specific properties to general settings
  if (fieldData.defaultValue !== undefined) general_settings.defaultValue = fieldData.defaultValue;
  if (fieldData.keyFilter) general_settings.keyFilter = fieldData.keyFilter;
  if (fieldData.min !== undefined) general_settings.min = fieldData.min;
  if (fieldData.max !== undefined) general_settings.max = fieldData.max;
  if (fieldData.length) general_settings.length = fieldData.length;
  if (fieldData.maxTags) general_settings.maxTags = fieldData.maxTags;
  if (fieldData.prefix) general_settings.prefix = fieldData.prefix;
  if (fieldData.suffix) general_settings.suffix = fieldData.suffix;
  if (fieldData.rows) general_settings.rows = fieldData.rows;
  if (fieldData.minHeight) general_settings.minHeight = fieldData.minHeight;
  
  // Add UI options - prefer ui_options_settings
  if (fieldData.ui_options_settings || fieldData.ui_options) {
    standardizedField.ui_options_settings = fieldData.ui_options_settings || fieldData.ui_options;
    standardizedField.ui_options = fieldData.ui_options_settings || fieldData.ui_options;
  }
  
  // Add validation settings - prefer validation_settings
  if (fieldData.validation_settings || fieldData.validation) {
    standardizedField.validation_settings = fieldData.validation_settings || fieldData.validation;
    standardizedField.validation = fieldData.validation_settings || fieldData.validation;
  }
  
  // Add appearance settings - prefer appearance_settings
  if (fieldData.appearance_settings || fieldData.appearance) {
    standardizedField.appearance_settings = fieldData.appearance_settings || fieldData.appearance;
    standardizedField.appearance = fieldData.appearance_settings || fieldData.appearance;
  }
  
  // Add advanced settings - prefer advanced_settings
  if (fieldData.advanced_settings || fieldData.advanced) {
    standardizedField.advanced_settings = fieldData.advanced_settings || fieldData.advanced;
    standardizedField.advanced = fieldData.advanced_settings || fieldData.advanced;
  }
  
  // Only add general settings if we have data
  if (Object.keys(general_settings).some(key => general_settings[key] !== undefined)) {
    standardizedField.general_settings = general_settings;
    standardizedField.general = general_settings;
  }
  
  return standardizedField;
}

/**
 * Helper to modify nested field settings without mutation, using dedicated columns
 */
export function updateNestedSetting(
  field: any,
  section: keyof FieldSettings,
  path: string,
  value: any
): any {
  const updatedField = cloneDeep(field);
  
  // Determine which column to update based on the section
  let columnName: string;
  switch (section) {
    case 'validation':
      columnName = 'validation_settings';
      break;
    case 'appearance':
      columnName = 'appearance_settings';
      break;
    case 'advanced':
      columnName = 'advanced_settings';
      break;
    case 'ui_options':
      columnName = 'ui_options_settings';
      break;
    case 'general':
    case 'helpText':
      columnName = 'general_settings';
      break;
    default:
      columnName = section;
  }
  
  // Ensure the column exists
  if (!updatedField[columnName]) {
    updatedField[columnName] = {};
  }
  
  // Special case for helpText in general settings
  if (section === 'helpText') {
    set(updatedField.general_settings, 'helpText', value);
  } else {
    // Use lodash's set to update the nested path
    set(updatedField[columnName], path, value);
  }
  
  // Keep the legacy field in sync
  updatedField[section] = updatedField[columnName];
  
  return updatedField;
}

/**
 * Safely get a nested setting value with a default fallback, prioritizing dedicated columns
 */
export function getNestedSetting(
  field: any,
  section: keyof FieldSettings,
  path: string,
  defaultValue: any = undefined
): any {
  // Determine which column to check based on the section
  let columnName: string;
  switch (section) {
    case 'validation':
      columnName = 'validation_settings';
      break;
    case 'appearance':
      columnName = 'appearance_settings';
      break;
    case 'advanced':
      columnName = 'advanced_settings';
      break;
    case 'ui_options':
      columnName = 'ui_options_settings';
      break;
    case 'general':
      columnName = 'general_settings';
      break;
    case 'helpText':
      return get(field.general_settings, 'helpText', defaultValue);
    default:
      columnName = section;
  }
  
  // Check the dedicated column first
  if (field && field[columnName]) {
    return get(field[columnName], path, defaultValue);
  }
  
  // Fall back to the legacy field if needed
  if (field && field[section]) {
    return get(field[section], path, defaultValue);
  }
  
  return defaultValue;
}

/**
 * Convert a field object to a preview-ready format
 * with consistent structure for rendering, prioritizing dedicated columns
 */
export function prepareFieldForPreview(field: any): any {
  return {
    id: field.id,
    name: field.name,
    type: field.type,
    apiId: field.api_id || field.apiId,
    required: field.required || false,
    helpText: field.general_settings?.helpText || field.helpText || field.description || '',
    placeholder: field.ui_options_settings?.placeholder || field.ui_options?.placeholder || `Enter ${field.name}...`,
    validation: field.validation_settings || field.validation || {},
    appearance: field.appearance_settings || field.appearance || {},
    advanced: field.advanced_settings || field.advanced || {},
    ui_options: field.ui_options_settings || field.ui_options || {},
    general: field.general_settings || field.general || {},
    options: field.options || []
  };
}
