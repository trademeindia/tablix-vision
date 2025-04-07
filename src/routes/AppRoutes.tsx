
import React, { useState, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import AdminRoutes from './AdminRoutes';
import CustomerRoutes from './CustomerRoutes';
import StaffRoutes from './StaffRoutes';
import ProfileRoutes from './ProfileRoutes';
import PublicRoutes from './PublicRoutes';
import { useAuth } from '@/contexts/AuthContext';
import Spinner from '@/components/ui/spinner';

const AppRoutes: React.FC = () => {
  const location = useLocation();
  const [path, setPath] = useState<string>(location.pathname);
  const [loadingError, setLoadingError] = useState<boolean>(false);
  const { user, loading, userRoles, refreshUserRoles } = useAuth();
  const [initialLoadComplete, setInitialLoadComplete] = useState<boolean>(false);

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

  // When app loads, ensure demo accounts get proper roles
  useEffect(() => {
    const ensureDemoRoles = async () => {
      if (user?.email?.endsWith('@demo.com')) {
        console.log('Ensuring proper role for demo account:', user.email);
        
        // If no role is set, assign one based on email pattern
        if (!localStorage.getItem('lastUserRole')) {
          const email = user.email.toLowerCase();
          const defaultRole = email.includes('owner') ? 'owner' :
                             email.includes('chef') ? 'chef' :
                             email.includes('waiter') ? 'waiter' :
                             email.includes('staff') ? 'staff' : 'customer';
          
          console.log('Setting default role for demo account:', defaultRole);
          localStorage.setItem('lastUserRole', defaultRole);
          
          // Refresh roles to apply the change
          await refreshUserRoles();
        }
      }
    };
    
    if (user && !loading) {
      ensureDemoRoles();
    }
  }, [user, loading, refreshUserRoles]);

  // Mark initial load as complete once auth loading is done
  useEffect(() => {
    if (!loading && !initialLoadComplete) {
      setInitialLoadComplete(true);
      console.log('Initial auth load complete:', {
        user: user?.email,
        roles: userRoles,
        path: location.pathname
      });
    }
  }, [loading, user, userRoles, initialLoadComplete, location]);

  // Show loading spinner during the initial auth check
  if (loading && !initialLoadComplete) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-slate-600">Loading application...</p>
          <p className="text-sm text-slate-500 mt-2">Verifying authentication...</p>
        </div>
      </div>
    );
  }

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

  // Show 404 for invalid paths
  const isKnownPath = [
    '/auth', '/dashboard', '/customer', '/staff-dashboard', 
    '/profile', '/menu', '/orders', '/qr-codes', '/analytics', 
    '/tables', '/staff', '/customers', '/invoices', '/inventory', 
    '/google-drive-test', '/marketing', '/settings', '/unauthorized', '/menu360'
  ].some(prefix => path.startsWith(prefix)) || path === '/';

  if (!isKnownPath && initialLoadComplete) {
    console.log('Unknown path detected:', path);
    return <Navigate to="/auth/login" replace />;
  }

  // Special case for login page - only redirect if explicitly on login and authenticated
  if (path === "/auth/login" && !loading && user) {
    // Get the preferred redirect path based on user role
    let redirectPath = '/dashboard';
    
    // Only redirect based on role if we have roles
    if (userRoles && userRoles.length > 0) {
      if (userRoles.includes('owner') || userRoles.includes('manager')) {
        redirectPath = '/dashboard';
      } else if (userRoles.includes('customer')) {
        redirectPath = '/customer/menu';
      } else if (userRoles.includes('chef')) {
        redirectPath = '/staff-dashboard/kitchen';
      } else if (userRoles.includes('waiter') || userRoles.includes('staff')) {
        redirectPath = '/staff-dashboard/orders';
      }
    }
    
    console.log(`User already logged in as ${user.email}, redirecting to ${redirectPath}`);
    return <Navigate to={redirectPath} replace />;
  }

  // Always redirect to login if not authenticated and at root path
  if (path === "/" && !loading && !user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Special case for demo accounts - ensure they can access dashboard routes
  if (!loading && user?.email?.endsWith('@demo.com') && path === '/dashboard') {
    // Ensure role is set to owner for dashboard access
    if (!userRoles.includes('owner')) {
      // Set role in localStorage and refresh roles
      localStorage.setItem('lastUserRole', 'owner');
      refreshUserRoles();
    }
    
    // Continue to dashboard route below - don't return here!
  }

  // If user is authenticated at root path, redirect to their appropriate dashboard
  if (path === "/" && !loading && user) {
    // Determine which dashboard to show based on role
    let redirectPath = '/dashboard'; // Default to owner dashboard
    
    if (userRoles && userRoles.length > 0) {
      if (userRoles.includes('customer')) {
        redirectPath = '/customer/menu';
      } else if (userRoles.includes('chef')) {
        redirectPath = '/staff-dashboard/kitchen';
      } else if (userRoles.includes('waiter') || userRoles.includes('staff')) {
        redirectPath = '/staff-dashboard/orders';
      }
    }
    
    return <Navigate to={redirectPath} replace />;
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
      console.log('Unauthorized access attempt to protected path:', path);
      return <Navigate to="/auth/login" state={{ from: path }} replace />;
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
