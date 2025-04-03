
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';

const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Settings</h2>
        <p className="text-muted-foreground mt-1">Manage your project configuration</p>
      </div>
      
      <Tabs defaultValue="general">
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
                <CardDescription>
                  Basic information about your Directus project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="project-name">Project Name</Label>
                    <Input id="project-name" value="My Directus Project" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-url">Project URL</Label>
                    <Input id="project-url" value="https://mydirectus.example.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project-description">Project Description</Label>
                  <Input id="project-description" value="A headless CMS for managing content" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Branding</CardTitle>
                <CardDescription>
                  Customize the look and feel of your project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="project-logo">Project Logo</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-directus-blue rounded-md flex items-center justify-center text-white font-bold text-2xl">
                      D
                    </div>
                    <Button variant="outline">Upload Logo</Button>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="accent-color">Accent Color</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-directus-blue rounded-md"></div>
                    <Input id="accent-color" value="#546de5" className="w-32" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security options for your project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">Require 2FA for all admin users</p>
                  </div>
                  <Switch id="two-factor" />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">API Rate Limiting</h4>
                    <p className="text-sm text-muted-foreground">Limit API requests to prevent abuse</p>
                  </div>
                  <Switch id="rate-limit" defaultChecked />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="rate-limit-value">Maximum Requests per Minute</Label>
                  <Input id="rate-limit-value" type="number" value="60" className="w-32" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize the user interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Dark Mode</h4>
                    <p className="text-sm text-muted-foreground">Enable dark theme by default</p>
                  </div>
                  <Switch id="dark-mode" />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Dense UI</h4>
                    <p className="text-sm text-muted-foreground">Compact the interface to show more content</p>
                  </div>
                  <Switch id="dense-ui" />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="default-view">Default Collection View</Label>
                  <div className="flex gap-4">
                    <Button variant="outline" className="border-directus-blue text-directus-blue">
                      Table
                    </Button>
                    <Button variant="outline">
                      Cards
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                These settings are for advanced users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Cache API Responses</h4>
                    <p className="text-sm text-muted-foreground">Improve performance by caching API results</p>
                  </div>
                  <Switch id="cache-api" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Telemetry</h4>
                    <p className="text-sm text-muted-foreground">Send anonymous usage data to help improve the CMS</p>
                  </div>
                  <Switch id="telemetry" defaultChecked />
                </div>
                <Separator />
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
                  <h4 className="font-medium text-amber-800">Danger Zone</h4>
                  <p className="text-sm text-amber-700 mb-4">These actions cannot be undone</p>
                  <Button variant="destructive">Reset Project</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
