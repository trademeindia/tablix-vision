
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from './hooks/use-theme';
import ThemeApplier from './components/layout/ThemeProvider';
import { Toaster } from './components/ui/toaster';
import AppRoutes from './routes/AppRoutes';
import ErrorBoundary from './components/ErrorBoundary';

// Create a client with updated configuration for error handling and state persistence
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function App() {
  // In a real app, you would get the restaurant ID from authentication
  const restaurantId = '123e4567-e89b-12d3-a456-426614174000';

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider restaurantId={restaurantId}>
          <ThemeApplier restaurantId={restaurantId}>
            <TooltipProvider>
              <Router>
                <AuthProvider>
                  <AppRoutes />
                  <Toaster />
                </AuthProvider>
              </Router>
            </TooltipProvider>
          </ThemeApplier>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
