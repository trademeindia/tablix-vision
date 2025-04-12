import { supabase } from '@/integrations/supabase/client';

/**
 * Initialize Supabase when the app starts
 * - Checks auth status
 * - Sets up listeners
 * - Configures storage buckets if needed
 */
export async function initializeSupabase() {
  if (process.env.NODE_ENV === 'development') {
    console.log('Initializing Supabase...');
  }
  
  try {
    // Verify the connection
    const { data, error } = await supabase.from('restaurants').select('count').limit(1);
    
    if (error) {
      console.error('Error connecting to Supabase:', error);
      return false;
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Successfully connected to Supabase');
    }
    
    // Check auth status
    const { data: authData } = await supabase.auth.getSession();
    if (authData?.session) {
      if (process.env.NODE_ENV === 'development') {
        console.log('User is authenticated');
      }
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.log('No authenticated user');
      }
    }
    
    // Enable realtime for critical tables
    enableRealtimeTables();
    
    return true;
  } catch (err) {
    console.error('Failed to initialize Supabase:', err);
    return false;
  }
}

/**
 * Enable realtime for critical tables
 */
function enableRealtimeTables() {
  try {
    // Create a channel for restaurant tables
    supabase.channel('db-tables-status')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'tables'
      }, (payload) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('Table status changed:', payload);
        }
      })
      .subscribe();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Realtime enabled for tables');
    }
  } catch (err) {
    console.error('Failed to enable realtime:', err);
  }
}
