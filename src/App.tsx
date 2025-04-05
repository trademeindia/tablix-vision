import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Landing/Auth pages
import Menu360LandingPage from './pages/landing/Menu360LandingPage';
import Index from './pages/Index';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import UpdatePasswordPage from './pages/auth/UpdatePasswordPage';
import AuthCallbackPage from './pages/auth/AuthCallbackPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import ProfilePage from './pages/ProfilePage';

// Admin/Owner pages
import DashboardPage from './pages/DashboardPage';
import MenuPage from './pages/MenuPage';
import NotFound from './pages/NotFound';
import OrdersPage from './pages/OrdersPage';
import OrderFormPage from './pages/OrderFormPage';
import QRCodePage from './pages/QRCodePage';
import AnalyticsPage from './pages/AnalyticsPage';
import InvoicesPage from './pages/InvoicesPage';
import CreateInvoicePage from './pages/CreateInvoicePage';
import TablesPage from './pages/TablesPage';
import StaffPage from './pages/StaffPage';
import GoogleDriveTestPage from './pages/GoogleDriveTestPage';
import InventoryPage from './pages/InventoryPage';
import AppearancePage from './pages/settings/AppearancePage';
import MarketingPage from './pages/MarketingPage';
import CustomersPage from './pages/CustomersPage';
import SettingsPage from './pages/settings/SettingsPage';
import NotificationsPage from './pages/settings/NotificationsPage';
import IntegrationsPage from './pages/settings/integrations';
import IntegrationDetailPage from './pages/settings/integration/IntegrationDetailPage';

// Customer pages
import CustomerMenuPage from './pages/customer/MenuPage';
import CustomerProfilePage from './pages/customer/ProfilePage';
import CustomerCheckoutPage from './pages/customer/CheckoutPage';
import CustomerCallWaiterPage from './pages/customer/CallWaiterPage';
import UserProfilePage from './pages/customer/UserProfilePage';

// Staff pages
import StaffDashboardPage from './pages/StaffDashboardPage';
import StaffOrdersPage from './pages/staff/OrdersPage';
import StaffKitchenPage from './pages/staff/KitchenPage';
import StaffInventoryPage from './pages/staff/InventoryPage';
import StaffReportsPage from './pages/staff/ReportsPage';

// UI components
import { Toaster } from './components/ui/toaster';
import { ThemeProvider } from './hooks/use-theme';
import ThemeApplier from './components/layout/ThemeProvider';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  // In a real app, you would get the restaurant ID from authentication
  const restaurantId = '123e4567-e89b-12d3-a456-426614174000';

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider restaurantId={restaurantId}>
        <ThemeApplier restaurantId={restaurantId}>
          <TooltipProvider>
            <AuthProvider>
              <Router>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/menu360" element={<Menu360LandingPage />} />
                  <Route path="/unauthorized" element={<UnauthorizedPage />} />
                  
                  {/* Auth routes */}
                  <Route path="/auth/login" element={<LoginPage />} />
                  <Route path="/auth/signup" element={<SignupPage />} />
                  <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/auth/update-password" element={<UpdatePasswordPage />} />
                  <Route path="/auth/callback" element={<AuthCallbackPage />} />
                  
                  {/* Profile route - accessible to all authenticated users */}
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute requiredRoles={['owner', 'manager', 'chef', 'waiter', 'staff', 'customer']}>
                        <ProfilePage />
                      </ProtectedRoute>
                    } 
                  />
                  
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
                    path="/invoices/create" 
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

                  {/* 404 route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
              </Router>
            </AuthProvider>
          </TooltipProvider>
        </ThemeApplier>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
