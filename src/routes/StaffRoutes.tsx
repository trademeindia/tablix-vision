
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { UserRole } from '@/hooks/auth/types/user-role.types';

// Staff pages
import StaffDashboardPage from '@/pages/StaffDashboardPage';
import StaffOrdersPage from '@/pages/staff/OrdersPage';
import StaffKitchenPage from '@/pages/staff/KitchenPage';
import StaffInventoryPage from '@/pages/staff/InventoryPage';
import StaffReportsPage from '@/pages/staff/ReportsPage';

const StaffRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Staff Dashboard */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute requiredRoles={['waiter', 'chef', 'manager', 'staff'] as UserRole[]}>
            <StaffDashboardPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Staff Orders View */}
      <Route 
        path="/orders" 
        element={
          <ProtectedRoute requiredRoles={['waiter', 'manager', 'staff'] as UserRole[]}>
            <StaffOrdersPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Kitchen View */}
      <Route 
        path="/kitchen" 
        element={
          <ProtectedRoute requiredRoles={['chef', 'manager', 'staff'] as UserRole[]}>
            <StaffKitchenPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Inventory View */}
      <Route 
        path="/inventory" 
        element={
          <ProtectedRoute requiredRoles={['chef', 'manager', 'staff'] as UserRole[]}>
            <StaffInventoryPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Reports View */}
      <Route 
        path="/reports" 
        element={
          <ProtectedRoute requiredRoles={['manager', 'staff'] as UserRole[]}>
            <StaffReportsPage />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default StaffRoutes;
