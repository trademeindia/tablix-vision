
import { useState, useEffect, useCallback } from 'react';
import { getRestaurantOrders } from '@/services/order';
import { Order } from '@/services/order/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface OrderFilters {
  status?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export function useOrders(restaurantId: string, filters: OrderFilters = {}) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [count, setCount] = useState(0);
  const [realtimeStatus, setRealtimeStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected');
  
  const fetchOrders = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const { orders: data, count: totalCount } = await getRestaurantOrders(restaurantId, {
        status: filters.status,
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
      
      // Sort the data based on filter criteria
      let sortedData = [...data];
      if (filters.sortBy) {
        sortedData.sort((a, b) => {
          // Handle different sort fields
          const sortField = filters.sortBy as keyof Order;
          const aValue = a[sortField];
          const bValue = b[sortField];
          
          // Handle specific field types
          if (sortField === 'total_amount') {
            return filters.sortDirection === 'asc' 
              ? (Number(aValue || 0) - Number(bValue || 0)) 
              : (Number(bValue || 0) - Number(aValue || 0));
          }
          
          // Default string comparison
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return filters.sortDirection === 'asc'
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue);
          }
          
          // Date comparison
          if (sortField === 'created_at' || sortField === 'updated_at') {
            const dateA = aValue ? new Date(aValue as string).getTime() : 0;
            const dateB = bValue ? new Date(bValue as string).getTime() : 0;
            return filters.sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
          }
          
          return 0;
        });
      }
      
      setOrders(sortedData);
      setCount(totalCount);
      
      // Filter orders for the tabs
      setActiveOrders(sortedData.filter(order => 
        order.status !== 'completed' && order.status !== 'served' && order.status !== 'cancelled'
      ));
      
      setCompletedOrders(sortedData.filter(order => 
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
  }, [restaurantId, filters, toast]);
  
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  
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
  }, [fetchOrders, restaurantId, toast]);

  return {
    orders,
    activeOrders,
    completedOrders,
    isLoading,
    isRefreshing,
    count,
    fetchOrders,
    realtimeStatus
  };
}
