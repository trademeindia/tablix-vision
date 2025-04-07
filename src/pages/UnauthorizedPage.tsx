
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Home, ArrowLeft, LogOut } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';

interface LocationState {
  from?: string;
  userRoles?: string[];
  requiredRoles?: string[];
}

const UnauthorizedPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userRoles, signOut } = useAuth();
  
  // Get state information passed to this page
  const state = location.state as LocationState || {};
  const fromPath = state.from || '/';
  const stateUserRoles = state.userRoles || [];
  const stateRequiredRoles = state.requiredRoles || [];
  
  // Handle logout
  const handleLogout = async () => {
    await signOut();
    navigate('/auth/login', { replace: true });
  };
  
  // Go back to previous page
  const goBack = () => {
    navigate(-1);
  };

  return (
    <>
      <Helmet>
        <title>Access Denied | Menu 360</title>
      </Helmet>
      
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-md">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="text-lg font-bold">Access Denied</AlertTitle>
            <AlertDescription className="mt-2">
              You do not have permission to access this page.
              {user && (
                <div className="mt-2 text-sm">
                  <p>You are logged in as: <span className="font-medium">{user.email}</span></p>
                  <p>Your current role{userRoles.length > 1 ? 's' : ''}: {' '}
                    <span className="font-medium">{userRoles.join(', ')}</span>
                  </p>
                </div>
              )}
            </AlertDescription>
          </Alert>
          
          {process.env.NODE_ENV === 'development' && stateRequiredRoles.length > 0 && (
            <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <h3 className="text-sm font-medium text-amber-800">Debug Information</h3>
              <p className="text-xs text-amber-700 mt-1">
                Required role{stateRequiredRoles.length > 1 ? 's' : ''}: {stateRequiredRoles.join(', ')}
              </p>
              <p className="text-xs text-amber-700 mt-1">
                Attempted to access: {fromPath}
              </p>
            </div>
          )}
          
          <p className="text-center text-slate-500 mb-6">
            Please contact your administrator if you believe this is an error.
          </p>
          
          <div className="flex flex-col space-y-2">
            <Button onClick={goBack} variant="outline" className="flex items-center justify-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            
            <Button asChild>
              <Link to="/" className="flex items-center justify-center">
                <Home className="mr-2 h-4 w-4" />
                Go to Home
              </Link>
            </Button>
            
            <Button variant="ghost" onClick={handleLogout} className="flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50">
              <LogOut className="mr-2 h-4 w-4" />
              Logout and Login with a Different Account
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UnauthorizedPage;
