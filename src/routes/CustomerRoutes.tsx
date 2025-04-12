
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { UserRole } from '@/hooks/auth/types/user-role.types';

// Customer pages
import CustomerMenuPage from '@/pages/customer/MenuPage';
import CustomerProfilePage from '@/pages/customer/ProfilePage';
import CustomerCheckoutPage from '@/pages/customer/CheckoutPage';
import CustomerCallWaiterPage from '@/pages/customer/CallWaiterPage';
import UserProfilePage from '@/pages/customer/UserProfilePage';

const CustomerRoutes: React.FC = () => {
  console.log('Customer routes component rendered');
  
  return (
    <Routes>
      {/* Customer Menu - accessible to all roles */}
      <Route 
        path="/menu" 
        element={<CustomerMenuPage />}
      />
      
      {/* Customer protected routes */}
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute requiredRoles={['customer'] as UserRole[]}>
            <CustomerProfilePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/checkout" 
        element={
          <ProtectedRoute requiredRoles={['customer'] as UserRole[]}>
            <CustomerCheckoutPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/call-waiter" 
        element={
          <ProtectedRoute requiredRoles={['customer'] as UserRole[]}>
            <CustomerCallWaiterPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Customer user profile route */}
      <Route 
        path="/user-profile" 
        element={
          <ProtectedRoute requiredRoles={['customer'] as UserRole[]}>
            <UserProfilePage />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default CustomerRoutes;
