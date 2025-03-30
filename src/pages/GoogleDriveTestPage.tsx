
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
          A Google Drive folder has been provided with ID: <span className="font-mono bg-white px-2 py-0.5 rounded border">1YeQFebTjgSQQNYt4Dq2CF_1b_Qu1lcqj</span>. 
          Use this ID in the test tool below to connect to your Google Drive.
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
              <h3 className="font-medium">Step 1: Verify Google Drive Connection</h3>
              <ol className="list-decimal list-inside space-y-2 mt-2 text-sm text-muted-foreground">
                <li>Use the test tool to verify connectivity with your Google Drive folder</li>
                <li>Test file upload to ensure proper permissions are set</li>
                <li>If folder creation fails but upload works with an existing folder ID, use the provided folder ID</li>
              </ol>
            </div>
            
            <div>
              <h3 className="font-medium">Step 2: Link to Your Restaurant</h3>
              <ol className="list-decimal list-inside space-y-2 mt-2 text-sm text-muted-foreground">
                <li>Once verified, update your restaurant record with the Google Drive folder ID</li>
                <li>All menu items will now store media in this folder</li>
              </ol>
            </div>
            
            <div>
              <h3 className="font-medium">Step 3: Troubleshooting</h3>
              <ul className="list-disc list-inside space-y-2 mt-2 text-sm text-muted-foreground">
                <li>If connection fails, check that Google API credentials are properly set in Supabase secrets</li>
                <li>Verify the folder has proper sharing permissions</li>
                <li>Check Edge Function logs for detailed error messages</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default GoogleDriveTestPage;
