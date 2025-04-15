
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const enableRealtimeForMenuTables = async () => {
  try {
    // Enable realtime for menu-related tables
    const { error } = await supabase.from('menu_items').select('count(*)', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error connecting to Supabase:', error);
      return false;
    }
    
    console.log('Supabase connection verified for menu items');
    
    // Initialize a test channel to verify realtime is working
    const channel = supabase.channel('realtime-test-channel');
    await channel.subscribe((status) => {
      console.log('Realtime subscription test status:', status);
      
      if (status === 'SUBSCRIBED') {
        console.log('Realtime functionality is available and working');
      } else if (status === 'CHANNEL_ERROR') {
        console.warn('Realtime subscription failed:', status);
        toast({
          title: "Realtime functionality issue",
          description: "Menu updates may not appear automatically. Please refresh manually if needed.",
          variant: "destructive"
        });
      }
    });
    
    return true;
  } catch (err) {
    console.error('Error initializing Supabase realtime:', err);
    return false;
  }
};
