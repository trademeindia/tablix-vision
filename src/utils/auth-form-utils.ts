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
      
      // Only clear session for subsequent attempts to avoid unnecessary operations
      if (attempts > 1) {
        try {
          const { data } = await fetch('/api/auth/clear-session', { 
            method: 'POST',
            credentials: 'include'
          }).then(res => res.json());
          
          if (data?.success) {
            console.log('Successfully cleared session before retry');
          }
        } catch (e) {
          // Skip session clearing if it fails - continue with login attempt
          console.warn('Failed to clear session before retry, continuing anyway');
        }
      }
      
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
    error: success ? '' : `Demo login failed after ${attempts} attempts. ${lastError}` 
  };
};
