export function adaptCollectionFormData(values: any): any {
  const adaptedFields = values.fields.map((field: any) => {
    let settings = field.settings || {};

    // Adapt number field settings
    if (field.type === 'number') {
      settings = adaptNumberFieldSettings(field.settings);
    }

    return {
      name: field.name,
      api_id: field.apiId,
      type: field.type,
      required: field.required || false,
      settings: settings,
    };
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
  const adaptedSettings: any = {};

  if (settings.min !== undefined) {
    adaptedSettings.min = settings.min;
  }
  if (settings.max !== undefined) {
    adaptedSettings.max = settings.max;
  }
  if (settings.step !== undefined) {
    adaptedSettings.step = settings.step;
  }
  if (settings.defaultValue !== undefined) {
    adaptedSettings.defaultValue = settings.defaultValue;
  }
  if (settings.prefix !== undefined) {
    adaptedSettings.prefix = settings.prefix;
  }
  if (settings.suffix !== undefined) {
    adaptedSettings.suffix = settings.suffix;
  }
  if (settings.locale !== undefined) {
    adaptedSettings.locale = settings.locale;
  }
  if (settings.currency !== undefined) {
    adaptedSettings.currency = settings.currency;
  }
  if (settings.showButtons !== undefined) {
    adaptedSettings.showButtons = settings.showButtons;
  }
  if (settings.buttonLayout !== undefined) {
    adaptedSettings.buttonLayout = settings.buttonLayout;
  }
  if (settings.floatLabel !== undefined) {
    adaptedSettings.floatLabel = settings.floatLabel;
  }
  if (settings.filled !== undefined) {
    adaptedSettings.filled = settings.filled;
  }
  if (settings.accessibilityLabel !== undefined) {
    adaptedSettings.accessibilityLabel = settings.accessibilityLabel;
  }

  return adaptedSettings;
}

export function adaptFieldsForPreview(fields: any[]): any[] {
  console.log('Raw fields data received for preview:', JSON.stringify(fields, null, 2));

  return fields.map(field => {
    const apiId = field.api_id || field.apiId || field.name?.toLowerCase().replace(/\s+/g, '_');

    // Extract ui_options from either direct property or from settings
    const ui_options = field.ui_options || (field.settings?.ui_options) || {};

    // Extract appearance settings from field or settings
    const appearance = field.appearance || (field.settings?.appearance) || {};
    console.log(`Extracted appearance settings for field ${field.name}:`, JSON.stringify(appearance, null, 2));

    // Ensure uiVariant is properly extracted
    if (appearance.uiVariant) {
      console.log(`UI Variant for field ${field.name}:`, appearance.uiVariant);
    } else {
      console.log(`No UI Variant found for field ${field.name}`);
    }

    // Get placeholder with detailed fallback logging
    let placeholder = null;
    if (ui_options.placeholder) {
      console.log(`Found placeholder in ui_options for ${field.name}:`, ui_options.placeholder);
      placeholder = ui_options.placeholder;
    } else if (field.placeholder) {
      console.log(`Found placeholder in field.placeholder for ${field.name}:`, field.placeholder);
      placeholder = field.placeholder;
    } else {
      placeholder = `Enter ${field.name}...`;
      console.log(`Using default placeholder for ${field.name}:`, placeholder);
    }

    // Debug logging
    console.log('Field data for preview:', {
      fieldName: field.name,
      fieldType: field.type,
      ui_options,
      settings: field.settings,
      appearance,
      placeholder
    });

    return {
      id: field.id,
      name: field.name,
      type: field.type,
      apiId: apiId,
      required: field.required || false,
      helpText: field.helpText || field.description,
      placeholder: placeholder,
      ui_options: ui_options,
      validation: field.validation || {},
      appearance: appearance,
      advanced: field.advanced || {},
      options: field.options || [],
      min: field.min !== undefined ? field.min : (field.validation?.min !== undefined ? field.validation.min : undefined),
      max: field.max !== undefined ? field.max : (field.validation?.max !== undefined ? field.validation.max : undefined),
      maxTags: field.maxTags || 10,
      mask: field.mask || field.advanced?.mask,
      keyFilter: field.keyFilter || field.validation?.keyFilter,
      length: field.length || 6,  // For OTP input
      rows: field.rows || 10,     // For textarea/markdown
      prefix: field.prefix || field.advanced?.prefix,
      suffix: field.suffix || field.advanced?.suffix,
    };
  });
}
