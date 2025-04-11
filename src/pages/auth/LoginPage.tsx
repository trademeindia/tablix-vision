
import React, { useState, useEffect } from 'react';
import AuthPageWrapper from '@/components/auth/AuthPageWrapper';
import { useLoginForm } from '@/hooks/auth/use-login-form';
import RoleTabsSection from '@/components/auth/RoleTabsSection';
import LoginForm from '@/components/auth/LoginForm';
import AuthFormTitle from '@/components/auth/AuthFormTitle';
import DemoAccountSelector from '@/components/auth/DemoAccountSelector';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, HelpCircle, Coffee } from "lucide-react";
import { useDemoAccounts } from '@/hooks/auth/use-demo-accounts';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

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

  const [showDemoHelp, setShowDemoHelp] = useState(true);
  const { initializeDemoAccounts, isInitializing } = useDemoAccounts();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Initialize demo accounts when the login page loads
    initializeDemoAccounts();
  }, [initializeDemoAccounts]);

  const toggleDemoHelp = () => setShowDemoHelp(!showDemoHelp);

  return (
    <AuthPageWrapper title="Login">
      <div className="p-2 sm:p-4">
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left side - Decorative panel for larger screens */}
            <div className="hidden md:block md:w-1/3 bg-gradient-to-br from-primary/80 to-primary p-8 text-primary-foreground">
              <div className="h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Welcome to Menu 360</h2>
                  <p className="mb-4 text-primary-foreground/90">Access your restaurant management dashboard to:</p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Coffee className="h-4 w-4 flex-shrink-0" />
                      <span>Manage your digital menus</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Coffee className="h-4 w-4 flex-shrink-0" />
                      <span>Process orders efficiently</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Coffee className="h-4 w-4 flex-shrink-0" />
                      <span>Track restaurant analytics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Coffee className="h-4 w-4 flex-shrink-0" />
                      <span>Engage with your customers</span>
                    </li>
                  </ul>
                </div>
                <div className="border-t border-primary-foreground/20 pt-4 mt-auto">
                  <p className="text-sm text-primary-foreground/80 break-words">
                    The complete solution for modern restaurants
                  </p>
                </div>
              </div>
            </div>
            
            {/* Right side - Form */}
            <div className="md:w-2/3 p-4 sm:p-6 md:p-8">
              <div className={isMobile ? "py-2" : "py-4"}>
                <RoleTabsSection role={role} handleRoleChange={handleRoleChange} />
                
                <div className={isMobile ? "mt-4" : "mt-6"}>
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
                  
                  <div className={isMobile ? "mt-6" : "mt-8"}>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-slate-200" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-2 text-slate-500 flex items-center gap-1">
                          <strong>Try a demo account</strong>
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
                          with full functionality.
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
            </div>
          </div>
        </Card>
      </div>
    </AuthPageWrapper>
  );
};

export default LoginPage;
