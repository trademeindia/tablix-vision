
import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import CustomersPage from '@/pages/CustomersPage';

const CustomerRoutes = () => {
  return (
    <>
      <Route 
        path="/customers" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <CustomersPage />
          </ProtectedRoute>
        } 
      />
    </>
  );
};

export default CustomerRoutes;
