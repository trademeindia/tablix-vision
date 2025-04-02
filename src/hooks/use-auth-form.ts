
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { handleError } from '@/utils/errorHandling';
import { authFormSchema, AuthFormValues } from '@/schemas/auth-schemas';
import { DEMO_EMAIL, DEMO_PASSWORD } from '@/constants/auth-constants';
import { preFillDemoCredentials, handleDemoLoginAttempt } from '@/utils/auth-form-utils';

export { DEMO_EMAIL, DEMO_PASSWORD } from '@/constants/auth-constants';
export type { AuthFormValues } from '@/schemas/auth-schemas';

export const useAuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [authError, setAuthError] = useState<string | null>(null);
  const { signIn, signUp } = useAuth();

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'onBlur' // Validate on blur for better UX
  });

  // Clear error when tab changes or form is edited
  useEffect(() => {
    setAuthError(null);
  }, [activeTab, form.watch()]);

  const onSubmit = async (values: AuthFormValues) => {
    if (isLoading) return; // Prevent multiple submissions
    
    setIsLoading(true);
    setAuthError(null);
    
    try {
      if (activeTab === 'signin') {
        console.log(`Attempting to sign in with email: ${values.email}`);
        const { success, error } = await signIn(values.email, values.password);
        
        if (success) {
          toast({
            title: 'Sign in successful',
            description: 'Welcome back!'
          });
        } else {
          console.error('Sign in failed with error:', error);
          
          // For demo purposes, suggest using the demo button if there's an error
          if (values.email === DEMO_EMAIL) {
            setAuthError('For demo access, please use the "Try Demo Account" button above for a more reliable experience.');
          } else {
            setAuthError(error || 'Authentication failed. Please check your credentials and try again.');
          }
          
          toast({
            title: 'Sign in failed',
            description: error || 'Please check your credentials and try again',
            variant: 'destructive'
          });
        }
      } else {
        console.log(`Attempting to sign up with email: ${values.email}`);
        const { success, error } = await signUp(values.email, values.password, {
          full_name: values.email.split('@')[0]
        });
        
        if (success) {
          toast({
            title: 'Sign up successful',
            description: 'Welcome to Restaurant Management Dashboard!'
          });
          
          // After successful signup, switch to signin tab
          setActiveTab('signin');
          
          // For better UX, set a timeout before trying to sign in with new credentials
          setTimeout(() => {
            signIn(values.email, values.password).catch(() => {
              /* Ignore error, will be captured by login form */
            });
          }, 1000);
        } else {
          console.error('Sign up failed with error:', error);
          setAuthError(error || 'Registration failed. Please try again.');
          toast({
            title: 'Sign up failed',
            description: error || 'An error occurred during sign up',
            variant: 'destructive'
          });
        }
      }
    } catch (error) {
      handleError(error, {
        context: 'Authentication form submission',
        category: 'auth'
      });
      setAuthError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    if (isDemoLoading) return; // Prevent multiple submissions
    
    setIsDemoLoading(true);
    setAuthError(null);
    
    try {
      console.log(`Attempting demo login with: ${DEMO_EMAIL}`);
      
      // Fill the form with demo credentials for better UX
      preFillDemoCredentials(form, DEMO_EMAIL, DEMO_PASSWORD);
      
      // Short delay to let the form update visually
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Show toast to indicate demo login is in progress
      toast({
        title: 'Accessing Demo Account',
        description: 'Please wait while we prepare your dashboard...'
      });
      
      // Try multiple times for demo login with increasing delays
      const result = await handleDemoLoginAttempt(signIn, DEMO_EMAIL, DEMO_PASSWORD);
      
      if (result.success) {
        toast({
          title: 'Demo Access Granted',
          description: 'You are now using the demo account. Explore all features!'
        });
      } else {
        console.error('Demo login failed after multiple attempts with error:', result.error);
        
        // Show a more helpful error message for demo users
        setAuthError(result.error || 'Demo login failed. Please try again in a few moments.');
        
        toast({
          title: 'Demo Access Failed',
          description: 'Unable to access demo account. Please try again.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      handleError(error, {
        context: 'Demo login',
        category: 'auth'
      });
      setAuthError('An unexpected error occurred with the demo login. Please try again.');
    } finally {
      setIsDemoLoading(false);
    }
  };

  return {
    form,
    isLoading,
    isDemoLoading,
    activeTab,
    setActiveTab,
    authError,
    onSubmit,
    handleDemoLogin,
    preFillDemoCredentials: () => preFillDemoCredentials(form, DEMO_EMAIL, DEMO_PASSWORD)
  };
};
