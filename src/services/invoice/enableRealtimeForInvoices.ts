
import { supabase } from '@/integrations/supabase/client';

export const enableRealtimeForInvoices = async (restaurantId: string) => {
  return supabase
    .channel('invoices-realtime')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'invoices',
      filter: `restaurant_id=eq.${restaurantId}`
    }, (payload) => {
      console.log('Realtime invoice update received:', payload);
    })
    .subscribe();
};

export const disableRealtimeForInvoices = async (channel: any) => {
  return supabase.removeChannel(channel);
};
