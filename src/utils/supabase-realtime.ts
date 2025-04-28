
import { supabase } from '@/lib/supabaseClient';

// Store active channel subscriptions to allow cleanup
let activeChannels: any[] = [];

/**
 * Enable realtime updates for specific tables
 */
export const enableRealtimeForMenuTables = async () => {
  try {
    // Enable realtime for menu-related tables
    const tables = ['orders', 'order_items', 'menu_items', 'menu_categories', 'tables'];
    
    // Create a promise for each table to enable realtime
    const enablePromises = tables.map(tableName => 
      supabase
        .channel(`table-${tableName}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: tableName }, payload => {
          console.log(`Realtime update for ${tableName}:`, payload);
        })
        .subscribe(status => {
          if (status === 'SUBSCRIBED') {
            console.log(`Realtime enabled for ${tableName}`);
          } else if (status === 'CHANNEL_ERROR') {
            console.error(`Failed to enable realtime for ${tableName}`);
          }
        })
    );
    
    // Store the channels for later cleanup
    activeChannels = await Promise.all(enablePromises);
    
    return true;
  } catch (error) {
    console.error('Error setting up realtime:', error);
    return false;
  }
};

/**
 * Clean up all realtime subscriptions
 */
export const cleanupRealtimeSubscriptions = () => {
  try {
    activeChannels.forEach(channel => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    });
    activeChannels = [];
    console.log('Removed all realtime subscriptions');
  } catch (error) {
    console.error('Error cleaning up realtime subscriptions:', error);
  }
};

/**
 * Subscribe to a specific table with filters
 */
export const subscribeToTable = (
  tableName: string,
  filter?: Record<string, any>,
  callback?: (payload: any) => void
) => {
  try {
    const channelName = `table-${tableName}-${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: tableName,
          filter: filter || undefined
        },
        (payload) => {
          console.log(`Realtime update for ${tableName}:`, payload);
          if (callback) callback(payload);
        }
      )
      .subscribe();
    
    activeChannels.push(channel);
    return channel;
  } catch (error) {
    console.error(`Error subscribing to ${tableName}:`, error);
    return null;
  }
};
