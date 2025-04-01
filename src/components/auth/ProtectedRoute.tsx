
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStatus } from '@/hooks/use-auth-status';
import Spinner from '@/components/ui/spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoading, isAuthenticated, checkSession } = useAuthStatus();
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const verify = async () => {
      try {
        console.log('Verifying session in ProtectedRoute...');
        await checkSession();
      } catch (error) {
        console.error("Error verifying session:", error);
      } finally {
        setIsChecking(false);
      }
    };
    
    verify();
  }, [checkSession]);

  // Show loading state while checking authentication status
  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Spinner size="lg" className="mb-4" />
        <p className="text-gray-600 font-medium">Verifying your session...</p>
        <p className="text-gray-500 text-sm mt-2">Please wait while we authenticate you</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to /auth');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Render children if authenticated
  console.log('User authenticated, rendering protected content');
  return <>{children}</>;
};
