
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardPage from '@/pages/DashboardPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import MenuPage from '@/pages/MenuPage';
import OrdersPage from '@/pages/OrdersPage';
import OrderFormPage from '@/pages/OrderFormPage';
import QRCodePage from '@/pages/QRCodePage';
import TablesPage from '@/pages/TablesPage';
import StaffPage from '@/pages/StaffPage';
import CustomersPage from '@/pages/CustomersPage';
import InvoicesPage from '@/pages/InvoicesPage';
import CreateInvoicePage from '@/pages/CreateInvoicePage';
import InventoryPage from '@/pages/InventoryPage';
import MarketingPage from '@/pages/MarketingPage';
import GoogleDriveTestPage from '@/pages/GoogleDriveTestPage';
import SettingsPage from '@/pages/settings/SettingsPage';
import AppearancePage from '@/pages/settings/AppearancePage';
import NotificationsPage from '@/pages/settings/NotificationsPage';
import IntegrationsPage from '@/pages/settings/IntegrationsPage';
import IntegrationDetailPage from '@/pages/settings/integration/IntegrationDetailPage';
import { UserRole } from '@/hooks/auth/types/user-role.types';

const AdminRoutes: React.FC = () => {
  // console.log('Admin routes component rendered');
  
  return (
    <Routes>
      <Route path="/" element={
        <ProtectedRoute requiredRoles={['owner', 'manager'] as UserRole[]}>
          <DashboardPage />
        </ProtectedRoute>
      } />
      
      <Route path="/dashboard" element={
        <ProtectedRoute requiredRoles={['owner', 'manager'] as UserRole[]}>
          <DashboardPage />
        </ProtectedRoute>
      } />
      
      <Route path="/analytics" element={
        <ProtectedRoute requiredRoles={['owner', 'manager'] as UserRole[]}>
          <AnalyticsPage />
        </ProtectedRoute>
      } />
      
      <Route path="/menu" element={
        <ProtectedRoute requiredRoles={['owner', 'manager'] as UserRole[]}>
          <MenuPage />
        </ProtectedRoute>
      } />
      
      <Route path="/orders" element={
        <ProtectedRoute requiredRoles={['owner', 'manager'] as UserRole[]}>
          <OrdersPage />
        </ProtectedRoute>
      } />
      
      <Route path="/orders/new" element={
        <ProtectedRoute requiredRoles={['owner', 'manager', 'waiter'] as UserRole[]}>
          <OrderFormPage />
        </ProtectedRoute>
      } />
      
      <Route path="/qr-codes" element={
        <ProtectedRoute requiredRoles={['owner', 'manager'] as UserRole[]}>
          <QRCodePage />
        </ProtectedRoute>
      } />
      
      <Route path="/tables" element={
        <ProtectedRoute requiredRoles={['owner', 'manager'] as UserRole[]}>
          <TablesPage />
        </ProtectedRoute>
      } />
      
      <Route path="/staff" element={
        <ProtectedRoute requiredRoles={['owner', 'manager'] as UserRole[]}>
          <StaffPage />
        </ProtectedRoute>
      } />
      
      <Route path="/customers" element={
        <ProtectedRoute requiredRoles={['owner', 'manager'] as UserRole[]}>
          <CustomersPage />
        </ProtectedRoute>
      } />
      
      <Route path="/invoices" element={
        <ProtectedRoute requiredRoles={['owner', 'manager'] as UserRole[]}>
          <InvoicesPage />
        </ProtectedRoute>
      } />
      
      <Route path="/invoices/create" element={
        <ProtectedRoute requiredRoles={['owner', 'manager'] as UserRole[]}>
          <CreateInvoicePage />
        </ProtectedRoute>
      } />
      
      <Route path="/inventory" element={
        <ProtectedRoute requiredRoles={['owner', 'manager'] as UserRole[]}>
          <InventoryPage />
        </ProtectedRoute>
      } />
      
      <Route path="/marketing" element={
        <ProtectedRoute requiredRoles={['owner', 'manager'] as UserRole[]}>
          <MarketingPage />
        </ProtectedRoute>
      } />
      
      <Route path="/google-drive-test" element={
        <ProtectedRoute requiredRoles={['owner', 'manager'] as UserRole[]}>
          <GoogleDriveTestPage />
        </ProtectedRoute>
      } />
      
      <Route path="/settings" element={
        <ProtectedRoute requiredRoles={['owner', 'manager'] as UserRole[]}>
          <SettingsPage />
        </ProtectedRoute>
      } />
      
      <Route path="/settings/appearance" element={
        <ProtectedRoute requiredRoles={['owner', 'manager'] as UserRole[]}>
          <AppearancePage />
        </ProtectedRoute>
      } />
      
      <Route path="/settings/notifications" element={
        <ProtectedRoute requiredRoles={['owner', 'manager'] as UserRole[]}>
          <NotificationsPage />
        </ProtectedRoute>
      } />
      
      <Route path="/settings/integrations" element={
        <ProtectedRoute requiredRoles={['owner', 'manager'] as UserRole[]}>
          <IntegrationsPage />
        </ProtectedRoute>
      } />
      
      <Route path="/settings/integrations/:id" element={
        <ProtectedRoute requiredRoles={['owner', 'manager'] as UserRole[]}>
          <IntegrationDetailPage />
        </ProtectedRoute>
      } />
      
      {/* Default redirect for unmatched paths */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
