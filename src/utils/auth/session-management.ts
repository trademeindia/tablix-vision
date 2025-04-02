
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
 * Check if there's an existing session with error handling and retries
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
      
      // Validate the session has required properties
      if (!data.session.access_token) {
        console.warn('Session missing access token, may be invalid');
      }
      
      // Test a simple database query to verify the session is valid
      try {
        const { error: testError } = await supabase.from('menu_categories').select('count').limit(1);
        if (testError) {
          console.warn('Session appears invalid, test query failed:', testError.message);
          if (testError.message.includes('JWT')) {
            console.log('JWT issue detected, clearing session');
            await supabase.auth.signOut();
            return { session: null, error: new Error('Session token expired or invalid') };
          }
        }
      } catch (testErr) {
        console.warn('Error testing session validity:', testErr);
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
