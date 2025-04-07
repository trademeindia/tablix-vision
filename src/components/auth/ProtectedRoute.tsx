
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

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check if user has required roles (if specified)
  if (requiredRoles && requiredRoles.length > 0) {
    // Check if user has at least one of the required roles
    const hasRequiredRole = userRoles.some(role => requiredRoles.includes(role));
    
    if (!hasRequiredRole) {
      // Redirect to unauthorized page if user doesn't have required role
      return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }
  }

  // User is authenticated and has required roles (if any)
  return <>{children}</>;
};

export default ProtectedRoute;
