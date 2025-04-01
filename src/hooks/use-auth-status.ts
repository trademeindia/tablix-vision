
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

export type AuthStatus = {
  isLoading: boolean;
  isAuthenticated: boolean;
  session: Session | null;
  user: User | null;
  checkSession: () => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, userData?: any) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
};

export const useAuthStatus = (): AuthStatus => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);
      }
    );

    // Check for existing session
    checkSession();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkSession = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error checking session:', error);
        return false;
      }
      
      setSession(data.session);
      setUser(data.session?.user ?? null);
      return !!data.session;
    } catch (error) {
      console.error('Unexpected error in checkSession:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      if (!email || !password) {
        return { success: false, error: 'Email and password are required' };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Error signing in:', error);
        return { success: false, error: error.message };
      }

      setSession(data.session);
      setUser(data.user);
      return { success: true };
    } catch (error: any) {
      console.error('Unexpected error in signIn:', error);
      return { 
        success: false, 
        error: error?.message || 'An unexpected error occurred during sign in' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData?: any): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      if (!email || !password) {
        return { success: false, error: 'Email and password are required' };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: window.location.origin + '/auth'
        }
      });

      if (error) {
        console.error('Error signing up:', error);
        return { success: false, error: error.message };
      }

      // During development, auto sign-in after signup even if email verification is required
      if (data.user && !data.session) {
        console.log('User created but session is null - attempting direct signin');
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (!signInError && signInData.session) {
          setSession(signInData.session);
          setUser(signInData.user);
          toast({
            title: "Sign up successful",
            description: "You've been automatically signed in for development purposes.",
          });
          return { success: true };
        } else {
          toast({
            title: "Email verification required",
            description: "Please check your email to verify your account before signing in.",
            variant: "destructive"
          });
        }
      } else if (data.session) {
        // User was created and automatically signed in
        setSession(data.session);
        setUser(data.user);
        toast({
          title: "Sign up successful",
          description: "You've been automatically signed in.",
        });
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Unexpected error in signUp:', error);
      return { 
        success: false, 
        error: error?.message || 'An unexpected error occurred during sign up' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Sign out failed",
        description: "There was an error signing out. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    isAuthenticated: !!session,
    session,
    user,
    checkSession,
    signIn,
    signUp,
    signOut
  };
};
