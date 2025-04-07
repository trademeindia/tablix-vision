
import { useCallback } from 'react';
import { useAuthState } from './auth/use-auth-state';
import { supabase } from '@/integrations/supabase/client';

export const useSession = () => {
  const { user, session, loading, initialized } = useAuthState();

  const signIn = useCallback(async (email: string, password: string) => {
    console.log('Attempting sign in for:', email);
    try {
      // Clear any previous role data on new sign in
      localStorage.removeItem('lastUserRole');
      
      const result = await supabase.auth.signInWithPassword({ email, password });
      
      if (!result.error && result.data.user) {
        console.log('Sign in successful for:', email);
        
        // Check if this is a demo account and set role if needed
        if (email.endsWith('@demo.com') && !localStorage.getItem('lastUserRole')) {
          const roleFromEmail = email.includes('owner') ? 'owner' :
                               email.includes('chef') ? 'chef' :
                               email.includes('waiter') ? 'waiter' :
                               email.includes('staff') ? 'staff' : 'customer';
          
          console.log('Demo account detected, setting role:', roleFromEmail);
          localStorage.setItem('lastUserRole', roleFromEmail);
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error in signIn:', error);
      return { error };
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    try {
      // Clear any previous role data on sign up
      localStorage.removeItem('lastUserRole');
      
      // Determine if this looks like a demo account sign-up
      let role = 'customer';
      if (email.endsWith('@demo.com')) {
        role = email.includes('owner') ? 'owner' :
               email.includes('chef') ? 'chef' :
               email.includes('waiter') ? 'waiter' :
               email.includes('staff') ? 'staff' : 'customer';
        
        console.log('Demo account sign up detected, setting role:', role);
        localStorage.setItem('lastUserRole', role);
      }
      
      return await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role, // Include role in metadata
          },
        },
      });
    } catch (error) {
      return { error };
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      // Clear any previous role data on sign in
      localStorage.removeItem('lastUserRole');
      
      return await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
    } catch (error) {
      return { error };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      console.log('Signing out user');
      // Clear any role data before sign out
      localStorage.removeItem('lastUserRole');
      
      const result = await supabase.auth.signOut();
      console.log('Sign out result:', result.error ? 'Error' : 'Success');
      return result;
    } catch (error) {
      console.error('Error in signOut:', error);
      return { error };
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    try {
      return await supabase.auth.resetPasswordForEmail(email);
    } catch (error) {
      return { error };
    }
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    try {
      return await supabase.auth.updateUser({ password });
    } catch (error) {
      return { error };
    }
  }, []);

  return {
    user,
    session,
    loading,
    initialized,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword,
  };
};
