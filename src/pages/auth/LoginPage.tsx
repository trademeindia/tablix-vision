
import React, { useState, useEffect } from 'react';
import AuthPageWrapper from '@/components/auth/AuthPageWrapper';
import { useLoginForm } from '@/hooks/auth/use-login-form';
import RoleTabsSection from '@/components/auth/RoleTabsSection';
import LoginForm from '@/components/auth/LoginForm';
import WelcomeSection from '@/components/auth/WelcomeSection';
import DemoAccountSelector from '@/components/auth/DemoAccountSelector';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, HelpCircle } from "lucide-react";
import { useDemoAccounts } from '@/hooks/auth/use-demo-accounts';

const LoginPage = () => {
  const {
    email,
    setEmail,
    password, 
    setPassword,
    isSubmitting,
    error,
    role,
    handleRoleChange,
    handleSubmit,
    handleGoogleSignIn,
    handleDemoLogin
  } = useLoginForm();

  const [showDemoHelp, setShowDemoHelp] = useState(false);
  const { initializeDemoAccounts, isInitializing } = useDemoAccounts();

  useEffect(() => {
    // Initialize demo accounts when the login page loads
    initializeDemoAccounts();
    
    // Force a refresh to ensure the latest styles are applied
    console.log('Login page mounted, ensuring styles are applied');
    
    // Add class to body for background styling
    document.body.classList.add('auth-page');
    
    return () => {
      // Clean up body class when component unmounts
      document.body.classList.remove('auth-page');
    };
  }, [initializeDemoAccounts]);

  const toggleDemoHelp = () => setShowDemoHelp(!showDemoHelp);

  return (
    <AuthPageWrapper title="Login">
      <div>
        <WelcomeSection />
        
        <RoleTabsSection role={role} handleRoleChange={handleRoleChange} />
        
        <div className="animate-fade-in">
          <LoginForm 
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            isSubmitting={isSubmitting}
            error={error}
            role={role}
            handleSubmit={handleSubmit}
            handleGoogleSignIn={handleGoogleSignIn}
          />
          
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-3 text-slate-500 flex items-center gap-1 font-medium">
                  Or try a demo account
                  <button 
                    onClick={toggleDemoHelp} 
                    className="text-slate-400 hover:text-slate-600 focus:outline-none ml-1"
                    aria-label="Demo help"
                  >
                    <HelpCircle className="h-4 w-4" />
                  </button>
                </span>
              </div>
            </div>
            
            {showDemoHelp && (
              <Alert className="mt-4 bg-blue-50 text-blue-800 border-blue-200 animate-fade-in">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-600">About Demo Mode</AlertTitle>
                <AlertDescription className="text-sm">
                  Demo accounts provide instant access to the application with pre-populated data. 
                  No email verification is required. You'll be able to explore the interface and features 
                  but with limited functionality.
                </AlertDescription>
              </Alert>
            )}
            
            {error && error.includes('email confirmation') && (
              <Alert className="mt-4 bg-amber-50 text-amber-800 border-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-800">Demo Setup Required</AlertTitle>
                <AlertDescription className="text-sm">
                  For demo accounts to work properly, please make sure that email confirmation is disabled
                  in the Supabase project authentication settings.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="mt-4">
              <DemoAccountSelector 
                onSelectDemo={handleDemoLogin}
                isLoading={isInitializing || isSubmitting} 
              />
            </div>
          </div>
        </div>
      </div>
    </AuthPageWrapper>
  );
};

export default LoginPage;
