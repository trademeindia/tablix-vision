
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '../errorHandling';

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
