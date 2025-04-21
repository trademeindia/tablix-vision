
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';

export const usePasswordOperations = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Reset password (send reset link)
  const resetPassword = async (email: string): Promise<void> => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Error resetting password:', error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update password (after reset)
  const updatePassword = async (password: string): Promise<void> => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.updateUser({
        password,
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Error updating password:', error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    resetPassword,
    updatePassword,
    isLoading,
  };
};
