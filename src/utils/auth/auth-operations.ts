
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
        console.log('Demo account sign-in with regular method failed, trying special flow...');
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
 * Special sign-in method for demo account
 */
export const signInDemoAccount = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('Attempting special sign-in flow for demo account');
    
    // Try signing up without email confirmation (for demo account only)
    // This will either create the account or fail silently if it exists
    try {
      await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: 'Demo User' }
        }
      });
      // Wait a moment for the account to register
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (e) {
      // Ignore errors here - the account might already exist
      console.log('Demo account signup attempt completed');
    }
    
    // Now try to sign in directly
    for (let attempt = 1; attempt <= 3; attempt++) {
      console.log(`Demo direct login attempt ${attempt}`);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (!error && data?.session) {
        console.log('Demo login successful!');
        return { success: true };
      }
      
      if (error) {
        console.log(`Demo login attempt ${attempt} failed:`, error.message);
        
        // Only wait between attempts, not after the last one
        if (attempt < 3) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    
    // If we couldn't log in after multiple attempts, return error
    return { 
      success: false, 
      error: 'Could not access demo account. Please try again or contact support.' 
    };
  } catch (error: any) {
    console.error('Error in demo account sign in:', error);
    return { 
      success: false, 
      error: 'Demo account login failed. Please try again.' 
    };
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
