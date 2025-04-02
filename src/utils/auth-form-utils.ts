
import { UseFormReturn } from 'react-hook-form';
import { AuthFormValues } from '@/schemas/auth-schemas';

/**
 * Pre-fills the auth form with demo credentials
 */
export const preFillDemoCredentials = (
  form: UseFormReturn<AuthFormValues>,
  email: string,
  password: string
): void => {
  form.setValue('email', email, { shouldValidate: true });
  form.setValue('password', password, { shouldValidate: true });
};

/**
 * Handles demo login attempt with multiple retries and timeouts
 */
export const handleDemoLoginAttempt = async (
  signInFunction: (email: string, password: string) => Promise<{ success: boolean; error?: string }>,
  email: string,
  password: string,
  maxAttempts: number = 3
): Promise<{ success: boolean; error?: string }> => {
  console.log(`Attempting demo login with email: ${email}, max attempts: ${maxAttempts}`);
  
  // First attempt - try direct login
  const firstAttempt = await signInFunction(email, password);
  if (firstAttempt.success) {
    console.log('Demo login successful on first attempt');
    
    // Trigger direct navigation event
    window.dispatchEvent(new CustomEvent('demo-login-success'));
    
    return { success: true };
  }
  
  // Attempt to force demo account confirmation via edge function
  try {
    const confirmResult = await fetch('/api/auth/force-confirm-demo', {
      method: 'POST',
      credentials: 'include'
    });
    await confirmResult.json();
    console.log('Force-confirmed demo account via edge function');
  } catch (e) {
    console.warn('Failed to force-confirm demo account:', e);
  }
  
  // Allow time for confirmation to take effect
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Second attempt after confirmation
  const secondAttempt = await signInFunction(email, password);
  if (secondAttempt.success) {
    console.log('Demo login successful on second attempt after confirmation');
    
    // Trigger direct navigation event
    window.dispatchEvent(new CustomEvent('demo-login-success'));
    
    return { success: true };
  }
  
  // If we still have remaining attempts, try with increasing delays
  let currentAttempt = 2;
  while (currentAttempt < maxAttempts) {
    // Calculate delay with exponential backoff
    const delay = Math.pow(2, currentAttempt) * 500;
    console.log(`Waiting ${delay}ms before attempt ${currentAttempt + 1}`);
    
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Try login again
    const result = await signInFunction(email, password);
    if (result.success) {
      console.log(`Demo login successful on attempt ${currentAttempt + 1}`);
      
      // Trigger direct navigation event 
      window.dispatchEvent(new CustomEvent('demo-login-success'));
      
      return { success: true };
    }
    
    currentAttempt++;
  }
  
  // If we get here, all attempts failed
  console.error(`Demo login failed after ${maxAttempts} attempts`);
  return { 
    success: false, 
    error: 'Unable to access demo account after multiple attempts. Please try again later.' 
  };
};
