
import React from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from './hooks/use-theme';
import ThemeApplier from './components/layout/ThemeProvider';
import { Toaster } from './components/ui/toaster';
import AppRoutes from './routes/AppRoutes';

// Optimize query client with better caching and reduced network requests
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 10 * 60 * 1000, // 10 minutes, increased from 5
      gcTime: 15 * 60 * 1000, // 15 minutes (formerly cacheTime)
    },
  },
});

// Simple route handler for logging
const RouteHandler = () => {
  const location = useLocation();
  
  React.useEffect(() => {
    // Log route changes for debugging - only in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Route changed to:', location.pathname);
    }
  }, [location]);

  return <AppRoutes />;
};

function App() {
  // Using a demo restaurant ID - for reliable testing
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
