
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ThemeSettings from '@/components/settings/ThemeSettings';

const AppearancePage = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Appearance Settings</h1>
        <p className="text-slate-500">Customize your restaurant's appearance</p>
      </div>
      
      <Tabs defaultValue="theme" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
        </TabsList>
        
        <TabsContent value="theme">
          <ThemeSettings />
        </TabsContent>
        
        <TabsContent value="branding">
          <div className="p-8 text-center border rounded-md">
            <p className="text-muted-foreground">Branding settings will be available soon.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="layout">
          <div className="p-8 text-center border rounded-md">
            <p className="text-muted-foreground">Layout settings will be available soon.</p>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default AppearancePage;
