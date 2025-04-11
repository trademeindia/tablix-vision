
import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardPage from '@/pages/DashboardPage';
import AnalyticsPage from '@/pages/AnalyticsPage';

const DashboardRoutes = () => {
  return (
    <>
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <DashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/analytics" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <AnalyticsPage />
          </ProtectedRoute>
        } 
      />
    </>
  );
};

export default DashboardRoutes;
