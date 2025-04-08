
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

  // Handle validation settings
  if (fieldData.validation) {
    settings.validation = fieldData.validation;
  } else if (fieldData.settings?.validation) {
    settings.validation = fieldData.settings.validation;
  }

  // Handle appearance settings
  if (fieldData.appearance) {
    settings.appearance = fieldData.appearance;
  } else if (fieldData.settings?.appearance) {
    settings.appearance = fieldData.settings.appearance;
  }

  // Handle advanced settings
  if (fieldData.advanced) {
    settings.advanced = fieldData.advanced;
  } else if (fieldData.settings?.advanced) {
    settings.advanced = fieldData.settings.advanced;
  }

  // Handle UI options
  if (fieldData.ui_options) {
    settings.ui_options = fieldData.ui_options;
  } else if (fieldData.settings?.ui_options) {
    settings.ui_options = fieldData.settings.ui_options;
  }

  // Handle help text
  if (fieldData.helpText) {
    settings.helpText = fieldData.helpText;
  } else if (fieldData.settings?.helpText) {
    settings.helpText = fieldData.settings.helpText;
  }
  
  // Handle general settings
  if (fieldData.general) {
    settings.general = fieldData.general;
  } else if (fieldData.settings?.general) {
    settings.general = fieldData.settings.general;
  }

  return settings;
}

/**
 * New helper function to extract settings from the new column structure
 * @param fieldData The field data object
 * @returns Normalized field settings object
 */
export const getSettingsFromColumns = (fieldData: any): FieldSettings => {
  // Handle the new columns structure if available
  if (
    fieldData.validation_settings ||
    fieldData.appearance_settings ||
    fieldData.advanced_settings ||
    fieldData.ui_options_settings ||
    fieldData.general_settings
  ) {
    return {
      validation: fieldData.validation_settings || {},
      appearance: fieldData.appearance_settings || {},
      advanced: fieldData.advanced_settings || {},
      ui_options: fieldData.ui_options_settings || {},
      general: fieldData.general_settings || {},
      helpText: fieldData.general_settings?.helpText || fieldData.helpText || '',
    };
  }

  // Fall back to the legacy structure
  return getNormalizedFieldSettings(fieldData);
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
  } else if (fieldData?.settings?.general) {
    return fieldData.settings.general;
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
  } else if (fieldData?.settings?.validation) {
    return fieldData.settings.validation;
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
  } else if (fieldData?.settings?.appearance) {
    return fieldData.settings.appearance;
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
  } else if (fieldData?.settings?.advanced) {
    return fieldData.settings.advanced;
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
  } else if (fieldData?.settings?.ui_options) {
    return fieldData.settings.ui_options;
  }
  return {};
};

/**
 * Updates a field with new settings
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
  
  // Ensure settings object exists
  if (!updatedField.settings) {
    updatedField.settings = {};
  }
  
  // Update the specified section with deep merge
  if (!updatedField.settings[section]) {
    updatedField.settings[section] = {};
  }
  
  updatedField.settings[section] = merge({}, updatedField.settings[section], newSettings);
  
  // For consistency, also update top level if it exists there
  if (updatedField[section]) {
    updatedField[section] = merge({}, updatedField[section], newSettings);
  }
  
  return updatedField;
}

/**
 * Creates an update payload for the database that matches the expected structure
 * @param section The settings section being updated
 * @param newSettings The new settings for that section
 * @returns A properly structured update payload
 */
export const createColumnUpdatePayload = (
  section: keyof FieldSettings,
  settings: any
): Partial<FieldSettingsColumns & { settings?: any }> => {
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
      // For backward compatibility
      return createUpdatePayload(section, settings);
  }
};

/**
 * Create update payload for the new column structure
 * @param section The settings section being updated
 * @param newSettings The new settings for that section
 * @returns A properly structured update payload
 */
export const createUpdatePayload = (
  section: keyof FieldSettings,
  settings: any
): { settings: any } => {
  return {
    settings: {
      [section]: settings
    }
  };
};

/**
 * Standardizes the field structure for database operations
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
  
  // Add UI options
  if (fieldData.ui_options) {
    standardizedField.ui_options_settings = fieldData.ui_options;
  }
  
  // Add validation settings
  if (fieldData.validation) {
    standardizedField.validation_settings = fieldData.validation;
  }
  
  // Add appearance settings
  if (fieldData.appearance) {
    standardizedField.appearance_settings = fieldData.appearance;
  }
  
  // Add advanced settings
  if (fieldData.advanced) {
    standardizedField.advanced_settings = fieldData.advanced;
  }
  
  // Only add general settings if we have data
  if (Object.keys(general_settings).some(key => general_settings[key] !== undefined)) {
    standardizedField.general_settings = general_settings;
  }
  
  // Collect all settings into the legacy settings object for backward compatibility
  const settings: Record<string, any> = {};
  
  if (fieldData.validation) settings.validation = fieldData.validation;
  if (fieldData.appearance) settings.appearance = fieldData.appearance;
  if (fieldData.advanced) settings.advanced = fieldData.advanced;
  if (fieldData.ui_options) settings.ui_options = fieldData.ui_options;
  if (fieldData.helpText) settings.helpText = fieldData.helpText;
  if (Object.keys(general_settings).length > 0) settings.general = general_settings;
  
  // Only add settings if we have some data
  if (Object.keys(settings).length > 0) {
    standardizedField.settings = settings;
  }

  return standardizedField;
}

/**
 * Helper to modify nested field settings without mutation
 */
export function updateNestedSetting(
  field: any,
  section: keyof FieldSettings,
  path: string,
  value: any
): any {
  const updatedField = cloneDeep(field);
  
  // Ensure settings and section exist
  if (!updatedField.settings) {
    updatedField.settings = {};
  }
  
  if (!updatedField.settings[section]) {
    updatedField.settings[section] = {};
  }
  
  // Use lodash's set to update the nested path
  set(updatedField.settings[section], path, value);
  
  return updatedField;
}

/**
 * Safely get a nested setting value with a default fallback
 */
export function getNestedSetting(
  field: any,
  section: keyof FieldSettings,
  path: string,
  defaultValue: any = undefined
): any {
  if (!field || !field.settings || !field.settings[section]) {
    return defaultValue;
  }
  
  return get(field.settings[section], path, defaultValue);
}

/**
 * Convert a field object to a preview-ready format
 * with consistent structure for rendering
 */
export function prepareFieldForPreview(field: any): any {
  const settings = getSettingsFromColumns(field);
  const generalSettings = getGeneralSettings(field);
  
  return {
    id: field.id,
    name: field.name,
    type: field.type,
    apiId: field.api_id || field.apiId,
    required: field.required || false,
    helpText: generalSettings.helpText || settings.helpText || field.description || '',
    placeholder: settings.ui_options?.placeholder || `Enter ${field.name}...`,
    validation: settings.validation || {},
    appearance: settings.appearance || {},
    advanced: settings.advanced || {},
    ui_options: settings.ui_options || {},
    general: generalSettings || {},
    options: field.options || []
  };
}
