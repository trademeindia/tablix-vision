
import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, FolderPlus, Upload } from 'lucide-react';
import Spinner from '@/components/ui/spinner';

const GoogleDriveTest = () => {
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [isTestingUpload, setIsTestingUpload] = useState(false);
  const [status, setStatus] = useState<{
    message: string;
    type: 'success' | 'error' | 'loading' | null;
  }>({ message: '', type: null });
  const [folderId, setFolderId] = useState<string | null>(null);
  
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
      } else {
        throw new Error('No folder ID returned');
      }
    } catch (error) {
      console.error('Error creating folder:', error);
      setStatus({
        message: `Failed to create folder: ${error.message || 'Unknown error'}`,
        type: 'error'
      });
    } finally {
      setIsCreatingFolder(false);
    }
  };
  
  const testUpload = async () => {
    if (!folderId) {
      setStatus({
        message: 'Please create a test folder first',
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
      setStatus({
        message: `Failed to upload file: ${error.message || 'Unknown error'}`,
        type: 'error'
      });
    } finally {
      setIsTestingUpload(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Google Drive Integration Test</CardTitle>
        <CardDescription>
          Verify your Google Drive integration by creating a test folder and uploading a file
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
            <AlertDescription>{status.message}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Step 1: Create a test folder in Google Drive
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
          
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Step 2: Test file upload to the created folder
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
