
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
import AuthPage from "./pages/auth/AuthPage";
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

// Protected route component
import { ProtectedRoute } from './components/auth/ProtectedRoute';

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
            {/* Auth routes */}
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Protected admin routes */}
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/menu" element={<ProtectedRoute><MenuPage /></ProtectedRoute>} />
            <Route path="/qr-codes" element={<ProtectedRoute><QRCodePage /></ProtectedRoute>} />
            <Route path="/tables" element={<ProtectedRoute><TablesPage /></ProtectedRoute>} />
            <Route path="/staff" element={<ProtectedRoute><StaffPage /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
            <Route path="/google-drive-test" element={<ProtectedRoute><GoogleDriveTestPage /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
            
            {/* Staff Dashboard Routes */}
            <Route path="/staff-dashboard" element={<ProtectedRoute><StaffDashboardPage /></ProtectedRoute>} />
            <Route path="/staff-dashboard/orders" element={<ProtectedRoute><StaffOrdersPage /></ProtectedRoute>} />
            <Route path="/staff-dashboard/kitchen" element={<ProtectedRoute><KitchenPage /></ProtectedRoute>} />
            <Route path="/staff-dashboard/inventory" element={<ProtectedRoute><InventoryPage /></ProtectedRoute>} />
            <Route path="/staff-dashboard/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
            
            {/* Public Customer Facing Routes */}
            <Route path="/customer-menu" element={<CustomerMenuPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/call-waiter" element={<CallWaiterPage />} />
            <Route path="/profile" element={<CustomerProfilePage />} />
            
            {/* Catch-all and redirect */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
