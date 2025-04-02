
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
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Clear any session cookies via the edge function
    try {
      const clearResult = await fetch('/api/auth/clear-session', { 
        method: 'POST',
        credentials: 'include'
      });
      console.log('Session cookies cleared:', await clearResult.json());
    } catch (e) {
      console.warn('Failed to clear session cookies, continuing anyway:', e);
    }
    
    // Wait a moment for cookie cleanup
    await new Promise(resolve => setTimeout(resolve, 200));
    
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
    await new Promise(resolve => setTimeout(resolve, 500));
    
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
    
    // If still failed, try one last approach
    console.log('Trying final login approach with forceful email confirmation');
      
    try {
      // This is a direct database approach that the edge function provides
      const finalAttempt = await fetch('/api/auth/force-confirm-demo', { 
        method: 'POST',
        credentials: 'include'
      });
      
      if (finalAttempt.ok) {
        console.log('Demo account email confirmed via edge function');
        
        // Try login one more time
        const lastAttempt = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (!lastAttempt.error && lastAttempt.data?.session) {
          console.log('Final login attempt succeeded');
          return { success: true };
        }
      }
    } catch (e) {
      console.warn('Force confirm approach failed:', e);
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
