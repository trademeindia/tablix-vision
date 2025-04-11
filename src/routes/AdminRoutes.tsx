
import React from 'react';
import { Routes, Route } from 'react-router-dom';
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

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Dashboard & Analytics Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <DashboardPage />
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

      {/* Menu Routes */}
      <Route 
        path="/menu" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <MenuPage />
          </ProtectedRoute>
        } 
      />

      {/* Order Routes */}
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

      {/* QR Code Routes */}
      <Route 
        path="/qr-codes" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <QRCodePage />
          </ProtectedRoute>
        } 
      />

      {/* Table Routes */}
      <Route 
        path="/tables" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <TablesPage />
          </ProtectedRoute>
        } 
      />

      {/* Staff Routes */}
      <Route 
        path="/staff" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <StaffPage />
          </ProtectedRoute>
        } 
      />

      {/* Customer Routes */}
      <Route 
        path="/customers" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <CustomersPage />
          </ProtectedRoute>
        } 
      />

      {/* Invoice Routes */}
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
      <Route 
        path="/create-invoice" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <CreateInvoicePage />
          </ProtectedRoute>
        } 
      />

      {/* Inventory Routes */}
      <Route 
        path="/inventory" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <InventoryPage />
          </ProtectedRoute>
        } 
      />

      {/* Marketing Routes */}
      <Route 
        path="/marketing" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <MarketingPage />
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

      {/* Settings Routes */}
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
