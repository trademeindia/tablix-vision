
import React, { useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { signInWithEmail, signUpWithEmail, signOutUser, checkCurrentSession } from '@/utils/auth-utils';
import AuthContext from './auth/useAuthContext';
import { AuthProviderProps } from './auth/types';
import { handleError } from '@/utils/errorHandling';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Set up auth state listener and check for existing session
  useEffect(() => {
    console.log('Setting up auth state listener');
    let mounted = true;
    
    // 1. Set up the auth state listener FIRST (to catch any auth events during initialization)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event, 'Session:', currentSession?.user?.email ?? 'No user');
        
        if (!mounted) return;
        
        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
        } else {
          setSession(null);
          setUser(null);
        }
        
        // Only update loading state if the component is still mounted
        if (mounted) {
          setIsLoading(false);
        }
      }
    );

    // 2. Check for existing session immediately after setting up listener
    const checkInitialSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          handleError(error, { 
            context: 'Checking initial session',
            category: 'auth',
            showToast: false
          });
          if (mounted) setIsLoading(false);
          return;
        }
        
        if (data.session) {
          console.log('Found existing session for user:', data.session.user.email);
          if (mounted) {
            setSession(data.session);
            setUser(data.session.user);
          }
        } else {
          console.log('No existing session found');
          if (mounted) {
            setSession(null);
            setUser(null);
          }
        }
      } catch (error) {
        handleError(error, { 
          context: 'Unexpected error checking initial session',
          category: 'auth',
          showToast: false
        });
      } finally {
        // Only update loading state if the component is still mounted
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Run session check and cleanup subscription when component unmounts
    checkInitialSession();
    
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const checkSession = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { session: currentSession, error } = await checkCurrentSession();
      
      if (error) {
        handleError(error, { 
          context: 'Checking session',
          category: 'auth',
          showToast: false
        });
        return false;
      }
      
      if (currentSession) {
        setSession(currentSession);
        setUser(currentSession.user);
        return true;
      } else {
        setSession(null);
        setUser(null);
        return false;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    const result = await signInWithEmail(email, password);
    setIsLoading(false);
    return result;
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    setIsLoading(true);
    const result = await signUpWithEmail(email, password, userData);
    setIsLoading(false);
    return result;
  };

  const signOut = async (): Promise<void> => {
    setIsLoading(true);
    const { success } = await signOutUser();
    
    if (success) {
      setSession(null);
      setUser(null);
    }
    
    setIsLoading(false);
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

// Export the useAuth hook from useAuthContext
export { useAuth } from './auth/useAuthContext';
