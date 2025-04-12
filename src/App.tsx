import React, { useEffect } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from './hooks/use-theme';
import ThemeApplier from './components/layout/ThemeProvider';
import { Toaster } from './components/ui/toaster';
import AppRoutes from './routes/AppRoutes';
import { initializeSupabase } from './utils/supabase-init';

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
  
  // Initialize Supabase on first render
  useEffect(() => {
    initializeSupabase().then(success => {
      if (success) {
        if (process.env.NODE_ENV === 'development') {
          console.log('Supabase initialization complete');
        }
      } else {
        console.warn('Supabase initialization had issues');
      }
    });
  }, []);
  
  React.useEffect(() => {
    // Log route changes for debugging - only in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Route changed to:', location.pathname);
    }
  }, [location]);

  return <AppRoutes />;
};

function App() {
  // Using a fallback ID for development. In production, this would come from auth or context
  const fallbackRestaurantId = "123e4567-e89b-12d3-a456-426614174000"; // Demo restaurant ID

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider restaurantId={fallbackRestaurantId}>
        <ThemeApplier>
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
