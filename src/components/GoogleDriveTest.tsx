
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, FolderPlus, Upload, LinkIcon, Info, ExternalLink } from 'lucide-react';
import Spinner from '@/components/ui/spinner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const GoogleDriveTest = () => {
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [isTestingUpload, setIsTestingUpload] = useState(false);
  const [status, setStatus] = useState<{
    message: string;
    type: 'success' | 'error' | 'loading' | null;
    details?: string;
  }>({ message: '', type: null });
  const [folderId, setFolderId] = useState<string | null>(null);
  const [folderIdInput, setFolderIdInput] = useState('');
  const [driveUrl, setDriveUrl] = useState<string | null>(null);
  const [isCredentialsChecked, setIsCredentialsChecked] = useState(false);
  const [showSetupInstructions, setShowSetupInstructions] = useState(false);
  
  // Check if we have the required credentials (initial check)
  useEffect(() => {
    const checkCredentials = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('check-drive-credentials', {
          body: {}
        });
        
        if (error) {
          console.error('Error checking credentials:', error);
          setIsCredentialsChecked(true);
          return;
        }
        
        setIsCredentialsChecked(true);
        
        if (data && data.hasCredentials) {
          setStatus({
            message: 'Google Drive credentials are configured.',
            type: 'success'
          });
        } else {
          setStatus({
            message: 'Google Drive credentials need to be configured.',
            type: 'error',
            details: 'Please follow the setup instructions below.'
          });
          setShowSetupInstructions(true);
        }
      } catch (error) {
        console.error('Error checking credentials:', error);
        setIsCredentialsChecked(true);
        setStatus({
          message: 'Failed to check credentials.',
          type: 'error',
          details: error.message
        });
      }
    };
    
    checkCredentials();
  }, []);
  
  const createTestFolder = async () => {
    setIsCreatingFolder(true);
    setStatus({ message: 'Creating test folder in Google Drive...', type: 'loading' });
    
    try {
      const { data, error } = await supabase.functions.invoke('create-drive-folder', {
        body: { folderName: 'Restaurant Test Folder' },
      });
      
      if (error) throw new Error(error.message);
      
      if (data && data.folderId) {
        setFolderId(data.folderId);
        setStatus({
          message: `Folder created successfully! ID: ${data.folderId}`,
          type: 'success'
        });
        
        // Create Drive URL based on folder ID
        setDriveUrl(`https://drive.google.com/drive/folders/${data.folderId}`);
      } else {
        throw new Error('No folder ID returned');
      }
    } catch (error) {
      console.error('Error creating folder:', error);
      
      // Check for authentication errors
      const errorMessage = error.message || 'Unknown error';
      let details = '';
      
      if (errorMessage.includes('invalid_client') || errorMessage.includes('unauthorized_client')) {
        details = 'Google OAuth client credentials are invalid or missing. Please check your GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in Supabase secrets.';
        setShowSetupInstructions(true);
      } else if (errorMessage.includes('invalid_grant')) {
        details = 'Google refresh token is invalid or expired. Please follow the setup instructions to generate a new refresh token.';
        setShowSetupInstructions(true);
      } else {
        details = errorMessage;
      }
      
      setStatus({
        message: 'Failed to create folder',
        type: 'error',
        details
      });
    } finally {
      setIsCreatingFolder(false);
    }
  };
  
  const useFolderId = () => {
    if (!folderIdInput.trim()) {
      setStatus({
        message: 'Please enter a folder ID',
        type: 'error'
      });
      return;
    }
    
    setFolderId(folderIdInput);
    setDriveUrl(`https://drive.google.com/drive/folders/${folderIdInput}`);
    setStatus({
      message: `Using existing folder ID: ${folderIdInput}`,
      type: 'success'
    });
  };
  
  const testUpload = async () => {
    if (!folderId) {
      setStatus({
        message: 'Please create or specify a test folder first',
        type: 'error'
      });
      return;
    }
    
    setIsTestingUpload(true);
    setStatus({ message: 'Testing file upload to Google Drive...', type: 'loading' });
    
    // Create a simple text file for testing
    const testFile = new File(['This is a test file from Restaurant Management Dashboard'], 
      'test-file.txt', 
      { type: 'text/plain' }
    );
    
    const formData = new FormData();
    formData.append('file', testFile);
    formData.append('folderId', folderId);
    
    try {
      const { data, error } = await supabase.functions.invoke('test-drive-upload', {
        body: formData,
      });
      
      if (error) throw new Error(error.message);
      
      setStatus({
        message: `File uploaded successfully! File ID: ${data.fileId}`,
        type: 'success'
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      
      // Check for authentication errors
      const errorMessage = error.message || 'Unknown error';
      let details = '';
      
      if (errorMessage.includes('invalid_client') || errorMessage.includes('unauthorized_client')) {
        details = 'Google OAuth client credentials are invalid or missing. Please check your GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in Supabase secrets.';
        setShowSetupInstructions(true);
      } else if (errorMessage.includes('invalid_grant')) {
        details = 'Google refresh token is invalid or expired. Please follow the setup instructions to generate a new refresh token.';
        setShowSetupInstructions(true);
      } else {
        details = errorMessage;
      }
      
      setStatus({
        message: 'Failed to upload file',
        type: 'error',
        details
      });
    } finally {
      setIsTestingUpload(false);
    }
  };
  
  if (!isCredentialsChecked) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Google Drive Integration Test</CardTitle>
          <CardDescription>
            Checking Google Drive credentials...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Spinner size="lg" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Google Drive Integration Test</CardTitle>
        <CardDescription>
          Verify your Google Drive integration by creating a test folder or using an existing one
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status.message && (
          <Alert 
            variant={status.type === 'error' ? 'destructive' : 'default'} 
            className={`mb-4 ${status.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : ''}`}
          >
            {status.type === 'loading' && <Spinner size="sm" className="mr-2" />}
            {status.type === 'success' && <CheckCircle className="h-4 w-4 mr-2" />}
            {status.type === 'error' && <AlertCircle className="h-4 w-4 mr-2" />}
            <div>
              <AlertDescription>{status.message}</AlertDescription>
              {status.details && (
                <p className="text-xs mt-1 font-normal">{status.details}</p>
              )}
            </div>
          </Alert>
        )}
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="folderId">Existing Folder ID</Label>
              <div className="flex space-x-2">
                <Input 
                  id="folderId" 
                  placeholder="Paste Google Drive folder ID here" 
                  value={folderIdInput}
                  onChange={(e) => setFolderIdInput(e.target.value)}
                />
                <Button onClick={useFolderId} variant="outline">
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Use
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              If you already have a Google Drive folder, enter its ID above
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-2 text-muted-foreground">OR</span>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Create a new test folder in Google Drive
            </p>
            <Button 
              onClick={createTestFolder} 
              disabled={isCreatingFolder || isTestingUpload}
              className="w-full"
            >
              {isCreatingFolder ? <Spinner size="sm" className="mr-2" /> : <FolderPlus className="h-4 w-4 mr-2" />}
              Create Test Folder
            </Button>
          </div>
          
          {driveUrl && (
            <div className="pt-2">
              <a 
                href={driveUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline flex items-center"
              >
                <LinkIcon className="h-3 w-3 mr-1" />
                View folder in Google Drive
              </a>
            </div>
          )}
          
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Test file upload to the selected folder
            </p>
            <Button 
              onClick={testUpload} 
              disabled={isTestingUpload || isCreatingFolder || !folderId}
              className="w-full"
              variant={!folderId ? "outline" : "default"}
            >
              {isTestingUpload ? <Spinner size="sm" className="mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
              Test Upload
            </Button>
          </div>
          
          <Collapsible
            open={showSetupInstructions}
            onOpenChange={setShowSetupInstructions}
            className="w-full border rounded-md p-2"
          >
            <div className="flex items-center justify-between space-x-4 px-4">
              <h4 className="text-sm font-semibold">Google Drive Setup Instructions</h4>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Info className="h-4 w-4" />
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="px-4 pt-2 pb-4 text-sm">
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium mb-1">1. Create a Google Cloud Project</h5>
                  <ol className="list-decimal list-inside pl-2 text-xs space-y-1 text-muted-foreground">
                    <li>Go to the <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center inline-flex"><span>Google Cloud Console</span><ExternalLink className="h-3 w-3 ml-0.5" /></a></li>
                    <li>Create a new project or select an existing one</li>
                    <li>Enable the Google Drive API for your project</li>
                  </ol>
                </div>
                
                <div>
                  <h5 className="font-medium mb-1">2. Configure OAuth Consent Screen</h5>
                  <ol className="list-decimal list-inside pl-2 text-xs space-y-1 text-muted-foreground">
                    <li>Go to "OAuth consent screen" in the API & Services section</li>
                    <li>Select "External" for User Type</li>
                    <li>Fill in required fields (App name, email)</li>
                    <li>Add scopes: "../auth/drive" and "../auth/drive.file"</li>
                    <li>Add yourself as a test user</li>
                  </ol>
                </div>
                
                <div>
                  <h5 className="font-medium mb-1">3. Create OAuth Client ID</h5>
                  <ol className="list-decimal list-inside pl-2 text-xs space-y-1 text-muted-foreground">
                    <li>Go to "Credentials" in the API & Services section</li>
                    <li>Create OAuth client ID</li>
                    <li>Application type: Web application</li>
                    <li>Add redirect URI: <span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">https://developers.google.com/oauthplayground</span></li>
                    <li>Save your Client ID and Client Secret</li>
                  </ol>
                </div>
                
                <div>
                  <h5 className="font-medium mb-1">4. Generate Refresh Token</h5>
                  <ol className="list-decimal list-inside pl-2 text-xs space-y-1 text-muted-foreground">
                    <li>Go to <a href="https://developers.google.com/oauthplayground/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center inline-flex"><span>OAuth 2.0 Playground</span><ExternalLink className="h-3 w-3 ml-0.5" /></a></li>
                    <li>Click the settings icon (⚙️) in the top right</li>
                    <li>Check "Use your own OAuth credentials"</li>
                    <li>Enter your OAuth Client ID and Secret</li>
                    <li>Click "Close"</li>
                    <li>Select "Drive API v3" from the list and select both scopes</li>
                    <li>Click "Authorize APIs" and sign in with your Google account</li>
                    <li>Click "Exchange authorization code for tokens"</li>
                    <li>Save the Refresh Token</li>
                  </ol>
                </div>
                
                <div>
                  <h5 className="font-medium mb-1">5. Add Credentials to Supabase</h5>
                  <ol className="list-decimal list-inside pl-2 text-xs space-y-1 text-muted-foreground">
                    <li>Go to your Supabase project's "Settings" > "Edge Functions"</li>
                    <li>Add the following secrets:</li>
                    <li><span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">GOOGLE_CLIENT_ID</span>: Your OAuth Client ID</li>
                    <li><span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">GOOGLE_CLIENT_SECRET</span>: Your OAuth Client Secret</li>
                    <li><span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">GOOGLE_REFRESH_TOKEN</span>: The refresh token from step 4</li>
                    <li>Optionally add <span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">GOOGLE_API_KEY</span> if you have one</li>
                  </ol>
                </div>
                
                <div className="pt-2">
                  <a 
                    href="https://supabase.com/dashboard/project/qofbpjdbmisyxysfcyeb/settings/functions" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center text-xs"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Go to Supabase Edge Function Secrets
                  </a>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-xs text-muted-foreground text-center">
          This tool helps verify that your Google Drive API credentials are properly configured
        </p>
      </CardFooter>
    </Card>
  );
};

export default GoogleDriveTest;
