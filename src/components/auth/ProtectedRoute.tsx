
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Spinner from '@/components/ui/spinner';
import { UserRole } from '@/hooks/use-user-role';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
}) => {
  const { user, userRoles, loading } = useAuth();
  const location = useLocation();
  
  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Spinner size="lg" />
        <p className="ml-2 text-lg font-medium">Authenticating...</p>
      </div>
    );
  }

  // DEVELOPMENT MODE: Allow access to all routes for easier development
  const isDevelopment = import.meta.env.DEV || true; // Force dev mode for now
  if (isDevelopment) {
    console.log('Development mode: bypassing authentication checks');
    return <>{children}</>;
  }

  // Regular authentication flow
  if (!user) {
    // Redirect to login if not authenticated
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (requiredRoles && requiredRoles.length > 0) {
    // Check if user has at least one of the required roles
    const hasRequiredRole = userRoles.some(role => requiredRoles.includes(role));
    
    if (!hasRequiredRole) {
      console.log('Unauthorized, redirecting to unauthorized page');
      // Redirect to unauthorized page if user doesn't have required role
      return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
