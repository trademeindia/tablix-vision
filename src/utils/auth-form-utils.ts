
import { UseFormReturn } from 'react-hook-form';
import { AuthFormValues } from '@/hooks/use-auth-form';

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
        await fetch(`${baseUrl}/api/force-confirm-demo`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (e) {
        // Ignore force-confirm errors and continue with sign-in
      }
      
      // Wait a bit for any confirmation to take effect
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Sign in attempt
      const result = await signInFn(email, password);
      
      if (result.success) {
        console.log(`Demo login succeeded on attempt ${attempt}`);
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
    error: `Unable to access demo account after multiple attempts. Please try again later.` 
  };
};
