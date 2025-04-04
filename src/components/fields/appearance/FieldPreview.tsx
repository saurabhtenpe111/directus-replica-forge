
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";

interface FieldPreviewProps {
  fieldType: string | null;
  settings: any;
  previewState: 'default' | 'hover' | 'focus' | 'disabled' | 'error';
  isDarkMode: boolean;
  onPreviewStateChange: (state: 'default' | 'hover' | 'focus' | 'disabled' | 'error') => void;
  onDarkModeChange: (isDark: boolean) => void;
}

export function FieldPreview({
  fieldType,
  settings,
  previewState,
  isDarkMode,
  onPreviewStateChange,
  onDarkModeChange
}: FieldPreviewProps) {
  const getPreviewStyle = () => {
    const { colors, uiVariant, theme } = settings;
    
    // Base styles
    let containerStyle: React.CSSProperties = {
      padding: '16px',
      backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
      borderRadius: '8px',
      transition: 'all 0.2s ease'
    };
    
    let labelStyle: React.CSSProperties = {
      display: 'block',
      marginBottom: '8px',
      fontWeight: 500,
      color: isDarkMode ? '#e5e7eb' : colors?.label || '#64748b',
    };
    
    let inputStyle: React.CSSProperties = {
      width: '100%',
      padding: '10px 12px',
      borderRadius: '4px',
      backgroundColor: isDarkMode ? '#374151' : colors?.background || '#ffffff',
      color: isDarkMode ? '#f9fafb' : colors?.text || '#1e293b',
      transition: 'all 0.2s ease'
    };
    
    // Apply UI variant styles
    switch (uiVariant) {
      case 'standard':
        inputStyle = {
          ...inputStyle,
          border: `1px solid ${isDarkMode ? '#4b5563' : colors?.border || '#e2e8f0'}`,
        };
        break;
      case 'material':
        inputStyle = {
          ...inputStyle,
          border: 'none',
          borderBottom: `2px solid ${isDarkMode ? '#4b5563' : colors?.border || '#e2e8f0'}`,
          borderRadius: '0',
          paddingLeft: '0',
          paddingRight: '0',
        };
        break;
      case 'pill':
        inputStyle = {
          ...inputStyle,
          borderRadius: '9999px',
          border: `1px solid ${isDarkMode ? '#4b5563' : colors?.border || '#e2e8f0'}`,
        };
        break;
      case 'borderless':
        inputStyle = {
          ...inputStyle,
          border: 'none',
          backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(241, 245, 249, 0.7)',
        };
        break;
      case 'underlined':
        inputStyle = {
          ...inputStyle,
          border: 'none',
          borderBottom: `1px solid ${isDarkMode ? '#4b5563' : colors?.border || '#e2e8f0'}`,
          borderRadius: '0',
          paddingLeft: '0',
          paddingRight: '0',
          backgroundColor: 'transparent',
        };
        break;
    }
    
    // Apply theme styles
    switch (theme) {
      case 'classic':
        // Already handled in base styles
        break;
      case 'modern':
        inputStyle = {
          ...inputStyle,
          boxShadow: isDarkMode ? '0 1px 2px rgba(0, 0, 0, 0.6)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
        };
        break;
      case 'playful':
        labelStyle = {
          ...labelStyle,
          color: isDarkMode ? '#93c5fd' : '#3b82f6',
          fontWeight: 600,
        };
        inputStyle = {
          ...inputStyle,
          border: `2px solid ${isDarkMode ? '#93c5fd' : '#3b82f6'}`,
        };
        break;
      case 'minimal':
        labelStyle = {
          ...labelStyle,
          fontSize: '0.875rem',
        };
        inputStyle = {
          ...inputStyle,
          padding: '8px 10px',
        };
        break;
      case 'corporate':
        inputStyle = {
          ...inputStyle,
          border: `1px solid ${isDarkMode ? '#4b5563' : colors?.border || '#e2e8f0'}`,
          boxShadow: 'none',
        };
        break;
    }
    
    // Apply state styles
    switch (previewState) {
      case 'hover':
        inputStyle = {
          ...inputStyle,
          borderColor: isDarkMode ? '#6b7280' : '#cbd5e1',
          backgroundColor: isDarkMode 
            ? 'rgba(75, 85, 99, 0.7)' 
            : 'rgba(248, 250, 252, 0.7)',
        };
        break;
      case 'focus':
        inputStyle = {
          ...inputStyle,
          outline: 'none',
          borderColor: isDarkMode ? '#93c5fd' : colors?.focus || '#3b82f6',
          boxShadow: `0 0 0 1px ${isDarkMode ? 'rgba(147, 197, 253, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
        };
        break;
      case 'disabled':
        labelStyle = {
          ...labelStyle,
          opacity: 0.6,
        };
        inputStyle = {
          ...inputStyle,
          opacity: 0.6,
          cursor: 'not-allowed',
          backgroundColor: isDarkMode ? '#374151' : '#f1f5f9',
        };
        break;
      case 'error':
        labelStyle = {
          ...labelStyle,
          color: '#ef4444',
        };
        inputStyle = {
          ...inputStyle,
          borderColor: '#ef4444',
          boxShadow: '0 0 0 1px rgba(239, 68, 68, 0.3)',
        };
        break;
    }
    
    // Apply custom CSS if provided
    const customStyles = settings.customCSS ? 
      { style: { ...inputStyle, ...JSON.parse(`{${settings.customCSS}}`) } } : 
      { style: inputStyle };
    
    return { containerStyle, labelStyle, inputStyle: customStyles };
  };
  
  const { containerStyle, labelStyle, inputStyle } = getPreviewStyle();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex space-x-1 border rounded-md overflow-hidden">
          <Button
            type="button"
            variant={previewState === 'default' ? "secondary" : "ghost"}
            size="sm"
            className="rounded-none"
            onClick={() => onPreviewStateChange('default')}
          >
            Default
          </Button>
          <Button
            type="button"
            variant={previewState === 'hover' ? "secondary" : "ghost"}
            size="sm"
            className="rounded-none"
            onClick={() => onPreviewStateChange('hover')}
          >
            Hover
          </Button>
          <Button
            type="button"
            variant={previewState === 'focus' ? "secondary" : "ghost"}
            size="sm"
            className="rounded-none"
            onClick={() => onPreviewStateChange('focus')}
          >
            Focus
          </Button>
          <Button
            type="button"
            variant={previewState === 'disabled' ? "secondary" : "ghost"}
            size="sm"
            className="rounded-none"
            onClick={() => onPreviewStateChange('disabled')}
          >
            Disabled
          </Button>
          <Button
            type="button"
            variant={previewState === 'error' ? "secondary" : "ghost"}
            size="sm"
            className="rounded-none"
            onClick={() => onPreviewStateChange('error')}
          >
            Error
          </Button>
        </div>
        
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="w-8 h-8"
          onClick={() => onDarkModeChange(!isDarkMode)}
        >
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
      
      <div style={containerStyle} className="border rounded-md">
        <label style={labelStyle}>
          Field Label {previewState === 'error' && <span className="text-red-500">*</span>}
        </label>
        
        <input
          type="text"
          placeholder="Field placeholder"
          disabled={previewState === 'disabled'}
          className={cn(
            "border transition-all",
            settings.customCSS && "custom-field"
          )}
          {...inputStyle}
        />
        
        {previewState === 'error' && (
          <p className="text-red-500 text-sm mt-1">This field has an error</p>
        )}
      </div>
      
      {settings.customCSS && (
        <div className="p-2 bg-gray-50 dark:bg-gray-800 border rounded-md mt-4">
          <h4 className="text-xs font-medium mb-1">Applied Custom CSS:</h4>
          <pre className="text-xs overflow-auto p-2 bg-gray-100 dark:bg-gray-700 rounded">
            {settings.customCSS}
          </pre>
        </div>
      )}
    </div>
  );
}
