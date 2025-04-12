
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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
  console.log('Admin routes component rendered');
  const location = useLocation();
  console.log('Admin routes current path:', location.pathname);
  
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

  // Extract the current path to determine which component to render
  const path = location.pathname;
  
  // Function to render the appropriate component based on the path
  const renderComponent = () => {
    if (path === '/dashboard' || path === '/') {
      return <ProtectedDashboard component={DashboardPage} />;
    } else if (path === '/analytics') {
      return <ProtectedDashboard component={AnalyticsPage} />;
    } else if (path === '/menu') {
      return <ProtectedDashboard component={MenuPage} />;
    } else if (path === '/orders') {
      return <ProtectedDashboard component={OrdersPage} />;
    } else if (path === '/orders/new') {
      return <ProtectedDashboard component={OrderFormPage} roles={['owner', 'manager', 'waiter'] as UserRole[]} />;
    } else if (path === '/qr-codes') {
      return <ProtectedDashboard component={QRCodePage} />;
    } else if (path === '/tables') {
      return <ProtectedDashboard component={TablesPage} />;
    } else if (path === '/staff') {
      return <ProtectedDashboard component={StaffPage} />;
    } else if (path === '/customers') {
      return <ProtectedDashboard component={CustomersPage} />;
    } else if (path === '/invoices' || path.startsWith('/invoices/')) {
      return <ProtectedDashboard component={InvoicesPage} />;
    } else if (path === '/invoices/create' || path === '/create-invoice') {
      return <ProtectedDashboard component={CreateInvoicePage} />;
    } else if (path === '/inventory') {
      return <ProtectedDashboard component={InventoryPage} />;
    } else if (path === '/marketing') {
      return <ProtectedDashboard component={MarketingPage} />;
    } else if (path === '/google-drive-test') {
      return <ProtectedDashboard component={GoogleDriveTestPage} />;
    } else if (path === '/settings') {
      return <ProtectedDashboard component={SettingsPage} />;
    } else if (path === '/settings/appearance') {
      return <ProtectedDashboard component={AppearancePage} />;
    } else if (path === '/settings/notifications') {
      return <ProtectedDashboard component={NotificationsPage} />;
    } else if (path === '/settings/integrations') {
      return <ProtectedDashboard component={IntegrationsPage} />;
    } else if (path.startsWith('/settings/integrations/')) {
      return <ProtectedDashboard component={IntegrationDetailPage} />;
    }
    
    // Default to Dashboard if no match
    return <ProtectedDashboard component={DashboardPage} />;
  };
  
  return renderComponent();
};

export default AdminRoutes;
