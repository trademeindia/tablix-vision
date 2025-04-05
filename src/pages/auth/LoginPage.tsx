
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AuthPageWrapper from '@/components/auth/AuthPageWrapper';
import { useLoginForm } from '@/hooks/use-auth-form';
import RoleTabsSection from '@/components/auth/RoleTabsSection';
import LoginForm from '@/components/auth/LoginForm';
import AuthFormTitle from '@/components/auth/AuthFormTitle';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

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
    handleGoogleSignIn
  } = useLoginForm();

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
