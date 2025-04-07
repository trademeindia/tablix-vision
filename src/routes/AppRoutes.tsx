
import React, { useState, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import AdminRoutes from './AdminRoutes';
import CustomerRoutes from './CustomerRoutes';
import StaffRoutes from './StaffRoutes';
import ProfileRoutes from './ProfileRoutes';
import PublicRoutes from './PublicRoutes';
import { useAuth } from '@/contexts/AuthContext';

const AppRoutes: React.FC = () => {
  const location = useLocation();
  const [path, setPath] = useState<string>(location.pathname);
  const [loadingError, setLoadingError] = useState<boolean>(false);
  const { user, loading } = useAuth();

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

  // Always redirect to login if not authenticated and at root path
  if (path === "/" && !loading) {
    return <Navigate to="/auth/login" replace />;
  }

  // If user is authenticated at root path, redirect to their appropriate dashboard
  if (path === "/" && !loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  // If user is not logged in and trying to access a protected route, redirect to login
  if (!loading && !user) {
    if (
      path.startsWith('/customer') ||
      path.startsWith('/staff-dashboard') ||
      path.startsWith('/profile') ||
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
      return <Navigate to="/auth/login" replace />;
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
  
  // Default to public routes for any other paths
  return <PublicRoutes />;
};

export default AppRoutes;
