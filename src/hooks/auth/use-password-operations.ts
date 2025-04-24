
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';

export const usePasswordOperations = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Reset password (send reset link)
  const resetPassword = async (email: string): Promise<{ error: any | null }> => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      
      return { error };
    } catch (error: any) {
      console.error('Error resetting password:', error.message);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update password (after reset)
  const updatePassword = async (password: string): Promise<{ error: any | null }> => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.updateUser({
        password,
      });
      
      return { error };
    } catch (error: any) {
      console.error('Error updating password:', error.message);
      return { error };
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
