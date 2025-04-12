import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

// Types for the order data
interface OrderNotification {
  id: string;
  customer_name?: string;
  table_id?: string;
  total_amount: number;
  status: string;
  created_at: string;
}

interface UseRealtimeOrdersProps {
  restaurantId: string;
  enabled?: boolean;
}

export function useRealtimeOrders({ 
  restaurantId, 
  enabled = true 
}: UseRealtimeOrdersProps) {
  const [newOrders, setNewOrders] = useState<OrderNotification[]>([]);
  const [updatedOrders, setUpdatedOrders] = useState<OrderNotification[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!enabled || !restaurantId) return;

    // Subscribe to changes in the orders table
    const channel = supabase
      .channel('orders-changes')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'orders',
        filter: `restaurant_id=eq.${restaurantId}`
      }, (payload) => {
        console.log('New order received:', payload);
        const newOrder = payload.new as OrderNotification;
        
        // Add to the new orders array
        setNewOrders(prev => [newOrder, ...prev].slice(0, 10));
        
        // Show a notification toast
        toast({
          title: 'New Order Received',
          description: `Order #${newOrder.id.slice(-5)} - ${newOrder.customer_name || 'Customer'}`,
        });
      })
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'orders',
        filter: `restaurant_id=eq.${restaurantId}`
      }, (payload) => {
        console.log('Order updated:', payload);
        const updatedOrder = payload.new as OrderNotification;
        
        // Add to the updated orders array
        setUpdatedOrders(prev => {
          // If order already exists, replace it
          const exists = prev.some(order => order.id === updatedOrder.id);
          if (exists) {
            return prev.map(order => 
              order.id === updatedOrder.id ? updatedOrder : order
            );
          }
          // Otherwise add it to the beginning
          return [updatedOrder, ...prev].slice(0, 10);
        });
      })
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
        setIsSubscribed(status === 'SUBSCRIBED');
      });

    return () => {
      console.log('Unsubscribing from orders channel');
      supabase.removeChannel(channel);
      setIsSubscribed(false);
    };
  }, [restaurantId, enabled, toast]);

  return {
    newOrders,
    updatedOrders,
    isSubscribed,
    clearNewOrders: () => setNewOrders([]),
    clearUpdatedOrders: () => setUpdatedOrders([])
  };
}
