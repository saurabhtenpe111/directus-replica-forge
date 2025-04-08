
import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { useDarkMode } from '@/hooks/use-dark-mode';

export interface JSONEditorFieldProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
}

export function JSONEditorField({ value, onChange, height = "200px" }: JSONEditorFieldProps) {
  const { isDarkMode } = useDarkMode();
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    try {
      if (newValue.trim()) {
        JSON.parse(newValue);
      }
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const formatJson = () => {
    try {
      const parsedJson = JSON.parse(value);
      const formatted = JSON.stringify(parsedJson, null, 2);
      onChange(formatted);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  useEffect(() => {
    // Format the JSON on initial load
    if (value && value.trim()) {
      try {
        const parsedJson = JSON.parse(value);
        const formatted = JSON.stringify(parsedJson, null, 2);
        if (formatted !== value) {
          onChange(formatted);
        }
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      }
    }
  }, []);

  return (
    <div className="w-full">
      <Textarea
        value={value}
        onChange={handleChange}
        className={`font-mono text-sm ${error ? 'border-red-500' : ''} overflow-auto`}
        style={{ 
          height, 
          backgroundColor: isDarkMode ? '#1e1e1e' : '#f9fafb', 
          color: isDarkMode ? '#d4d4d4' : '#1f2937' 
        }}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}

export default JSONEditorField;
