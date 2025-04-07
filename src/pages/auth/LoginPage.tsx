
import React, { useState, useEffect } from 'react';
import AuthPageWrapper from '@/components/auth/AuthPageWrapper';
import { useLoginForm } from '@/hooks/auth/use-login-form';
import RoleTabsSection from '@/components/auth/RoleTabsSection';
import LoginForm from '@/components/auth/LoginForm';
import AuthFormTitle from '@/components/auth/AuthFormTitle';
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
  }, [initializeDemoAccounts]);

  const toggleDemoHelp = () => setShowDemoHelp(!showDemoHelp);

  return (
    <AuthPageWrapper title="Login">
      <div>
        <RoleTabsSection role={role} handleRoleChange={handleRoleChange} />
        
        <div>
          <AuthFormTitle role={role} isSignup={false} />
          
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
                <span className="bg-white px-2 text-slate-500 flex items-center gap-1">
                  Or try a demo account
                  <button 
                    onClick={toggleDemoHelp} 
                    className="text-slate-400 hover:text-slate-600 focus:outline-none"
                    aria-label="Demo help"
                  >
                    <HelpCircle className="h-4 w-4" />
                  </button>
                </span>
              </div>
            </div>
            
            {showDemoHelp && (
              <Alert className="mt-4 bg-blue-50 text-blue-800 border-blue-200">
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
            
            <DemoAccountSelector 
              onSelectDemo={handleDemoLogin}
              isLoading={isInitializing || isSubmitting} 
            />
          </div>
        </div>
      </div>
    </AuthPageWrapper>
  );
};

export default LoginPage;
