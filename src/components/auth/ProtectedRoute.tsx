
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Spinner from '@/components/ui/spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredAuth?: boolean; // If true, requires authentication (default), if false allows bypass
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredAuth = true // Default behavior is to require auth
}) => {
  const { isAuthenticated, isLoading, checkSession } = useAuth();
  const [isVerifying, setIsVerifying] = useState(requiredAuth && !isAuthenticated && !isLoading);
  const location = useLocation();

  // On mount, check if session is valid only if needed
  useEffect(() => {
    let mounted = true;
    
    if (requiredAuth && !isAuthenticated && !isLoading) {
      console.log('ProtectedRoute: Verifying session...');
      setIsVerifying(true);
      
      checkSession().finally(() => {
        if (mounted) {
          setIsVerifying(false);
        }
      });
    }
    
    return () => {
      mounted = false;
    };
  }, [requiredAuth, isAuthenticated, isLoading, checkSession]);

  // For development/testing - bypass authentication if not required
  if (!requiredAuth) {
    console.log('Authentication bypass: Auth not required for this route');
    return <>{children}</>;
  }

  // Show loading spinner while checking authentication
  if (isLoading || isVerifying) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Spinner size="lg" />
        <p className="text-muted-foreground mt-2">Verifying authentication...</p>
      </div>
    );
  }

  // If authentication is required but user is not authenticated, redirect to auth page
  if (requiredAuth && !isAuthenticated) {
    console.log('Not authenticated, redirecting to auth page');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If we get here, either the user is authenticated or authentication is not required
  return <>{children}</>;
};
