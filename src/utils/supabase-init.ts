
import { supabase } from '@/integrations/supabase/client';

/**
 * Initialize Supabase connection and perform any necessary setup
 * This is called once when the app starts
 */
export const initializeSupabase = async () => {
  try {
    console.log('Initializing Supabase connection...');
    
    // Check if we have an existing session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Error retrieving session:', sessionError);
      return;
    }
    
    if (session) {
      console.log('Existing session found');
      
      // Enable real-time features for tables that need live updates
      try {
        await enableRealtimeForTables();
        console.log('Realtime features enabled successfully');
      } catch (realtimeError) {
        console.error('Error enabling realtime features:', realtimeError);
      }
    } else {
      console.log('No existing session found');
    }
    
    // Set up auth listener for debugging purposes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log('Auth state changed:', event, 'User ID:', currentSession?.user?.id);
    });
    
    return { success: true };
    
  } catch (error) {
    console.error('Failed to initialize Supabase:', error);
    return { success: false, error };
  }
};

/**
 * Enable real-time updates for specific tables
 * This is done by executing SQL to set the replica identity and add tables to the publication
 */
const enableRealtimeForTables = async () => {
  // List of tables that need real-time updates
  const realtimeTables = ['orders', 'order_items', 'tables', 'menu_items', 'waiter_requests'];
  
  try {
    const { error } = await supabase.rpc('enable_realtime_tables', {
      tables: realtimeTables
    });
    
    if (error) {
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error enabling realtime for tables:', error);
    console.log('Realtime might not be properly configured for some tables');
    return { success: false, error };
  }
};
