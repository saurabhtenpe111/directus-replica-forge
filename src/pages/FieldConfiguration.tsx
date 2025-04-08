import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CollectionService, ValidationSettings, CollectionField } from '@/services/CollectionService';
import { FieldConfigPanel } from '@/components/fields/FieldConfigPanel';
import { MainLayout } from '@/components/layout/MainLayout';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { FieldTypeSelector } from '@/components/fields/FieldTypeSelector';
import { CollectionPreviewForm } from '@/components/collection-preview/CollectionPreviewForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { FieldList } from '@/components/fields/FieldList';
import {
  FileJson,
  Settings2,
  View,
  ArrowLeft,
  Eye,
  Save,
  Plus,
  Trash2,
  FileType,
  X
} from 'lucide-react';
import { FieldAppearancePanel } from '@/components/fields/appearance/FieldAppearancePanel';
import { FieldValidationPanel } from '@/components/fields/validation/FieldValidationPanel';
import { FieldAdvancedPanel } from '@/components/fields/FieldAdvancedPanel';
import { FieldLayoutPanel } from '@/components/fields/FieldLayoutPanel';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { JSONEditorField } from '@/components/fields/inputs/JSONEditorField';
import { ComponentSelector } from '@/components/fields/ComponentSelector';
import { 
  ValidationSettings as ValidationSettingsType,
  AppearanceSettings,
  AdvancedSettings,
  UIOptions
} from '@/utils/fieldSettingsHelpers';

// Define the Field type that will be used in this component
interface Field extends CollectionField {
  required: boolean;
  validation?: ValidationSettingsType;
  validation_settings?: ValidationSettingsType;
  appearance?: AppearanceSettings;
  appearance_settings?: AppearanceSettings;
  advanced?: AdvancedSettings;
  advanced_settings?: AdvancedSettings;
  ui_options?: UIOptions;
  ui_options_settings?: UIOptions;
  settings?: any;
}

