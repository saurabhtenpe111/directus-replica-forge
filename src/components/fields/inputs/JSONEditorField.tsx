
import React, { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';
import { useDarkMode } from '@/hooks/use-dark-mode';

export interface JSONEditorFieldProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
}

export function JSONEditorField({ value, onChange, height = "300px" }: JSONEditorFieldProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    if (!editorRef.current) return;

    // Initialize Monaco editor
    monacoRef.current = monaco.editor.create(editorRef.current, {
      value,
      language: 'json',
      automaticLayout: true,
      theme: isDarkMode ? 'vs-dark' : 'vs',
      minimap: { enabled: false },
      formatOnPaste: true,
      formatOnType: true,
      scrollBeyondLastLine: false,
      tabSize: 2,
      lineNumbers: 'on',
    });

    // Add change event listener
    const disposable = monacoRef.current.onDidChangeModelContent(() => {
      const newValue = monacoRef.current?.getValue() || '';
      onChange(newValue);
    });

    // Cleanup
    return () => {
      disposable.dispose();
      monacoRef.current?.dispose();
    };
  }, [editorRef, isDarkMode]);

  // Update editor value when prop changes
  useEffect(() => {
    if (monacoRef.current) {
      const currentValue = monacoRef.current.getValue();
      if (value !== currentValue) {
        monacoRef.current.setValue(value);
      }
    }
  }, [value]);

  return <div ref={editorRef} style={{ height, width: '100%', border: '1px solid #ccc', borderRadius: '4px' }} />;
}

export default JSONEditorField;
