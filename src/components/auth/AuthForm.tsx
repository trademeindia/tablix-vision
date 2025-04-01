import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStatus } from '@/hooks/use-auth-status';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { DemoCredentials } from './DemoCredentials';
import { DemoLoginButton } from './DemoLoginButton';
import { LoginForm } from './LoginForm';

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

export const AuthForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [authError, setAuthError] = useState<string | null>(null);
  const { signIn, signUp } = useAuthStatus();

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
        setAuthError(error || 'Unable to access demo account. Please try again.');
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

  return (
    <div className="w-full max-w-md overflow-hidden bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-400 bg-clip-text text-transparent">Restaurant Manager</h1>
          <p className="text-gray-500 mt-2">Manage your restaurant with ease</p>
        </div>
        
        {authError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Error</AlertTitle>
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
        )}
        
        {/* Demo Credentials Card */}
        <DemoCredentials />

        {/* Demo Login Button */}
        <DemoLoginButton 
          isLoading={isDemoLoading} 
          onDemoLogin={handleDemoLogin} 
        />

        <Separator className="my-6" />
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'signin' | 'signup')} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 rounded-lg bg-gray-100 p-1">
            <TabsTrigger value="signin" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Sign In
            </TabsTrigger>
            <TabsTrigger value="signup" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Sign Up
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin" className="mt-0">
            <LoginForm 
              form={form} 
              onSubmit={onSubmit} 
              isLoading={isLoading} 
              isSignUp={false}
            />
          </TabsContent>
          
          <TabsContent value="signup" className="mt-0">
            <LoginForm 
              form={form} 
              onSubmit={onSubmit} 
              isLoading={isLoading} 
              isSignUp={true}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-center">
        <p className="text-sm text-gray-600">
          {activeTab === 'signin' ? 
            "Don't have an account? Switch to Sign Up." : 
            "Already have an account? Switch to Sign In."}
        </p>
      </div>
    </div>
  );
};
