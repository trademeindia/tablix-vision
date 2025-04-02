
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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
    
    // If still failed, try one more approach - login with auto-confirm
    if (secondAttempt.error && secondAttempt.error.message.includes('Email not confirmed')) {
      console.log('Trying login with auto-confirmation workaround');
      
      // Force a sign-up which might auto-confirm in development
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin
        }
      });
      
      if (!signUpError) {
        // Try login again immediately
        const thirdAttempt = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (!thirdAttempt.error && thirdAttempt.data?.session) {
          console.log('Login with auto-confirmation succeeded');
          return { success: true };
        }
      }
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
        data: { full_name: 'Demo User' },
        emailRedirectTo: window.location.origin
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
