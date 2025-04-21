
import { createClient } from '@supabase/supabase-js';

// Supabase project URL and anon key
const supabaseUrl = 'https://qofbpjdbmisyxysfcyeb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvZmJwamRibWlzeXh5c2ZjeWViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MTUxMzIsImV4cCI6MjA1ODQ5MTEzMn0.RqUyHPLxCWUATAufUkXCUN9yczZNBKMQD_wYF4Q3VVA';

// Initialize the Supabase client with explicit auth configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: localStorage,
  },
});

// Function to set up realtime listeners for a specific table
export const setupRealtimeListener = (
  tableName: string, 
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*', 
  callback: (payload: any) => void,
  filterColumn?: string,
  filterValue?: string
) => {
  const filter = filterColumn && filterValue 
    ? `${filterColumn}=eq.${filterValue}` 
    : undefined;
    
  // Create a channel for real-time changes - fix the API usage
  const channel = supabase.channel('schema-db-changes')
    .on(
      'postgres_changes', 
      {
        event: event,
        schema: 'public',
        table: tableName,
        filter: filter
      },
      callback
    )
    .subscribe((status) => {
      console.log(`Realtime subscription for ${tableName} status:`, status);
    });
    
  return channel;
};

// Function to remove a realtime listener
export const removeRealtimeListener = (channel: any) => {
  if (channel) {
    supabase.removeChannel(channel);
  }
};

// Log initial connection info
console.log(`Supabase client initialized with project: ${supabaseUrl}`);
