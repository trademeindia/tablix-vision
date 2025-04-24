
import { supabase, setupRealtimeListener } from '@/integrations/supabase/client';

/**
 * Enable realtime subscriptions for menu-related tables
 */
export const enableRealtimeForMenuTables = async () => {
  try {
    console.log('Setting up realtime subscriptions for menu tables...');
    
    // Subscribe to menu categories changes
    const categoriesChannel = setupRealtimeListener(
      'menu_categories',
      '*',
      (payload) => {
        console.log('Menu category changed:', payload);
      }
    );
    
    // Subscribe to menu items changes
    const itemsChannel = setupRealtimeListener(
      'menu_items',
      '*',
      (payload) => {
        console.log('Menu item changed:', payload);
      }
    );
    
    console.log('Realtime subscriptions set up successfully');
    return true;
  } catch (error) {
    console.error('Failed to set up realtime subscriptions:', error);
    return false;
  }
};
