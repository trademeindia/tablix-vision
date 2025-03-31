
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuthStatus } from '@/hooks/use-auth-status';
import { Loader2 } from 'lucide-react';

const AuthPage: React.FC = () => {
  const { isLoading, isAuthenticated } = useAuthStatus();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Restaurant Management Dashboard</h1>
        <p className="text-muted-foreground">Sign in to manage your restaurant</p>
      </div>
      
      <AuthForm />
      
      <p className="mt-8 text-sm text-muted-foreground text-center">
        Manage your menus, orders, and staff all in one place.
      </p>
    </div>
  );
};

export default AuthPage;
