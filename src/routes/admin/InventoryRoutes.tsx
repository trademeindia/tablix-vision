
import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import InventoryPage from '@/pages/InventoryPage';

const InventoryRoutes = () => {
  return (
    <>
      <Route 
        path="/inventory" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <InventoryPage />
          </ProtectedRoute>
        } 
      />
    </>
  );
};

export default InventoryRoutes;
