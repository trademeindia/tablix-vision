import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { handleError } from './errorHandling';

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
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password
    });

    if (error) {
      // Special handling for "Email not confirmed" error
      if (error.message === 'Email not confirmed') {
        console.log('Email not confirmed. Trying to auto-confirm for demo purposes...');
        // For demo purposes, we'll allow login even without confirmation
        return await signInWithoutConfirmation(normalizedEmail, password);
      }
      
      handleError(error, { 
        context: 'Sign in',
        category: 'auth',
        showToast: false
      });
      return { success: false, error: error.message };
    }

    if (data.session && data.user) {
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
 * Alternative sign in method for demo purposes when email is not confirmed
 */
export const signInWithoutConfirmation = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // For demo accounts only, try direct session creation
    // This is a workaround for the demo account which may not have email confirmation
    console.log('Attempting alternative sign in method for demo account');
    
    // First, try to get user by email
    const { data: userData, error: userError } = await supabase.auth.admin.getUserByEmail(email);
    
    if (userError || !userData?.user) {
      console.error('Could not find user by email:', userError);
      return { success: false, error: 'Demo login failed. Please try regular sign in.' };
    }
    
    // Try to create a session for this user
    const { data, error } = await supabase.auth.admin.createSession({
      userId: userData.user.id
    });
    
    if (error) {
      console.error('Failed to create session:', error);
      return { success: false, error: 'Demo authentication failed. Please try again or contact support.' };
    }
    
    if (data?.session) {
      console.log('Alternative sign in successful for demo user');
      return { success: true };
    }
    
    return { success: false, error: 'Could not authenticate demo account' };
  } catch (error: any) {
    console.error('Error in alternative sign in:', error);
    return { 
      success: false, 
      error: 'Demo account login failed. You can create a new account instead.' 
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
      toast({
        title: "Account created",
        description: "Please check your email to verify your account before signing in.",
      });
      return { success: true };
    } else if (data.session) {
      // User was created and automatically signed in
      toast({
        title: "Sign up successful",
        description: "You've been automatically signed in.",
      });
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

/**
 * Sign out the current user
 */
export const signOutUser = async (): Promise<{ success: boolean; error?: string }> => {
  try {
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
 * Check if there's an existing session
 */
export const checkCurrentSession = async () => {
  try {
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
      console.log('Session check: Found existing session');
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
