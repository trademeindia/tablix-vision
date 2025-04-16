
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useKitchenRealtime(onOrderItemUpdate: () => void, onOrderUpdate: () => void) {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const orderItemsChannel = supabase
      .channel('kitchen-order-items')
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'order_items',
        },
        (payload) => {
          console.log('Order item update received:', payload);
          onOrderItemUpdate();
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
        setIsSubscribed(status === 'SUBSCRIBED');
      });

    const ordersChannel = supabase
      .channel('kitchen-orders')
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'orders',
          filter: `status=in.(pending,preparing,ready)`
        },
        (payload) => {
          console.log('Order update received:', payload);
          
          if (payload.old && payload.new && payload.old.status !== payload.new.status) {
            onOrderUpdate();
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(orderItemsChannel);
      supabase.removeChannel(ordersChannel);
    };
  }, [onOrderItemUpdate, onOrderUpdate]);

  return {
    isSubscribed
  };
}
