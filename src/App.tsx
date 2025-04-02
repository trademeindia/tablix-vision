
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import MenuPage from "./pages/MenuPage";
import QRCodePage from "./pages/QRCodePage";
import TablesPage from "./pages/TablesPage";
import StaffPage from "./pages/StaffPage";
import StaffDashboardPage from "./pages/StaffDashboardPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import NotFound from "./pages/NotFound";
import OrdersPage from "./pages/OrdersPage";
import InvoicesPage from "./pages/InvoicesPage";
import CreateInvoicePage from "./pages/CreateInvoicePage";
import GoogleDriveTestPage from "./pages/GoogleDriveTestPage";

// Import placeholder pages for staff dashboard sections
import StaffOrdersPage from "./pages/staff/OrdersPage";
import KitchenPage from "./pages/staff/KitchenPage";
import InventoryPage from "./pages/staff/InventoryPage";
import ReportsPage from "./pages/staff/ReportsPage";

// Import customer facing pages
import CustomerMenuPage from "./pages/customer/MenuPage";
import CheckoutPage from "./pages/customer/CheckoutPage";
import CallWaiterPage from "./pages/customer/CallWaiterPage";
import CustomerProfilePage from './pages/customer/ProfilePage';

// Create a new query client instance with error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30000
    }
  }
});

const App = () => {
  console.log("Rendering App component");
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/qr-codes" element={<QRCodePage />} />
            <Route path="/tables" element={<TablesPage />} />
            <Route path="/staff" element={<StaffPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/invoices" element={<InvoicesPage />} />
            <Route path="/invoices/:invoiceId" element={<InvoicesPage />} />
            <Route path="/create-invoice" element={<CreateInvoicePage />} />
            <Route path="/google-drive-test" element={<GoogleDriveTestPage />} />
            
            {/* Staff Dashboard Routes */}
            <Route path="/staff-dashboard" element={<StaffDashboardPage />} />
            <Route path="/staff-dashboard/orders" element={<StaffOrdersPage />} />
            <Route path="/staff-dashboard/kitchen" element={<KitchenPage />} />
            <Route path="/staff-dashboard/inventory" element={<InventoryPage />} />
            <Route path="/staff-dashboard/reports" element={<ReportsPage />} />
            
            {/* Customer Facing Routes - With consistent naming and proper redirects */}
            <Route path="/customer-menu" element={<CustomerMenuPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/call-waiter" element={<CallWaiterPage />} />
            <Route path="/profile" element={<CustomerProfilePage />} />
            
            {/* Add redirect from old path format to new format */}
            <Route path="/customer/menu" element={<Navigate to="/customer-menu" replace />} />
            
            <Route path="/analytics" element={<AnalyticsPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
