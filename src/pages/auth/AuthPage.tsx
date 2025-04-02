
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuth } from '@/contexts/AuthContext';
import Spinner from '@/components/ui/spinner';
import { PageTransition } from '@/components/ui/page-transition';

const AuthPage: React.FC = () => {
  const { isLoading, isAuthenticated, authInitialized } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the page the user was trying to access
  const from = (location.state as any)?.from?.pathname || '/';

  // Wait for auth to initialize before attempting any redirects
  useEffect(() => {
    let redirectTimeout: NodeJS.Timeout;
    
    // Only proceed with redirect logic once auth is initialized
    if (authInitialized && !isLoading) {
      if (isAuthenticated) {
        console.log(`User is authenticated, preparing to redirect to ${from}`);
        
        // Set a flag to show redirect UI
        setIsRedirecting(true);
        
        // Add a small delay before redirecting to avoid UI flickering
        redirectTimeout = setTimeout(() => {
          console.log(`Executing redirect to ${from}`);
          navigate(from, { replace: true });
        }, 500);
      }
    }
    
    return () => {
      if (redirectTimeout) clearTimeout(redirectTimeout);
    };
  }, [isAuthenticated, navigate, from, isLoading, authInitialized]);

  // Show loading state while authentication is initializing
  if (!authInitialized || isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
        <Spinner size="lg" className="mb-4" />
        <p className="text-gray-600 font-medium">Checking authentication status...</p>
        <p className="text-gray-500 text-sm mt-2">Just a moment, please</p>
      </div>
    );
  }
  
  // Show redirect state
  if (isRedirecting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
        <Spinner size="lg" className="mb-4" />
        <p className="text-gray-600 font-medium">Authentication successful!</p>
        <p className="text-gray-500 text-sm mt-2">Redirecting to dashboard...</p>
      </div>
    );
  }

  // Show the auth form
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
              Use the "Try Demo Account" button below for instant access!
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
