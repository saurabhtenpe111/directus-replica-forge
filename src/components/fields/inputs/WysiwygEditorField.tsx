
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { BlockEditorField } from './BlockEditorField';

// This is essentially a wrapper around the BlockEditorField
// In a real implementation, you might use a different rich text editor library
// or add more specific functionality for a WYSIWYG editor

interface WysiwygEditorFieldProps {
  id: string;
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  className?: string;
  minHeight?: string;
}

export function WysiwygEditorField({
  id,
  label,
  value = '',
  onChange,
  placeholder = 'Enter content...',
  required = false,
  helpText,
  className,
  minHeight = '200px'
}: WysiwygEditorFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <BlockEditorField
        id={id}
        label={label}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        helpText={helpText}
        minHeight={minHeight}
        className={className}
      />
    </div>
  );
}

export default WysiwygEditorField;
