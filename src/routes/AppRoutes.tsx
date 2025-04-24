import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, Navigate, Routes, Route } from 'react-router-dom';
import AdminRoutes from './AdminRoutes';
import CustomerRoutes from './CustomerRoutes';
import StaffRoutes from './StaffRoutes';
import ProfileRoutes from './ProfileRoutes';
import PublicRoutes from './PublicRoutes';
import UnauthorizedPage from '@/pages/UnauthorizedPage';
import { useAuth } from '@/contexts/AuthContext';
import { getRedirectPathByRole } from '@/hooks/auth/use-redirect-paths';
import NotFound from '@/pages/NotFound';
import Menu360LandingPage from '@/pages/landing/Menu360LandingPage';
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';
import UpdatePasswordPage from '@/pages/auth/UpdatePasswordPage';
import AuthCallbackPage from '@/pages/auth/AuthCallbackPage';

const AppRoutes: React.FC = () => {
  const location = useLocation();
  const { user, userRoles, loading } = useAuth();
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
        // console.log('Current path:', location.pathname);
        // console.log('User roles:', userRoles);
        // console.log('Redirect path:', redirectPath);
      }
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

  // console.log('AppRoutes rendering with path:', location.pathname);

  return (
    <Routes>
      {/* Landing Page - Root Path */}
      <Route path="/" element={<Menu360LandingPage />} />
      <Route path="/menu360" element={<Menu360LandingPage />} />
      <Route path="/index" element={<Navigate to="/" replace />} />
      
      {/* Auth Routes */}
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/signup" element={<SignupPage />} />
      <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
      <Route path="/auth/update-password" element={<UpdatePasswordPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      
      {/* Legacy auth route redirects */}
      <Route path="/login" element={<Navigate to="/auth/login" replace />} />
      <Route path="/signup" element={<Navigate to="/auth/signup" replace />} />
      <Route path="/reset-password" element={<Navigate to="/auth/reset-password" replace />} />
      <Route path="/update-password" element={<Navigate to="/auth/update-password" replace />} />
      <Route path="/callback" element={<Navigate to="/auth/callback" replace />} />
      
      {/* Other Public Routes */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/customer-menu" element={<Navigate to="/customer/menu" replace />} />
      
      {/* Customer routes */}
      <Route path="/customer/*" element={<CustomerRoutes />} />
      
      {/* Staff routes */}
      <Route path="/staff-dashboard/*" element={<StaffRoutes />} />
      
      {/* Profile routes */}
      <Route path="/profile/*" element={<ProfileRoutes />} />
      
      {/* Admin dashboard routes - configure with wildcard to properly handle nested routes */}
      <Route path="/*" element={<AdminRoutes />} />
      
      {/* Fallback for all other paths */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
