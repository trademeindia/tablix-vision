
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, signupSchema, AuthFormValues } from '@/schemas/auth-schemas';
import { useAuth } from '@/contexts/AuthContext';
import { DEMO_EMAIL, DEMO_PASSWORD } from '@/constants/auth-constants';
import { toast } from '@/hooks/use-toast';
import { preFillDemoCredentials, handleDemoLoginAttempt } from '@/utils/auth-form-utils';

export { AuthFormValues };

export const useAuthForm = () => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { signIn, signUp } = useAuth();

  // Use the appropriate schema based on the active tab
  const schema = activeTab === 'signin' ? loginSchema : signupSchema;

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '', // Only used for signup
    },
  });

  const onSubmit = async (values: AuthFormValues) => {
    // Clear previous errors
    setAuthError(null);
    setIsLoading(true);

    try {
      // Different logic for signin vs signup
      if (activeTab === 'signin') {
        const { email, password } = values;
        const result = await signIn(email, password);

        if (!result.success) {
          setAuthError(result.error || 'Sign in failed');
        }
      } else {
        // For signup tab
        const { email, password } = values;
        const result = await signUp(email, password);

        if (result.success) {
          toast({
            title: 'Account created',
            description: 'Please check your email to confirm your account',
          });
          // Switch to the signin tab after successful signup
          setActiveTab('signin');
        } else {
          setAuthError(result.error || 'Sign up failed');
        }
      }
    } catch (error: any) {
      console.error('Auth form submission error:', error);
      setAuthError(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    try {
      // Clear previous errors and set loading state
      setAuthError(null);
      setIsDemoLoading(true);
      
      // Pre-fill the form with demo credentials for visual feedback
      preFillDemoCredentials(form, DEMO_EMAIL, DEMO_PASSWORD);
      
      // Show initial toast to indicate process has started
      toast({
        title: 'Accessing Demo Dashboard',
        description: 'Setting up your experience...'
      });
      
      // Use the enhanced demo login attempt function with retries
      const result = await handleDemoLoginAttempt(signIn, DEMO_EMAIL, DEMO_PASSWORD, 3);
      
      if (!result.success) {
        setAuthError(result.error || 'Demo login failed');
        toast({
          title: 'Demo Login Failed',
          description: result.error || 'Please try again',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Error in demo login:', error);
      setAuthError(error.message || 'Demo login failed');
      
      toast({
        title: 'Demo Login Error',
        description: 'Please try again in a moment',
        variant: 'destructive',
      });
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
  };
};
