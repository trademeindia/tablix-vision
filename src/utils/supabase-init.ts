
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Initialize Supabase with URL and anon key
export async function initializeSupabase() {
  try {
    // Check for environment variables
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://example.supabase.co';
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';
    
    // Create the Supabase client with types
    const supabase = createClient<Database>(
      supabaseUrl,
      supabaseAnonKey,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
        },
        realtime: {
          // Enable or disable realtime subscriptions
          enabled: true,
        },
      }
    );
    
    // Initialize Realtime channels
    try {
      // Subscribe to critical tables like orders, tables, etc.
      const channel = supabase.channel('public:orders');
      channel.on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'orders' 
      }, (payload) => {
        // Realtime subscription working
        console.info('Realtime subscription initialized successfully');
      });
      
      // Start the channel
      channel.subscribe();
      
    } catch (realtimeError) {
      console.error('Failed to initialize realtime subscriptions:', realtimeError);
    }
    
    return supabase;
  } catch (error) {
    console.error('Error initializing Supabase client:', error);
    throw error;
  }
}

export const getSupabaseUrl = () => import.meta.env.VITE_SUPABASE_URL || '';
