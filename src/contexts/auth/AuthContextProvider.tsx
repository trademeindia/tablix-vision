
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { checkCurrentSession } from '@/utils/auth/session-management';
import { signInWithEmail } from '@/utils/auth/sign-in';
import { signUpWithEmail } from '@/utils/auth/sign-up';
import { signOutUser } from '@/utils/auth/session-management';
import { handleError } from '@/utils/errorHandling';
import AuthContext from './useAuthContext';
import { AuthProviderProps } from './types';
import { toast } from '@/hooks/use-toast';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authInitialized, setAuthInitialized] = useState<boolean>(false);
  const [sessionCheckCount, setSessionCheckCount] = useState<number>(0);
  const authStateChangeHandler = useRef<((event: string, session: Session | null) => void) | null>(null);
  const authInitializationTimeout = useRef<NodeJS.Timeout | null>(null);

  // Handle auth state changes
  const handleAuthChange = useCallback((event: string, currentSession: Session | null) => {
    console.log('Auth state changed:', event, 'Session:', currentSession?.user?.email ?? 'No user');
    
    if (currentSession) {
      setSession(currentSession);
      setUser(currentSession.user);
      
      // Show toast for login success if not silent event
      if (event === 'SIGNED_IN') {
        toast({
          title: 'Signed in successfully',
          description: `Welcome ${currentSession.user.email?.split('@')[0] || 'back'}!`,
          variant: 'default'
        });
      }
    } else {
      setSession(null);
      setUser(null);
      
      // Show toast for logout if not silent event
      if (event === 'SIGNED_OUT') {
        toast({
          title: 'Signed out',
          description: 'You have been signed out successfully',
          variant: 'default'
        });
      }
    }
    
    setIsLoading(false);
    // Set auth as initialized when auth changes are detected
    setAuthInitialized(true);
  }, []);

  // Clear resources on component unmount
  useEffect(() => {
    return () => {
      if (authInitializationTimeout.current) {
        clearTimeout(authInitializationTimeout.current);
      }
    };
  }, []);

  // Set up auth state listener and check for existing session
  useEffect(() => {
    console.log('Setting up auth state listener');
    let mounted = true;
    let initialCheckDone = false;
    
    // Mark that we're checking auth
    setIsLoading(true);
    
    // Store the handler in ref to avoid recreating the subscription when it changes
    authStateChangeHandler.current = (event, currentSession) => {
      if (mounted) {
        handleAuthChange(event, currentSession);
      }
    };
    
    // 1. Set up the auth state listener FIRST (to catch any auth events during initialization)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        if (authStateChangeHandler.current) {
          authStateChangeHandler.current(event, currentSession);
        }
      }
    );

    // 2. Check for existing session immediately after setting up listener
    const checkInitialSession = async () => {
      try {
        if (initialCheckDone) return;
        
        const { data, error } = await supabase.auth.getSession();
        initialCheckDone = true;
        
        if (error) {
          handleError(error, { 
            context: 'Checking initial session',
            category: 'auth',
            showToast: false
          });
          if (mounted) {
            setIsLoading(false);
            setAuthInitialized(true);
          }
          return;
        }
        
        if (mounted) {
          if (data.session) {
            console.log('Found existing session for user:', data.session.user.email);
            setSession(data.session);
            setUser(data.session.user);
          } else {
            console.log('No existing session found');
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
    
    // Set a safety timeout to ensure authInitialized is set even if session check hangs
    authInitializationTimeout.current = setTimeout(() => {
      if (mounted && !authInitialized) {
        console.log('Safety timeout triggered for auth initialization');
        setAuthInitialized(true);
        setIsLoading(false);
      }
    }, 3000);
    
    return () => {
      mounted = false;
      if (authInitializationTimeout.current) {
        clearTimeout(authInitializationTimeout.current);
      }
      subscription.unsubscribe();
    };
  }, [handleAuthChange, authInitialized]);

  const checkSession = useCallback(async (): Promise<boolean> => {
    // Prevent excessive session checks
    if (sessionCheckCount > 3 && session === null) {
      console.log('Skipping redundant session check after 3 attempts');
      return false;
    }
    
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
  }, [sessionCheckCount, session]);

  const signIn = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const result = await signInWithEmail(email, password);
      
      if (result.success) {
        // Single session check after successful login
        await checkSession();
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
