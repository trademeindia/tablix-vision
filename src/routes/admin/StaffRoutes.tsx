
import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import StaffPage from '@/pages/StaffPage';

const StaffRoutes = () => {
  return (
    <>
      <Route 
        path="/staff" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <StaffPage />
          </ProtectedRoute>
        } 
      />
    </>
  );
};

export default StaffRoutes;
