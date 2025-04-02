
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '../errorHandling';
import { signInDemoAccount } from './demo-account';

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
