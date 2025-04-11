
import React from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
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

// Handler for route monitoring
const RouteHandler = () => {
  const location = useLocation();
  
  React.useEffect(() => {
    // Log route changes for debugging
    console.log('Route changed to:', location.pathname);
  }, [location]);

  return <AppRoutes />;
};

function App() {
  // Using a demo restaurant ID - for reliable testing
  const restaurantId = '123e4567-e89b-12d3-a456-426614174000';
  
  console.log("App initializing with restaurant ID:", restaurantId);

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
