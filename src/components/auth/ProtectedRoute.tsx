
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Spinner from '@/components/ui/spinner';
import { UserRole } from '@/hooks/use-user-role';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
}) => {
  const { user, userRoles, loading, refreshUserRoles } = useAuth();
  const location = useLocation();
  const [authChecked, setAuthChecked] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [autoRetryCount, setAutoRetryCount] = useState(0);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  // Verify access rights when auth state or required roles change
  useEffect(() => {
    const checkAccess = async () => {
      // If still loading, wait
      if (loading) {
        console.log('Protected route: Still loading auth state...');
        return;
      }

      // If no user, no access
      if (!user) {
        console.log('Protected route: No user logged in, redirecting to login.');
        setAuthChecked(true);
        setHasAccess(false);
        return;
      }

      console.log('Protected route: User logged in as', user.email);

      // If no role requirement, grant access
      if (!requiredRoles || requiredRoles.length === 0) {
        console.log('Protected route: No roles required, granting access.');
        setAuthChecked(true);
        setHasAccess(true);
        return;
      }

      // Check if we have any roles yet
      if (userRoles.length === 0 && autoRetryCount < 2) {
        console.log('Protected route: No roles detected. Attempting to refresh roles...');
        setAutoRetryCount(prev => prev + 1);
        
        // Try to refresh roles
        try {
          const refreshedRoles = await refreshUserRoles();
          console.log('Protected route: Roles refreshed:', refreshedRoles);
          
          // We'll let the next effect run handle the updated roles
          return;
        } catch (error) {
          console.error('Protected route: Failed to refresh roles:', error);
        }
      }

      // Check user roles against required roles
      const hasRequiredRole = userRoles.some(role => requiredRoles.includes(role));
      
      console.log('Protected route role check:', { 
        userRoles, 
        requiredRoles, 
        hasAccess: hasRequiredRole,
        user: user?.email 
      });
      
      setAuthChecked(true);
      setHasAccess(hasRequiredRole);
      
      // Show toast for unauthorized access
      if (!hasRequiredRole && userRoles.length > 0) {
        toast.error(`Access denied: You need ${requiredRoles.join(' or ')} role to access this page.`);
      }
    };

    // Call check immediately
    checkAccess();
  }, [user, userRoles, requiredRoles, loading, refreshUserRoles, autoRetryCount]);

  // Debug toggle function - only in development
  const toggleDebugInfo = () => {
    if (!debugInfo) {
      const info = { 
        user: user ? { id: user.id, email: user.email, metadata: user.user_metadata } : null,
        userRoles,
        requiredRoles,
        hasAccess,
        authChecked,
        loading,
        location: location.pathname
      };
      setDebugInfo(JSON.stringify(info, null, 2));
    } else {
      setDebugInfo(null);
    }
  };

  // Show loading state while checking authentication
  if (loading || !authChecked) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-slate-600">Verifying access...</p>
          {autoRetryCount > 0 && (
            <p className="text-slate-500 text-sm mt-2">Retry attempt: {autoRetryCount}/2</p>
          )}
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  }

  // Redirect to unauthorized page if user doesn't have required role
  if (!hasAccess) {
    // Add debugging info to the state if in development
    const debugState = process.env.NODE_ENV === 'development' 
      ? { 
          from: location.pathname, 
          userRoles: userRoles, 
          requiredRoles: requiredRoles 
        }
      : { from: location.pathname };

    return <Navigate to="/unauthorized" state={debugState} replace />;
  }

  // User is authenticated and has required roles
  return (
    <>
      {children}
      
      {/* Hidden debug button - only visible in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-2 right-2 z-50">
          <button 
            onClick={toggleDebugInfo}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs px-2 py-1 rounded-md shadow-sm"
          >
            {debugInfo ? 'Hide Debug' : 'Auth Debug'}
          </button>
          {debugInfo && (
            <pre className="absolute bottom-full right-0 mb-2 p-3 bg-slate-800 text-slate-200 rounded shadow-lg text-xs max-w-md max-h-60 overflow-auto">
              {debugInfo}
            </pre>
          )}
        </div>
      )}
    </>
  );
};

export default ProtectedRoute;
