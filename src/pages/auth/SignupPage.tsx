
import React from 'react';
import AuthPageWrapper from '@/components/auth/AuthPageWrapper';
import { useSignupForm } from '@/hooks/use-auth-form';
import RoleTabsSection from '@/components/auth/RoleTabsSection';
import SignupForm from '@/components/auth/SignupForm';
import AuthFormTitle from '@/components/auth/AuthFormTitle';

const SignupPage = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    name,
    setName,
    isSubmitting,
    error,
    role,
    handleRoleChange,
    handleSubmit,
    handleGoogleSignUp
  } = useSignupForm();

  return (
    <AuthPageWrapper title="Sign Up">
      <div>
        <RoleTabsSection role={role} handleRoleChange={handleRoleChange} />
        
        <div>
          <AuthFormTitle role={role} isSignup={true} />
          
          <SignupForm 
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            name={name}
            setName={setName}
            isSubmitting={isSubmitting}
            error={error}
            role={role}
            handleSubmit={handleSubmit}
            handleGoogleSignUp={handleGoogleSignUp}
          />
        </div>
      </div>
    </AuthPageWrapper>
  );
};

export default SignupPage;
