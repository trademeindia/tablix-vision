import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MenuPage from "./pages/MenuPage";
import QRCodePage from "./pages/QRCodePage";
import TablesPage from "./pages/TablesPage";
import StaffPage from "./pages/StaffPage";
import StaffDashboardPage from "./pages/StaffDashboardPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import NotFound from "./pages/NotFound";

// Import placeholder pages for staff dashboard sections
import OrdersPage from "./pages/staff/OrdersPage";
import KitchenPage from "./pages/staff/KitchenPage";
import InventoryPage from "./pages/staff/InventoryPage";
import ReportsPage from "./pages/staff/ReportsPage";

// Import customer facing pages
import CustomerMenuPage from "./pages/customer/MenuPage";
import CheckoutPage from "./pages/customer/CheckoutPage";
import CallWaiterPage from "./pages/customer/CallWaiterPage";
import CustomerProfilePage from './pages/customer/ProfilePage';

const queryClient = new QueryClient();

const App = () => (
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
          
          {/* Staff Dashboard Routes */}
          <Route path="/staff-dashboard" element={<StaffDashboardPage />} />
          <Route path="/staff-dashboard/orders" element={<OrdersPage />} />
          <Route path="/staff-dashboard/kitchen" element={<KitchenPage />} />
          <Route path="/staff-dashboard/inventory" element={<InventoryPage />} />
          <Route path="/staff-dashboard/reports" element={<ReportsPage />} />
          
          {/* Customer Facing Routes */}
          <Route path="/customer-menu" element={<CustomerMenuPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/call-waiter" element={<CallWaiterPage />} />
          <Route path="/profile" element={<CustomerProfilePage />} />
          
          <Route path="/analytics" element={<AnalyticsPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
