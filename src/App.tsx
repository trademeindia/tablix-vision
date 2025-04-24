import * as React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import {  enableRealtimeForMenuTables, cleanupRealtimeSubscriptions } from './utils/supabase-realtime';
import { supabase, getSupabaseUrl } from '@/lib/supabaseClient';
import { initializeSupabase } from './utils/supabase-init';
import { ThemeProviderWrapper as ThemeProvider } from '@/components/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import LoadingScreen from '@/components/ui/loading-screen';
import { AuthProvider } from '@/contexts/AuthContext';
import { useSupabaseAuthListener } from '@/hooks/use-supabase-auth-listener';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const INITIALIZATION_DELAY = 800;
const INITIALIZATION_ERROR_MESSAGE = 'Failed to initialize the application. Please try again.';

function App() {
  const [isInitializing, setIsInitializing] = React.useState(true);
  const [isSupabaseReady, setIsSupabaseReady] = React.useState(false);
  const [tableNames, setTableNames] = React.useState<string[]>([]);

  // Initialize Supabase connection and prepare Realtime
  React.useEffect(() => {
    const initialize = async () => {
      try {
        // Initialize Supabase connection
        const success = await initializeSupabase();
        setIsSupabaseReady(success);
        // console.log('Supabase initialization:', success ? 'successful' : 'failed');

        // Enable realtime for menu tables
        await enableRealtimeForMenuTables();

        // Finish initialization after a small delay to ensure everything is loaded
        setTimeout(() => {
          setIsInitializing(false);
        }, INITIALIZATION_DELAY);
      } catch (error) {
        console.error('Initialization error:', error);
        setIsInitializing(false);
      }
    };

    initialize();

    // Cleanup function to remove realtime subscriptions on unmount
    return () => {
      cleanupRealtimeSubscriptions();
    };
  }, []);
  // Fetch table names for debugging
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
      } catch (err) {
        console.error('Error fetching table names:', err);
      }
    };

    if (isSupabaseReady) {
      fetchTableNames();
    }
  }, [isSupabaseReady]);

  // Set up auth state listener
  React.useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // console.log('Auth state changed:', session ? 'User authenticated' : 'No active session');
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
