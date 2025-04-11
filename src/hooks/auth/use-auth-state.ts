
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // First, check localStorage for cached user to prevent initial flicker
    const cachedUserString = localStorage.getItem('cachedUser');
    if (cachedUserString) {
      try {
        const cachedUser = JSON.parse(cachedUserString);
        // Only use cached user data temporarily until real auth check completes
        setUser(cachedUser);
      } catch (e) {
        // Invalid cache, ignore
        localStorage.removeItem('cachedUser');
      }
    }

    // Set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('Auth state changed:', event);
        }
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Cache current user for faster future loads
        if (currentSession?.user) {
          // Store a simplified version to reduce storage size
          const userToCache = {
            id: currentSession.user.id,
            email: currentSession.user.email,
            user_metadata: currentSession.user.user_metadata
          };
          localStorage.setItem('cachedUser', JSON.stringify(userToCache));
        }
        
        // If user logged out, clear localStorage
        if (event === 'SIGNED_OUT') {
          localStorage.removeItem('userRole');
          localStorage.removeItem('demoOverride');
          localStorage.removeItem('cachedUser');
        }
        
        // When user signs in or updates, we should persist their email for role lookup
        if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && currentSession?.user?.email) {
          localStorage.setItem('userEmail', currentSession.user.email);
        }
        
        setLoading(false);
      }
    );

    // Then check for existing session
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
