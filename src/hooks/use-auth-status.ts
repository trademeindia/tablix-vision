
import { useState, useEffect, useCallback } from 'react';
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

  // Setup auth state listener and check for existing session
  useEffect(() => {
    // Set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event, 'Session:', currentSession?.user?.email ?? 'No user');
        
        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
        } else {
          setSession(null);
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session immediately
    checkSession();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkSession = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error checking session:', error);
        return false;
      }
      
      if (data.session) {
        console.log('Found existing session for user:', data.session.user.email);
        setSession(data.session);
        setUser(data.session.user);
        return true;
      } else {
        console.log('No existing session found');
        setSession(null);
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error('Unexpected error in checkSession:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      // Validate inputs
      if (!email || !password) {
        return { success: false, error: 'Email and password are required' };
      }

      // Normalize email to handle potential typos or case issues
      const normalizedEmail = email.trim().toLowerCase();
      
      console.log(`Attempting to sign in with email: ${normalizedEmail}`);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password
      });

      if (error) {
        console.error('Error signing in:', error.message);
        
        // Provide more specific error messages
        if (error.message.includes('Invalid login')) {
          return { success: false, error: 'Invalid email or password. Please try again.' };
        }
        
        return { success: false, error: error.message };
      }

      if (data.session && data.user) {
        console.log('Sign in successful for user:', data.user.email);
        setSession(data.session);
        setUser(data.user);
        return { success: true };
      } else {
        console.error('Sign in returned without error but no session/user');
        return { success: false, error: 'Authentication failed. Please try again.' };
      }
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
      
      // Validate inputs
      if (!email || !password) {
        return { success: false, error: 'Email and password are required' };
      }

      // Normalize email
      const normalizedEmail = email.trim().toLowerCase();
      
      console.log(`Attempting to sign up with email: ${normalizedEmail}`);
      
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: userData,
          emailRedirectTo: window.location.origin + '/auth'
        }
      });

      if (error) {
        console.error('Error signing up:', error);
        
        // Provide specific error messages
        if (error.message.includes('already registered')) {
          return { success: false, error: 'This email is already registered. Please sign in instead.' };
        }
        
        return { success: false, error: error.message };
      }

      // For development convenience - auto sign-in after signup
      if (data.user && !data.session) {
        console.log('User created but session is null - attempting direct signin');
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password
        });
        
        if (!signInError && signInData.session) {
          setSession(signInData.session);
          setUser(signInData.user);
          toast({
            title: "Sign up successful",
            description: "You've been automatically signed in.",
          });
          return { success: true };
        } else {
          toast({
            title: "Account created",
            description: "Please check your email to verify your account before signing in.",
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
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
        toast({
          title: "Sign out failed",
          description: "There was an error signing out. Please try again.",
          variant: "destructive"
        });
      } else {
        setSession(null);
        setUser(null);
        console.log('User signed out successfully');
      }
    } catch (error) {
      console.error('Unexpected error signing out:', error);
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
