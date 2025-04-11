
import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import OrdersPage from '@/pages/OrdersPage';
import OrderFormPage from '@/pages/OrderFormPage';

const OrderRoutes = () => {
  return (
    <>
      <Route 
        path="/orders" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <OrdersPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/orders/new" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager', 'waiter']}>
            <OrderFormPage />
          </ProtectedRoute>
        } 
      />
    </>
  );
};

export default OrderRoutes;
