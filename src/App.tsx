
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import MenuPage from './pages/MenuPage';
import NotFound from './pages/NotFound';
import OrdersPage from './pages/OrdersPage';
import QRCodePage from './pages/QRCodePage';
import AnalyticsPage from './pages/AnalyticsPage';
import InvoicesPage from './pages/InvoicesPage';
import CreateInvoicePage from './pages/CreateInvoicePage';
import TablesPage from './pages/TablesPage';
import StaffPage from './pages/StaffPage';
import StaffDashboardPage from './pages/StaffDashboardPage';
import GoogleDriveTestPage from './pages/GoogleDriveTestPage';
import { Toaster } from './components/ui/toaster';
import { ThemeProvider } from './hooks/use-theme';
import ThemeApplier from './components/layout/ThemeProvider';
import AppearancePage from './pages/settings/AppearancePage';
import MarketingPage from './pages/MarketingPage';

// Customer pages
import CustomerMenuPage from './pages/customer/MenuPage';
import CustomerProfilePage from './pages/customer/ProfilePage';
import CustomerCheckoutPage from './pages/customer/CheckoutPage';
import CustomerCallWaiterPage from './pages/customer/CallWaiterPage';

// Staff pages
import StaffOrdersPage from './pages/staff/OrdersPage';
import StaffKitchenPage from './pages/staff/KitchenPage';
import StaffInventoryPage from './pages/staff/InventoryPage';
import StaffReportsPage from './pages/staff/ReportsPage';

function App() {
  // In a real app, you would get the restaurant ID from authentication
  const restaurantId = '123e4567-e89b-12d3-a456-426614174000';

  return (
    <ThemeProvider restaurantId={restaurantId}>
      <ThemeApplier restaurantId={restaurantId}>
        <Router>
          <Routes>
            {/* Admin routes */}
            <Route path="/" element={<Index />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/qr-codes" element={<QRCodePage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/tables" element={<TablesPage />} />
            <Route path="/staff" element={<StaffPage />} />
            <Route path="/invoices" element={<InvoicesPage />} />
            <Route path="/invoices/create" element={<CreateInvoicePage />} />
            <Route path="/google-drive-test" element={<GoogleDriveTestPage />} />
            <Route path="/settings/appearance" element={<AppearancePage />} />
            <Route path="/marketing" element={<MarketingPage />} />

            {/* Customer routes */}
            <Route path="/customer/menu" element={<CustomerMenuPage />} />
            <Route path="/customer/profile" element={<CustomerProfilePage />} />
            <Route path="/customer/checkout" element={<CustomerCheckoutPage />} />
            <Route path="/customer/call-waiter" element={<CustomerCallWaiterPage />} />

            {/* Staff routes */}
            <Route path="/staff-dashboard" element={<StaffDashboardPage />} />
            <Route path="/staff-dashboard/orders" element={<StaffOrdersPage />} />
            <Route path="/staff-dashboard/kitchen" element={<StaffKitchenPage />} />
            <Route path="/staff-dashboard/inventory" element={<StaffInventoryPage />} />
            <Route path="/staff-dashboard/reports" element={<StaffReportsPage />} />

            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </ThemeApplier>
    </ThemeProvider>
  );
}

export default App;
