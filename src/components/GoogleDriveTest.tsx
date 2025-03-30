
import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, FolderPlus, Upload, LinkIcon } from 'lucide-react';
import Spinner from '@/components/ui/spinner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const GoogleDriveTest = () => {
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [isTestingUpload, setIsTestingUpload] = useState(false);
  const [status, setStatus] = useState<{
    message: string;
    type: 'success' | 'error' | 'loading' | null;
  }>({ message: '', type: null });
  const [folderId, setFolderId] = useState<string | null>(null);
  const [folderIdInput, setFolderIdInput] = useState('');
  const [driveUrl, setDriveUrl] = useState<string | null>(null);
  
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
        setDriveUrl(data.webViewLink);
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
            <AlertDescription>{status.message}</AlertDescription>
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
