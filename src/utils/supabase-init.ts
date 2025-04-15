
import { supabase } from '@/integrations/supabase/client';

/**
 * Initialize Supabase when the app starts
 * - Checks auth status
 * - Sets up listeners
 * - Enables realtime functionality for critical tables
 */
export async function initializeSupabase() {
  console.log('Initializing Supabase...');
  
  try {
    // Verify the connection
    const { data, error } = await supabase.from('restaurants').select('count').limit(1);
    
    if (error) {
      console.error('Error connecting to Supabase:', error);
      return false;
    }
    
    console.log('Successfully connected to Supabase');
    
    // Check auth status
    const { data: authData } = await supabase.auth.getSession();
    if (authData?.session) {
      console.log('User is authenticated');
    } else {
      console.log('No authenticated user');
    }
    
    // Enable realtime for critical tables
    await enableRealtimeTables();
    
    return true;
  } catch (err) {
    console.error('Failed to initialize Supabase:', err);
    return false;
  }
}

/**
 * Enable realtime for critical tables
 */
async function enableRealtimeTables() {
  try {
    // Create dedicated channels for different table groups
    
    // 1. Channel for tables status updates
    const tablesChannel = supabase.channel('tables-status-updates')
      .on('postgres_changes', {
        event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
        schema: 'public',
        table: 'tables'
      }, (payload) => {
        console.log('Table status changed:', payload);
        // Event will be handled by components that subscribe to this channel
      })
      .subscribe((status) => {
        console.log('Tables channel status:', status);
      });
    
    // 2. Channel for orders updates
    const ordersChannel = supabase.channel('orders-updates')
      .on('postgres_changes', {
        event: '*', // Listen for all events
        schema: 'public',
        table: 'orders'
      }, (payload) => {
        console.log('Order changed:', payload);
        // Event will be handled by components that subscribe to this channel
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'order_items'
      }, (payload) => {
        console.log('Order item changed:', payload);
        // Event will be handled by components that subscribe to this channel
      })
      .subscribe((status) => {
        console.log('Orders channel status:', status);
      });
      
    // 3. Channel for menu updates (optional, only if menu changes should be real-time)
    const menuChannel = supabase.channel('menu-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'menu_items',
        filter: 'is_available=eq.true' // Only listen for available items
      }, (payload) => {
        console.log('Menu item changed:', payload);
        // Event will be handled by components that subscribe to this channel
      })
      .subscribe((status) => {
        console.log('Menu channel status:', status);
      });
    
    console.log('Realtime enabled for critical tables');
    
    // We don't unsubscribe as these are application-level subscriptions
    // that should remain active throughout the application lifecycle
    
    return { tablesChannel, ordersChannel, menuChannel };
  } catch (err) {
    console.error('Failed to enable realtime:', err);
    return null;
  }
}
