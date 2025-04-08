
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
}

export interface ValidationSettings {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  message?: string;
  min?: number;
  max?: number;
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

  return settings;
}

/**
 * Safely access a specific settings section
 * @param fieldData The field data object
 * @param section The settings section to access
 * @returns The settings section or empty object if not found
 */
export function getSettingsSection<T = any>(fieldData: any, section: keyof FieldSettings): T {
  const settings = getNormalizedFieldSettings(fieldData);
  return (settings[section] as T) || {} as T;
}

/**
 * Get validation settings from field data
 * @param fieldData The field data object
 * @returns ValidationSettings object
 */
export function getValidationSettings(fieldData: any): ValidationSettings {
  return getSettingsSection<ValidationSettings>(fieldData, 'validation');
}

/**
 * Get appearance settings from field data
 * @param fieldData The field data object
 * @returns AppearanceSettings object
 */
export function getAppearanceSettings(fieldData: any): AppearanceSettings {
  return getSettingsSection<AppearanceSettings>(fieldData, 'appearance');
}

/**
 * Get advanced settings from field data
 * @param fieldData The field data object
 * @returns AdvancedSettings object
 */
export function getAdvancedSettings(fieldData: any): AdvancedSettings {
  return getSettingsSection<AdvancedSettings>(fieldData, 'advanced');
}

/**
 * Get UI options from field data
 * @param fieldData The field data object
 * @returns UIOptions object
 */
export function getUIOptions(fieldData: any): UIOptions {
  return getSettingsSection<UIOptions>(fieldData, 'ui_options');
}

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
export function createUpdatePayload(
  section: keyof FieldSettings,
  newSettings: any
): any {
  const payload: any = {
    settings: {}
  };
  
  payload.settings[section] = newSettings;
  
  return payload;
}

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
    settings: {}
  };

  // Add API ID if present
  if (fieldData.apiId || fieldData.api_id) {
    standardizedField.api_id = fieldData.apiId || fieldData.api_id;
  }

  // Add description if present
  if (fieldData.description) {
    standardizedField.description = fieldData.description;
  }

  // Collect all settings into the settings object
  const normalizedSettings = getNormalizedFieldSettings(fieldData);

  // Add each settings section to the standardized structure
  if (normalizedSettings.validation) {
    standardizedField.settings.validation = normalizedSettings.validation;
  }
  
  if (normalizedSettings.appearance) {
    standardizedField.settings.appearance = normalizedSettings.appearance;
  }
  
  if (normalizedSettings.advanced) {
    standardizedField.settings.advanced = normalizedSettings.advanced;
  }
  
  if (normalizedSettings.ui_options) {
    standardizedField.settings.ui_options = normalizedSettings.ui_options;
  }
  
  if (normalizedSettings.helpText) {
    standardizedField.settings.helpText = normalizedSettings.helpText;
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
  const settings = getNormalizedFieldSettings(field);
  
  return {
    id: field.id,
    name: field.name,
    type: field.type,
    apiId: field.api_id || field.apiId,
    required: field.required || false,
    helpText: settings.helpText || field.description || '',
    placeholder: settings.ui_options?.placeholder || `Enter ${field.name}...`,
    validation: settings.validation || {},
    appearance: settings.appearance || {},
    advanced: settings.advanced || {},
    ui_options: settings.ui_options || {},
    options: field.options || []
  };
}
