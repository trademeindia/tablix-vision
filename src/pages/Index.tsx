
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Spinner from '@/components/ui/spinner';
import { Helmet } from 'react-helmet-async';
import { getRedirectPathByRole } from '@/hooks/auth/use-redirect-paths';

const Index = () => {
  const { user, loading, userRoles } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" className="mx-auto" />
        <Helmet>
          <title>Loading... - Menu 360</title>
        </Helmet>
      </div>
    );
  }

  // Always redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // If authenticated, redirect based on role
  let redirectPath = '/dashboard'; // default
  
  if (userRoles.length > 0) {
    redirectPath = getRedirectPathByRole(userRoles[0]);
  }
  
  return <Navigate to={redirectPath} replace />;
};

export default Index;
