
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import GoogleDriveTest from '@/components/GoogleDriveTest';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const GoogleDriveTestPage = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Google Drive Integration</h1>
        <p className="text-slate-500">Test and configure your Google Drive integration</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GoogleDriveTest />
        
        <Card>
          <CardHeader>
            <CardTitle>Integration Guide</CardTitle>
            <CardDescription>
              How to set up Google Drive integration for your restaurant
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Step 1: Google Cloud Setup</h3>
              <ol className="list-decimal list-inside space-y-2 mt-2 text-sm text-muted-foreground">
                <li>Create a project in Google Cloud Console</li>
                <li>Enable the Google Drive API</li>
                <li>Create OAuth 2.0 credentials (Client ID and Client Secret)</li>
                <li>Add authorized redirect URIs for your application</li>
                <li>Create and save a refresh token</li>
              </ol>
            </div>
            
            <div>
              <h3 className="font-medium">Step 2: Configure Supabase</h3>
              <ol className="list-decimal list-inside space-y-2 mt-2 text-sm text-muted-foreground">
                <li>Add your Google API credentials to Supabase Edge Functions secrets</li>
                <li>Test the integration using the tool on this page</li>
                <li>Assign the created folder to your restaurant</li>
              </ol>
            </div>
            
            <div>
              <h3 className="font-medium">Step 3: Usage</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Once configured, 3D models uploaded through the menu management system will be 
                securely stored in your restaurant's Google Drive folder. The system will automatically 
                manage file uploads and maintain references to these files.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default GoogleDriveTestPage;
