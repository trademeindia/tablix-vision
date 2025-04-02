import { AuthFormValues } from '@/schemas/auth-schemas';

/**
 * Pre-fills form with demo credentials
 */
export const preFillDemoCredentials = (
  form: any, 
  demoEmail: string, 
  demoPassword: string
) => {
  try {
    form.setValue('email', demoEmail);
    form.setValue('password', demoPassword);
    
    // Clear any validation errors
    form.clearErrors();
  } catch (e) {
    console.error('Error pre-filling demo credentials:', e);
    // Continue despite errors
  }
};

/**
 * Handles login attempt for demo account with reduced retries and optimized timing
 */
export const handleDemoLoginAttempt = async (
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>,
  email: string,
  password: string,
  maxAttempts: number = 3
): Promise<{ success: boolean; error?: string }> => {
  let success = false;
  let attempts = 0;
  let lastError = '';
  
  while (!success && attempts < maxAttempts) {
    attempts++;
    console.log(`Demo login attempt ${attempts} of ${maxAttempts}`);
    
    try {
      // Add progressively longer delays between attempts, but keep them short
      if (attempts > 1) {
        const delayMs = Math.min(500 * attempts, 1500);
        console.log(`Waiting ${delayMs}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
      
      // Clear any session cookies via the edge function for each attempt
      try {
        console.log('Clearing session cookies before attempt', attempts);
        await fetch('/api/auth/clear-session', { 
          method: 'POST',
          credentials: 'include'
        });
      } catch (e) {
        console.warn('Failed to clear session cookies, continuing anyway:', e);
      }
      
      // Force a signout to clear any local session state
      try {
        console.log('Forcing signout before attempt', attempts);
        const { supabase } = await import('@/integrations/supabase/client');
        await supabase.auth.signOut().catch(() => {/* ignore signout errors */});
      } catch (e) {
        console.warn('Failed to sign out before retry, continuing anyway:', e);
      }
      
      // If this is the last attempt, try to force-confirm the demo account
      if (attempts === maxAttempts - 1) {
        try {
          console.log('Using force-confirm endpoint for demo account');
          await fetch('/api/auth/force-confirm-demo', { 
            method: 'POST',
            credentials: 'include'
          });
          
          // Wait a bit for the confirmation to take effect
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (e) {
          console.warn('Failed to force-confirm demo account, continuing anyway:', e);
        }
      }
      
      console.log(`Attempting actual login for attempt ${attempts}`);
      const result = await signIn(email, password);
      success = result.success;
      lastError = result.error || '';
      
      if (success) {
        console.log(`Demo login succeeded on attempt ${attempts}`);
        break;
      } else {
        console.log(`Demo login attempt ${attempts} failed: ${lastError}`);
      }
    } catch (e) {
      console.error(`Demo login attempt ${attempts} failed with exception:`, e);
      lastError = e instanceof Error ? e.message : 'Unknown error occurred';
    }
  }
  
  return { 
    success, 
    error: success ? '' : `Demo login failed after ${attempts} attempts. Please try again later.` 
  };
};
