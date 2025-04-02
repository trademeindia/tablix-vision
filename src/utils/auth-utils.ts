
import { supabase } from '@/integrations/supabase/client';
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
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password
    });

    if (error) {
      console.error('Error signing in:', error.message);
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
    console.error('Unexpected error in signIn:', error);
    return { 
      success: false, 
      error: error?.message || 'An unexpected error occurred during sign in' 
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
      console.error('Error signing up:', error);
      return { success: false, error: error.message };
    }

    // For development convenience - auto sign-in after signup
    if (data.user && !data.session) {
      toast({
        title: "Account created",
        description: "Please check your email to verify your account before signing in.",
      });
    } else if (data.session) {
      // User was created and automatically signed in
      toast({
        title: "Sign up successful",
        description: "You've been automatically signed in.",
      });
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Unexpected error in signUp:', error);
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
      console.error('Error signing out:', error);
      toast({
        title: "Sign out failed",
        description: "There was an error signing out. Please try again.",
        variant: "destructive"
      });
      return { success: false, error: error.message };
    }
    
    console.log('User signed out successfully');
    return { success: true };
  } catch (error: any) {
    console.error('Unexpected error signing out:', error);
    toast({
      title: "Sign out failed",
      description: "There was an error signing out. Please try again.",
      variant: "destructive"
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
      console.error('Error checking session:', error);
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
    console.error('Unexpected error in checkSession:', error);
    return { session: null, error };
  }
};
