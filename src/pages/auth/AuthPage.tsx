
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuth } from '@/contexts/AuthContext';
import Spinner from '@/components/ui/spinner';
import { PageTransition } from '@/components/ui/page-transition';
import { DEMO_EMAIL, DEMO_PASSWORD } from '@/constants/auth-constants';
import { toast } from '@/hooks/use-toast';

const AuthPage: React.FC = () => {
  const { isLoading, isAuthenticated, authInitialized, checkSession, signIn } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [hasCheckedSession, setHasCheckedSession] = useState(false);
  const [isLongLoadingState, setIsLongLoadingState] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the page the user was trying to access
  const from = (location.state as any)?.from?.pathname || '/';

  // Set a timeout to show additional message if loading takes too long
  useEffect(() => {
    let longLoadingTimeout: NodeJS.Timeout;
    
    if (isLoading && !isLongLoadingState) {
      longLoadingTimeout = setTimeout(() => {
        setIsLongLoadingState(true);
      }, 5000);
    }
    
    return () => {
      if (longLoadingTimeout) clearTimeout(longLoadingTimeout);
    };
  }, [isLoading, isLongLoadingState]);

  // Check session only once on initial render
  useEffect(() => {
    let mounted = true;
    
    // Only check session if authentication is initialized but user is not authenticated yet
    if (authInitialized && !isAuthenticated && !isLoading && !hasCheckedSession) {
      const verifyAuth = async () => {
        try {
          console.log('AuthPage: Verifying session...');
          await checkSession();
        } finally {
          if (mounted) {
            setHasCheckedSession(true);
          }
        }
      };
      
      verifyAuth();
    }
    
    // For testing: Auto sign-in with demo account in development
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('autoDemo') === 'true' && !isAuthenticated && !isLoading && hasCheckedSession) {
      const tryAutoDemo = async () => {
        try {
          console.log('Attempting auto demo login');
          toast({
            title: 'Auto Demo Login',
            description: 'Attempting to log in with demo account...'
          });
          
          await signIn(DEMO_EMAIL, DEMO_PASSWORD);
        } catch (error) {
          console.error('Auto demo login failed:', error);
        }
      };
      
      setTimeout(tryAutoDemo, 1000);
    }
    
    return () => {
      mounted = false;
    };
  }, [authInitialized, isAuthenticated, isLoading, checkSession, hasCheckedSession, location.search, signIn]);

  // Handle redirect after authentication with debouncing
  useEffect(() => {
    let redirectTimeout: NodeJS.Timeout;
    
    // Only proceed with redirect logic once auth is initialized and not loading
    if (authInitialized && !isLoading && hasCheckedSession) {
      if (isAuthenticated && !isRedirecting) {
        // Set a flag to show redirect UI and prevent duplicate redirects
        setIsRedirecting(true);
        
        // Add a small delay before redirecting to avoid UI flickering
        redirectTimeout = setTimeout(() => {
          console.log('Authentication successful, redirecting to:', from);
          navigate(from, { replace: true });
        }, 800); // Longer delay to allow animations to complete
      }
    }
    
    return () => {
      if (redirectTimeout) clearTimeout(redirectTimeout);
    };
  }, [isAuthenticated, navigate, from, isLoading, authInitialized, hasCheckedSession, isRedirecting]);

  // Emergency reset option for users stuck in loading state
  const handleEmergencyReset = async () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      console.log('Emergency reset: Storage cleared');
      toast({
        title: 'Storage Reset',
        description: 'Local storage cleared. Please try signing in again.'
      });
      window.location.reload();
    } catch (error) {
      console.error('Error during emergency reset:', error);
    }
  };

  // Show loading state while authentication is initializing or verifying
  if (!authInitialized || isLoading || (!hasCheckedSession && !isAuthenticated)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
        <Spinner size="lg" className="mb-4" />
        <p className="text-gray-600 font-medium">Checking authentication status...</p>
        <p className="text-gray-500 text-sm mt-2">Just a moment, please</p>
        
        {isLongLoadingState && (
          <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg max-w-sm text-center">
            <p className="text-amber-800 mb-3">Taking longer than expected?</p>
            <button 
              onClick={handleEmergencyReset}
              className="text-sm bg-amber-100 hover:bg-amber-200 text-amber-900 px-4 py-2 rounded-md border border-amber-300"
            >
              Reset Authentication
            </button>
          </div>
        )}
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
    <PageTransition duration={400}>
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
