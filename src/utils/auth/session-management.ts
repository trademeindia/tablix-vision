
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '../errorHandling';

/**
 * Sign out the current user
 */
export const signOutUser = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('Attempting to sign out user');
    // First, let's make sure we clear any potential local storage issues
    try {
      localStorage.removeItem('supabase.auth.token');
    } catch (e) {
      // Ignore errors with localStorage
    }
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      handleError(error, { 
        context: 'Sign out',
        category: 'auth',
        showToast: true
      });
      return { success: false, error: error.message };
    }
    
    console.log('User signed out successfully');
    return { success: true };
  } catch (error: any) {
    handleError(error, { 
      context: 'Unexpected error signing out',
      category: 'auth',
      showToast: true
    });
    return { success: false, error: error?.message };
  }
};

/**
 * Check if there's an existing session with optimized performance
 */
export const checkCurrentSession = async () => {
  try {
    console.log('Checking for current session');
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      handleError(error, { 
        context: 'Checking session',
        category: 'auth',
        showToast: false
      });
      return { session: null, error };
    }
    
    if (data.session) {
      console.log('Session check: Found existing session for', data.session.user.email);
      
      // If this is a demo account, skip the test query to avoid potential RLS issues
      if (data.session.user.email === 'demo@restaurant.com') {
        return { session: data.session, error: null };
      }
      
      // Do a quick test query to ensure session is valid
      try {
        const { error: testError } = await supabase
          .from('profiles')
          .select('id')
          .limit(1);
        
        if (testError && (testError.code === 'PGRST301' || testError.message.includes('JWT'))) {
          console.log('Session invalid (JWT expired), clearing session');
          await supabase.auth.signOut();
          return { session: null, error: null };
        }
      } catch (testErr) {
        // If test query fails, still return the session
        console.warn('Session validation query failed, but continuing:', testErr);
      }
      
      return { session: data.session, error: null };
    } else {
      console.log('Session check: No existing session found');
      return { session: null, error: null };
    }
  } catch (error) {
    handleError(error, { 
      context: 'Unexpected error in checkSession',
      category: 'auth',
      showToast: false
    });
    return { session: null, error };
  }
};
