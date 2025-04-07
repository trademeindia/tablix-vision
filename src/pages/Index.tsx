
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Spinner from '@/components/ui/spinner';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  const { user, loading } = useAuth();
  
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

  // If authenticated, redirect to the appropriate dashboard
  return <Navigate to="/dashboard" replace />;
};

export default Index;
