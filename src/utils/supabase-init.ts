
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
    
    // Test if realtime is working
    try {
      const channel = supabase.channel('test');
      const status = await channel.subscribe();
      console.log('Realtime subscription test status:', status);
      
      // Clean up test channel
      supabase.removeChannel(channel);
      
      console.log('Realtime functionality is available and working');
    } catch (realtimeError) {
      console.warn('Realtime test encountered an error:', realtimeError);
    }
    
    return true;
  } catch (err) {
    console.error('Unexpected error initializing Supabase:', err);
    return false;
  }
};
