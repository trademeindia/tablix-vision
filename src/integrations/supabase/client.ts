
import { createClient } from '@supabase/supabase-js';
import { RealtimeChannel } from '@supabase/supabase-js';

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
): RealtimeChannel => {
  const filter = filterColumn && filterValue 
    ? `${filterColumn}=eq.${filterValue}` 
    : undefined;
    
  // Create a unique channel for each subscription
  const channelName = `table-changes-${tableName}-${Math.random().toString(36).substring(2, 11)}`;
  
  // Create the channel
  const channel = supabase.channel(channelName);
  
  // Configure and subscribe to Postgres changes
  // The issue is here - we need to use the correct type for the 'postgres_changes' event
  channel
    .on(
      'postgres_changes' as any, // Use type assertion to bypass TypeScript error temporarily
      { 
        event: event, 
        schema: 'public', 
        table: tableName, 
        filter: filter 
      }, 
      callback
    )
    .subscribe((status) => {
      console.log(`Realtime subscription status for ${tableName}: ${status}`);
      
      // Handle subscription errors
      if (status === 'CHANNEL_ERROR') {
        console.error(`Failed to subscribe to changes for ${tableName}`);
      }
    });
    
  console.log(`Realtime subscription created for ${tableName} with channel: ${channelName}`);
  
  return channel;
};

// Function to remove a realtime listener
export const removeRealtimeListener = (channel: RealtimeChannel) => {
  if (channel) {
    supabase.removeChannel(channel);
  }
};

// Log initial connection info
console.log(`Supabase client initialized with project: ${supabaseUrl}`);
