import React, { useEffect, useState } from 'react';
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

// Debug component to help diagnose rendering issues
const DebugInfo = ({ error }: { error?: Error }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white">
      <h1 className="text-3xl font-bold mb-4">Application Diagnostic</h1>
      
      {error ? (
        <div className="mb-6 text-red-500">
          <h2 className="text-xl font-medium mb-2">Error Detected:</h2>
          <p className="font-mono bg-gray-100 p-4 rounded">{error.message}</p>
        </div>
      ) : (
        <p className="mb-6 text-xl">The application is loading but not rendering properly.</p>
      )}
      
      <div className="w-full max-w-md">
        <h2 className="text-xl font-medium mb-2">Environment Check:</h2>
        <ul className="list-disc pl-5 mb-6">
          <li>NODE_ENV: {process.env.NODE_ENV || 'Not available'}</li>
          <li>Supabase URL: {import.meta.env.VITE_SUPABASE_URL ? 'Configured ✓' : 'Missing ✗'}</li>
          <li>Supabase Key: {import.meta.env.VITE_SUPABASE_KEY ? 'Configured ✓' : 'Missing ✗'}</li>
        </ul>
      </div>
      
      <button 
        className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium"
        onClick={() => window.location.reload()}
      >
        Refresh Page
      </button>
    </div>
  );
};

function App() {
  // Using a fallback ID for development. In production, this would come from auth or context
  const fallbackRestaurantId = "123e4567-e89b-12d3-a456-426614174000"; // Demo restaurant ID
  const [error, setError] = useState<Error | null>(null);
  const [showDebug, setShowDebug] = useState(false);

  // Add error handling to catch render issues
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Application error:', event.error);
      setError(event.error);
      setShowDebug(true);
    };

    window.addEventListener('error', handleError);
    
    // Check if the app is rendering after 2 seconds
    const timer = setTimeout(() => {
      const appContentElement = document.querySelector('main, .landing-page, #hero');
      if (!appContentElement) {
        console.warn('No main content detected - possible render issue');
        setShowDebug(true);
      }
    }, 2000);

    return () => {
      window.removeEventListener('error', handleError);
      clearTimeout(timer);
    };
  }, []);

  // Show diagnostic screen if needed
  if (showDebug) {
    return <DebugInfo error={error || undefined} />;
  }

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
