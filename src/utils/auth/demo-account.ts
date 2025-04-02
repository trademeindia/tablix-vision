
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Enhanced sign-in method for demo account with direct dashboard access
 */
export const signInDemoAccount = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('Starting enhanced demo account login flow with direct dashboard access');
    
    // Show toast to indicate process has started
    toast({
      title: 'Accessing Demo Dashboard',
      description: 'Please wait while we prepare your experience...'
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
    
    // Force confirm the demo account email via edge function
    console.log('Forcing demo account confirmation');
    try {
      const confirmResult = await fetch('/api/auth/force-confirm-demo', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (!confirmResult.ok) {
        throw new Error('Failed to confirm demo account');
      }
      
      console.log('Demo account confirmed successfully');
    } catch (e) {
      console.warn('Force confirm approach failed:', e);
      // Continue anyway as we'll try direct login
    }
    
    // Allow a moment for confirmation to take effect
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Try direct login with demo credentials
    console.log('Attempting direct demo login');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (!error && data?.session) {
      console.log('Demo login successful, redirecting to dashboard');
      
      // Fire a custom event to signal successful demo login
      window.dispatchEvent(new CustomEvent('demo-login-success'));
      
      return { success: true };
    }
    
    console.log('Direct login failed, error:', error?.message);
    
    // If login failed, try one more approach - admin login
    console.log('Trying final admin login approach');
    
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (!signInError) {
      console.log('Admin login successful');
      
      // Fire a custom event to signal successful demo login
      window.dispatchEvent(new CustomEvent('demo-login-success'));
      
      return { success: true };
    }
    
    // If all approaches failed
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
