
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";

type StatusType = {
  message: string;
  type: 'success' | 'error' | 'loading' | null;
  details?: string;
};

export const useFileUpload = (
  folderId: string | null,
  setStatus: (status: StatusType) => void,
  setShowSetupInstructions: (show: boolean) => void
) => {
  const [isTestingUpload, setIsTestingUpload] = useState(false);
  
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
  
  return {
    isTestingUpload,
    testUpload
  };
};
