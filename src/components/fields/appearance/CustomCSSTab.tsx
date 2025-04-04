
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface CustomCSSTabProps {
  settings: any;
  onUpdate: (settings: any) => void;
}

export function CustomCSSTab({ settings, onUpdate }: CustomCSSTabProps) {
  const [activeSubTab, setActiveSubTab] = useState('code');
  const [cssSnippets] = useState([
    { name: 'Focus Glow Effect', css: 'box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);' },
    { name: 'Smooth Hover Transition', css: 'transition: all 0.2s ease-in-out;' },
    { name: 'Material Design Ripple', css: 'position: relative; overflow: hidden;' },
    { name: 'Subtle Inner Shadow', css: 'box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);' },
    { name: 'Modern Border Radius', css: 'border-radius: 8px;' },
  ]);
  
  const updateCustomCSS = (css: string) => {
    onUpdate({ customCSS: css });
  };
  
  const addCssSnippet = (snippet: string) => {
    const currentCSS = settings.customCSS || '';
    const updatedCSS = currentCSS + (currentCSS ? '\n' : '') + snippet;
    updateCustomCSS(updatedCSS);
  };
  
  const formatCSS = () => {
    try {
      // Simple CSS formatter
      const formattedCSS = settings.customCSS
        .split(';')
        .filter((line: string) => line.trim() !== '')
        .map((line: string) => `${line.trim()};`)
        .join('\n');
      
      updateCustomCSS(formattedCSS);
    } catch (e) {
      console.error('Error formatting CSS:', e);
    }
  };
  
  const resetCSS = () => {
    updateCustomCSS('');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Custom CSS</h3>
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={formatCSS}
          >
            Format Code
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={resetCSS}
          >
            Reset to Default
          </Button>
        </div>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <div className="bg-gray-100 dark:bg-gray-800 p-3 border-b flex justify-between items-center">
          <Tabs defaultValue="code" value={activeSubTab} onValueChange={setActiveSubTab}>
            <TabsList>
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="visual">Visual</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="ghost"
              className="h-8 px-3"
            >
              Split View
            </Button>
            <Button 
              size="sm" 
              variant="ghost"
              className="h-8 px-3"
            >
              Full Screen
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <TabsContent value="code" className="m-0 border-r">
            <div className="p-4">
              <h4 className="font-medium mb-2">CSS Editor</h4>
              <div className="relative">
                <div className="absolute top-0 left-0 w-8 bg-gray-100 dark:bg-gray-800 h-full border-r flex flex-col">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="text-xs text-gray-500 text-right px-2 py-1">
                      {i + 1}
                    </div>
                  ))}
                </div>
                <textarea
                  className="font-mono text-sm w-full h-64 p-2 pl-10 bg-white dark:bg-gray-900 border-0 resize-none focus:outline-none focus:ring-0"
                  value={settings.customCSS || ''}
                  onChange={(e) => updateCustomCSS(e.target.value)}
                  placeholder=".custom-input {
  border-color: #0066cc;
  border-width: 2px;
  border-radius: 4px;
  padding: 8px 12px;
  background-color: #ffffff;
  color: #333333;
  font-size: 15px;
  font-family: 'Arial', sans-serif;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="visual" className="m-0">
            <div className="p-4">
              <h4 className="font-medium mb-4">Visual Property Editor</h4>
              
              <Tabs defaultValue="border">
                <TabsList className="w-full grid grid-cols-4 mb-4">
                  <TabsTrigger value="border">Border</TabsTrigger>
                  <TabsTrigger value="spacing">Spacing</TabsTrigger>
                  <TabsTrigger value="shadow">Shadow</TabsTrigger>
                  <TabsTrigger value="typography">Typography</TabsTrigger>
                </TabsList>
                
                <TabsContent value="border" className="space-y-4">
                  <div>
                    <Label>Border Width</Label>
                    <div className="grid grid-cols-4 gap-2 mt-1">
                      <Button variant="outline" size="sm" className="text-xs">0px</Button>
                      <Button variant="outline" size="sm" className="text-xs">1px</Button>
                      <Button variant="outline" size="sm" className="text-xs bg-blue-50">2px</Button>
                      <Button variant="outline" size="sm" className="text-xs">4px</Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Border Radius</Label>
                    <div className="grid grid-cols-5 gap-2 mt-1">
                      <Button variant="outline" size="sm" className="text-xs">0px</Button>
                      <Button variant="outline" size="sm" className="text-xs">2px</Button>
                      <Button variant="outline" size="sm" className="text-xs">4px</Button>
                      <Button variant="outline" size="sm" className="text-xs bg-blue-50">8px</Button>
                      <Button variant="outline" size="sm" className="text-xs">12px</Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Border Style</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                        <option>Solid</option>
                        <option>Dashed</option>
                        <option>Dotted</option>
                        <option>Double</option>
                        <option>None</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Border Color</Label>
                    <div className="flex gap-2 mt-1">
                      <div className="h-9 w-9 rounded-md border bg-blue-600" />
                      <Input value="#0066cc" className="font-mono" />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="mt-8 border-t pt-4">
                <h4 className="font-medium mb-2">Visualization</h4>
                <div className="border border-dashed rounded-md p-4 flex justify-center items-center">
                  <div className="relative w-32 h-12 flex-shrink-0">
                    <div className="absolute inset-0 flex items-center justify-center border-2 border-blue-600 rounded-md bg-white shadow-sm">
                      <span className="text-sm">CONTENT</span>
                    </div>
                    <div className="absolute -top-6 w-full text-center">
                      <span className="text-xs text-gray-500">0px</span>
                    </div>
                    <div className="absolute -bottom-6 w-full text-center">
                      <span className="text-xs text-gray-500">0px</span>
                    </div>
                    <div className="absolute -left-6 h-full flex items-center">
                      <span className="text-xs text-gray-500">8px</span>
                    </div>
                    <div className="absolute -right-6 h-full flex items-center">
                      <span className="text-xs text-gray-500">8px</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
        
        <div className="border-t p-4">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium mb-2">CSS Snippets</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {cssSnippets.map((snippet, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => addCssSnippet(snippet.css)}
                  >
                    {snippet.name}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs text-blue-600"
                >
                  + Save Current as Snippet
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Label htmlFor="auto-complete" className="text-xs">Auto-Complete</Label>
              <Switch id="auto-complete" />
            </div>
          </div>
          
          <div className="flex items-center text-xs mt-2 text-amber-500">
            <span className="mr-1">⚠️</span> Warning: Consider using a variable for consistent colors across the theme.
          </div>
        </div>
        
        <div className="border-t p-4 bg-gray-50 dark:bg-gray-800 flex justify-end space-x-2">
          <Button variant="outline">Validate</Button>
          <Button>Apply Changes</Button>
        </div>
      </div>
    </div>
  );
}
