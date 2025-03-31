
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCredentialsCheck } from './useCredentialsCheck';
import { useFolderOperations } from './useFolderOperations';
import { useFileUpload } from './useFileUpload';
import LoadingState from './LoadingState';
import StatusAlert from './StatusAlert';
import ExistingFolderInput from './ExistingFolderInput';
import CreateFolderButton from './CreateFolderButton';
import TestUploadButton from './TestUploadButton';
import SetupInstructions from './SetupInstructions';

const GoogleDriveTest = () => {
  const { 
    status, 
    setStatus, 
    isCredentialsChecked, 
    showSetupInstructions, 
    setShowSetupInstructions 
  } = useCredentialsCheck();
  
  const {
    isCreatingFolder,
    folderId,
    folderIdInput,
    setFolderIdInput,
    driveUrl,
    createTestFolder,
    useFolderId
  } = useFolderOperations(setStatus, setShowSetupInstructions);
  
  const {
    isTestingUpload,
    testUpload
  } = useFileUpload(folderId, setStatus, setShowSetupInstructions);
  
  if (!isCredentialsChecked) {
    return <LoadingState />;
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
        <StatusAlert 
          message={status.message} 
          type={status.type} 
          details={status.details}
        />
        
        <div className="space-y-4">
          <ExistingFolderInput 
            folderIdInput={folderIdInput}
            setFolderIdInput={setFolderIdInput}
            useFolderId={useFolderId}
          />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-2 text-muted-foreground">OR</span>
            </div>
          </div>
          
          <CreateFolderButton 
            isCreatingFolder={isCreatingFolder}
            isTestingUpload={isTestingUpload}
            createTestFolder={createTestFolder}
            driveUrl={driveUrl}
          />
          
          <TestUploadButton 
            folderId={folderId}
            isTestingUpload={isTestingUpload}
            isCreatingFolder={isCreatingFolder}
            testUpload={testUpload}
          />
          
          <SetupInstructions 
            open={showSetupInstructions} 
            onOpenChange={setShowSetupInstructions} 
          />
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
