
import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import MenuPage from '@/pages/MenuPage';

const MenuRoutes = () => {
  return (
    <>
      <Route 
        path="/menu" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <MenuPage />
          </ProtectedRoute>
        } 
      />
    </>
  );
};

export default MenuRoutes;
