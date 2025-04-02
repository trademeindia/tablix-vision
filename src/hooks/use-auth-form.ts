import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

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
  const { signIn, signUp } = useAuth();

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  // Clear error when tab changes or form is edited
  useEffect(() => {
    setAuthError(null);
  }, [activeTab, form.watch()]);

  const onSubmit = async (values: AuthFormValues) => {
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
          setAuthError(error || 'Authentication failed. Please check your credentials and try again.');
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
      console.error('Authentication error:', error);
      setAuthError('An unexpected error occurred. Please try again later.');
      toast({
        title: 'Authentication error',
        description: 'An unexpected error occurred. Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsDemoLoading(true);
    setAuthError(null);
    
    try {
      console.log(`Attempting demo login with: ${DEMO_EMAIL}`);
      
      // Fill the form with demo credentials for better UX
      form.setValue('email', DEMO_EMAIL);
      form.setValue('password', DEMO_PASSWORD);
      
      const { success, error } = await signIn(DEMO_EMAIL, DEMO_PASSWORD);
      
      if (success) {
        toast({
          title: 'Demo Access Granted',
          description: 'You are now using the demo account. Explore the features!'
        });
      } else {
        console.error('Demo login failed with error:', error);
        setAuthError(`Demo login failed: ${error || 'Unable to access demo account. Please try again.'}`);
        toast({
          title: 'Demo Access Failed',
          description: error || 'Unable to access demo account. Please try again.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Demo login error:', error);
      setAuthError('An unexpected error occurred with the demo login. Please try again.');
      toast({
        title: 'Demo Access Error',
        description: 'An unexpected error occurred. Please try again later.',
        variant: 'destructive'
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
    handleDemoLogin
  };
};