const fieldTypes = {
  'Text & Numbers': [
    { id: 'text', name: 'Input', description: 'Single line text field' },
    { id: 'textarea', name: 'Textarea', description: 'Multi-line text field' },
    { id: 'number', name: 'Number', description: 'Numeric field with validation and formatting' },
    { id: 'password', name: 'Password', description: 'Secure password input with toggle' },
    { id: 'mask', name: 'Input Mask', description: 'Input with formatting mask' },
    { id: 'otp', name: 'Input OTP', description: 'One-time password input' },
    { id: 'autocomplete', name: 'Autocomplete Input', description: 'Input with suggestions' },
    { id: 'blockeditor', name: 'Block Editor', description: 'Rich text block editor' },
    { id: 'code', name: 'Code', description: 'Code snippet with syntax highlighting' },
    { id: 'wysiwyg', name: 'WYSIWYG', description: 'What you see is what you get editor' },
    { id: 'markdown', name: 'Markdown', description: 'Markdown text editor' },
    { id: 'tags', name: 'Tags', description: 'Input for multiple tags or keywords' },
    { id: 'list', name: 'List', description: 'Ordered or unordered list' },
    { id: 'slug', name: 'Slug', description: 'URL-friendly version of a name' },
    { id: 'seo', name: 'SEO Interface', description: 'Search engine optimization fields' },
    { id: 'translation', name: 'Translation', description: 'Multilingual content editor' },
  ],
  'Selection': [
    { id: 'select', name: 'Dropdown', description: 'Single selection dropdown' },
    { id: 'multiselect', name: 'Dropdown (Multiple)', description: 'Multiple selection dropdown' },
    { id: 'toggle', name: 'Toggle', description: 'On/Off toggle switch' },
    { id: 'boolean', name: 'Boolean', description: 'True/False toggle field' },
    { id: 'checkbox', name: 'Checkboxes', description: 'Multiple checkbox options' },
    { id: 'tristatecheck', name: 'Tri-State Checkbox', description: 'Checkbox with three states' },
    { id: 'multistatecheck', name: 'Multi-State Checkbox', description: 'Checkbox with multiple states' },
    { id: 'radio', name: 'Radio Buttons', description: 'Single selection radio options' },
    { id: 'selectbutton', name: 'Select Button', description: 'Button-style option selector' },
    { id: 'treeselect', name: 'Checkboxes (Tree)', description: 'Hierarchical checkbox selection' },
    { id: 'listbox', name: 'List Box', description: 'Scrollable selection list' },
    { id: 'mention', name: 'Mention Box', description: 'Text input with @mentions' },
    { id: 'date', name: 'Date/Calendar', description: 'Advanced date and time picker' },
    { id: 'color', name: 'Color', description: 'Color picker field' },
    { id: 'colorpicker', name: 'Color Picker', description: 'Advanced color selection tool' },
    { id: 'icon', name: 'Icon', description: 'Icon selection from a library' },
    { id: 'radioCards', name: 'Radio Cards', description: 'Visual card-based radio selection' },
    { id: 'checkboxCards', name: 'Checkbox Cards', description: 'Visual card-based checkbox selection' },
  ],
  'Relational': [
    { id: 'relation', name: 'Relation', description: 'Relationship to another collection' },
    { id: 'file', name: 'File', description: 'Single file upload field' },
    { id: 'image', name: 'Image', description: 'Image upload and preview' },
    { id: 'files', name: 'Files', description: 'Multiple file uploads' },
    { id: 'media', name: 'Media', description: 'Image, video, or document upload' },
    { id: 'manyToMany', name: 'Many to Many', description: 'Many-to-many relationship' },
    { id: 'oneToMany', name: 'One to Many', description: 'One-to-many relationship' },
    { id: 'manyToOne', name: 'Many to One', description: 'Many-to-one relationship' },
    { id: 'treeView', name: 'Tree View', description: 'Hierarchical tree relationship view' },
    { id: 'translations', name: 'Translations', description: 'Multi-language content fields' },
    { id: 'builder', name: 'Builder (M2A)', description: 'Advanced modular content builder' },
    { id: 'collectionItem', name: 'Collection Item Dropdown', description: 'Select items from another collection' },
  ],
  'Advanced': [
    { id: 'json', name: 'JSON', description: 'Structured JSON data field' },
    { id: 'map', name: 'Map', description: 'Geographic map selection' },
    { id: 'repeater', name: 'Repeater', description: 'Repeatable group of fields' },
    { id: 'inlineRepeater', name: 'Inline Repeater', description: 'Inline repeatable fields' },
    { id: 'rating', name: 'Rating', description: 'Star-based rating selector' },
    { id: 'slider', name: 'Slider', description: 'Range slider input' },
    { id: 'hash', name: 'Hash', description: 'Secure hash field with encryption' },
  ],
  'Presentation': [
    { id: 'divider', name: 'Divider', description: 'Visual separator between fields' },
    { id: 'buttonLinks', name: 'Button Links', description: 'Clickable button links' },
    { id: 'notice', name: 'Notice', description: 'Information or warning message' },
    { id: 'modal', name: 'Modal', description: 'Dialog popup trigger' },
    { id: 'builderButton', name: 'Builder (M2A) Button Group', description: 'Button group for builder interface' },
    { id: 'superHeader', name: 'Super Header', description: 'Prominent section header' },
  ],
  'Groups': [
    { id: 'accordion', name: 'Accordion', description: 'Collapsible content sections' },
    { id: 'detailGroup', name: 'Detail Group', description: 'Grouped details with labels' },
    { id: 'rawGroup', name: 'Raw Group', description: 'Custom group without styling' },
    { id: 'modal', name: 'Modal', description: 'Popup dialog content group' },
    { id: 'tabGroup', name: 'Tab Group', description: 'Content organized in tabs' },
  ],
};

const flatFieldTypes = Object.entries(fieldTypes).flatMap(([category, types]) =>
  types.map(type => ({ ...type, group: category }))
);

function FieldConfiguration() {
  // ... keep existing code (component implementation)
}

// Make sure to export the component as default
export default FieldConfiguration;
