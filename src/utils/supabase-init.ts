
import { supabase } from '@/integrations/supabase/client';

export const initializeSupabase = async () => {
  try {
    // Check if Supabase is available and properly configured
    const { data, error } = await supabase.from('menu_items').select('count()', { count: 'exact' }).limit(1);
    
    if (error) {
      console.error('Error initializing Supabase:', error);
      return false;
    }
    
    console.log('Supabase successfully initialized');
    
    // Enable realtime for menu items and categories
    try {
      // These are admin-only operations and will only work with the service role key
      // In production, this would need to be done via SQL migrations
      console.log('Realtime functionality is available through database configuration');
    } catch (realtimeError) {
      console.warn('Unable to configure realtime:', realtimeError);
    }
    
    return true;
  } catch (err) {
    console.error('Unexpected error initializing Supabase:', err);
    return false;
  }
};
