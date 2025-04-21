
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';

export const useAuthOperations = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Sign in with email and password
  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Error signing in:', error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Sign up with email and password
  const signUp = async (email: string, password: string, name: string): Promise<void> => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Error signing up:', error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Sign in with Google OAuth
  const signInWithGoogle = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Error signing in with Google:', error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Sign out
  const signOut = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Error signing out:', error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    isLoading,
  };
};
