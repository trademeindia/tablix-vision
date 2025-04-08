
import React, { useEffect } from 'react';
import { BrowserRouter as Router, useLocation, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from './hooks/use-theme';
import ThemeApplier from './components/layout/ThemeProvider';
import { Toaster } from './components/ui/toaster';
import AppRoutes from './routes/AppRoutes';

// Create a client with updated configuration for error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      // Mutations options (if needed)
    }
  },
});

// Handler for first-time visits
const RouteHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect first-time visitors from the /customer/menu path
    // AND only if they directly accessed that URL (not navigated from within the app)
    if (location.pathname === '/customer/menu' && !document.referrer.includes(window.location.host)) {
      // Check if there are any table/restaurant parameters - if not, it's likely a direct access
      const params = new URLSearchParams(location.search);
      const hasTableParam = params.has('table');
      const hasRestaurantParam = params.has('restaurant');
      
      // Only redirect if no specific table/restaurant was requested
      if (!hasTableParam && !hasRestaurantParam) {
        // First time visitor without specific table - redirect to landing page
        console.log('First time visit to customer menu without parameters - redirecting to landing page');
        navigate('/', { replace: true });
      }
    }
  }, [location, navigate]);

  return <AppRoutes />;
};

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
                <RouteHandler />
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
