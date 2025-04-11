
import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import AdminRoutes from './AdminRoutes';
import CustomerRoutes from './CustomerRoutes';
import StaffRoutes from './StaffRoutes';
import ProfileRoutes from './ProfileRoutes';
import PublicRoutes from './PublicRoutes';
import { useAuth } from '@/contexts/AuthContext';
import { getRedirectPathByRole, hasRoutePermission } from '@/hooks/auth/use-redirect-paths';

const AppRoutes: React.FC = () => {
  const location = useLocation();
  const { user, userRoles, loading } = useAuth();
  const [path, setPath] = useState<string>(location.pathname);
  const [loadingError, setLoadingError] = useState<boolean>(false);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);

  // Check for demo override
  const isDemoOverrideActive = localStorage.getItem('demoOverride') === 'true';
  const isDemoUser = user?.email?.endsWith('@demo.com') || false;

  // Memoize the primary role and redirect path to avoid recalculations
  const { primaryRole, redirectPath } = useMemo(() => {
    if (userRoles && userRoles.length > 0) {
      const role = userRoles[0];
      return { 
        primaryRole: role, 
        redirectPath: getRedirectPathByRole(role) 
      };
    }
    return { primaryRole: null, redirectPath: '/customer/menu' };
  }, [userRoles]);

  useEffect(() => {
    try {
      // Only log in development mode
      if (process.env.NODE_ENV === 'development') {
        console.log('Current path:', location.pathname);
      }
      setPath(location.pathname);
      setLoadingError(false);
    } catch (error) {
      console.error('Error updating route:', error);
      setLoadingError(true);
    }
  }, [location]);

  // Handle initial page load - prevent automatic redirects except explicit ones
  useEffect(() => {
    if (!loading) {
      // Mark that initial load is complete after a short delay
      // This delay ensures landing page is visible before any redirects
      const timer = setTimeout(() => {
        setInitialLoad(false);
      }, 3000); // 3 second delay before allowing redirects
      
      return () => clearTimeout(timer);
    }
  }, [loading]);

  // Show error message if route loading failed
  if (loadingError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Navigation error</h1>
        <p className="mb-6">We encountered a problem loading this page.</p>
        <button 
          className="px-4 py-2 bg-primary text-white rounded-md"
          onClick={() => window.location.reload()}
        >
          Refresh Page
        </button>
      </div>
    );
  }

  // Critical: If we're at the root path (/) OR menu360 path, always show the landing page
  // This prevents the "bounce" effect completely for these key landing pages
  if (path === '/' || path === '/menu360') {
    return <PublicRoutes />;
  }
  
  // Auth pages should always be accessible regardless of login status
  if (path.startsWith('/auth/')) {
    return <PublicRoutes />;
  }
  
  // Only redirect authenticated users from index page after login AND explicit navigation
  if (path === '/index' && user && !loading && !initialLoad) {
    return <Navigate to={redirectPath} replace />;
  }

  // For demo users with override active, redirect to appropriate dashboard
  if (isDemoUser && isDemoOverrideActive && path === '/unauthorized') {
    return <Navigate to={redirectPath} replace />;
  }

  // Special case for the unauthorized page when using demo override
  if (path === '/unauthorized' && isDemoUser && location.state?.from?.pathname) {
    // If demo override is active, redirect to the original destination
    if (isDemoOverrideActive) {
      return <Navigate to={location.state.from.pathname} replace />;
    }
  }

  // Handle the public customer-menu route separately
  if (path === '/customer-menu') {
    return <PublicRoutes />;
  }

  // Check if the user has permission for the requested path
  if (user && !loading && !initialLoad && userRoles.length > 0) {
    const hasPermission = hasRoutePermission(path, userRoles);
    
    // If user doesn't have permission for the requested path and isn't already being redirected
    if (!hasPermission && path !== '/unauthorized' && !path.startsWith('/auth/')) {
      console.log(`User lacks permission for ${path}, redirecting to unauthorized`);
      return <Navigate to="/unauthorized" state={{ from: location, requiredRoles: [], userRoles }} replace />;
    }
  }

  // Conditionally render route groups based on the current path
  if (path.startsWith('/customer')) {
    return <CustomerRoutes />;
  } else if (path.startsWith('/staff-dashboard')) {
    return <StaffRoutes />;
  } else if (path.startsWith('/profile')) {
    return <ProfileRoutes />;
  } else if (
    path.startsWith('/dashboard') || 
    path.startsWith('/menu') ||
    path.startsWith('/orders') ||
    path.startsWith('/qr-codes') ||
    path.startsWith('/analytics') ||
    path.startsWith('/tables') ||
    path.startsWith('/staff') ||
    path.startsWith('/customers') ||
    path.startsWith('/invoices') ||
    path.startsWith('/inventory') ||
    path.startsWith('/google-drive-test') ||
    path.startsWith('/marketing') ||
    path.startsWith('/settings')
  ) {
    return <AdminRoutes />;
  }
  
  // Default to public routes for all other paths
  return <PublicRoutes />;
};

export default AppRoutes;
