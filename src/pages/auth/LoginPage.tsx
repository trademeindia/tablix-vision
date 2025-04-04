
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AuthPageWrapper from '@/components/auth/AuthPageWrapper';
import { useLoginForm } from '@/hooks/use-auth-form';
import RoleTabsSection from '@/components/auth/RoleTabsSection';
import LoginForm from '@/components/auth/LoginForm';
import AuthFormTitle from '@/components/auth/AuthFormTitle';

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
