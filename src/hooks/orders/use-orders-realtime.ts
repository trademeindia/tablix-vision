
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/hooks/use-toast';

export function useOrdersRealtime(
  restaurantId: string, 
  fetchOrders: () => Promise<void>
) {
  const [realtimeStatus, setRealtimeStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected');
  
  useEffect(() => {
    // Set up real-time subscription for order updates
    const channel = supabase
      .channel('order-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'orders',
          filter: `restaurant_id=eq.${restaurantId}`
        },
        (payload) => {
          console.log('Order change detected:', payload);
          // Update the orders list when changes occur
          fetchOrders();
          
          // Show a notification
          if (payload.eventType === 'INSERT') {
            toast({
              title: "New Order Received",
              description: `Order #${payload.new.id.substring(0, 8)} has been placed.`,
            });
          } else if (payload.eventType === 'UPDATE') {
            const oldStatus = payload.old.status;
            const newStatus = payload.new.status;
            
            if (oldStatus !== newStatus) {
              toast({
                title: "Order Status Updated",
                description: `Order #${payload.new.id.substring(0, 8)} is now ${newStatus}.`,
              });
            } else {
              toast({
                title: "Order Updated",
                description: `Order #${payload.new.id.substring(0, 8)} has been updated.`,
              });
            }
          } else if (payload.eventType === 'DELETE') {
            toast({
              title: "Order Deleted",
              description: `Order #${payload.old.id.substring(0, 8)} has been removed.`,
              variant: "destructive"
            });
          }
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
        if (status === 'SUBSCRIBED') {
          setRealtimeStatus('connected');
        } else if (status === 'CHANNEL_ERROR') {
          setRealtimeStatus('error');
          console.error('Error connecting to realtime updates');
        } else {
          setRealtimeStatus('disconnected');
        }
      });
    
    // Clean up the subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchOrders, restaurantId]);

  return { realtimeStatus };
}
