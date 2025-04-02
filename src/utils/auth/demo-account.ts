
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
    
    // First, sign out to clear any existing sessions
    await supabase.auth.signOut();
    console.log('Signed out any existing sessions');
    
    // Slight delay to ensure signout is processed
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Attempt to force-confirm the demo account
    console.log('Calling force-confirm-demo endpoint');
    try {
      const confirmResult = await fetch('/api/force-confirm-demo', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!confirmResult.ok) {
        console.warn(`Force confirm returned status ${confirmResult.status}`);
      } else {
        const confirmData = await confirmResult.json();
        console.log('Force confirm response:', confirmData);
      }
    } catch (e) {
      console.warn('Force confirm approach failed:', e);
      // Continue anyway as we'll try direct login
    }
    
    // Allow a moment for confirmation to take effect
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Try multiple sign-in attempts with increasing delays
    for (let attempt = 1; attempt <= 3; attempt++) {
      console.log(`Login attempt ${attempt}/3`);
      
      // Sign in attempt
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (!error && data?.session) {
        console.log('Demo login successful on attempt', attempt);
        
        // Fire a custom event to signal successful demo login
        window.dispatchEvent(new CustomEvent('demo-login-success'));
        
        // Show success toast
        toast({
          title: 'Demo Access Granted',
          description: 'You now have full access to the Restaurant Dashboard!',
        });
        
        return { success: true };
      }
      
      console.log(`Attempt ${attempt} failed:`, error?.message);
      
      // If we have more attempts to go, wait with increasing delay
      if (attempt < 3) {
        const delay = attempt * 800;
        console.log(`Waiting ${delay}ms before next attempt`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    // If all attempts failed
    console.error('All demo login approaches failed');
    
    // Final backup approach: try to directly get a session
    try {
      console.log('Attempting final backup approach: get session directly');
      const { data } = await supabase.auth.getSession();
      
      if (data?.session) {
        console.log('Successfully retrieved session after failed logins');
        
        // Fire success event
        window.dispatchEvent(new CustomEvent('demo-login-success'));
        
        return { success: true };
      }
    } catch (sessionError) {
      console.error('Final session retrieval failed:', sessionError);
    }
    
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
