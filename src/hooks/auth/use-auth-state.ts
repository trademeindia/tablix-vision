
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

/**
 * Hook to manage authentication state securely
 * Follows Supabase best practices for auth state management
 */
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

    // Critical: Set up the auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event);
        
        // Only update state with synchronous operations here
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
        
        // Use setTimeout for any async operations to prevent potential deadlocks
        if (currentSession?.user) {
          setTimeout(() => {
            // Any additional data fetching after auth state change
            console.log('Fetching additional user data after auth change');
          }, 0);
        }
      }
    );

    // THEN check for existing session
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
      // Clean up subscription when component unmounts
      subscription.unsubscribe();
    };
  }, []);

  return { user, session, loading };
}
