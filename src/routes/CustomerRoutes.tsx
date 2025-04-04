
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Customer pages
import CustomerMenuPage from '@/pages/customer/MenuPage';
import CustomerProfilePage from '@/pages/customer/ProfilePage';
import CustomerCheckoutPage from '@/pages/customer/CheckoutPage';
import CustomerCallWaiterPage from '@/pages/customer/CallWaiterPage';
import UserProfilePage from '@/pages/customer/UserProfilePage';

const CustomerRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Customer routes - protected */}
      <Route 
        path="/customer/menu" 
        element={
          <ProtectedRoute requiredRoles={['customer']}>
            <CustomerMenuPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/customer/profile" 
        element={
          <ProtectedRoute requiredRoles={['customer']}>
            <CustomerProfilePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/customer/checkout" 
        element={
          <ProtectedRoute requiredRoles={['customer']}>
            <CustomerCheckoutPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/customer/call-waiter" 
        element={
          <ProtectedRoute requiredRoles={['customer']}>
            <CustomerCallWaiterPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Customer user profile route */}
      <Route 
        path="/customer/user-profile" 
        element={
          <ProtectedRoute requiredRoles={['customer']}>
            <UserProfilePage />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default CustomerRoutes;
