
import { toast } from '@/hooks/use-toast';

/**
 * Applies UI variant settings to field database records
 * @param field - The field object to update
 * @param variant - The UI variant to apply
 * @returns The updated field object with the new UI variant
 */
export function applyUIVariantToField(field: any, variant: 'standard' | 'material' | 'pill' | 'borderless' | 'underlined'): any {
  if (!field) {
    console.error('Cannot apply UI variant to undefined field');
    return field;
  }
  
  console.log(`Applying UI variant ${variant} to field ${field.name || field.id}`);
  
  try {
    // Create settings structure if it doesn't exist
    const settings = field.settings || {};
    const appearance = settings.appearance || {};
    
    // Apply the UI variant to the appearance settings
    appearance.uiVariant = variant;
    
    // Update settings structure
    settings.appearance = appearance;
    
    // Update field with new settings
    return {
      ...field,
      settings
    };
  } catch (error) {
    console.error('Error applying UI variant to field:', error);
    return field;
  }
}

/**
 * Updates a field in the database with new appearance settings
 * @param field - The field object with updated appearance settings
 * @param updateFunction - The function to call to update the field in the database
 * @returns Promise resolving to the updated field
 */
export async function saveUIVariantSettings(field: any, updateFunction: (field: any) => Promise<any>): Promise<any> {
  try {
    console.log('Saving UI variant settings for field:', field);
    
    // Call the provided update function
    const updatedField = await updateFunction(field);
    
    // Show success toast
    toast({
      title: 'UI variant updated',
      description: `Field ${field.name || field.id} has been updated with new appearance settings.`
    });
    
    return updatedField;
  } catch (error) {
    console.error('Error saving UI variant settings:', error);
    
    // Show error toast
    toast({
      title: 'Error updating UI variant',
      description: 'Failed to save appearance settings. Please try again.',
      variant: 'destructive'
    });
    
    throw error;
  }
}
