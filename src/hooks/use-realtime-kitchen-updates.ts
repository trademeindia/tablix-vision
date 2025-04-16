
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export function useRealtimeKitchenUpdates(restaurantId: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [recentUpdates, setRecentUpdates] = useState<any[]>([]);
  
  useEffect(() => {
    if (!restaurantId) return;
    
    // Set up realtime subscription for order_items (for individual item status updates)
    const orderItemsChannel = supabase
      .channel('kitchen-order-items')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'order_items',
          filter: `restaurant_id=eq.${restaurantId}`
        },
        (payload) => {
          console.log('Item update received:', payload);
          
          // Add to recent updates
          setRecentUpdates(prev => [
            {
              id: Math.random().toString(),
              type: 'item',
              timestamp: new Date(),
              data: payload.new
            },
            ...prev
          ].slice(0, 10));
          
          // Show toast notification
          if (payload.new.completed) {
            toast({
              title: 'Item completed',
              description: `${payload.new.name} has been marked as prepared`,
            });
          }
        }
      )
      .subscribe((status) => {
        console.log('Order items realtime status:', status);
        setIsConnected(status === 'SUBSCRIBED');
      });
    
    // Set up realtime subscription for orders (for status updates)
    const ordersChannel = supabase
      .channel('kitchen-orders')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `restaurant_id=eq.${restaurantId}`
        },
        (payload) => {
          console.log('Order update received:', payload);
          
          // Add to recent updates
          setRecentUpdates(prev => [
            {
              id: Math.random().toString(),
              type: 'order',
              timestamp: new Date(),
              data: payload.new
            },
            ...prev
          ].slice(0, 10));
          
          // Show toast notification for status changes
          const oldStatus = payload.old.status;
          const newStatus = payload.new.status;
          
          if (oldStatus !== newStatus) {
            toast({
              title: 'Order status changed',
              description: `Order #${payload.new.id.substring(0, 6)} is now ${newStatus}`,
            });
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(orderItemsChannel);
      supabase.removeChannel(ordersChannel);
    };
  }, [restaurantId]);
  
  return {
    isConnected,
    recentUpdates
  };
}
