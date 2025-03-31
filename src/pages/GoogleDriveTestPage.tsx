
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import GoogleDriveTest from '@/components/GoogleDriveTest';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

const GoogleDriveTestPage = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Google Drive Integration</h1>
        <p className="text-slate-500">Test and configure your Google Drive integration</p>
      </div>
      
      <Alert className="mb-6 border-blue-200 bg-blue-50">
        <InfoIcon className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-700">
          Connect to Google Drive to store menu item media securely. Follow the setup instructions below if you encounter any connection issues.
        </AlertDescription>
      </Alert>
      
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
              <h3 className="font-medium">Step 1: Configure Google Cloud</h3>
              <ol className="list-decimal list-inside space-y-2 mt-2 text-sm text-muted-foreground">
                <li>Create a Google Cloud Project and enable the Drive API</li>
                <li>Set up OAuth consent screen (external) and credentials</li>
                <li>Generate a refresh token using OAuth 2.0 Playground</li>
              </ol>
            </div>
            
            <div>
              <h3 className="font-medium">Step 2: Add Secrets to Supabase</h3>
              <ol className="list-decimal list-inside space-y-2 mt-2 text-sm text-muted-foreground">
                <li>Go to Supabase Edge Function Settings</li>
                <li>Add GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN</li>
                <li>Make sure the credentials match those from your Google Cloud project</li>
              </ol>
            </div>
            
            <div>
              <h3 className="font-medium">Step 3: Verify Connection</h3>
              <ol className="list-decimal list-inside space-y-2 mt-2 text-sm text-muted-foreground">
                <li>Use the test tool to verify connectivity with Google Drive</li>
                <li>Create a test folder or use an existing folder ID</li>
                <li>Test file upload to ensure proper permissions</li>
              </ol>
            </div>
            
            <div>
              <h3 className="font-medium">Step 4: Link to Your Restaurant</h3>
              <ol className="list-decimal list-inside space-y-2 mt-2 text-sm text-muted-foreground">
                <li>Once verified, your restaurant will automatically use the created folder</li>
                <li>All menu items will store media in this Google Drive folder</li>
              </ol>
            </div>
            
            <div>
              <h3 className="font-medium">Common Issues</h3>
              <ul className="list-disc list-inside space-y-2 mt-2 text-sm text-muted-foreground">
                <li><span className="font-semibold">invalid_client error</span>: OAuth credentials are incorrect or missing</li>
                <li><span className="font-semibold">invalid_grant error</span>: Refresh token is expired or invalid</li>
                <li><span className="font-semibold">permission denied</span>: API not enabled or scopes not configured</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default GoogleDriveTestPage;
