
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Spinner from '@/components/ui/spinner';
import { UserRole } from '@/hooks/auth/types/user-role.types';

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
    console.log("No authenticated user, redirecting to login");
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // For demo accounts or Google auth users, check if override is active
  const isDemoAccount = user.email?.endsWith('@demo.com') || false;
  const isGoogleAuth = user.app_metadata.provider === 'google';
  const isDemoOverrideActive = localStorage.getItem('demoOverride') === 'true';
  
  // If demo override is active, allow access regardless of roles
  if ((isDemoAccount || isGoogleAuth) && isDemoOverrideActive) {
    console.log("Demo override is active, allowing access to:", location.pathname);
    localStorage.setItem('demoOverride', 'true'); // Ensure it's set
    return <>{children}</>;
  }
  
  // Check if user has required roles (if specified)
  if (requiredRoles && requiredRoles.length > 0) {
    // Check if user has at least one of the required roles
    const hasRequiredRole = userRoles.some(role => requiredRoles.includes(role));
    
    // If user is a demo account but doesn't have required role, set demo override
    if (isDemoAccount && !hasRequiredRole) {
      console.log("Demo account without required role, enabling demo override");
      localStorage.setItem('demoOverride', 'true');
      return <>{children}</>;
    }
    
    if (!hasRequiredRole) {
      // Save debugging information to help troubleshoot
      const debugInfo = {
        requiredRoles,
        userRoles,
        location: location.pathname,
        isDemoAccount,
        isGoogleAuth,
        isDemoOverrideActive
      };
      console.log("Access denied debugging info:", debugInfo);
      
      // Redirect to unauthorized page if user doesn't have required role
      return <Navigate to="/unauthorized" state={{ 
        from: location,
        requiredRoles: requiredRoles,
        userRoles: userRoles,
      }} replace />;
    }
  }

  // User is authenticated and has required roles (if any)
  return <>{children}</>;
};

export default ProtectedRoute;
