
import React from 'react';
import { AuthFormHeader } from '@/components/auth/AuthForm';

interface AuthFormTitleProps {
  role: string;
  isSignup?: boolean;
}

const AuthFormTitle: React.FC<AuthFormTitleProps> = ({ role, isSignup = false }) => {
  const title = role === 'customer' ? `Customer ${isSignup ? 'Sign Up' : 'Login'}` : 
               role === 'staff' ? `Staff ${isSignup ? 'Sign Up' : 'Login'}` : 
               `Owner ${isSignup ? 'Sign Up' : 'Login'}`;

  const description = isSignup ? 'Create a new account to get started' : 
                     'Enter your credentials to access your account';

  return (
    <AuthFormHeader 
      title={title}
      description={description}
    />
  );
};

export default AuthFormTitle;
