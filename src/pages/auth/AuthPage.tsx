
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 text-gray-800">
            Restaurant Dashboard
          </h1>
          <p className="text-gray-600">Sign in to manage your restaurant operations</p>
        </div>
        
        <AuthForm />
        
        <p className="mt-8 text-sm text-center text-gray-500">
          Manage menus, orders, and staff all in one place
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
