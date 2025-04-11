
import React, { useState, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import AdminRoutes from './AdminRoutes';
import CustomerRoutes from './CustomerRoutes';
import StaffRoutes from './StaffRoutes';
import ProfileRoutes from './ProfileRoutes';
import PublicRoutes from './PublicRoutes';
import { useAuth } from '@/contexts/AuthContext';
import { getRedirectPathByRole } from '@/hooks/auth/use-redirect-paths';

const AppRoutes: React.FC = () => {
  const location = useLocation();
  const { user, userRoles, loading } = useAuth();
  const [path, setPath] = useState<string>(location.pathname);
  const [loadingError, setLoadingError] = useState<boolean>(false);

  // Check for demo override
  const isDemoOverrideActive = localStorage.getItem('demoOverride') === 'true';
  const isDemoUser = user?.email?.endsWith('@demo.com') || false;

  useEffect(() => {
    try {
      // Log the current path to help with debugging
      console.log('Current path:', location.pathname);
      setPath(location.pathname);
      setLoadingError(false);
    } catch (error) {
      console.error('Error updating route:', error);
      setLoadingError(true);
    }
  }, [location]);

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

  // Don't redirect from root path if the user is not logged in
  if (path === '/' && !user && !loading) {
    console.log('Anonymous user at root path, showing landing page');
    // Just render the normal route
  }
  
  // Only redirect authenticated users from the root path after login
  if (path === '/' && user && !loading) {
    console.log('Authenticated user at root path. Redirecting based on role:', userRoles);
    
    if (userRoles && userRoles.length > 0) {
      const primaryRole = userRoles[0];
      const redirectPath = getRedirectPathByRole(primaryRole);
      console.log(`Redirecting to ${redirectPath} based on primary role ${primaryRole}`);
      return <Navigate to={redirectPath} replace />;
    } else {
      console.log('No roles found, defaulting to customer menu');
      return <Navigate to="/customer/menu" replace />;
    }
  }

  // For demo users with override active, redirect to appropriate dashboard based on role
  if (isDemoUser && isDemoOverrideActive && path === '/unauthorized') {
    if (userRoles && userRoles.length > 0) {
      const primaryRole = userRoles[0];
      const redirectPath = getRedirectPathByRole(primaryRole);
      console.log(`Demo user with override, redirecting to ${redirectPath}`);
      return <Navigate to={redirectPath} replace />;
    }
  }

  // Special case for the unauthorized page when using demo override
  if (path === '/unauthorized' && isDemoUser && location.state?.from?.pathname) {
    // If we're on the unauthorized page but demo override is active, redirect to the original destination
    if (isDemoOverrideActive) {
      return <Navigate to={location.state.from.pathname} replace />;
    }
  }

  // Handle the public customer-menu route separately
  // But only if the path is explicitly /customer-menu
  if (path === '/customer-menu') {
    return <PublicRoutes />;
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
  
  // Default to public routes
  return <PublicRoutes />;
};

export default AppRoutes;
