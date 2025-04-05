
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthPageWrapper from '@/components/auth/AuthPageWrapper';
import { useLoginForm } from '@/hooks/use-auth-form';
import RoleTabsSection from '@/components/auth/RoleTabsSection';
import LoginForm from '@/components/auth/LoginForm';
import AuthFormTitle from '@/components/auth/AuthFormTitle';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Spinner from '@/components/ui/spinner';

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role') || 'customer';
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  // If user is already authenticated, redirect to appropriate dashboard
  useEffect(() => {
    if (user) {
      const redirectPath = roleParam === 'customer' ? '/customer/menu' :
                       roleParam === 'staff' ? '/staff-dashboard' :
                       roleParam === 'owner' ? '/dashboard' : '/';
      navigate(redirectPath);
    }
  }, [user, roleParam, navigate]);
  
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
    handleGoogleSignIn
  } = useLoginForm({ 
    redirectTo: roleParam === 'customer' ? '/customer/menu' : 
               roleParam === 'staff' ? '/staff-dashboard' : 
               roleParam === 'owner' ? '/dashboard' : '/' 
  });

  // Handle initial role from URL parameter
  useEffect(() => {
    if (roleParam) {
      handleRoleChange(roleParam);
    }
  }, [roleParam]);

  if (authLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Spinner size="lg" />
        <p className="ml-2 text-lg font-medium">Checking authentication...</p>
      </div>
    );
  }

  return (
    <AuthPageWrapper title="Login">
      <div>
        <RoleTabsSection role={role} handleRoleChange={handleRoleChange} />
        
        <div>
          <AuthFormTitle role={role} isSignup={false} />
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
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
        </div>
      </div>
    </AuthPageWrapper>
  );
};

export default LoginPage;
