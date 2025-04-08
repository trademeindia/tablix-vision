
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Admin/Owner pages
import DashboardPage from '@/pages/DashboardPage';
import MenuPage from '@/pages/MenuPage';
import OrdersPage from '@/pages/OrdersPage';
import OrderFormPage from '@/pages/OrderFormPage';
import QRCodePage from '@/pages/QRCodePage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import InvoicesPage from '@/pages/InvoicesPage';
import CreateInvoicePage from '@/pages/CreateInvoicePage';
import TablesPage from '@/pages/TablesPage';
import StaffPage from '@/pages/StaffPage';
import GoogleDriveTestPage from '@/pages/GoogleDriveTestPage';
import InventoryPage from '@/pages/InventoryPage';
import AppearancePage from '@/pages/settings/AppearancePage';
import MarketingPage from '@/pages/MarketingPage';
import CustomersPage from '@/pages/CustomersPage';
import SettingsPage from '@/pages/settings/SettingsPage';
import NotificationsPage from '@/pages/settings/NotificationsPage';
import IntegrationsPage from '@/pages/settings/integrations';
import IntegrationDetailPage from '@/pages/settings/integration/IntegrationDetailPage';

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Admin/Owner routes - protected */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <DashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/menu" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <MenuPage />
          </ProtectedRoute>
        } 
      />
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
      <Route 
        path="/qr-codes" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <QRCodePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/analytics" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <AnalyticsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tables" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <TablesPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/staff" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <StaffPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/customers" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <CustomersPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/invoices" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <InvoicesPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/invoices/:invoiceId" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <InvoicesPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/invoices/create" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <CreateInvoicePage />
          </ProtectedRoute>
        } 
      />
      {/* Add support for the /create-invoice path as well */}
      <Route 
        path="/create-invoice" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <CreateInvoicePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/inventory" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <InventoryPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/google-drive-test" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <GoogleDriveTestPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/marketing" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <MarketingPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Settings routes - protected */}
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <SettingsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings/appearance" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <AppearancePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings/notifications" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <NotificationsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings/integrations" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <IntegrationsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings/integrations/:id" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <IntegrationDetailPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings/integrations/:id/setup" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <IntegrationDetailPage />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default AdminRoutes;
