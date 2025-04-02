
import React, { useEffect } from 'react';
import { useAuthForm } from '@/hooks/use-auth-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { DemoCredentials } from './DemoCredentials';
import { DemoLoginButton } from './DemoLoginButton';
import { LoginForm } from './LoginForm';

export const AuthForm: React.FC = () => {
  const {
    form,
    isLoading,
    isDemoLoading,
    activeTab,
    setActiveTab,
    authError,
    onSubmit,
    handleDemoLogin
  } = useAuthForm();

  // Reset form validation state when tab changes
  useEffect(() => {
    form.reset();
  }, [activeTab, form]);

  return (
    <div className="w-full max-w-md overflow-hidden bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-400 bg-clip-text text-transparent">Restaurant Manager</h1>
          <p className="text-gray-500 mt-2">Manage your restaurant with ease</p>
        </div>
        
        {/* Big, attention-grabbing demo login button */}
        <div className="bg-amber-100 rounded-lg p-4 border-2 border-amber-300 mb-6">
          <h3 className="text-amber-800 font-bold text-center mb-3">👇 Fastest Way to Access Dashboard 👇</h3>
          <DemoLoginButton 
            isLoading={isDemoLoading} 
            onDemoLogin={handleDemoLogin} 
          />
        </div>
        
        {authError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Error</AlertTitle>
            <AlertDescription className="text-sm">{authError}</AlertDescription>
          </Alert>
        )}
        
        {/* Demo Credentials Card */}
        <DemoCredentials />

        <Separator className="my-6" />
        
        <p className="text-sm text-gray-500 mb-4 text-center">Or sign in with your own account</p>
        
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
