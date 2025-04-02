
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '../errorHandling';

/**
 * Sign in a user with email and password
 */
export const signInWithEmail = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // Validate inputs
    if (!email || !password) {
      return { success: false, error: 'Email and password are required' };
    }

    // Normalize email to handle potential typos or case issues
    const normalizedEmail = email.trim().toLowerCase();
    
    console.log(`Attempting to sign in with email: ${normalizedEmail}`);
    
    // For demo account, directly bypass email confirmation check
    const isDemo = normalizedEmail === 'demo@restaurant.com';
    
    // Use the standard sign-in method first
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password
    });

    if (error) {
      // For demo account, try a special direct login flow if there's an error
      if (isDemo) {
        console.log('Demo account sign-in with regular method failed, trying enhanced demo flow...');
        return await signInDemoAccount(normalizedEmail, password);
      }
      
      handleError(error, { 
        context: 'Sign in',
        category: 'auth',
        showToast: false
      });
      return { success: false, error: error.message };
    }

    if (data?.session && data?.user) {
      console.log('Sign in successful for user:', data.user.email);
      return { success: true };
    } else {
      console.error('Sign in returned without error but no session/user');
      return { success: false, error: 'Authentication failed. Please try again.' };
    }
  } catch (error: any) {
    handleError(error, { 
      context: 'Unexpected error in signIn',
      category: 'auth',
      showToast: false
    });
    return { 
      success: false, 
      error: error?.message || 'An unexpected error occurred during sign in' 
    };
  }
};

/**
 * Enhanced and more robust sign-in method for demo account
 */
export const signInDemoAccount = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('Starting enhanced demo account login flow');
    
    // First, try a direct login with existing credentials - this might work if the account exists
    const directLoginResult = await tryDirectLogin(email, password);
    if (directLoginResult.success) {
      console.log('Direct login for demo account succeeded');
      return directLoginResult;
    }
    
    console.log('Direct login failed, attempting account recovery...');
    
    // Try to create or "repair" the demo account if it doesn't exist or is in a bad state
    await repairDemoAccount(email, password);
    
    // Now try again with the repaired account
    const secondAttemptResult = await tryDirectLogin(email, password);
    if (secondAttemptResult.success) {
      console.log('Login after account repair succeeded');
      return secondAttemptResult;
    }
    
    // If we're still failing, try one final approach: reset the session entirely
    console.log('Login still failing after repair, trying final approach with session reset...');
    await supabase.auth.signOut();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const finalAttemptResult = await tryDirectLogin(email, password);
    if (finalAttemptResult.success) {
      console.log('Final login attempt succeeded after session reset');
      return finalAttemptResult;
    }
    
    // If we get here, all our attempts have failed
    console.error('All demo login approaches failed');
    return { 
      success: false, 
      error: 'Unable to access demo account after multiple attempts. Please try again later.' 
    };
  } catch (error: any) {
    console.error('Error in enhanced demo account sign in:', error);
    return { 
      success: false, 
      error: 'Demo account login failed. Please try again.' 
    };
  }
};

/**
 * Helper function to try direct login for demo account
 */
const tryDirectLogin = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // Try a simple sign in first
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (!error && data?.session) {
      return { success: true };
    }
    
    return { success: false, error: error?.message };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
};

/**
 * Helper function to repair/recreate demo account if needed
 */
const repairDemoAccount = async (email: string, password: string): Promise<void> => {
  try {
    // Try signing up without email confirmation (for demo account only)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: 'Demo User' },
        emailRedirectTo: window.location.origin + '/auth'
      }
    });
    
    if (error) {
      console.log('Account repair attempt gave error:', error.message);
    } else if (data?.user) {
      console.log('Account repair/creation attempt succeeded');
      // Wait a moment for the account to register in the system
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  } catch (e) {
    console.log('Exception during account repair attempt:', e);
    // We ignore errors here - we're just trying to ensure the account exists
  }
};

/**
 * Sign up a new user with email and password
 */
export const signUpWithEmail = async (email: string, password: string, userData?: any): Promise<{ success: boolean; error?: string }> => {
  try {
    // Validate inputs
    if (!email || !password) {
      return { success: false, error: 'Email and password are required' };
    }

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();
    
    console.log(`Attempting to sign up with email: ${normalizedEmail}`);
    
    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: userData,
        emailRedirectTo: window.location.origin + '/auth'
      }
    });

    if (error) {
      handleError(error, { 
        context: 'Sign up',
        category: 'auth',
        showToast: false
      });
      return { success: false, error: error.message };
    }

    // For development convenience - auto sign-in after signup
    if (data.user && !data.session) {
      return { success: true };
    } else if (data.session) {
      // User was created and automatically signed in
      return { success: true };
    } else {
      return { success: false, error: 'Something went wrong during signup. Please try again.' };
    }
  } catch (error: any) {
    handleError(error, { 
      context: 'Unexpected error in signUp',
      category: 'auth',
      showToast: false
    });
    return { 
      success: false, 
      error: error?.message || 'An unexpected error occurred during sign up' 
    };
  }
};
