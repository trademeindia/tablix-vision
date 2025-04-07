
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    console.log('Initializing auth state...');
    setLoading(true);

    // Important: Set up the auth state listener FIRST to avoid missing events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event);
        
        // Use setTimeout to prevent potential deadlocks with Supabase auth
        setTimeout(() => {
          // Only update state if the session actually changed
          if (JSON.stringify(currentSession) !== JSON.stringify(session)) {
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
          }
          
          if (event === 'SIGNED_OUT') {
            console.log('User signed out');
            localStorage.removeItem('lastUserRole');
          } else if (event === 'SIGNED_IN') {
            console.log('User signed in:', currentSession?.user?.email);
            
            // If signing in with a demo account, ensure the role is set correctly
            const email = currentSession?.user?.email?.toLowerCase();
            if (email?.endsWith('@demo.com')) {
              const roleFromEmail = email.includes('owner') ? 'owner' :
                                   email.includes('chef') ? 'chef' :
                                   email.includes('waiter') ? 'waiter' :
                                   email.includes('staff') ? 'staff' : 'customer';
              
              console.log('Demo account detected, setting role:', roleFromEmail);
              localStorage.setItem('lastUserRole', roleFromEmail);
            }
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
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          console.log('Initial session found for user:', currentSession.user.email);
          
          // Check for demo account and ensure role is set
          const email = currentSession.user.email?.toLowerCase();
          if (email?.endsWith('@demo.com') && !localStorage.getItem('lastUserRole')) {
            const roleFromEmail = email.includes('owner') ? 'owner' :
                                 email.includes('chef') ? 'chef' :
                                 email.includes('waiter') ? 'waiter' :
                                 email.includes('staff') ? 'staff' : 'customer';
            
            console.log('Demo account detected at init, setting role:', roleFromEmail);
            localStorage.setItem('lastUserRole', roleFromEmail);
          }
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };
    
    getInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [session]);

  return { user, session, loading, initialized };
}
