
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

type CredentialsStatus = {
  message: string;
  type: 'success' | 'error' | 'loading' | null;
  details?: string;
};

export const useCredentialsCheck = () => {
  const [status, setStatus] = useState<CredentialsStatus>({ message: '', type: null });
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

  return {
    status,
    setStatus,
    isCredentialsChecked,
    showSetupInstructions,
    setShowSetupInstructions
  };
};
