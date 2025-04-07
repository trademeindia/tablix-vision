
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Home, ArrowLeft, LogOut, Info, RefreshCcw } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface LocationState {
  from?: string;
  userRoles?: string[];
  requiredRoles?: string[];
  savedRole?: string;
}

const UnauthorizedPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userRoles, signOut, refreshUserRoles } = useAuth();
  const [showDebug, setShowDebug] = useState(true); // Show debug by default to help diagnose
  const [retrying, setRetrying] = useState(false);
  
  // Get state information passed to this page
  const state = location.state as LocationState || {};
  const fromPath = state.from || '/';
  const stateUserRoles = state.userRoles || userRoles;
  const stateRequiredRoles = state.requiredRoles || [];
  const stateSavedRole = state.savedRole || localStorage.getItem('lastUserRole');
  
  // Handle Force Dashboard Access - Emergency override for demo purposes
  const forceDashboardAccess = () => {
    try {
      console.log('Forcing dashboard access by setting role to owner');
      
      // Set role to owner (highest privilege) to ensure access
      localStorage.setItem('lastUserRole', 'owner');
      
      // Refresh user roles
      refreshUserRoles().then(() => {
        console.log('Roles refreshed, navigating to dashboard');
        toast.success('Override applied! Redirecting to dashboard...');
        
        // Navigate to dashboard with slight delay to ensure state updates
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1000);
      });
    } catch (error) {
      console.error('Error forcing dashboard access:', error);
      toast.error('Could not override access restrictions');
    }
  };
  
  // Handle logout
  const handleLogout = async () => {
    try {
      setRetrying(true);
      toast.info('Logging you out...');
      
      // Clear any role-related localStorage before logout
      localStorage.removeItem('lastUserRole');
      
      // Perform the logout
      const result = await signOut();
      
      if (result.error) {
        console.error('Logout error:', result.error);
        toast.error('Failed to log out properly. Please try again.');
        setRetrying(false);
        return;
      }
      
      // After successful logout, navigate to login page with a slight delay
      // to ensure the auth state is fully updated
      setTimeout(() => {
        navigate('/auth/login', { replace: true });
        setRetrying(false);
      }, 1500);
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out. Please try again.');
      setRetrying(false);
    }
  };
  
  // Go back to previous page
  const goBack = () => {
    navigate(-1);
  };
  
  // Try to reload user's roles and retry navigation
  const retryNavigation = async () => {
    setRetrying(true);
    try {
      toast.info('Refreshing your access permissions...');
      
      // Clear role from localStorage to force a fresh fetch
      localStorage.removeItem('lastUserRole');
      
      // Attempt to refresh roles
      await refreshUserRoles();
      
      // Attempt to navigate to the original destination after a short delay
      // This gives time for any role updates to propagate
      setTimeout(() => {
        navigate(fromPath, { replace: true });
        setRetrying(false);
      }, 1500);
    } catch (error) {
      console.error('Error retrying navigation:', error);
      toast.error('Failed to refresh permissions. Please try again.');
      setRetrying(false);
    }
  };
  
  // Go to dashboard based on role
  const goToDashboard = () => {
    // Determine appropriate dashboard based on role
    if (userRoles.includes('customer')) {
      navigate('/customer/menu', { replace: true });
    } else if (userRoles.includes('chef')) {
      navigate('/staff-dashboard/kitchen', { replace: true });
    } else if (userRoles.includes('waiter')) {
      navigate('/staff-dashboard/orders', { replace: true });
    } else {
      navigate('/dashboard', { replace: true });
    }
  };
  
  // Try to login as a different role
  const goToLoginPage = () => {
    // We're already logged in, so we need to log out first
    localStorage.removeItem('lastUserRole');
    navigate('/auth/login', { replace: true });
  };
  
  // Log diagnostic information
  useEffect(() => {
    console.log('UnauthorizedPage mounted with state:', {
      fromPath,
      stateUserRoles,
      stateRequiredRoles,
      currentUserRoles: userRoles,
      savedRole: localStorage.getItem('lastUserRole'),
      user: user?.email
    });
  }, [fromPath, stateUserRoles, stateRequiredRoles, userRoles, user]);

  return (
    <>
      <Helmet>
        <title>Access Denied | Menu 360</title>
      </Helmet>
      
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 sm:p-6">
        <div className="w-full max-w-md shadow-lg rounded-lg border border-slate-200 bg-white p-6">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="text-lg font-bold">Access Denied</AlertTitle>
            <AlertDescription className="mt-2">
              You do not have permission to access this page.
              {user && (
                <div className="mt-2 text-sm">
                  <p>You are logged in as: <span className="font-medium">{user.email}</span></p>
                  <p>Your current role{userRoles.length > 1 ? 's' : ''}: {' '}
                    <span className="font-medium">{userRoles.join(', ') || 'None assigned'}</span>
                  </p>
                  {stateSavedRole && (
                    <p>Saved role in localStorage: {' '}
                      <span className="font-medium">{stateSavedRole}</span>
                    </p>
                  )}
                  {stateRequiredRoles && stateRequiredRoles.length > 0 && (
                    <p>Required role{stateRequiredRoles.length > 1 ? 's' : ''}: {' '}
                      <span className="font-medium">{stateRequiredRoles.join(' or ')}</span>
                    </p>
                  )}
                </div>
              )}
            </AlertDescription>
          </Alert>
          
          <div className="mb-6">
            <button 
              onClick={() => setShowDebug(!showDebug)}
              className="flex w-full items-center justify-between rounded-md bg-amber-50 p-3 text-sm font-medium text-amber-800 hover:bg-amber-100"
            >
              <span className="flex items-center">
                <Info className="mr-2 h-4 w-4" />
                {showDebug ? 'Hide Debug Information' : 'Show Debug Information'}
              </span>
            </button>
            
            {showDebug && (
              <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-md overflow-auto max-h-48">
                <h3 className="text-sm font-medium text-slate-800">Debug Information</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Required role{stateRequiredRoles.length > 1 ? 's' : ''}: {stateRequiredRoles.join(', ') || 'None specified'}
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  Current role{userRoles.length > 1 ? 's' : ''}: {userRoles.join(', ') || 'None assigned'}
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  Attempted to access: {fromPath}
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  User ID: {user?.id || 'Not logged in'}
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  User email: {user?.email || 'Not available'}
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  Local storage role: {localStorage.getItem('lastUserRole') || 'Not set'}
                </p>
                {user?.user_metadata && (
                  <p className="text-xs text-slate-600 mt-1">
                    User metadata: {JSON.stringify(user.user_metadata, null, 2)}
                  </p>
                )}
              </div>
            )}
          </div>
          
          <div className="p-3 mb-6 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="text-sm font-medium text-blue-800 mb-1">🔧 Demo Access Override</h3>
            <p className="text-xs text-blue-700 mb-2">
              Having trouble accessing the dashboard? Use this button to override access restrictions 
              for demo purposes.
            </p>
            <Button
              onClick={forceDashboardAccess}
              variant="outline"
              className="w-full bg-blue-100 border-blue-300 hover:bg-blue-200 text-blue-800"
            >
              Access Dashboard (Demo Override)
            </Button>
          </div>
          
          <p className="text-center text-slate-500 mb-6">
            If you believe this is an error, try refreshing your session, logging in with a different account, or contact your administrator.
          </p>
          
          <div className="flex flex-col space-y-3">
            <Button 
              onClick={retryNavigation} 
              variant="default"
              className="flex items-center justify-center"
              disabled={retrying}
            >
              <RefreshCcw className={`mr-2 h-4 w-4 ${retrying ? 'animate-spin' : ''}`} />
              {retrying ? 'Trying again...' : 'Refresh Access'}
            </Button>
            
            <Button onClick={goBack} variant="outline" className="flex items-center justify-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            
            <Button onClick={goToDashboard} variant="outline" className="flex items-center justify-center">
              <Home className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Button>
            
            <Button 
              variant="outline" 
              onClick={goToLoginPage} 
              className="flex items-center justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Login with a Different Role
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={handleLogout} 
              className="flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50"
              disabled={retrying}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {retrying ? 'Logging out...' : 'Logout'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UnauthorizedPage;
