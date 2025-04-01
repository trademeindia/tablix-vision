import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { useAuthStatus } from '@/hooks/use-auth-status';
import { Loader2, Mail, Lock, Info, ExternalLink, Copy } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

const authFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' })
});

type AuthFormValues = z.infer<typeof authFormSchema>;

// Demo account credentials
const DEMO_EMAIL = 'demo@restaurant.com';
const DEMO_PASSWORD = 'demo123456';

export const AuthForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const { signIn, signUp } = useAuthStatus();

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (values: AuthFormValues) => {
    setIsLoading(true);
    try {
      if (activeTab === 'signin') {
        const { success, error } = await signIn(values.email, values.password);
        if (success) {
          toast({
            title: 'Sign in successful',
            description: 'Welcome back!'
          });
        } else {
          toast({
            title: 'Sign in failed',
            description: error || 'Please check your credentials and try again',
            variant: 'destructive'
          });
        }
      } else {
        const { success, error } = await signUp(values.email, values.password, {
          full_name: values.email.split('@')[0]
        });
        if (success) {
          toast({
            title: 'Sign up successful',
            description: 'Welcome to Restaurant Management Dashboard!'
          });
        } else {
          toast({
            title: 'Sign up failed',
            description: error || 'An error occurred during sign up',
            variant: 'destructive'
          });
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
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
    try {
      const { success, error } = await signIn(DEMO_EMAIL, DEMO_PASSWORD);
      if (success) {
        toast({
          title: 'Demo Access Granted',
          description: 'You are now using the demo account. Explore the features!'
        });
      } else {
        toast({
          title: 'Demo Access Failed',
          description: error || 'Unable to access demo account. Please try again.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Demo login error:', error);
      toast({
        title: 'Demo Access Error',
        description: 'An unexpected error occurred. Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setIsDemoLoading(false);
    }
  };

  const copyCredentials = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "You can now paste the credentials",
    });
  };

  return (
    <div className="w-full max-w-md overflow-hidden bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-400 bg-clip-text text-transparent">Restaurant Manager</h1>
          <p className="text-gray-500 mt-2">Manage your restaurant with ease</p>
        </div>
        
        <Alert className="mb-6 bg-blue-50 border-blue-100">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertTitle className="text-blue-700">Development Mode</AlertTitle>
          <AlertDescription className="text-blue-600 text-sm">
            Email verification is bypassed for development.
          </AlertDescription>
        </Alert>

        {/* Demo Credentials Card */}
        <div className="mb-6 bg-amber-50 rounded-lg p-4 border border-amber-100">
          <h3 className="text-amber-800 font-medium text-sm mb-2">Demo Credentials</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Mail className="h-3.5 w-3.5 text-amber-600 mr-2" />
                <span className="text-amber-700 text-sm font-mono">{DEMO_EMAIL}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-amber-600 hover:text-amber-700 hover:bg-amber-100"
                onClick={() => copyCredentials(DEMO_EMAIL)}
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Lock className="h-3.5 w-3.5 text-amber-600 mr-2" />
                <span className="text-amber-700 text-sm font-mono">{DEMO_PASSWORD}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-amber-600 hover:text-amber-700 hover:bg-amber-100"
                onClick={() => copyCredentials(DEMO_PASSWORD)}
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Demo Login Button */}
        <div className="mb-6">
          <Button 
            onClick={handleDemoLogin} 
            className="w-full rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 transition-all duration-200 py-2 h-11"
            disabled={isDemoLoading}
          >
            {isDemoLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Accessing Demo...
              </>
            ) : (
              <>
                <ExternalLink className="mr-2 h-4 w-4" />
                Try Demo Account
              </>
            )}
          </Button>
          <p className="text-center text-xs text-gray-500 mt-2">
            No sign up required - instant access to all features
          </p>
        </div>

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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Email</FormLabel>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <FormControl>
                          <Input 
                            placeholder="your.email@example.com" 
                            type="email" 
                            className="pl-10" 
                            {...field} 
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Password</FormLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <FormControl>
                          <Input 
                            placeholder="Password" 
                            type="password" 
                            className="pl-10" 
                            {...field} 
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 py-2 h-11"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="signup" className="mt-0">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Email</FormLabel>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <FormControl>
                          <Input 
                            placeholder="your.email@example.com" 
                            type="email" 
                            className="pl-10" 
                            {...field} 
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Password</FormLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <FormControl>
                          <Input 
                            placeholder="Password (min. 6 characters)" 
                            type="password" 
                            className="pl-10" 
                            {...field} 
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 py-2 h-11"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </Form>
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
