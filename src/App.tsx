
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from './hooks/use-theme';
import ThemeApplier from './components/layout/ThemeProvider';
import { Toaster } from './components/ui/toaster';
import AppRoutes from './routes/AppRoutes';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Spinner from './components/ui/spinner';

// Create a client with better defaults for error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      onError: (error) => {
        console.error('Query error:', error);
      },
    },
  },
});

function App() {
  // In a real app, you would get the restaurant ID from authentication
  const restaurantId = '123e4567-e89b-12d3-a456-426614174000';
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading and log it
    console.log('App initializing...');
    const timer = setTimeout(() => {
      setIsLoading(false);
      console.log('App initialized and ready');
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Spinner size="lg" />
        <p className="ml-2 text-lg font-medium">Loading application...</p>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <Helmet>
        <title>Menu 360 | Restaurant Management System</title>
        <meta name="description" content="Complete restaurant management platform" />
      </Helmet>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider restaurantId={restaurantId}>
            <ThemeApplier restaurantId={restaurantId}>
              <TooltipProvider>
                <Router>
                  <AppRoutes />
                  <Toaster />
                </Router>
              </TooltipProvider>
            </ThemeApplier>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
