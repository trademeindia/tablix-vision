
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuth } from '@/contexts/AuthContext';
import Spinner from '@/components/ui/spinner';
import { PageTransition } from '@/components/ui/page-transition';

const AuthPage: React.FC = () => {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the page the user was trying to access
  const from = (location.state as any)?.from?.pathname || '/';

  useEffect(() => {
    // Redirect to dashboard if already authenticated
    if (isAuthenticated && !isLoading) {
      console.log(`User is authenticated, redirecting to ${from}`);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
        <Spinner size="lg" className="mb-4" />
        <p className="text-gray-600 font-medium">Checking authentication status...</p>
        <p className="text-gray-500 text-sm mt-2">Just a moment, please</p>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2 text-gray-800">
              Restaurant Dashboard
            </h1>
            <p className="text-gray-600 mb-3">Sign in to manage your restaurant operations</p>
            <div className="inline-block bg-amber-100 text-amber-800 px-4 py-2 rounded-lg text-sm font-medium">
              Use the demo credentials below for instant access!
            </div>
          </div>
          
          <AuthForm />
          
          <p className="mt-8 text-sm text-center text-gray-500">
            Manage menus, orders, and staff all in one place
          </p>
        </div>
      </div>
    </PageTransition>
  );
};

export default AuthPage;
