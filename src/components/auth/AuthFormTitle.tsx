
import React from 'react';
import { AuthFormHeader } from '@/components/auth/AuthForm';

interface AuthFormTitleProps {
  role: string;
  isSignup?: boolean;
}

const AuthFormTitle: React.FC<AuthFormTitleProps> = ({ role, isSignup = false }) => {
  const getRoleTitle = () => {
    switch (role) {
      case 'owner': return 'Restaurant Owner';
      case 'manager': return 'Restaurant Manager';
      case 'waiter': return 'Restaurant Waiter';
      case 'chef': return 'Kitchen Staff';
      default: return 'Restaurant Staff';
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
