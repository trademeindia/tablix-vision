
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
import { UserRole } from '@/hooks/auth/types/user-role.types';

const AdminRoutes: React.FC = () => {
  // Common wrapper for protected routes
  const ProtectedDashboard = ({ 
    component: Component, 
    roles = ['owner', 'manager'] as UserRole[]
  }: { 
    component: React.ComponentType, 
    roles?: UserRole[] 
  }) => (
    <ProtectedRoute requiredRoles={roles}>
      <Component />
    </ProtectedRoute>
  );
  
  return (
    <Routes>
      {/* Dashboard & Analytics Routes */}
      <Route path="/" element={<ProtectedDashboard component={DashboardPage} />} />
      <Route path="/analytics" element={<ProtectedDashboard component={AnalyticsPage} />} />

      {/* Menu Routes */}
      <Route path="/menu" element={<ProtectedDashboard component={MenuPage} />} />

      {/* Order Routes */}
      <Route path="/orders" element={<ProtectedDashboard component={OrdersPage} />} />
      <Route 
        path="/orders/new" 
        element={
          <ProtectedDashboard 
            component={OrderFormPage} 
            roles={['owner', 'manager', 'waiter'] as UserRole[]} 
          />
        } 
      />

      {/* QR Code Routes */}
      <Route path="/qr-codes" element={<ProtectedDashboard component={QRCodePage} />} />

      {/* Table Routes */}
      <Route path="/tables" element={<ProtectedDashboard component={TablesPage} />} />

      {/* Staff Routes */}
      <Route path="/staff" element={<ProtectedDashboard component={StaffPage} />} />

      {/* Customer Routes */}
      <Route path="/customers" element={<ProtectedDashboard component={CustomersPage} />} />

      {/* Invoice Routes */}
      <Route path="/invoices" element={<ProtectedDashboard component={InvoicesPage} />} />
      <Route path="/invoices/:invoiceId" element={<ProtectedDashboard component={InvoicesPage} />} />
      <Route path="/invoices/create" element={<ProtectedDashboard component={CreateInvoicePage} />} />
      <Route path="/create-invoice" element={<ProtectedDashboard component={CreateInvoicePage} />} />

      {/* Inventory Routes */}
      <Route path="/inventory" element={<ProtectedDashboard component={InventoryPage} />} />

      {/* Marketing Routes */}
      <Route path="/marketing" element={<ProtectedDashboard component={MarketingPage} />} />
      <Route path="/google-drive-test" element={<ProtectedDashboard component={GoogleDriveTestPage} />} />

      {/* Settings Routes */}
      <Route path="/settings" element={<ProtectedDashboard component={SettingsPage} />} />
      <Route path="/settings/appearance" element={<ProtectedDashboard component={AppearancePage} />} />
      <Route path="/settings/notifications" element={<ProtectedDashboard component={NotificationsPage} />} />
      <Route path="/settings/integrations" element={<ProtectedDashboard component={IntegrationsPage} />} />
      <Route path="/settings/integrations/:id" element={<ProtectedDashboard component={IntegrationDetailPage} />} />
      <Route path="/settings/integrations/:id/setup" element={<ProtectedDashboard component={IntegrationDetailPage} />} />
    </Routes>
  );
};

export default AdminRoutes;
