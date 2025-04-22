
import { getSupabaseUrl, supabase } from "./lib/supabaseClient";
import React from 'react';
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
  const [isInitializing, setIsInitializing] = React.useState(true);
  const [tableNames, setTableNames] = React.useState<string[]>([]);

  React.useEffect(() => {
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

  React.useEffect(() => {
    const fetchTableNames = async () => {
      try {
        const { data, error } = await supabase
          .from('information_schema.tables')
          .select('table_name')
          .eq('table_schema', 'public');

        if (error) {
          console.error('Error fetching table names:', error);
          return;
        }

        const names = data.map((row: any) => row.table_name);
        setTableNames(names);
      } catch (error) {
        console.error('Error fetching table names:', error);
      }
    };

    fetchTableNames();
  }, []);

  React.useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const supabaseUrl = getSupabaseUrl();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <BrowserRouter>
          <AuthProvider>
            {isInitializing ? (
              <LoadingScreen message="Initializing application..." />
            ) : (
              <div>
                <AppRoutes />
                <Toaster />
              </div>
            )}
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
