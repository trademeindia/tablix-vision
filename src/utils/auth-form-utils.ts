
import { UseFormReturn } from 'react-hook-form';
import { AuthFormValues } from '@/schemas/auth-schemas';

/**
 * Pre-fill the form with demo credentials
 */
export const preFillDemoCredentials = (
  form: UseFormReturn<AuthFormValues>, 
  email: string, 
  password: string
) => {
  form.setValue('email', email);
  form.setValue('password', password);
};

/**
 * Attempt demo login with multiple retries for reliability
 */
export const handleDemoLoginAttempt = async (
  signInFn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>,
  email: string,
  password: string,
  maxAttempts: number = 3
): Promise<{ success: boolean; error?: string }> => {
  let lastError = '';
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    console.log(`Attempting demo login (attempt ${attempt}/${maxAttempts})`);
    
    try {
      // First, attempt to force-confirm the demo account directly
      try {
        const baseUrl = window.location.origin;
        const forceConfirmResponse = await fetch(`${baseUrl}/api/force-confirm-demo`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (!forceConfirmResponse.ok) {
          console.warn(`Force confirm returned status ${forceConfirmResponse.status}`);
          // Try the alternative format as fallback
          await fetch(`${baseUrl}/functions/v1/force-confirm-demo`, {
            method: 'POST',
            credentials: 'include',
            headers: { 
              'Content-Type': 'application/json',
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || ''
            }
          });
        }
      } catch (e) {
        // Ignore force-confirm errors and continue with sign-in
        console.warn('Force-confirm attempt failed, continuing with login:', e);
      }
      
      // Wait a bit for any confirmation to take effect
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Sign in attempt
      const result = await signInFn(email, password);
      
      if (result.success) {
        console.log(`Demo login succeeded on attempt ${attempt}`);
        // Add a custom event that components can listen for
        window.dispatchEvent(new CustomEvent('demo-login-success'));
        return { success: true };
      }
      
      lastError = result.error || 'Unknown login error';
      console.log(`Attempt ${attempt} failed: ${lastError}`);
      
      // Exponential backoff between attempts
      if (attempt < maxAttempts) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        console.log(`Waiting ${delay}ms before next attempt`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    } catch (error: any) {
      lastError = error?.message || 'Unexpected error during login attempt';
      console.error(`Error in attempt ${attempt}:`, error);
    }
  }
  
  console.error(`Demo login failed after ${maxAttempts} attempts`);
  return { 
    success: false, 
    error: `Unable to access demo account. Please try again later.` 
  };
};
