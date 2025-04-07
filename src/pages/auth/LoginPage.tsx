
import React, { useEffect, useState } from 'react';
import AuthPageWrapper from '@/components/auth/AuthPageWrapper';
import WelcomeSection from '@/components/auth/WelcomeSection';
import LoginForm from '@/components/auth/LoginForm';
import DemoAccountSelector from '@/components/auth/DemoAccountSelector';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getRedirectPathByRole } from '@/hooks/auth/use-redirect-paths';
import { toast } from 'sonner';
import { useDemoAccounts } from '@/hooks/auth/use-demo-accounts';
import { useLoginForm } from '@/hooks/auth/use-login-form';

const LoginPage = () => {
  const { user, userRoles, loading } = useAuth();
  const navigate = useNavigate();
  const { isInitializing, initializeDemoAccounts } = useDemoAccounts();
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  
  // Use the login form hook to manage form state and submission
  const {
    email,
    setEmail,
    password,
    setPassword,
    isSubmitting,
    error,
    role,
    handleSubmit,
    handleGoogleSignIn,
    handleDemoLogin,
  } = useLoginForm({ redirectTo: '/dashboard' });
  
  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      console.log('User already logged in, redirecting...', { user, roles: userRoles });
      const redirectPath = userRoles.length > 0 ? getRedirectPathByRole(userRoles[0]) : '/dashboard';
      console.log('Redirecting to:', redirectPath);
      navigate(redirectPath, { replace: true });
    }
  }, [user, loading, navigate, userRoles]);
  
  // Ensure demo accounts are created
  useEffect(() => {
    initializeDemoAccounts();
  }, [initializeDemoAccounts]);
  
  // Debug function - only used during development
  const toggleDebugInfo = () => {
    if (!debugInfo) {
      const info = { 
        user: user ? { id: user.id, email: user.email, metadata: user.user_metadata } : null,
        roles: userRoles,
        loading,
        isSubmitting,
        error
      };
      setDebugInfo(JSON.stringify(info, null, 2));
    } else {
      setDebugInfo(null);
    }
  };
  
  const handleSelectDemo = async (credentials: { email: string; password: string; role: string }) => {
    try {
      console.log('Starting demo login process with credentials:', credentials.email, 'role:', credentials.role);
      await handleDemoLogin(credentials);
    } catch (e) {
      console.error('Demo login error:', e);
      toast.error('An unexpected error occurred during demo login');
    }
  };

  return (
    <AuthPageWrapper title="Login">
      <WelcomeSection 
        title="Welcome Back"
        subtitle="Log in to manage your restaurant"
      />
      
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

      <div className="text-center my-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-4 text-slate-500 font-medium">Or try a demo account</span>
          </div>
        </div>
      </div>
      
      <DemoAccountSelector 
        onSelectDemo={handleSelectDemo}
        isLoading={isInitializing || isSubmitting}
      />
      
      {/* Hidden debug button - only visible in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 text-center">
          <button 
            type="button" 
            onClick={toggleDebugInfo}
            className="text-xs text-slate-400 hover:text-slate-600"
          >
            {debugInfo ? 'Hide Debug Info' : 'Show Debug Info'}
          </button>
          {debugInfo && (
            <pre className="mt-2 p-2 bg-slate-100 rounded text-xs text-left overflow-auto max-h-40">
              {debugInfo}
            </pre>
          )}
        </div>
      )}
    </AuthPageWrapper>
  );
};

export default LoginPage;
