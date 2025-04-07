
import React from 'react';
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
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { isInitializing, initializeDemoAccounts } = useDemoAccounts();
  
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
  
  // Ensure demo accounts are created
  React.useEffect(() => {
    initializeDemoAccounts();
  }, [initializeDemoAccounts]);
  
  const handleSelectDemo = async (credentials: { email: string; password: string; role: string }) => {
    try {
      toast.loading('Logging in with demo account...');
      
      await handleDemoLogin(credentials);
    } catch (e) {
      console.error('Demo login error:', e);
      toast.error('An unexpected error occurred');
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
    </AuthPageWrapper>
  );
};

export default LoginPage;
