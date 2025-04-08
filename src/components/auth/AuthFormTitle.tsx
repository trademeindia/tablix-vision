
import React from 'react';
import { AuthFormHeader } from '@/components/auth/AuthForm';

interface AuthFormTitleProps {
  role: string;
  isSignup?: boolean;
}

const AuthFormTitle: React.FC<AuthFormTitleProps> = ({ role, isSignup = false }) => {
  const getRoleTitle = () => {
    switch (role) {
      case 'customer': return 'Customer';
      case 'staff': return 'Staff';
      default: return 'Restaurant Owner';
    }
  };

  const title = `${getRoleTitle()} ${isSignup ? 'Sign Up' : 'Sign In'}`;
  const description = isSignup 
    ? 'Create a new account to get started with Menu 360' 
    : 'Enter your credentials to access your dashboard';

  return (
    <AuthFormHeader 
      title={title}
      description={description}
    />
  );
};

export default AuthFormTitle;
