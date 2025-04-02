import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { signInWithEmail, signUpWithEmail, signOutUser, checkCurrentSession } from '@/utils/auth';
import AuthContext from './auth/useAuthContext';
import { AuthProviderProps } from './auth/types';
import { handleError } from '@/utils/errorHandling';
import { toast } from '@/hooks/use-toast';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authInitialized, setAuthInitialized] = useState<boolean>(false);
  const [sessionCheckCount, setSessionCheckCount] = useState<number>(0);

  // Handle auth state changes
  const handleAuthChange = useCallback((event: string, currentSession: Session | null) => {
    console.log('Auth state changed:', event, 'Session:', currentSession?.user?.email ?? 'No user');
    
    if (currentSession) {
      setSession(currentSession);
      setUser(currentSession.user);
    } else {
      setSession(null);
      setUser(null);
    }
    
    setIsLoading(false);
  }, []);

  // Set up auth state listener and check for existing session
  useEffect(() => {
    console.log('Setting up auth state listener');
    let mounted = true;
    
    // Mark that we're checking auth
    setIsLoading(true);
    
    // 1. Set up the auth state listener FIRST (to catch any auth events during initialization)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        if (mounted) {
          handleAuthChange(event, currentSession);
        }
      }
    );

    // 2. Check for existing session immediately after setting up listener
    const checkInitialSession = async () => {
      try {
        // Try multiple times to ensure we get a valid session (helps with flaky connections)
        let retryCount = 0;
        const maxRetries = 3;
        let sessionData = null;
        let sessionError = null;
        
        // Keep trying until we get a session or reach max retries
        while (retryCount < maxRetries && !sessionData && mounted) {
          if (retryCount > 0) {
            console.log(`Retry attempt ${retryCount} checking for session...`);
            // Add increasing delay between retries
            await new Promise(r => setTimeout(r, retryCount * 500));
          }
          
          const { data, error } = await supabase.auth.getSession();
          if (error) {
            sessionError = error;
          } else if (data.session) {
            sessionData = data.session;
            break;
          }
          
          retryCount++;
        }
        
        if (sessionError && !sessionData && mounted) {
          handleError(sessionError, { 
            context: 'Checking initial session',
            category: 'auth',
            showToast: false
          });
          setIsLoading(false);
          setAuthInitialized(true);
          return;
        }
        
        if (mounted) {
          if (sessionData) {
            console.log('Found existing session for user:', sessionData.user.email);
            setSession(sessionData);
            setUser(sessionData.user);
          } else {
            console.log('No existing session found after', retryCount, 'attempts');
            setSession(null);
            setUser(null);
          }
          
          setIsLoading(false);
          setAuthInitialized(true);
        }
      } catch (error) {
        handleError(error, { 
          context: 'Unexpected error checking initial session',
          category: 'auth',
          showToast: false
        });
        if (mounted) {
          setIsLoading(false);
          setAuthInitialized(true);
        }
      }
    };

    // Run session check and cleanup subscription when component unmounts
    checkInitialSession();
    
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [handleAuthChange]);

  const checkSession = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setSessionCheckCount(prev => prev + 1);
      console.log(`Performing explicit session check, attempt: ${sessionCheckCount + 1}`);
      
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
        console.log('Session check found valid session for:', currentSession.user.email);
        setSession(currentSession);
        setUser(currentSession.user);
        return true;
      } else {
        console.log('Session check found no valid session');
        setSession(null);
        setUser(null);
        return false;
      }
    } finally {
      setIsLoading(false);
    }
  }, [sessionCheckCount]);

  const signIn = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const result = await signInWithEmail(email, password);
      
      if (result.success) {
        // Refresh the session immediately after successful login with potential retries
        let sessionFound = false;
        let attempts = 0;
        const maxAttempts = 3;
        
        while (!sessionFound && attempts < maxAttempts) {
          attempts++;
          console.log(`Post-login session check attempt ${attempts}`);
          
          // Add small delay between attempts (longer for later attempts)
          await new Promise(r => setTimeout(r, attempts * 300));
          
          sessionFound = await checkSession();
          if (sessionFound) break;
        }
        
        if (!sessionFound) {
          console.warn('Could not verify session after successful login');
        }
      }
      
      return result;
    } finally {
      setIsLoading(false);
    }
  }, [checkSession]);

  const signUp = useCallback(async (email: string, password: string, userData?: any) => {
    setIsLoading(true);
    const result = await signUpWithEmail(email, password, userData);
    setIsLoading(false);
    return result;
  }, []);

  const signOut = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    const { success } = await signOutUser();
    
    if (success) {
      setSession(null);
      setUser(null);
    }
    
    setIsLoading(false);
  }, []);

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
        signOut,
        authInitialized
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Export the useAuth hook from useAuthContext
export { useAuth } from './auth/useAuthContext';
