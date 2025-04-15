
import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { initializeSupabase } from './utils/supabase-init';
import { enableRealtimeForMenuTables } from './utils/supabase-realtime';
import { ThemeProvider } from '@/components/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import LoadingScreen from '@/components/ui/loading-screen';

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
        <BrowserRouter>
          <AppRoutes />
          <Toaster />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
