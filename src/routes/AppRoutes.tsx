
import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, Navigate, Routes, Route } from 'react-router-dom';
import AdminRoutes from './AdminRoutes';
import CustomerRoutes from './CustomerRoutes';
import StaffRoutes from './StaffRoutes';
import ProfileRoutes from './ProfileRoutes';
import PublicRoutes from './PublicRoutes';
import UnauthorizedPage from '@/pages/UnauthorizedPage';
import { useAuth } from '@/contexts/AuthContext';
import { getRedirectPathByRole, hasRoutePermission } from '@/hooks/auth/use-redirect-paths';
import NotFound from '@/pages/NotFound';

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
        console.log('User roles:', userRoles);
        console.log('Redirect path:', redirectPath);
      }
      setPath(location.pathname);
      setLoadingError(false);
    } catch (error) {
      console.error('Error updating route:', error);
      setLoadingError(true);
    }
  }, [location, redirectPath, userRoles]);

  // Handle initial page load - prevent automatic redirects except explicit ones
  useEffect(() => {
    if (!loading) {
      // Mark that initial load is complete after a short delay
      // This delay ensures landing page is visible before any redirects
      const timer = setTimeout(() => {
        setInitialLoad(false);
      }, 1000); // 1 second delay before allowing redirects
      
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

  // Check if current path is an auth route
  const isAuthRoute = path.startsWith('/auth/') || 
                      ['login', 'signup', 'reset-password', 'update-password', 'callback'].some(
                        route => path === `/${route}` || path === `/auth/${route}`
                      );

  return (
    <Routes>
      {/* First check for auth-related routes */}
      <Route path="/auth/*" element={<PublicRoutes />} />
      <Route path="/login" element={<Navigate to="/auth/login" replace />} />
      <Route path="/signup" element={<Navigate to="/auth/signup" replace />} />
      <Route path="/reset-password" element={<Navigate to="/auth/reset-password" replace />} />
      <Route path="/update-password" element={<Navigate to="/auth/update-password" replace />} />
      <Route path="/callback" element={<Navigate to="/auth/callback" replace />} />
      
      {/* Public and landing routes */}
      <Route path="/" element={<PublicRoutes />} />
      <Route path="/menu360" element={<PublicRoutes />} />
      <Route path="/index" element={<PublicRoutes />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/customer-menu" element={<PublicRoutes />} />
      
      {/* Protected routes */}
      <Route path="/customer/*" element={<CustomerRoutes />} />
      <Route path="/staff-dashboard/*" element={<StaffRoutes />} />
      <Route path="/profile/*" element={<ProfileRoutes />} />
      
      {/* Admin routes */}
      <Route path="/dashboard/*" element={<AdminRoutes />} />
      <Route path="/menu/*" element={<AdminRoutes />} />
      <Route path="/analytics/*" element={<AdminRoutes />} />
      <Route path="/orders/*" element={<AdminRoutes />} />
      <Route path="/qr-codes/*" element={<AdminRoutes />} />
      <Route path="/tables/*" element={<AdminRoutes />} />
      <Route path="/staff/*" element={<AdminRoutes />} />
      <Route path="/customers/*" element={<AdminRoutes />} />
      <Route path="/invoices/*" element={<AdminRoutes />} />
      <Route path="/inventory/*" element={<AdminRoutes />} />
      <Route path="/marketing/*" element={<AdminRoutes />} />
      <Route path="/google-drive-test/*" element={<AdminRoutes />} />
      <Route path="/settings/*" element={<AdminRoutes />} />
      
      {/* Fallback for all other paths */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
