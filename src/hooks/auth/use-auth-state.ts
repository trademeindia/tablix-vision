
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log("Initializing auth state...");
    setLoading(true);

    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // If user logged out, clear localStorage
        if (event === 'SIGNED_OUT') {
          localStorage.removeItem('userRole');
          localStorage.removeItem('demoOverride');
        }
        
        // When user signs in or updates, we should persist their email for role lookup
        if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && currentSession?.user?.email) {
          localStorage.setItem('userEmail', currentSession.user.email);
        }
        
        setLoading(false);
      }
    );

    // Then check for existing session
    console.log("Checking for existing session...");
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      // If we have a user, preserve their email
      if (currentSession?.user?.email) {
        localStorage.setItem('userEmail', currentSession.user.email);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, session, loading };
}
