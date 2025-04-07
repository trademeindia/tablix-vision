
import { useCallback } from 'react';
import { useAuthState } from './auth/use-auth-state';
import { supabase } from '@/integrations/supabase/client';

export const useSession = () => {
  const { user, session, loading, initialized } = useAuthState();

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      return await supabase.auth.signInWithPassword({ email, password });
    } catch (error) {
      return { error };
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    try {
      return await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
    } catch (error) {
      return { error };
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      return await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
    } catch (error) {
      return { error };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      return await supabase.auth.signOut();
    } catch (error) {
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
