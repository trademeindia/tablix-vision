
import { supabase } from '@/lib/supabaseClient';
import { RealtimeChannel } from '@supabase/supabase-js';

// Store active channels for proper cleanup
const activeChannels: RealtimeChannel[] = [];

/**
 * Enable realtime subscriptions for menu-related tables with proper filters
 */
export const enableRealtimeForMenuTables = async () => {
  try {
    console.log('Setting up realtime subscriptions for menu tables...');
    
    // Get current restaurant ID if available (for proper filtering)
    let restaurantId = null;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('restaurant_id')
          .eq('id', session.user.id)
          .single();
          
        restaurantId = profile?.restaurant_id;
      }
    } catch (error) {
      console.log('No active restaurant context found for realtime filtering');
    }
    
    // Clean up any existing channels first
    cleanupRealtimeSubscriptions();
    
    // Subscribe to menu categories changes
    const categoriesFilter = restaurantId ? `restaurant_id=eq.${restaurantId}` : undefined;
    const categoriesChannel = supabase.channel('menu_categories_changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'menu_categories',
          filter: categoriesFilter
        },
        (payload) => {
          console.log('Menu category changed:', payload);
          // Trigger UI refresh or state update here
        }
      )
      .subscribe((status) => {
        console.log(`Realtime subscription status for menu_categories: ${status}`);
      });
      
    activeChannels.push(categoriesChannel);
    
    // Subscribe to menu items changes
    const itemsChannel = supabase.channel('menu_items_changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'menu_items',
          filter: restaurantId ? `restaurant_id=eq.${restaurantId}` : undefined
        },
        (payload) => {
          console.log('Menu item changed:', payload);
          // Trigger UI refresh or state update here
        }
      )
      .subscribe((status) => {
        console.log(`Realtime subscription status for menu_items: ${status}`);
      });
      
    activeChannels.push(itemsChannel);
    
    // Subscribe to orders changes for real-time updates
    const ordersChannel = supabase.channel('orders_changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'orders',
          filter: restaurantId ? `restaurant_id=eq.${restaurantId}` : undefined
        },
        (payload) => {
          console.log('Order changed:', payload);
          // Trigger UI refresh or state update here
        }
      )
      .subscribe((status) => {
        console.log(`Realtime subscription status for orders: ${status}`);
      });
      
    activeChannels.push(ordersChannel);
    
    console.log('Realtime subscriptions set up successfully');
    return true;
  } catch (error) {
    console.error('Failed to set up realtime subscriptions:', error);
    return false;
  }
};

/**
 * Clean up all active realtime subscriptions
 */
export const cleanupRealtimeSubscriptions = () => {
  activeChannels.forEach(channel => {
    supabase.removeChannel(channel);
  });
  activeChannels.length = 0;
  console.log('Cleaned up all realtime subscriptions');
};
