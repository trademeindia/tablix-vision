
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Home, RefreshCw, LogIn } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';

const UnauthorizedPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userRoles, signOut } = useAuth();
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  // Extract information from location state
  const fromPath = location.state?.from?.pathname || '/';
  const stateRequiredRoles = location.state?.requiredRoles || [];
  const stateUserRoles = location.state?.userRoles || userRoles;
  
  // Debug info
  const savedRole = localStorage.getItem('userRole') || 'none';
  const isDemoAccount = user?.email?.endsWith('@demo.com') || false;
  
  useEffect(() => {
    // Log debug information to help troubleshoot
    console.log("UnauthorizedPage mounted with state:", {
      fromPath,
      stateUserRoles,
      stateRequiredRoles,
      currentUserRoles: userRoles,
      savedRole,
      user: user?.email
    });
  }, [fromPath, stateUserRoles, stateRequiredRoles, userRoles, savedRole, user]);

  const handleRefreshAccess = () => {
    // Force a refresh of the access
    window.location.href = fromPath;
  };

  const handleDemoAccess = () => {
    // For demo accounts, allow them to override access restrictions
    localStorage.setItem('demoOverride', 'true');
    navigate('/dashboard');
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleLoginWithDifferentRole = () => {
    navigate('/auth/login');
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/auth/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Access Denied | Menu 360</title>
      </Helmet>
      
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-md">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="text-lg font-bold">Access Denied</AlertTitle>
            <AlertDescription className="mt-2">
              You do not have permission to access this page.
            </AlertDescription>
          </Alert>
          
          {user && (
            <div className="bg-white p-4 rounded-md shadow mb-4">
              <p>You are logged in as: <strong>{user.email}</strong></p>
              <p>Your current role: <strong>{stateUserRoles.join(', ')}</strong></p>
              <p>Saved role in localStorage: <strong>{savedRole}</strong></p>
            </div>
          )}
          
          {isDemoAccount && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-md mb-6">
              <h3 className="flex items-center text-green-700 font-semibold text-lg mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1v-3a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Demo Access Override
              </h3>
              <p className="text-sm text-green-700 mb-4">
                You're using a demo account! Click the button below to override access restrictions and view the dashboard.
              </p>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-lg py-3 font-medium" 
                onClick={handleDemoAccess}
              >
                Access Dashboard (Demo Override)
              </Button>
              <p className="text-xs text-green-600 mt-2 text-center">
                This button enables demo mode and grants you full access to all features
              </p>
            </div>
          )}
          
          <Button 
            variant="outline" 
            className="mb-2 w-full"
            onClick={() => setShowDebugInfo(!showDebugInfo)}
          >
            {showDebugInfo ? 'Hide Debug Information' : 'Show Debug Information'}
          </Button>
          
          {showDebugInfo && (
            <div className="bg-slate-100 p-4 rounded mb-6 max-h-48 overflow-y-auto">
              <h4 className="font-medium mb-2">Debug Information</h4>
              <div className="text-xs font-mono">
                <p>Required role: {stateRequiredRoles.length ? stateRequiredRoles.join(', ') : 'None specified'}</p>
                <p>Current role: {stateUserRoles.join(', ')}</p>
                <p>Attempted to access: {fromPath}</p>
                <p>User ID: {user?.id || 'Not available'}</p>
                <p>User email: {user?.email || 'Not available'}</p>
                <p>Local storage role: {savedRole}</p>
                <p>User metadata: {JSON.stringify(user?.user_metadata || {})}</p>
              </div>
            </div>
          )}
          
          <p className="text-center text-slate-500 mb-6">
            If you believe this is an error, try refreshing your session,
            logging in with a different account, or contact your administrator.
          </p>
          
          <div className="flex flex-col space-y-2">
            <Button 
              variant="default" 
              className="w-full flex items-center justify-center"
              onClick={handleRefreshAccess}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Access
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate(-1)}
            >
              <span className="mr-2">←</span>
              Go Back
            </Button>
            
            <Button 
              variant="outline"
              className="w-full"
              onClick={handleGoToDashboard}
            >
              <Home className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full text-blue-600"
              onClick={handleLoginWithDifferentRole}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Login with a Different Role
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full text-red-600"
              onClick={handleLogout}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11.293 9.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L11 10.414V14a1 1 0 102 0v-3.586l1.293 1.293z" clipRule="evenodd" />
              </svg>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UnauthorizedPage;
