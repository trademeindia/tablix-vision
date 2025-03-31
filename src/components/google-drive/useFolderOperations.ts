
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";

type StatusType = {
  message: string;
  type: 'success' | 'error' | 'loading' | null;
  details?: string;
};

export const useFolderOperations = (
  setStatus: (status: StatusType) => void,
  setShowSetupInstructions: (show: boolean) => void
) => {
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
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
  
  return {
    isCreatingFolder,
    folderId,
    folderIdInput,
    setFolderIdInput,
    driveUrl,
    createTestFolder,
    useFolderId
  };
};
