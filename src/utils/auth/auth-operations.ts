
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '../errorHandling';
import { toast } from '@/hooks/use-toast';

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
    
    // For demo account, use enhanced flow
    const isDemo = normalizedEmail === 'demo@restaurant.com';
    
    if (isDemo) {
      console.log('Demo account detected, using enhanced sign-in flow');
      return await signInDemoAccount(normalizedEmail, password);
    }
    
    // Use the standard sign-in method
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password
    });

    if (error) {
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
    
    // Show toast to indicate process has started
    toast({
      title: 'Accessing Demo Account',
      description: 'Please wait while we authenticate you...'
    });
    
    // First, try to sign out to clear any existing session issues
    await supabase.auth.signOut();
    
    // Wait a moment for session cleanup
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Try direct login with demo credentials
    console.log('Attempting direct demo login');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (!error && data?.session) {
      console.log('Demo login successful');
      return { success: true };
    }
    
    console.log('Direct login failed, error:', error?.message);
    
    // If direct login failed, try account repair
    console.log('Attempting account repair...');
    await repairDemoAccount(email, password);
    
    // Wait a moment for account repair to take effect
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Try login again after repair
    console.log('Retrying login after account repair');
    const secondAttempt = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (!secondAttempt.error && secondAttempt.data?.session) {
      console.log('Login after account repair succeeded');
      return { success: true };
    }
    
    console.error('All demo login approaches failed');
    return { 
      success: false, 
      error: 'Unable to access demo account. Please try again later.' 
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
 * Helper function to repair/recreate demo account if needed
 */
const repairDemoAccount = async (email: string, password: string): Promise<void> => {
  try {
    console.log('Attempting to repair demo account');
    
    // Try signing up without email confirmation (for demo account only)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: 'Demo User' }
      }
    });
    
    if (error) {
      console.log('Account repair attempt gave error:', error.message);
      
      // If the error is about email already in use, try to force reset the password
      if (error.message.includes('email already registered')) {
        console.log('Email already registered, trying password reset flow');
        
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth`
        });
        
        if (resetError) {
          console.log('Password reset attempt failed:', resetError.message);
        }
      }
    } else if (data?.user) {
      console.log('Account repair/creation attempt succeeded');
    }
  } catch (e) {
    console.log('Exception during account repair attempt:', e);
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
        data: userData
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
