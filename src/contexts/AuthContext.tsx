
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  session: Session | null;
  user: User | null;
  checkSession: () => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, userData?: any) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Set up auth state listener and check for existing session
  useEffect(() => {
    console.log('Setting up auth state listener');
    
    // 1. Set up the auth state listener FIRST (to catch any auth events during initialization)
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

    // 2. Check for existing session immediately after setting up listener
    const checkInitialSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking initial session:', error);
          return;
        }
        
        if (data.session) {
          console.log('Found existing session for user:', data.session.user.email);
          setSession(data.session);
          setUser(data.session.user);
        } else {
          console.log('No existing session found');
          setSession(null);
          setUser(null);
        }
      } catch (error) {
        console.error('Unexpected error checking initial session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkInitialSession();

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
      
      if (data.session) {
        console.log('Session check: Found existing session');
        setSession(data.session);
        setUser(data.session.user);
        return true;
      } else {
        console.log('Session check: No existing session found');
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
  };

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
        return { success: false, error: error.message };
      }

      // For development convenience - auto sign-in after signup
      if (data.user && !data.session) {
        toast({
          title: "Account created",
          description: "Please check your email to verify your account before signing in.",
        });
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

  // Provide auth context to children
  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isAuthenticated: !!session,
        session,
        user,
        checkSession,
        signIn,
        signUp,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook for using auth context in components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
