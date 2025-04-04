
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Staff pages
import StaffDashboardPage from '@/pages/StaffDashboardPage';
import StaffOrdersPage from '@/pages/staff/OrdersPage';
import StaffKitchenPage from '@/pages/staff/KitchenPage';
import StaffInventoryPage from '@/pages/staff/InventoryPage';
import StaffReportsPage from '@/pages/staff/ReportsPage';

const StaffRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Staff routes - protected */}
      <Route 
        path="/staff-dashboard" 
        element={
          <ProtectedRoute requiredRoles={['waiter', 'chef', 'manager', 'staff']}>
            <StaffDashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/staff-dashboard/orders" 
        element={
          <ProtectedRoute requiredRoles={['waiter', 'manager', 'staff']}>
            <StaffOrdersPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/staff-dashboard/kitchen" 
        element={
          <ProtectedRoute requiredRoles={['chef', 'manager', 'staff']}>
            <StaffKitchenPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/staff-dashboard/inventory" 
        element={
          <ProtectedRoute requiredRoles={['chef', 'manager', 'staff']}>
            <StaffInventoryPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/staff-dashboard/reports" 
        element={
          <ProtectedRoute requiredRoles={['manager', 'staff']}>
            <StaffReportsPage />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default StaffRoutes;
