
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from './hooks/use-theme';
import ThemeApplier from './components/layout/ThemeProvider';
import { Toaster } from './components/ui/toaster';
import AppRoutes from './routes/AppRoutes';
import { Helmet } from 'react-helmet-async';
import Spinner from './components/ui/spinner';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  // In a real app, you would get the restaurant ID from authentication
  const restaurantId = '123e4567-e89b-12d3-a456-426614174000';
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
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
    <>
      <Helmet>
        <title>Menu 360 | Restaurant Management System</title>
        <meta name="description" content="Complete restaurant management platform" />
      </Helmet>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider restaurantId={restaurantId}>
          <ThemeApplier restaurantId={restaurantId}>
            <TooltipProvider>
              <AuthProvider>
                <Router>
                  <AppRoutes />
                  <Toaster />
                </Router>
              </AuthProvider>
            </TooltipProvider>
          </ThemeApplier>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
