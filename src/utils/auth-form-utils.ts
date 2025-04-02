
import { AuthFormValues } from '@/schemas/auth-schemas';

/**
 * Pre-fills form with demo credentials
 */
export const preFillDemoCredentials = (
  form: any, 
  demoEmail: string, 
  demoPassword: string
) => {
  form.setValue('email', demoEmail);
  form.setValue('password', demoPassword);
  
  // Clear any validation errors
  form.clearErrors();
};

/**
 * Handles login attempt for demo account with multiple retries
 */
export const handleDemoLoginAttempt = async (
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>,
  email: string,
  password: string,
  maxAttempts: number = 5
): Promise<{ success: boolean; error?: string }> => {
  let success = false;
  let attempts = 0;
  let error = '';
  
  while (!success && attempts < maxAttempts) {
    attempts++;
    console.log(`Demo login attempt ${attempts}`);
    
    try {
      const result = await signIn(email, password);
      success = result.success;
      error = result.error || '';
      
      if (success) break;
      
      // Wait longer between each retry
      if (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
      }
    } catch (e) {
      console.error(`Demo login attempt ${attempts} failed with exception:`, e);
      // Continue to next attempt
    }
  }
  
  return { 
    success, 
    error: success ? '' : `Demo login failed after ${attempts} attempts. ${error}` 
  };
};
