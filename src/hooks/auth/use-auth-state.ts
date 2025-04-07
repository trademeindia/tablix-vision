
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log('Initializing auth state...');
    setLoading(true);

    // IMPORTANT: Set up the auth state listener FIRST to avoid missing events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession?.user?.email);
        
        // Use setTimeout to prevent potential deadlocks with Supabase auth
        setTimeout(() => {
          // Always update both session and user
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          if (event === 'SIGNED_OUT') {
            console.log('User signed out');
            // Clear any cached user data or local storage values related to user state
            localStorage.removeItem('lastUserRole');
          } else if (event === 'SIGNED_IN') {
            console.log('User signed in:', currentSession?.user?.email);
          }
        }, 0);
      }
    );

    // THEN check for existing session
    const getInitialSession = async () => {
      try {
        console.log('Checking for existing session...');
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        console.log('Initial session check result:', currentSession ? 'Session found' : 'No session found');
        
        // Always update both session and user when session state changes
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          console.log('Initial session found for user:', currentSession.user.email);
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };
    
    getInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, session, loading };
}
