
import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { initializeSupabase } from './utils/supabase-init';
import { enableRealtimeForMenuTables } from './utils/supabase-realtime';
import { ThemeProviderWrapper as ThemeProvider } from '@/components/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import LoadingScreen from '@/components/ui/loading-screen';
import { AuthProvider } from '@/contexts/AuthContext';

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
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      // Initialize Supabase connection
      const success = await initializeSupabase();
      console.log('Supabase initialization:', success ? 'successful' : 'failed');
      
      // Enable realtime for menu tables
      if (success) {
        await enableRealtimeForMenuTables();
      }
      
      // Finish initialization after a small delay to ensure everything is loaded
      setTimeout(() => {
        setIsInitializing(false);
      }, 800);
    };

    initialize();
  }, []);

  if (isInitializing) {
    return <LoadingScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
            <Toaster />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
