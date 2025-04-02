
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Spinner from '@/components/ui/spinner';
import { toast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredAuth?: boolean; // If true, requires authentication (default), if false allows bypass
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredAuth = true // Default behavior is to require auth
}) => {
  const { isAuthenticated, isLoading, checkSession, authInitialized } = useAuth();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  const location = useLocation();

  // On mount, check if session is valid only if needed
  useEffect(() => {
    let mounted = true;
    
    const verifySession = async () => {
      // Limit verification attempts to prevent loops
      if (verificationAttempts >= 2) {
        console.log('ProtectedRoute: Max verification attempts reached, stopping checks');
        if (mounted) {
          setIsVerifying(false);
        }
        return;
      }
      
      if (requiredAuth && !isAuthenticated && authInitialized && !isLoading) {
        console.log('ProtectedRoute: Verifying session...');
        setIsVerifying(true);
        
        try {
          const isValid = await checkSession();
          
          if (!isValid && mounted && verificationAttempts === 0) {
            // If on first attempt we failed, show toast
            toast({
              title: "Authentication Required",
              description: "Please sign in to access this page",
              variant: "default"
            });
          }
        } finally {
          if (mounted) {
            setVerificationAttempts(prev => prev + 1);
            setIsVerifying(false);
          }
        }
      }
    };
    
    verifySession();
    
    return () => {
      mounted = false;
    };
  }, [requiredAuth, isAuthenticated, isLoading, checkSession, authInitialized, verificationAttempts]);

  // For development/testing - bypass authentication if not required
  if (!requiredAuth) {
    console.log('Authentication bypass: Auth not required for this route');
    return <>{children}</>;
  }

  // Show loading spinner while auth is initializing or checking authentication
  if (isLoading || isVerifying || !authInitialized) {
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
