
import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import MarketingPage from '@/pages/MarketingPage';
import GoogleDriveTestPage from '@/pages/GoogleDriveTestPage';

const MarketingRoutes = () => {
  return (
    <>
      <Route 
        path="/marketing" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <MarketingPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/google-drive-test" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <GoogleDriveTestPage />
          </ProtectedRoute>
        } 
      />
    </>
  );
};

export default MarketingRoutes;
