
import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { handleError } from '@/utils/errorHandling';

// Demo account credentials - keep these in sync with the Supabase migration
export const DEMO_EMAIL = 'demo@restaurant.com';
export const DEMO_PASSWORD = 'demo123456';

// Validation schema with better error messages
const authFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' })
    .transform(email => email.trim().toLowerCase()),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
});

export type AuthFormValues = z.infer<typeof authFormSchema>;

export const useAuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [authError, setAuthError] = useState<string | null>(null);
  const { signIn, signUp, isAuthenticated } = useAuth();

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

  // Pre-fill demo credentials when demo mode is activated
  const preFillDemoCredentials = () => {
    form.setValue('email', DEMO_EMAIL);
    form.setValue('password', DEMO_PASSWORD);
    
    // Clear any validation errors
    form.clearErrors();
  };

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
          // For demo purposes, show a more specific message for email confirmation errors
          if (error && error.includes('Email not confirmed')) {
            setAuthError('Demo account email is not confirmed. Using the "Try Demo Account" button is recommended for testing.');
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
      preFillDemoCredentials();
      
      // Short delay to let the form update visually
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Try up to 3 times with increasing delays for demo login
      let success = false;
      let error = '';
      
      for (let attempt = 1; attempt <= 3 && !success; attempt++) {
        console.log(`Demo login attempt ${attempt}`);
        
        const result = await signIn(DEMO_EMAIL, DEMO_PASSWORD);
        success = result.success;
        error = result.error || '';
        
        if (!success && attempt < 3) {
          // Wait longer between each retry
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
      
      if (success) {
        toast({
          title: 'Demo Access Granted',
          description: 'You are now using the demo account. Explore the features!'
        });
      } else {
        console.error('Demo login failed with error:', error);
        
        // Show a more helpful error message for demo users
        if (error.includes('Email not confirmed')) {
          setAuthError('The demo account email needs confirmation. Please contact the administrator to confirm the demo account email or create a new account.');
        } else {
          setAuthError(`Demo login failed: ${error || 'Unable to access demo account. Please try again.'}`);
        }
        
        toast({
          title: 'Demo Access Failed',
          description: error || 'Unable to access demo account. Please try again.',
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
    preFillDemoCredentials
  };
};
