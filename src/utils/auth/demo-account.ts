
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
    
    // Attempt to force-confirm the demo account with absolute path to fix 404 error
    console.log('Calling force-confirm-demo endpoint');
    try {
      const baseUrl = window.location.origin;
      const confirmResult = await fetch(`${baseUrl}/api/force-confirm-demo`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!confirmResult.ok) {
        console.warn(`Force confirm returned status ${confirmResult.status}`);
        
        // Try alternative format as fallback
        try {
          const fallbackResult = await fetch(`${baseUrl}/functions/v1/force-confirm-demo`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              // Use a hardcoded key instead of accessing protected property
              'apikey': process.env.SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvZmJwamRibWlzeXh5c2ZjeWViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MTUxMzIsImV4cCI6MjA1ODQ5MTEzMn0.RqUyHPLxCWUATAufUkXCUN9yczZNBKMQD_wYF4Q3VVA'
            }
          });
          
          if (fallbackResult.ok) {
            const fallbackData = await fallbackResult.json();
            console.log('Force confirm fallback succeeded:', fallbackData);
          }
        } catch (fallbackError) {
          console.warn('Force confirm fallback failed:', fallbackError);
        }
      } else {
        const confirmData = await confirmResult.json();
        console.log('Force confirm response:', confirmData);
      }
    } catch (e) {
      console.warn('Force confirm approach failed:', e);
      // Continue anyway as we'll try direct login
    }
    
    // Allow a moment for confirmation to take effect
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Try multiple sign-in attempts with increasing delays
    for (let attempt = 1; attempt <= 5; attempt++) {
      console.log(`Login attempt ${attempt}/5`);
      
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
      if (attempt < 5) {
        const delay = attempt * 800;
        console.log(`Waiting ${delay}ms before next attempt`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    // If all attempts failed
    console.error('All demo login approaches failed');
    
    // Final backup approach: try to directly setup auth
    try {
      console.log('Attempting final backup approach: direct auth setup');
      
      // Try to create and immediately validate demo account directly
      const { data: userData, error: createError } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true
      });
      
      if (!createError && userData) {
        console.log('Successfully created/confirmed user directly');
        
        // Now try to sign in with the confirmed account
        const { data: signInData } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInData?.session) {
          console.log('Login successful after direct account creation');
          
          // Fire success event
          window.dispatchEvent(new CustomEvent('demo-login-success'));
          
          return { success: true };
        }
      }
    } catch (directError) {
      console.error('Final direct account approach failed:', directError);
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
