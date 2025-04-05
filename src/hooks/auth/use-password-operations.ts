
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function usePasswordOperations() {
  const { toast } = useToast();

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      
      if (error) {
        console.error('Reset password error:', error.message);
        toast({
          title: 'Password Reset Failed',
          description: error.message || 'An error occurred while trying to reset your password.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Password Reset Email Sent',
          description: 'Check your email for a password reset link.',
        });
      }
      
      return { error };
    } catch (error) {
      console.error('Error resetting password:', error);
      toast({
        title: 'Password Reset Failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
      return { error };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        console.error('Update password error:', error.message);
        toast({
          title: 'Password Update Failed',
          description: error.message || 'An error occurred while trying to update your password.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Password Updated',
          description: 'Your password has been successfully updated.',
        });
      }
      
      return { error };
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        title: 'Password Update Failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
      return { error };
    }
  };

  return {
    resetPassword,
    updatePassword,
  };
}
