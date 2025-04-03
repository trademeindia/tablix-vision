
import { useState, useEffect, useCallback } from 'react';
import { getRestaurantOrders } from '@/services/order';
import { Order } from '@/services/order/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export function useOrders(restaurantId: string) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [count, setCount] = useState(0);
  
  const fetchOrders = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const { orders: data, count: totalCount } = await getRestaurantOrders(restaurantId);
      setOrders(data);
      setCount(totalCount);
      
      // Filter orders for the tabs
      setActiveOrders(data.filter(order => 
        order.status !== 'completed' && order.status !== 'served' && order.status !== 'cancelled'
      ));
      
      setCompletedOrders(data.filter(order => 
        order.status === 'completed' || order.status === 'served'
      ));
      
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error fetching orders",
        description: "Could not load your orders. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [restaurantId]);
  
  useEffect(() => {
    fetchOrders();
    
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
            toast({
              title: "Order Updated",
              description: `Order #${payload.new.id.substring(0, 8)} has been updated.`,
            });
          }
        }
      )
      .subscribe();
    
    // Clean up the subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchOrders, restaurantId]);

  return {
    orders,
    activeOrders,
    completedOrders,
    isLoading,
    isRefreshing,
    count,
    fetchOrders
  };
}
